#!/usr/bin/env python3
"""Run after builds: python3 deploy/check-nginx.py [www admin im passport].

Requires a locally installed Nginx; listens on a random 127.0.0.1 port and shuts
it down after the checks. No backend API calls or installed-config changes.
"""
from pathlib import Path
from tempfile import TemporaryDirectory
from http.client import HTTPConnection
from html.parser import HTMLParser
from urllib.parse import urlsplit, urljoin, unquote
import argparse, shutil, socket, subprocess, time

repo=Path(__file__).resolve().parents[1]
projects={'www':'common','admin':'react-next-admin','im':'react-next-im','passport':'react-next-passport'}
parser=argparse.ArgumentParser(description='Validate fresh static exports through an isolated localhost Nginx; never changes the system config.')
parser.add_argument('sites', nargs='*', help='Optional subset: www admin im passport')
parser.add_argument('--nginx', default=shutil.which('nginx'), help='Nginx executable')
parser.add_argument('--mime-types', type=Path, help='System mime.types file (auto-detected by default)')
args=parser.parse_args()
selected=args.sites or list(projects)
if not args.nginx: parser.error('Nginx is required; install it or pass --nginx')
if any(s not in projects for s in selected): parser.error('Valid sites: www admin im passport')
mime_types=args.mime_types or next((p for p in [Path('/etc/nginx/mime.types'),Path('/opt/homebrew/etc/nginx/mime.types'),Path('/usr/local/etc/nginx/mime.types')] if p.is_file()),None)
if not mime_types or not mime_types.is_file(): parser.error('Pass --mime-types /path/to/mime.types')
for site in selected:
    if not (repo/projects[site]/'out/index.html').is_file(): parser.error(f'{site}: out/index.html is missing; build the site first')
hosts={s+'.sparrowzoo.com':s for s in projects}
class ResourceLinks(HTMLParser):
    def __init__(self):super().__init__();self.urls=[]
    def handle_starttag(self,tag,attrs):
        a=dict(attrs)
        if tag in ['script','img','source','link']:
            if a.get('src'):self.urls.append(a['src'])
            if tag=='link' and a.get('rel') in ['stylesheet','preload','modulepreload'] and a.get('href'):self.urls.append(a['href'])
with TemporaryDirectory(prefix='sparrow-nginx-builds-') as tmp:
    base=Path(tmp);(base/'logs').mkdir()
    with socket.socket() as s:s.bind(('127.0.0.1',0));port=s.getsockname()[1]
    (base/'static.conf').write_text((repo/'deploy/nginx/static-locations.conf').read_text().replace('/srv/sparrow/assets',str(base/'assets')))
    sites=(repo/'deploy/nginx/sparrow-static.conf').read_text().replace('listen 80;',f'listen 127.0.0.1:{port};').replace('/etc/nginx/snippets/sparrow-static-locations.conf',str(base/'static.conf'))
    for site,project in projects.items():sites=sites.replace('/srv/sparrow/current/'+site,str(repo/project/'out'))
    (base/'sites.conf').write_text(sites)
    (base/'nginx.conf').write_text(f'error_log {base}/error.log;\npid {base}/nginx.pid;\nevents {{}}\nhttp {{ access_log off; include {mime_types}; include {base}/sites.conf; }}\n')
    process=subprocess.Popen([args.nginx,'-p',str(base)+'/', '-c',str(base/'nginx.conf'),'-e',str(base/'error.log'),'-g','daemon off;'],stdout=subprocess.PIPE,stderr=subprocess.PIPE)
    def request(site,path):
        c=HTTPConnection('127.0.0.1',port,timeout=10);c.request('GET',path,headers={'Host':site+'.sparrowzoo.com'});r=c.getresponse();result=(r.status,dict(r.getheaders()),r.read());c.close();return result
    checks=0; pages=0; resources=set()
    def check(ok,desc):
        global checks
        assert ok,desc
        checks+=1
    try:
        for _ in range(100):
            if process.poll() is not None:raise RuntimeError(process.stderr.read().decode())
            try:request(selected[0],'/');break
            except OSError:time.sleep(.05)
        for site in selected:
            out=repo/projects[site]/'out';routes={'/':out/'index.html'}
            app=repo/projects[site]/'src/app'
            for page in app.rglob('page.*'):
                if page.suffix not in ['.ts','.tsx','.js','.jsx']: continue
                segments=[p for p in page.parent.relative_to(app).parts if not p.startswith('(')]
                if any(p.startswith('_') for p in segments): continue
                if any('[' in p and p!='[locale]' for p in segments):
                    raise ValueError(f'{site}: add explicit static params for {page.relative_to(app)}')
                for locale in ['en','zh'] if '[locale]' in segments else [None]:
                    path='/'.join(locale if p=='[locale]' else p for p in segments)
                    route='/'+path+'/' if path else '/'
                    routes[route]=out/path/'index.html'
            for route,file in routes.items():
                status,h,b=request(site,route+'?x=1&x=2');check(status==200 and b==file.read_bytes(),site+route+' HTML bytes')
                check(h.get('Cache-Control')=='no-cache' and h.get('Content-Type','').startswith('text/html'),site+route+' HTML headers')
                status,h,b=request(site,route+'index.txt');check(status==200 and b==file.with_name('index.txt').read_bytes() and h.get('Cache-Control')=='no-cache',site+route+' route data')
                parser=ResourceLinks();parser.feed(file.read_text());pages+=1
                for url in parser.urls:
                    u=urlsplit(urljoin('http://'+site+'.sparrowzoo.com'+route,url))
                    if u.hostname in hosts:resources.add((hosts[u.hostname],u.path))
            for missing in ['/fr/','/unknown-page/','/_next/static/chunks/does-not-exist.js']:
                status,h,b=request(site,missing);check(status==404 and h.get('Cache-Control')=='no-cache',site+missing+' true 404')
            print(f'{site}: {len(routes)} exported pages and RSC data served by Nginx')
        for site,path in sorted(resources):
            status,h,b=request(site,path);file=repo/projects[site]/'out'/unquote(path).lstrip('/')
            check(status==200 and file.is_file() and b==file.read_bytes(),site+path+' resource bytes')
            if path.startswith('/_next/static/'):check('immutable' in h.get('Cache-Control',''),site+path+' immutable cache')
            if path.endswith('.js'):check('javascript' in h.get('Content-Type',''),site+path+' JS MIME')
            if path.endswith('.css'):check(h.get('Content-Type','').startswith('text/css'),site+path+' CSS MIME')
        if 'passport' in selected:
            status,h,b=request('passport','/cros-storage/?http://www.sparrowzoo.com/en/');check(status==200 and 'http://admin.sparrowzoo.com' in h.get('Content-Security-Policy','') and 'X-Frame-Options' not in h,'passport cros headers')
        print(f'PASS {checks} real-build Nginx checks: {pages} pages, route data, {len(resources)} resources, MIME, cache and 404')
    finally:
        process.terminate()
        try:process.wait(timeout=5)
        except subprocess.TimeoutExpired:process.kill();process.wait()
