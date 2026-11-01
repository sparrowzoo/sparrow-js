import {defineConfig, chromium} from '@playwright/test';
import {existsSync, readFileSync} from 'node:fs';
import {tmpdir} from 'node:os';
import path from 'node:path';

const managedBrowser = chromium.executablePath();
const executablePath = existsSync(managedBrowser) ? managedBrowser :
    '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';
const outputDir = process.env.MESSAGING_E2E_OUTPUT_DIR ?? path.join(tmpdir(), 'sparrow-messaging-e2e-results');
const credentialsPath = process.env.MESSAGING_E2E_CREDENTIALS;
const backend = credentialsPath ? JSON.parse(readFileSync(credentialsPath, 'utf8')) : null;

export default defineConfig({
    testDir: './tests/e2e',
    testMatch: backend ? 'real-backend.spec.mjs' : 'messaging.spec.mjs',
    workers: 1,
    retries: 0,
    timeout: 60_000,
    expect: {timeout: 10_000},
    reporter: [['list'], ['json', {outputFile: path.join(outputDir, 'report.json')}]],
    outputDir,
    use: {
        baseURL: 'http://127.0.0.1:3303',
        headless: true,
        launchOptions: {executablePath},
        trace: backend ? 'off' : 'retain-on-failure',
        screenshot: 'only-on-failure',
    },
    webServer: {
        command: 'yarn next dev --hostname 127.0.0.1 --port 3303',
        url: 'http://127.0.0.1:3303/zh/',
        reuseExistingServer: false,
        timeout: 90_000,
        env: {
            SPARROW_MESSAGING_E2E: '1',
            NEXT_PUBLIC_API: backend?.apiUrl ?? 'http://127.0.0.1:18888',
            NEXT_PUBLIC_WEBSOCKET: backend?.wsUrl ?? 'ws://127.0.0.1:18888/websocket',
            NEXT_PUBLIC_STORAGE_PROXY: 'http://127.0.0.1:3303/cros-storage/',
            NEXT_PUBLIC_TOKEN_STORAGE: 'COOKIE',
            NEXT_PUBLIC_TOKEN_COOKIE_DOMAIN: '',
            NEXT_PUBLIC_TOKEN_COOKIE_SECURE: 'false',
            NEXT_PUBLIC_AVATAR_URL: '/avatar/visitor.jpg',
        },
    },
});
