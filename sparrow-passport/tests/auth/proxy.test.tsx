import React from 'react';
import {act} from 'react-dom/test-utils';
import {createRoot, type Root} from 'react-dom/client';
import {afterEach, beforeEach, describe, expect, it, vi} from 'vitest';

const PARENT_ORIGIN = 'https://app.sso.test:4443';
const SECRET = 'never-log-this-token%==';
const originalParent = Object.getOwnPropertyDescriptor(window, 'parent');
let parentWindow: Window;
let postMessage: ReturnType<typeof vi.spyOn>;
let root: Root;
let container: HTMLDivElement;

beforeEach(() => {
    vi.resetModules();
    vi.stubEnv('NEXT_PUBLIC_ALLOW_ORIGINS', PARENT_ORIGIN);
    vi.stubEnv('NEXT_PUBLIC_TOKEN_STORAGE', 'LOCAL');
    vi.stubEnv('NEXT_PUBLIC_TOKEN_KEY', 'proxy-test-key');
    vi.stubEnv('NEXT_PUBLIC_TOKEN_COOKIE_DOMAIN', window.location.hostname);
    vi.stubEnv('NEXT_PUBLIC_TOKEN_COOKIE_SECURE', 'true');
    vi.stubEnv('NEXT_PUBLIC_TOKEN_COOKIE_SAME_SITE', 'Lax');
    vi.stubEnv('NEXT_PUBLIC_TOKEN_COOKIE_DAYS', '14');
    localStorage.clear();
    sessionStorage.clear();
    document.cookie = `proxy-test-key=; Max-Age=0; Path=/; Domain=${window.location.hostname}`;
    window.history.replaceState({}, '', `/?${encodeURIComponent(PARENT_ORIGIN)}`);
    const parentFrame = document.createElement('iframe');
    document.body.append(parentFrame);
    parentWindow = parentFrame.contentWindow!;
    Object.defineProperty(window, 'parent', {configurable: true, value: parentWindow});
    postMessage = vi.spyOn(parentWindow, 'postMessage').mockImplementation(() => undefined);
    container = document.createElement('div');
    document.body.append(container);
    (globalThis as Record<string, unknown>).IS_REACT_ACT_ENVIRONMENT = true;
});

afterEach(async () => {
    if (root) await act(async () => root.unmount());
    if (originalParent) Object.defineProperty(window, 'parent', originalParent);
    document.body.replaceChildren();
    vi.restoreAllMocks();
    vi.unstubAllEnvs();
});

async function mount(variant: 'normal' | 'debug') {
    const {default: Page} = variant === 'normal'
        ? await import('../../src/app/(cros)/cros-storage/page')
        : await import('../../src/app/(cros)/cros-storage-debug/page');
    root = createRoot(container);
    await act(async () => root.render(React.createElement(Page)));
}

async function send(data: Record<string, unknown>, source: Window = parentWindow, origin = PARENT_ORIGIN) {
    await act(async () => {
        window.dispatchEvent(new MessageEvent('message', {data, origin, source}));
    });
}

function response(requestId: string) {
    return postMessage.mock.calls.map(call => call[0]).find(data => data.requestId === requestId);
}

for (const variant of ['normal', 'debug'] as const) {
    describe(`${variant} production proxy`, () => {
        it('S04 preserves LOCAL/SESSION GET SET REMOVE responses', async () => {
            await mount(variant);
            for (const storage of ['local', 'session']) {
                await send({requestId: `${storage}-set`, command: 'set', storage, key: 'proxy-test-key', value: SECRET});
                expect(response(`${storage}-set`)).toEqual({requestId: `${storage}-set`, value: SECRET});
                await send({requestId: `${storage}-get`, command: 'get', storage, key: 'proxy-test-key'});
                expect(response(`${storage}-get`).value).toBe(SECRET);
                await send({requestId: `${storage}-remove`, command: 'remove', storage, key: 'proxy-test-key'});
                expect(response(`${storage}-remove`).value).toBe(SECRET);
                expect((storage === 'local' ? localStorage : sessionStorage).getItem('proxy-test-key')).toBeNull();
            }
        });

        it('S04 uses actual Cookie storage and preserves the original bytes', async () => {
            await mount(variant);
            await send({requestId: 'cookie-set', command: 'set', storage: 'cookie', key: 'proxy-test-key', value: SECRET, saveOptions: {remember: true}});
            expect(response('cookie-set')).toEqual({requestId: 'cookie-set', value: SECRET});
            expect(document.cookie).toContain(`proxy-test-key=${encodeURIComponent(SECRET)}`);
            await send({requestId: 'cookie-get', command: 'get', storage: 'cookie', key: 'proxy-test-key'});
            expect(response('cookie-get').value).toBe(SECRET);
            await send({requestId: 'cookie-remove', command: 'remove', storage: 'cookie', key: 'proxy-test-key'});
            expect(response('cookie-remove').value).toBe(SECRET);
            expect(document.cookie).not.toContain('proxy-test-key=');
        });

        it('S05 rejects a different window even when its origin is allowed', async () => {
            await mount(variant);
            postMessage.mockClear();
            await send({requestId: 'forged', command: 'set', storage: 'local', key: 'proxy-test-key', value: SECRET}, window);
            expect(localStorage.getItem('proxy-test-key')).toBeNull();
            expect(postMessage).not.toHaveBeenCalled();
        });

        it('S05 ignores non-object data and requests without a string correlation ID', async () => {
            await mount(variant);
            postMessage.mockClear();
            for (const data of [null, [], 'message', {requestId: 1, command: 'set', storage: 'local', key: 'proxy-test-key', value: SECRET}]) {
                await act(async () => window.dispatchEvent(new MessageEvent('message', {data, origin: PARENT_ORIGIN, source: parentWindow})));
            }
            expect(localStorage.getItem('proxy-test-key')).toBeNull();
            expect(postMessage).not.toHaveBeenCalled();
        });

        it.each(['https://unlisted.test', 'malformed%'])('S05 does not announce INIT for an untrusted or malformed parent URL: %s', async query => {
            window.history.replaceState({}, '', `/?${query}`);
            await mount(variant);
            expect(postMessage).not.toHaveBeenCalled();
        });

        it('S05 rejects unlisted origins and stops listening after unmount', async () => {
            await mount(variant);
            postMessage.mockClear();
            const request = {requestId: 'forged', command: 'set', storage: 'local', key: 'proxy-test-key', value: SECRET};
            await send(request, parentWindow, 'https://unlisted.test');
            expect(localStorage.getItem('proxy-test-key')).toBeNull();
            expect(postMessage).not.toHaveBeenCalled();
            await act(async () => root.unmount());
            await send(request);
            expect(localStorage.getItem('proxy-test-key')).toBeNull();
            expect(postMessage).not.toHaveBeenCalled();
        });

        it.each([
            {command: 'set', storage: 'local', value: SECRET, saveOptions: {remember: 'yes'}},
            {command: 'set', storage: 'local', value: SECRET, saveOptions: null},
            {command: 'set', storage: 'cookie', value: 123},
            {command: 'set', storage: 'unknown', value: SECRET},
            {command: 'unknown', storage: 'local', value: SECRET},
            {command: 'get', storage: 'local', key: 123},
        ])('S05 returns an error for malformed fields without writing: %j', async fields => {
            await mount(variant);
            await send({requestId: 'invalid', key: 'proxy-test-key', ...fields});
            expect(response('invalid')).toMatchObject({requestId: 'invalid', value: null, error: expect.any(String)});
            expect(response('invalid').error).not.toContain(SECRET);
            expect(localStorage.getItem('proxy-test-key')).toBeNull();
            expect(document.cookie).not.toContain('proxy-test-key=');
        });

        it('S05 does not send a raw storage exception or token to the caller or debug log', async () => {
            const consoleLog = vi.spyOn(console, 'log').mockImplementation(() => undefined);
            vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => { throw new Error(`browser rejected ${SECRET}`); });
            await mount(variant);
            await send({requestId: 'failure', command: 'set', storage: 'local', key: 'proxy-test-key', value: SECRET});
            expect(response('failure')).toMatchObject({requestId: 'failure', value: null, error: expect.any(String)});
            expect(response('failure').error).not.toContain(SECRET);
            expect(container.textContent).not.toContain(SECRET);
            expect(JSON.stringify(consoleLog.mock.calls)).not.toContain(SECRET);
        });

        it.each(['encoded', 'legacy'])('S04 INIT accepts the %s parent URL and uses an exact targetOrigin', async form => {
            const parentUrl = `${PARENT_ORIGIN}/path?from=login`;
            window.history.replaceState({}, '', `/?${form === 'encoded' ? encodeURIComponent(parentUrl) : parentUrl}`);
            await mount(variant);
            const init = postMessage.mock.calls.find(call => call[0].command === 'init');
            expect(init?.[0]).toMatchObject({command: 'init', storage: 'automatic', key: 'cros-iframe-storage', requestId: expect.any(String)});
            expect(init?.[1]).toBe(PARENT_ORIGIN);
        });
    });
}

it('S04 debug keeps manual hello operations, adds COOKIE, and displays only value length', async () => {
    await mount('debug');
    const select = container.querySelector<HTMLSelectElement>('#manual-storage')!;
    expect(Array.from(select.options).map(option => option.value)).toContain('cookie');
    document.cookie = `hello=${encodeURIComponent(SECRET)}; Path=/; Domain=${window.location.hostname}; Secure; SameSite=Lax`;
    await act(async () => {
        select.value = 'cookie';
        select.dispatchEvent(new Event('change', {bubbles: true}));
    });
    await act(async () => container.querySelector('form')!.dispatchEvent(new Event('submit', {bubbles: true, cancelable: true})));
    expect(container.textContent).not.toContain(SECRET);
    expect(container.textContent).toContain('valueLength');
    expect(container.textContent).toContain(String(SECRET.length));
    const input = container.querySelector<HTMLInputElement>('#manual-value')!;
    await act(async () => {
        Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, 'value')!.set!.call(input, 'manual-cookie%==');
        input.dispatchEvent(new Event('input', {bubbles: true}));
    });
    await act(async () => Array.from(container.querySelectorAll('button')).find(button => button.textContent === 'Write hello')!.click());
    expect(document.cookie).toContain(`hello=${encodeURIComponent('manual-cookie%==')}`);
    expect(Array.from(container.querySelectorAll('pre')).map(node => node.textContent).join('')).not.toContain('manual-cookie%==');
    document.cookie = `hello=; Max-Age=0; Path=/; Domain=${window.location.hostname}`;
});
