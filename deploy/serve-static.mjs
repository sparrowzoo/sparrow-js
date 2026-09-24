#!/usr/bin/env node
// Local preview only; production uses deploy/nginx/sparrow-static.conf.
import {createServer} from "node:http";
import {createReadStream, existsSync, statSync} from "node:fs";
import {extname, resolve, sep} from "node:path";

const base = resolve(process.argv[2] || "out");
const port = Number(process.argv[3] || 3000);
if (!existsSync(resolve(base, "index.html"))) throw new Error("Missing out/index.html; run npm run build first");
const types = {".html": "text/html; charset=utf-8", ".js": "text/javascript; charset=utf-8", ".css": "text/css; charset=utf-8", ".json": "application/json", ".txt": "text/plain; charset=utf-8", ".svg": "image/svg+xml", ".png": "image/png", ".jpg": "image/jpeg", ".jpeg": "image/jpeg", ".webp": "image/webp", ".woff2": "font/woff2", ".ico": "image/x-icon"};
createServer((req, res) => {
    if (req.method !== "GET" && req.method !== "HEAD") {res.writeHead(405, {Allow: "GET, HEAD"}).end(); return;}
    let url, file;
    try {
        url = new URL(req.url, "http://localhost");
        file = resolve(base, "." + decodeURIComponent(url.pathname));
        if (file !== base && !file.startsWith(base + sep)) throw new Error("Invalid path");
    } catch {res.writeHead(400).end(); return;}
    if (existsSync(file) && statSync(file).isDirectory()) {
        if (!url.pathname.endsWith("/")) {res.writeHead(308, {Location: url.pathname + "/" + url.search}).end(); return;}
        file = resolve(file, "index.html");
    }
    let status = 200;
    if (!existsSync(file) || !statSync(file).isFile()) {status = 404; file = resolve(base, "404.html");}
    res.writeHead(status, {"Content-Type": types[extname(file)] || "application/octet-stream", "Cache-Control": "no-cache"});
    if (req.method === "HEAD") {res.end(); return;}
    createReadStream(file).on("error", () => res.destroy()).pipe(res);
}).listen(port, "127.0.0.1", () => console.log(`Static preview: http://localhost:${port} (production API settings remain compiled in)`));
