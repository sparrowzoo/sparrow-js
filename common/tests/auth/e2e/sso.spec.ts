import {test as base, expect, type Page} from '@playwright/test';
import path from 'node:path';
import {homedir, tmpdir} from 'node:os';
import {startFixture} from './fixture-server.mjs';

type Fixture = Awaited<ReturnType<typeof startFixture>>;
type Mode = 'local' | 'session' | 'cookie';
type SaveOptions = {remember?: boolean};
type TestApi = {
    get(key?: string, mode?: Mode): Promise<string | null>;
    set(value: string, key?: string, mode?: Mode, options?: SaveOptions): Promise<string>;
    remove(key?: string, mode?: Mode): Promise<string | null>;
    getToken(mode?: Mode): Promise<string | null>;
    setToken(value: string, mode?: Mode, options?: SaveOptions): Promise<string>;
    removeToken(mode?: Mode): Promise<string | null>;
    messages: Array<{command?: string; requestId?: string}>;
};

declare global {
    interface Window { testApi: TestApi }
}

const test = base.extend<{}, {authFixture: Fixture}>({
    authFixture: [async ({}, use, workerInfo) => {
        const fixture = await startFixture({commonRoot: path.resolve(workerInfo.project.testDir, '../../..')});
        try { await use(fixture); } finally { await fixture.close(); }
    }, {scope: 'worker'}],
});

const TOKEN_KEY = 'auth-e2e-token';
// A deliberately old business expiry, with bytes which must not be decoded or
// replaced by getToken. This is synthetic data, never a real credential.
const EXPIRED_TOKEN = 'eyJhbGciOiJub25lIn0.eyJleHAiOjEsImV4cGlyZUF0IjoxfQ.unchanged%3D==';

async function openClient(page: Page, origin: string, mode: Mode = 'cookie', proxy = 'normal', sameSite = 'Lax') {
    await page.goto(`${origin}/?mode=${mode}&proxy=${proxy}&sameSite=${sameSite}`);
    await page.waitForFunction(() => Boolean(window.testApi));
}

async function localData(page: Page) {
    return page.evaluate(key => ({
        local: localStorage.getItem(key),
        session: sessionStorage.getItem(key),
        cookies: document.cookie,
    }), TOKEN_KEY);
}

test.afterEach(async ({browser, authFixture}, testInfo) => {
    const devtools = await browser.newBrowserCDPSession();
    const {arguments: browserArguments} = await devtools.send('Browser.getBrowserCommandLine');
    await devtools.detach();
    const featureSwitches = browserArguments.filter(argument => argument.startsWith('--disable-features'));
    // Verify the actual launched browser, not just the configuration source.
    expect(featureSwitches.at(-1)?.replace(/^--disable-features=?/, '') ?? '').toBe('');
    await testInfo.attach('browser-environment', {
        contentType: 'application/json',
        body: Buffer.from(JSON.stringify({
            timestamp: new Date().toISOString(),
            browser: browser.version(),
            node: process.version,
            platform: process.platform,
            origins: authFixture.origins,
            privacyPolicy: 'default browser policy; no third-party-cookie bypass flags',
            featureSwitches,
            browserArguments: browserArguments.map(argument => argument.replaceAll(homedir(), '${user.home}').replaceAll(tmpdir(), '${temp}')),
            mobileAcceptance: 'NOT EXECUTED: desktop automation is not iOS Safari/Android Chrome evidence',
        }, null, 2)),
    });
});

test('S13 desktop portion / S02 S06: shared Cookie keeps expired token bytes and 14+1 days without iframe or renewal', async ({page, context, authFixture}, testInfo) => {
    const auth = await context.newPage();
    await openClient(auth, authFixture.origins.auth);
    const savedAt = Date.now() / 1000;
    expect(await auth.evaluate(token => window.testApi.setToken(token, 'cookie', {remember: true}), EXPIRED_TOKEN)).toBe(EXPIRED_TOKEN);
    const [cookie] = (await context.cookies()).filter(item => item.name === TOKEN_KEY);
    expect(cookie).toMatchObject({domain: '.sso.test', path: '/', secure: true, sameSite: 'Lax', httpOnly: false});
    expect(decodeURIComponent(cookie.value)).toBe(EXPIRED_TOKEN);
    expect(cookie.expires).toBeGreaterThanOrEqual(savedAt + 15 * 86400 - 2);
    expect(cookie.expires).toBeLessThanOrEqual(Date.now() / 1000 + 15 * 86400 + 2);

    const authRequests: string[] = [];
    page.on('request', request => {
        if (new URL(request.url()).origin === authFixture.origins.auth) authRequests.push(request.url());
    });
    await openClient(page, authFixture.origins.app);
    expect(await page.evaluate(() => window.testApi.getToken('cookie'))).toBe(EXPIRED_TOKEN);
    expect(await page.evaluate(() => window.testApi.getToken('cookie'))).toBe(EXPIRED_TOKEN);
    await page.reload();
    await page.waitForFunction(() => Boolean(window.testApi));
    expect(await page.evaluate(() => window.testApi.getToken('cookie'))).toBe(EXPIRED_TOKEN);
    expect(await page.locator('iframe').count()).toBe(0);
    expect(authRequests).toEqual([]);
    const [afterReads] = (await context.cookies()).filter(item => item.name === TOKEN_KEY);
    expect(afterReads.expires).toBe(cookie.expires);
    expect(afterReads.value).toBe(cookie.value);
    await testInfo.attach('persistent-cookie-observation', {contentType: 'application/json', body: Buffer.from(JSON.stringify({
        domain: cookie.domain, path: cookie.path, secure: cookie.secure, sameSite: cookie.sameSite,
        expires: cookie.expires, retentionDays: 15,
        valueLength: decodeURIComponent(cookie.value).length, matchesInput: true,
        valueAndExpiryUnchangedAfterReads: true, iframeCount: 0, authorityRequests: 0,
    }, null, 2))});
});

test('S13 desktop portion / S02 S11: unchecked remember creates a session Cookie and logout removes the shared credential', async ({page, context, authFixture}, testInfo) => {
    const auth = await context.newPage();
    await openClient(auth, authFixture.origins.auth);
    await auth.evaluate(() => window.testApi.setToken('session-token%==', 'cookie', {remember: false}));
    const [cookie] = (await context.cookies()).filter(item => item.name === TOKEN_KEY);
    expect(cookie.expires).toBe(-1);
    expect(cookie).toMatchObject({domain: '.sso.test', path: '/', secure: true, sameSite: 'Lax'});
    await openClient(page, authFixture.origins.app);
    expect(await page.evaluate(() => window.testApi.getToken('cookie'))).toBe('session-token%==');
    expect(await page.evaluate(() => window.testApi.removeToken('cookie'))).toBe('session-token%==');
    expect((await context.cookies()).filter(item => item.name === TOKEN_KEY)).toEqual([]);
    expect(await auth.evaluate(() => window.testApi.getToken('cookie'))).toBeNull();
    expect(await page.evaluate(() => window.testApi.removeToken('cookie'))).toBeNull();
    await testInfo.attach('session-cookie-observation', {contentType: 'application/json', body: Buffer.from(JSON.stringify({
        domain: cookie.domain, path: cookie.path, secure: cookie.secure, sameSite: cookie.sameSite,
        expires: cookie.expires, valueLength: decodeURIComponent(cookie.value).length,
        sharedReadMatchesInput: true, remainingCookieCountAfterLogout: 0,
        authorityReadAfterLogoutHasValue: false, repeatedRemovalReturnsNull: true,
    }, null, 2))});
});

for (const proxy of ['normal', 'debug']) {
    test(`S04: ${proxy} production proxy preserves public get/set/remove and Cookie save options`, async ({page, context, authFixture}) => {
        await openClient(page, authFixture.origins.app, 'cookie', proxy);
        expect(await page.evaluate(() => window.testApi.set('rpc%==', 'ordinary-key', 'cookie', {remember: true}))).toBe('rpc%==');
        expect(await page.evaluate(() => window.testApi.get('ordinary-key', 'cookie'))).toBe('rpc%==');
        const [cookie] = (await context.cookies()).filter(item => item.name === 'ordinary-key');
        expect(cookie).toMatchObject({domain: '.sso.test', secure: true, sameSite: 'Lax'});
        expect(cookie.expires).toBeGreaterThan(Date.now() / 1000 + 14 * 86400);
        expect(await page.evaluate(() => window.testApi.remove('ordinary-key', 'cookie'))).toBe('rpc%==');
        expect(await page.evaluate(() => window.testApi.get('ordinary-key', 'cookie'))).toBeNull();
        expect((await context.cookies()).filter(item => item.name === 'ordinary-key')).toEqual([]);
        const expectedRoute = proxy === 'debug' ? '/cros-storage-debug/' : '/cros-storage/';
        expect(page.frames().some(frame => new URL(frame.url()).pathname.endsWith(expectedRoute))).toBe(true);
        if (proxy === 'debug') {
            const proxyFrame = page.frames().find(frame => frame.url().includes('cros-storage-debug'));
            expect(proxyFrame).toBeDefined();
            expect(await proxyFrame!.locator('body').innerText()).not.toContain('rpc%==');
        }
    });
}

for (const mode of ['local', 'session'] as const) {
    test(`S07: ${mode} RPC results are queried afresh and never written into B`, async ({page, authFixture}) => {
        await openClient(page, authFixture.origins.app, mode);
        await page.evaluate(({mode}) => window.testApi.setToken('remote-first', mode), {mode});
        expect(await page.evaluate(mode => window.testApi.getToken(mode), mode)).toBe('remote-first');
        expect(await localData(page)).toEqual({local: null, session: null, cookies: ''});
        const authFrame = page.frames().find(frame => frame.url().startsWith(authFixture.origins.auth));
        expect(authFrame).toBeDefined();
        // A second actual instance in A changes the source, independently of B.
        await authFrame!.evaluate(mode => window.testApi.setToken('remote-second', mode), mode);
        expect(await page.evaluate(mode => window.testApi.getToken(mode), mode)).toBe('remote-second');
        expect(await localData(page)).toEqual({local: null, session: null, cookies: ''});
        expect(await authFrame!.evaluate(() => window.testApi.messages.filter(message => message.command === 'get').length)).toBe(2);
    });
}

test('S07: Cookie RPC reads A host-only state twice without writing or caching it in B', async ({page, context, authFixture}) => {
    // Browser setup supplies an A-only Cookie so the shared-cookie local hit
    // cannot hide this fallback branch. Runtime configuration stays sso.test.
    await context.addCookies([{name: TOKEN_KEY, value: 'remote-cookie-first', url: authFixture.origins.auth, secure: true, sameSite: 'Lax'}]);
    await openClient(page, authFixture.origins.app);
    expect(await page.evaluate(() => window.testApi.getToken('cookie'))).toBe('remote-cookie-first');
    expect(await localData(page)).toEqual({local: null, session: null, cookies: ''});
    await context.addCookies([{name: TOKEN_KEY, value: 'remote-cookie-second', url: authFixture.origins.auth, secure: true, sameSite: 'Lax'}]);
    expect(await page.evaluate(() => window.testApi.getToken('cookie'))).toBe('remote-cookie-second');
    expect(await localData(page)).toEqual({local: null, session: null, cookies: ''});
    const authFrame = page.frames().find(frame => frame.url().startsWith(authFixture.origins.auth));
    expect(authFrame).toBeDefined();
    expect(await authFrame!.evaluate(() => window.testApi.messages.filter(message => message.command === 'get').length)).toBe(2);
    expect((await context.cookies()).filter(item => item.name === TOKEN_KEY)).toHaveLength(1);
});

for (const sameSite of ['Lax', 'None']) {
    test(`S14 observation: cross-root ${sameSite}+Secure records the actual value, empty result or restriction`, async ({page, context, authFixture}, testInfo) => {
        const auth = await context.newPage();
        await openClient(auth, authFixture.origins.auth, 'cookie', 'normal', sameSite);
        await auth.evaluate(() => window.testApi.setToken('cross-root-synthetic', 'cookie', {remember: true}));
        expect(await auth.evaluate(() => window.testApi.getToken('cookie'))).toBe('cross-root-synthetic');
        await openClient(page, authFixture.origins.other, 'cookie', 'normal', sameSite);
        expect(await localData(page)).toEqual({local: null, session: null, cookies: ''});
        const outcome = await page.evaluate(async () => {
            try {
                const value = await window.testApi.getToken('cookie');
                return {classification: value === null ? 'empty' : 'value', value, error: null};
            } catch (error) {
                return {classification: 'error', value: null, error: error instanceof Error ? error.message : String(error)};
            }
        });
        if (outcome.classification === 'value') expect(outcome.value).toBe('cross-root-synthetic');
        expect(await localData(page)).toEqual({local: null, session: null, cookies: ''});
        expect(await page.locator('iframe').count()).toBe(1);
        const record = {
            sameSite,
            secure: true,
            classification: outcome.classification,
            returnedExpectedToken: outcome.classification === 'value',
            error: outcome.error,
            bLocalStorageEmpty: true,
            scope: 'Observed desktop browser result; empty/error does not establish successful cross-root SSO',
            mobileAcceptance: 'not executed',
        };
        testInfo.annotations.push({type: 'cross-root-observation', description: `${sameSite}: ${outcome.classification}; not mobile acceptance`});
        await testInfo.attach(`cross-root-${sameSite}`, {contentType: 'application/json', body: Buffer.from(JSON.stringify(record, null, 2))});
        console.log(`S14 ${JSON.stringify(record)}`);
    });
}
