import {test, expect} from '@playwright/test';
import {startFixture, tokenFor, users, DIRECT_KEY, GROUP_KEY} from './messaging.fixture.mjs';

let fixture;
test.beforeAll(async () => { fixture = await startFixture(); });
test.afterAll(async () => { await fixture?.close(); });
test.afterEach(() => { fixture.state.directSessionKey = DIRECT_KEY; });

async function openUser(browser, user) {
    const context = await browser.newContext({viewport: {width: 1440, height: 1000}});
    await context.addCookies([{name: 'Authorization', value: encodeURIComponent(tokenFor(user)),
        url: 'http://127.0.0.1:3303', sameSite: 'Lax'}]);
    // Keep all test traffic local, including optional images and analytics.
    await context.route('**/*', route => {
        const url = new URL(route.request().url());
        if (!['127.0.0.1', 'localhost'].includes(url.hostname)) return route.abort();
        return route.continue();
    });
    const page = await context.newPage();
    const errors = [];
    page.on('pageerror', error => errors.push(error.message));
    await page.goto(`http://127.0.0.1:3303/zh/chat/sessions/session/?sessionKey=${DIRECT_KEY}`);
    await expect(page.locator('.im-editor-content')).toBeVisible();
    return {context, page, errors};
}

test('real pages: HTTP sessions/history, Base62 direct and group messages, reload and heartbeat (isolated peer)', async ({browser}, testInfo) => {
    const alice = await openUser(browser, users[0]);
    const bob = await openUser(browser, users[1]);
    try {
        await expect(alice.page.locator('.im-session-key')).toHaveText(DIRECT_KEY);
        await expect(alice.page.locator('.im-message-bubble').filter({hasText: 'E2E saved direct history'})).toHaveCount(1);
        await alice.page.locator('.im-session-trigger').filter({hasText: 'E2E Bob'}).click();
        await expect(alice.page).toHaveURL(new RegExp(`sessionKey=${DIRECT_KEY}`));
        await expect.poll(() => fixture.sockets.size).toBe(2);

        const directText = 'E2E direct 中文🙂';
        await alice.page.locator('.im-editor-content').fill(directText);
        await alice.page.locator('.im-send-button').click();
        await expect(alice.page.locator('.im-message-sent .im-message-bubble').filter({hasText: directText})).toHaveCount(1);
        await expect(bob.page.locator('.im-message-received .im-message-bubble').filter({hasText: directText})).toHaveCount(1);
        expect(fixture.frames.find(frame => frame.content === directText)).toMatchObject({
            protocolType: 8, device: 1, chatType: 0, messageType: 0,
            sender: {id: '1', category: 1}, receiver: {id: 'zzzzzzzzzz', category: 61}, sessionKey: DIRECT_KEY,
        });

        const reply = 'E2E reply from category 61';
        await bob.page.locator('.im-editor-content').fill(reply);
        await bob.page.locator('.im-editor-content').press('Enter');
        await expect(alice.page.locator('.im-message-received .im-message-bubble').filter({hasText: reply})).toHaveCount(1);

        for (const client of [alice, bob]) {
            await client.page.locator('.im-session-trigger').filter({hasText: 'E2E Test Group'}).click();
            await expect(client.page).toHaveURL(new RegExp(`sessionKey=${GROUP_KEY}`));
            await expect(client.page.locator('.im-session-key')).toHaveText(GROUP_KEY);
            await expect(client.page.locator('.im-message-bubble').filter({hasText: 'E2E saved group history'})).toHaveCount(1);
        }
        const groupText = 'E2E group 中文🙂';
        await alice.page.locator('.im-editor-content').fill(groupText);
        await alice.page.locator('.im-send-button').click();
        await expect(bob.page.locator('.im-message-received .im-message-bubble').filter({hasText: groupText})).toHaveCount(1);
        expect(fixture.frames.find(frame => frame.content === groupText)).toMatchObject({chatType: 1, sessionKey: GROUP_KEY, receiver: null});

        await bob.page.reload();
        await expect(bob.page.locator('.im-message-bubble').filter({hasText: groupText})).toHaveCount(1);
        await expect.poll(() => fixture.frames.some(frame => frame.protocolType === 30), {timeout: 12_000}).toBe(true);
        await alice.page.screenshot({path: testInfo.outputPath('group-messaging.png'), fullPage: true});
        expect(fixture.errors).toEqual([]);
        expect(alice.errors).toEqual([]);
        expect(bob.errors).toEqual([]);
        await testInfo.attach('wire-and-http-evidence', {contentType: 'application/json', body: Buffer.from(JSON.stringify({
            scope: 'Real Next.js pages and browser network transport; isolated synthetic HTTP/WebSocket peer. Not Java backend acceptance.',
            frames: fixture.frames, requests: fixture.requests,
        }, null, 2))});
    } finally {
        await alice.context.close();
        await bob.context.close();
    }
});

test('updated contact category changes the restored session route and outgoing recipient', async ({browser}) => {
    fixture.state.directSessionKey = '011Azzzzzzzzzz1';
    const alice = await openUser(browser, users[0]);
    try {
        await alice.page.locator('.im-session-trigger').filter({hasText: 'E2E Test Group'}).click();
        await expect(alice.page.locator('.im-session-key')).toHaveText(GROUP_KEY);
        await alice.page.locator('.im-session-trigger').filter({hasText: 'E2E Bob'}).click();
        await expect(alice.page).toHaveURL(new RegExp(`sessionKey=${DIRECT_KEY}`));
        await expect(alice.page.locator('.im-session-key')).toHaveText(DIRECT_KEY);
        await alice.page.locator('.im-editor-content').fill('E2E updated category');
        await alice.page.locator('.im-send-button').click();
        await expect.poll(() => fixture.frames.find(frame => frame.content === 'E2E updated category')?.receiver)
            .toEqual({id: 'zzzzzzzzzz', category: 61});
        expect(alice.errors).toEqual([]);
    } finally { await alice.context.close(); }
});

test('malformed and control frames do not become chat messages or prevent later sending', async ({browser}) => {
    const alice = await openUser(browser, users[0]);
    const warnings = [];
    alice.page.on('console', message => { if (message.type() === 'warning') warnings.push(message.text()); });
    try {
        const messagesBefore = await alice.page.locator('.im-message-bubble').count();
        await expect.poll(() => fixture.sockets.has('1')).toBe(true);
        fixture.sockets.get('1').send(Buffer.from([8]));
        fixture.sockets.get('1').send(Buffer.from([40]));
        await expect.poll(() => warnings.some(message => message.includes('Unable to process WebSocket protocol frame'))).toBe(true);
        await expect(alice.page.locator('.im-message-bubble')).toHaveCount(messagesBefore);
        await alice.page.locator('.im-editor-content').fill('E2E after malformed frame');
        await alice.page.locator('.im-send-button').click();
        await expect.poll(() => fixture.frames.some(frame => frame.content === 'E2E after malformed frame')).toBe(true);
        expect(alice.errors).toEqual([]);
    } finally { await alice.context.close(); }
});

test('history search restores message models and displays the group name', async ({browser}, testInfo) => {
    const alice = await openUser(browser, users[0]);
    try {
        await alice.page.goto('http://127.0.0.1:3303/zh/chat/message-search/');
        await alice.page.locator('.im-session-search-input').fill(DIRECT_KEY);
        await alice.page.locator('.im-session-search-input').press('Escape');
        await alice.page.locator('.im-message-search-filters input').last().fill('E2E saved');
        await alice.page.locator('.im-message-search-filters > button').last().click();
        await expect(alice.page.locator('.im-history-content').filter({hasText: 'E2E saved direct history'})).toHaveCount(1);
        await alice.page.locator('.im-session-search-input').fill(GROUP_KEY);
        await alice.page.locator('.im-session-search-input').press('Escape');
        await alice.page.locator('.im-message-search-filters > button').last().click();
        const groupMessage = alice.page.locator('.im-history-item').filter({hasText: 'E2E saved group history'});
        await expect(groupMessage).toHaveCount(1);
        await alice.page.screenshot({path: testInfo.outputPath('history-search.png'), fullPage: true});
        await expect(groupMessage.locator('.im-history-meta')).toContainText('E2E Test Group');
        expect(alice.errors).toEqual([]);
    } finally { await alice.context.close(); }
});
