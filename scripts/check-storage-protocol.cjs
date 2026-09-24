/* Run from any directory: node scripts/check-storage-protocol.cjs */
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const vm = require("node:vm");
const {createRequire} = require("node:module");

const root = path.resolve(__dirname, "..");
const ts = createRequire(path.join(root, "common/package.json"))("typescript");
const frameOrigin = "http://passport.sparrowzoo.com";
const allowedOrigins = ["www", "admin", "im", "passport", "coder"].map((host) => `http://${host}.sparrowzoo.com`);
const protocol = {
    CommandType: {INIT: "init", GET: "get", SET: "set", REMOVE: "remove"},
    StorageType: {LOCAL: "local", SESSION: "session", AUTOMATIC: "automatic"},
};

function evaluate(file, globals, imports) {
    const code = ts.transpileModule(fs.readFileSync(path.join(root, file), "utf8"), {
        compilerOptions: {module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2020},
    }).outputText;
    const exports = {};
    vm.runInNewContext(code, {
        exports, URL, Error, decodeURIComponent, encodeURIComponent,
        require: (name) => {
            assert.ok(name in imports, `Unexpected import: ${name}`);
            return imports[name];
        },
        ...globals,
    }, {filename: file});
    return exports;
}

function storage() {
    const data = new Map();
    return {getItem: (key) => data.get(key) ?? null, setItem: (key, value) => data.set(key, value), removeItem: (key) => data.delete(key)};
}

function surface() {
    const listeners = new Set();
    return {
        listeners,
        addEventListener: (type, callback) => {assert.equal(type, "message"); listeners.add(callback);},
        removeEventListener: (type, callback) => {assert.equal(type, "message"); listeners.delete(callback);},
        dispatch: (event) => [...listeners].forEach((listener) => listener(event)),
    };
}

function fixture(parentOrigin, {mount = true, legacyQuery = false, storageType = "LOCAL"} = {}) {
    const parent = surface();
    const child = surface();
    const localStorage = storage();
    const sessionStorage = storage();
    let time = 0, serial = 0, cleanup;
    const timers = new Map();
    const requests = [], responses = [];
    const globals = {
        setTimeout: (callback, delay) => {const id = ++serial; timers.set(id, {callback, at: time + delay}); return id;},
        clearTimeout: (id) => timers.delete(id),
    };
    const advance = (duration) => {
        const end = time + duration;
        while (true) {
            const next = [...timers].filter(([, timer]) => timer.at <= end).sort((a, b) => a[1].at - b[1].at)[0];
            if (!next) break;
            const [id, timer] = next;
            timers.delete(id);
            time = timer.at;
            timer.callback();
        }
        time = end;
    };
    parent.location = {origin: parentOrigin, href: `${parentOrigin}/zh/?a=1&a=2#detail`};
    child.parent = parent;
    child.localStorage = localStorage;
    child.sessionStorage = sessionStorage;
    parent.postMessage = (data, targetOrigin) => {
        assert.equal(targetOrigin, parentOrigin);
        responses.push(data);
        parent.dispatch({data, origin: frameOrigin, source: child});
    };
    child.postMessage = (data, targetOrigin) => {
        assert.equal(targetOrigin, frameOrigin);
        requests.push(data);
        child.dispatch({data, origin: parentOrigin, source: parent});
    };
    const attributes = new Map();
    let iframe;
    const env = {
        STORAGE_PROXY: `${frameOrigin}/cros-storage/`, TOKEN_KEY: "sparrow-test-token", TOKEN_STORAGE: storageType,
        allowOrigin: (origin) => allowedOrigins.includes(origin),
    };
    const sharedImports = {
        "@/common/lib/protocol/CrosProtocol": protocol,
        "@/common/lib/Env": env,
        "@/common/lib/Utils": {Utils: {randomUUID: () => `request-${++serial}`}},
    };
    const mountFrame = () => {
        child.location = {search: legacyQuery ? `?${parentOrigin}/zh/project-config/` : new URL(iframe.src).search};
        const page = evaluate("react-next-passport/src/app/(cros)/cros-storage/page.tsx", {window: child}, {
            ...sharedImports, react: {useEffect: (effect) => {cleanup = effect();}},
        });
        page.default();
    };
    const document = {
        querySelector: () => iframe,
        createElement: () => ({style: {}, contentWindow: child, setAttribute: (key, value) => attributes.set(key, value), getAttribute: (key) => attributes.get(key)}),
        body: {appendChild: (element) => {iframe = element; if (mount) mountFrame();}},
    };
    const {default: CrosStorage} = evaluate("common/src/common/lib/CrosStorage.ts", {window: parent, document, localStorage, sessionStorage, ...globals}, {
        ...sharedImports,
        "@/common/lib/UrlUtils": {default: {isCros: (a, b) => new URL(a).origin !== new URL(b).origin}},
        "@/common/lib/protocol/LoginUser": {default: {localize: (token) => ({token}), visitor: () => ({visitor: true})}},
    });
    return {parent, child, CrosStorage, requests, responses, attributes, timers, advance, mountFrame, localStorage, sessionStorage, cleanup: () => cleanup?.(), frame: () => iframe};
}

async function run() {
    for (const origin of allowedOrigins) {
        const f = fixture(origin);
        const client = f.CrosStorage.getCrosStorage();
        await client.setToken("test-token");
        assert.equal(await client.getToken(), "test-token");
        assert.equal(await client.removeToken(), "test-token");
        assert.equal(await client.getToken(), null);
        await client.set("");
        assert.equal(await client.get(), "");
        assert.equal(await client.getToken(undefined, async () => "visitor-token"), "visitor-token");
        assert.equal(await client.getToken(), "visitor-token");
        if (origin !== frameOrigin) {
            assert.equal(new URL(f.frame().src).search, `?${encodeURIComponent(origin)}`);
            assert.equal(f.responses[0].command, "init");
            const sibling = f.CrosStorage.getCrosStorage();
            client.destroy();
            assert.equal(await sibling.getToken(), "visitor-token", "destroy must retain shared iframe");
            sibling.destroy();
            assert.equal(f.parent.listeners.size, 0);
        }
        f.cleanup();
        assert.equal(f.child.listeners.size, 0);
        assert.equal(f.timers.size, 0);
    }

    const legacy = fixture(allowedOrigins[0], {legacyQuery: true, storageType: "SESSION"});
    const legacyClient = legacy.CrosStorage.getCrosStorage();
    await legacyClient.setToken("session-token");
    assert.equal(legacy.sessionStorage.getItem("sparrow-test-token"), "session-token");
    assert.equal(legacy.localStorage.getItem("sparrow-test-token"), null);
    legacy.cleanup();

    const delayed = fixture(allowedOrigins[1], {mount: false});
    const delayedClient = delayed.CrosStorage.getCrosStorage();
    const waiting = delayedClient.getToken();
    delayed.parent.dispatch({origin: `${frameOrigin}.evil.test`, source: delayed.child, data: {command: "init"}});
    delayed.parent.dispatch({origin: frameOrigin, source: {}, data: {command: "init"}});
    delayed.parent.dispatch({origin: frameOrigin, source: delayed.child, data: {command: "set"}});
    assert.notEqual(delayed.attributes.get("loaded"), "true");
    delayed.mountFrame();
    delayed.advance(100);
    assert.equal(await waiting, null);
    assert.equal(delayed.timers.size, 0);
    delayed.cleanup();

    const f = fixture(allowedOrigins[2]);
    const client = f.CrosStorage.getCrosStorage();
    const request = {requestId: "bad-request", key: "sensitive-key", storage: "local", command: "set", value: "forged"};
    const responseCount = f.responses.length;
    f.child.dispatch({origin: `${allowedOrigins[2]}.evil.test`, source: f.parent, data: request});
    f.child.dispatch({origin: allowedOrigins[2], source: {}, data: request});
    for (const data of [null, "invalid", {...request, command: "unknown"}, {...request, storage: "unknown"}]) {
        f.child.dispatch({origin: allowedOrigins[2], source: f.parent, data});
    }
    assert.equal(f.responses.length, responseCount);
    assert.equal(f.localStorage.getItem("sensitive-key"), null);
    f.child.localStorage = {getItem: () => {throw new Error("Storage blocked");}};
    await assert.rejects(client.getToken(), /Storage blocked/);
    assert.equal(f.timers.size, 0);

    f.cleanup(); // Stop the iframe receiver to test pending-response checks and timeouts.
    let settled = false;
    const pending = client.getToken();
    pending.then(() => {settled = true;}, () => {settled = true;});
    const id = f.requests.at(-1).requestId;
    f.parent.dispatch({origin: `${frameOrigin}.evil.test`, source: f.child, data: {requestId: id, value: "forged"}});
    f.parent.dispatch({origin: frameOrigin, source: {}, data: {requestId: id, value: "forged"}});
    f.parent.dispatch({origin: frameOrigin, source: f.child, data: {requestId: "wrong-id", value: "forged"}});
    await Promise.resolve();
    assert.equal(settled, false);
    const timedOut = assert.rejects(pending, /timed out/);
    f.advance(10000);
    await timedOut;
    assert.equal(f.parent.listeners.size, 0);
    assert.equal(f.timers.size, 0);

    const cancelled = client.getToken();
    const destroyed = assert.rejects(cancelled, /destroyed/);
    client.destroy();
    await destroyed;
    assert.equal(f.parent.listeners.size, 0);
    assert.equal(f.timers.size, 0);
    console.log("Storage protocol passed: five HTTP origins, same/cross origin, encoded/legacy parent URL, GET/SET/REMOVE, local/session, forged messages, storage denial, timeout, shared iframe, cleanup.");
}

run().catch((error) => {console.error(error); process.exitCode = 1;});
