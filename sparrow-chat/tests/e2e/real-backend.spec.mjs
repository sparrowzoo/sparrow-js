import {test, expect} from '@playwright/test';
import {readFileSync} from 'node:fs';

const backend = JSON.parse(readFileSync(process.env.MESSAGING_E2E_CREDENTIALS, 'utf8'));

test('real Java backend: two browser users exchange direct/group messages and restore persisted history', async ({browser}, testInfo) => {
    const clients = [];
    const pageErrors = [];
    try {
        for (const user of backend.users) {
            const context = await browser.newContext({viewport: {width: 1440, height: 1000}});
            clients.push({context, user});
            await context.addCookies([{name: backend.tokenHeader || 'Authorization', value: encodeURIComponent(user.token),
                url: 'http://127.0.0.1:3303', sameSite: 'Lax'}]);
            await context.route('**/*', route => {
                if (!['127.0.0.1', 'localhost'].includes(new URL(route.request().url()).hostname)) return route.abort();
                return route.continue();
            });
            const page = await context.newPage();
            clients.at(-1).page = page;
            page.on('pageerror', error => pageErrors.push(error.message));
            await page.goto(`http://127.0.0.1:3303/zh/chat/sessions/session/?sessionKey=${backend.sessionKey}`);
            await expect(page.locator('.im-editor-content')).toBeVisible();
            await expect(page.locator('.im-session-key')).toHaveText(backend.sessionKey);
        }
        const [alice, bob] = clients;
        const prefix = `browser-java-e2e-${Date.now()}`;
        const direct = `${prefix}-direct-中文🙂`;
        await alice.page.locator('.im-editor-content').fill(direct);
        await alice.page.locator('.im-send-button').click();
        await expect(alice.page.locator('.im-message-sent .im-message-bubble').filter({hasText: direct})).toHaveCount(1);
        await expect(bob.page.locator('.im-message-received .im-message-bubble').filter({hasText: direct})).toHaveCount(1);
        const reply = `${prefix}-reply`;
        await bob.page.locator('.im-editor-content').fill(reply);
        await bob.page.locator('.im-editor-content').press('Enter');
        await expect(alice.page.locator('.im-message-received .im-message-bubble').filter({hasText: reply})).toHaveCount(1);
        await bob.page.reload();
        await expect(bob.page.locator('.im-message-bubble').filter({hasText: direct})).toHaveCount(1);
        await expect(bob.page.locator('.im-message-bubble').filter({hasText: reply})).toHaveCount(1);
        await bob.page.screenshot({path: testInfo.outputPath('real-direct-history.png'), fullPage: true});

        for (const client of clients) {
            await client.page.goto(`http://127.0.0.1:3303/zh/chat/sessions/session/?sessionKey=${backend.groupSessionKey}`);
            await expect(client.page.locator('.im-session-key')).toHaveText(backend.groupSessionKey);
            await expect(client.page.locator('.im-editor-content')).toBeVisible();
        }
        const group = `${prefix}-group-中文🙂`;
        await alice.page.locator('.im-editor-content').fill(group);
        await alice.page.locator('.im-send-button').click();
        await expect(bob.page.locator('.im-message-received .im-message-bubble').filter({hasText: group})).toHaveCount(1);
        await bob.page.reload();
        await expect(bob.page.locator('.im-message-bubble').filter({hasText: group})).toHaveCount(1);
        await bob.page.screenshot({path: testInfo.outputPath('real-group-history.png'), fullPage: true});
        await alice.page.goto('http://127.0.0.1:3303/zh/chat/message-search/');
        await alice.page.locator('.im-session-search-input').fill(backend.sessionKey);
        await alice.page.locator('.im-session-search-input').press('Escape');
        await alice.page.locator('.im-message-search-filters input').last().fill(prefix);
        await alice.page.locator('.im-message-search-filters > button').last().click();
        await expect(alice.page.locator('.im-history-content').filter({hasText: direct})).toHaveCount(1);
        await alice.page.locator('.im-session-search-input').fill(backend.groupSessionKey);
        await alice.page.locator('.im-session-search-input').press('Escape');
        await alice.page.locator('.im-message-search-filters > button').last().click();
        const savedGroupMessage = alice.page.locator('.im-history-item').filter({hasText: group});
        await expect(savedGroupMessage).toHaveCount(1);
        await expect(savedGroupMessage.locator('.im-history-meta')).toContainText(backend.groupName || 'E2E Local Group');
        await alice.page.screenshot({path: testInfo.outputPath('real-history-search.png'), fullPage: true});
        expect(pageErrors).toEqual([]);
        await testInfo.attach('real-backend-evidence', {contentType: 'application/json', body: Buffer.from(JSON.stringify({
            apiUrl: backend.apiUrl, wsUrl: backend.wsUrl, users: backend.users.map(({id, name}) => ({id, name})),
            directSessionKey: backend.sessionKey, groupSessionKey: backend.groupSessionKey,
            messages: [direct, reply, group], browser: browser.version(),
            checks: ['direct-both-directions', 'group-delivery', 'history-after-full-reload', 'database-history-search', 'unicode-payload', 'no-page-errors'],
            loginScope: 'Dedicated pre-provisioned test tokens; login UI/captcha not exercised',
            preconditions: backend.preconditions ?? [],
        }, null, 2))});
    } finally {
        for (const client of clients) await client.context.close();
    }
});
