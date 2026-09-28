import {readFileSync} from 'node:fs';
import {resolve} from 'node:path';
import {describe, expect, it} from 'vitest';
const projects=['common','react-next-admin','react-next-im','react-next-passport'];
function config(project:string,mode:string) {
    const text=readFileSync(resolve(process.cwd(),'..',project,`.env.${mode}`),'utf8');
    return Object.fromEntries(text.split('\n').filter(l=>l&&!l.startsWith('#')).map(l=>{const i=l.indexOf('=');return [l.slice(0,i),l.slice(i+1)];}));
}
describe('S12 four-site release configuration',()=>{
    it('uses one new token key in all environments without reviving the old key',()=>{
        const configs=projects.flatMap(p=>['development','production'].map(m=>config(p,m)));
        expect(new Set(configs.map(c=>c.NEXT_PUBLIC_TOKEN_KEY))).toEqual(new Set(['sparrow_sso_token']));
    });
    it('enables identical HTTPS shared-domain Cookie settings in production',()=>{
        for(const project of projects) {
            const c=config(project,'production');
            expect(c).toMatchObject({NEXT_PUBLIC_TOKEN_STORAGE:'COOKIE',NEXT_PUBLIC_TOKEN_COOKIE_DOMAIN:'sparrowzoo.com',
                NEXT_PUBLIC_CROS_DEBUG:'false',NEXT_PUBLIC_TOKEN_COOKIE_DAYS:'14',NEXT_PUBLIC_TOKEN_COOKIE_SAME_SITE:'Lax',NEXT_PUBLIC_TOKEN_COOKIE_SECURE:'true',
                NEXT_PUBLIC_STORAGE_PROXY:'https://passport.sparrowzoo.com/cros-storage/'});
            expect(c.NEXT_PUBLIC_ALLOW_ORIGINS.split(',')).toContain('https://www.sparrowzoo.com');
        }
    });
    it('uses host-only Cookie consistently for HTTP localhost development',()=>{
        for(const project of projects) {
            const c=config(project,'development');
            expect(c).toMatchObject({NEXT_PUBLIC_TOKEN_STORAGE:'COOKIE',NEXT_PUBLIC_TOKEN_COOKIE_SECURE:'false',NEXT_PUBLIC_TOKEN_COOKIE_SAME_SITE:'Lax'});
            expect(c.NEXT_PUBLIC_TOKEN_COOKIE_DOMAIN ?? '').toBe('');
            expect(new URL(c.NEXT_PUBLIC_STORAGE_PROXY).hostname).toBe('localhost');
        }
    });
});
