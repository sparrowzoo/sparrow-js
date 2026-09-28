import https from 'node:https';
import {execFileSync} from 'node:child_process';
import {mkdtemp, readFile, rm} from 'node:fs/promises';
import {tmpdir} from 'node:os';
import path from 'node:path';
import {build} from 'esbuild';

const modes = new Set(['local', 'session', 'cookie']);
const sameSites = new Set(['Lax', 'None']);

// These wrappers only expose the real production instance. They contain no
// storage, expiry, routing or RPC implementation of their own.
function apiEntry(modulePath) {
    return `
        import CrosStorage from ${JSON.stringify(modulePath)};
        const messages = [];
        const storage = CrosStorage.getCrosStorage();
        window.testApi = {
            get: (...args) => storage.get(...args),
            set: (...args) => storage.set(...args),
            remove: (...args) => storage.remove(...args),
            getToken: (...args) => storage.getToken(...args),
            setToken: (...args) => storage.setToken(...args),
            removeToken: (...args) => storage.removeToken(...args),
            messages,
        };
        window.addEventListener('message', event => {
            if (window.parent !== window && event.source === window.parent && event.data && typeof event.data === 'object') {
                messages.push({command: event.data.command, requestId: event.data.requestId});
            }
        });
        window.addEventListener('pagehide', () => storage.destroy());
    `;
}

export async function startFixture({commonRoot = process.cwd()} = {}) {
    const passportRoot = path.resolve(commonRoot, '../react-next-passport');
    const directory = await mkdtemp(path.join(tmpdir(), 'sparrow-auth-https-'));
    let server;
    let closed = false;
    const close = async () => {
        if (closed) return;
        closed = true;
        if (server?.listening) {
            const stopped = new Promise((resolve, reject) => server.close(error => error ? reject(error) : resolve()));
            server.closeAllConnections();
            await stopped;
        }
        await rm(directory, {recursive: true, force: true});
    };
    try {
        const keyPath = path.join(directory, 'test.key');
        const certPath = path.join(directory, 'test.crt');
        execFileSync('openssl', ['req', '-x509', '-newkey', 'rsa:2048', '-nodes', '-days', '1',
            '-subj', '/CN=auth.sso.test',
            '-addext', 'subjectAltName=DNS:auth.sso.test,DNS:app.sso.test,DNS:app.other.test',
            '-keyout', keyPath, '-out', certPath], {stdio: 'pipe'});
        const bundles = new Map();
        let origins;
        async function bundle(role, mode, sameSite, proxy) {
            const cacheKey = `${role}-${mode}-${sameSite}-${proxy}`;
            if (!bundles.has(cacheKey)) {
                const projectRoot = role === 'proxy' ? passportRoot : commonRoot;
                const proxyRoute = proxy === 'debug' ? 'cros-storage-debug' : 'cros-storage';
                const environment = {
                    NODE_ENV: 'production',
                    NEXT_PUBLIC_TOKEN_KEY: 'auth-e2e-token',
                    NEXT_PUBLIC_TOKEN_STORAGE: mode.toUpperCase(),
                    NEXT_PUBLIC_TOKEN_COOKIE_DOMAIN: 'sso.test',
                    NEXT_PUBLIC_TOKEN_COOKIE_SAME_SITE: sameSite,
                    NEXT_PUBLIC_TOKEN_COOKIE_SECURE: 'true',
                    // DAYS intentionally absent: exercise the default 14+1.
                    NEXT_PUBLIC_CROS_DEBUG: proxy === 'debug' ? 'true' : 'false',
                    // The real facade selects the debug route when CROS_DEBUG
                    // is enabled. Its configured base URL stays the normal route.
                    NEXT_PUBLIC_STORAGE_PROXY: `${origins.auth}/${mode}/${sameSite}/cros-storage/`,
                    NEXT_PUBLIC_ALLOW_ORIGINS: Object.values(origins).join(','),
                    NEXT_PUBLIC_WWW_ROOT: origins.app,
                    NEXT_PUBLIC_PASSPORT_ROOT: origins.auth,
                    NEXT_PUBLIC_API: `${origins.auth}/unused-api`,
                };
                let contents = apiEntry(path.join(projectRoot, 'src/common/lib/CrosStorage.ts'));
                if (role === 'proxy') {
                    contents += `
                        import React from 'react';
                        import {createRoot} from 'react-dom/client';
                        import Page from ${JSON.stringify(path.join(passportRoot, 'src/app/(cros)', proxyRoute, 'page.tsx'))};
                        createRoot(document.getElementById('app')).render(React.createElement(Page));
                    `;
                }
                bundles.set(cacheKey, build({
                    absWorkingDir: projectRoot,
                    stdin: {contents, resolveDir: projectRoot, sourcefile: `${cacheKey}.tsx`, loader: 'tsx'},
                    bundle: true,
                    write: false,
                    platform: 'browser',
                    format: 'iife',
                    jsx: 'automatic',
                    tsconfig: path.join(projectRoot, 'tsconfig.json'),
                    define: {'process.env': JSON.stringify(environment)},
                    logLevel: 'silent',
                }).then(result => result.outputFiles[0].contents));
            }
            return bundles.get(cacheKey);
        }
        const html = script => `<!doctype html><html><head><meta charset="utf-8"><title>SSO production-module fixture</title></head><body><div id="app"></div><script src="${script}"></script></body></html>`;
        server = https.createServer({key: await readFile(keyPath), cert: await readFile(certPath)}, async (request, response) => {
            try {
                const url = new URL(request.url, `https://${request.headers.host}`);
                if (!['auth.sso.test', 'app.sso.test', 'app.other.test'].includes(url.hostname)) {
                    response.writeHead(400).end('Unknown fixture host');
                    return;
                }
                response.setHeader('Cache-Control', 'no-store');
                if (url.pathname === '/favicon.ico') { response.writeHead(204).end(); return; }
                const proxyMatch = url.pathname.match(/^\/(local|session|cookie)\/(Lax|None)\/(cros-storage(?:-debug)?)\/$/);
                if (proxyMatch) {
                    const [, mode, sameSite, proxyRoute] = proxyMatch;
                    const proxy = proxyRoute.endsWith('-debug') ? 'debug' : 'normal';
                    response.setHeader('Content-Type', 'text/html; charset=utf-8');
                    response.end(html(`/bundle.js?role=proxy&mode=${mode}&sameSite=${sameSite}&proxy=${proxy}`));
                    return;
                }
                const mode = url.searchParams.get('mode') ?? 'cookie';
                const sameSite = url.searchParams.get('sameSite') ?? 'Lax';
                const proxy = url.searchParams.get('proxy') ?? 'normal';
                if (!modes.has(mode) || !sameSites.has(sameSite) || !['normal', 'debug'].includes(proxy)) {
                    response.writeHead(400).end('Unknown fixture configuration');
                    return;
                }
                if (url.pathname === '/bundle.js') {
                    const role = url.searchParams.get('role') === 'proxy' ? 'proxy' : 'client';
                    response.setHeader('Content-Type', 'application/javascript');
                    response.end(await bundle(role, mode, sameSite, proxy));
                } else if (url.pathname === '/') {
                    response.setHeader('Content-Type', 'text/html; charset=utf-8');
                    response.end(html(`/bundle.js?role=client&mode=${mode}&sameSite=${sameSite}&proxy=${proxy}`));
                } else {
                    response.writeHead(404).end('Unknown fixture route');
                }
            } catch (error) {
                console.error('SSO fixture failed:', error instanceof Error ? error.message : error);
                response.writeHead(500).end('Fixture compilation failed');
            }
        });
        await new Promise((resolve, reject) => {
            server.once('error', reject);
            server.listen(0, '127.0.0.1', resolve);
        });
        const port = server.address().port;
        origins = {
            auth: `https://auth.sso.test:${port}`,
            app: `https://app.sso.test:${port}`,
            other: `https://app.other.test:${port}`,
        };
        return {origins, close};
    } catch (error) {
        await close();
        throw error;
    }
}
