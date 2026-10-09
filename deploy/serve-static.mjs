import { createServer } from 'node:http';
import { readFile, stat } from 'node:fs/promises';
import { extname, join, normalize, relative, isAbsolute } from 'node:path';

const [dir = 'out', port = 3000] = process.argv.slice(2);
const root = normalize(join(process.cwd(), dir));

const MIME = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript',
  '.css': 'text/css',
  '.json': 'application/json',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.gif': 'image/gif',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
  '.woff': 'font/woff',
  '.woff2': 'font/woff2',
  '.txt': 'text/plain',
  '.xml': 'application/xml',
};

async function resolve(file) {
  const rel = relative(root, file);
  if (rel.startsWith('..') || isAbsolute(rel)) return null;
  if ((await stat(file).catch(() => null))?.isDirectory()) file = join(file, 'index.html');
  return file;
}

const send = (res, code, body, type = 'text/plain; charset=utf-8') => {
  res.writeHead(code, { 'Content-Type': type });
  res.end(body);
};

createServer(async (req, res) => {
  const pathname = decodeURIComponent(new URL(req.url, 'http://x').pathname);
  let file = await resolve(join(root, pathname));
  if (!file) return send(res, 403, 'Forbidden');
  try {
    const data = await readFile(file);
    send(res, 200, data, MIME[extname(file)] || 'application/octet-stream');
  } catch {
    send(res, 404, 'Not Found');
  }
}).listen(port, () => console.log(`Serving ${dir} at http://localhost:${port}`));
