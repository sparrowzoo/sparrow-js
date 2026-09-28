import {defineConfig, chromium} from '@playwright/test';
import {existsSync} from 'node:fs';
import {tmpdir} from 'node:os';
import path from 'node:path';

// Use the managed browser when installed; otherwise reuse a local Chrome without
// downloading a browser or changing the machine's hosts/certificate settings.
const configuredBrowser = process.env.AUTH_E2E_CHROME_EXECUTABLE;
const bundledBrowser = chromium.executablePath();
const localChrome = [
    '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
    '/usr/bin/google-chrome',
    '/usr/bin/chromium',
].find(candidate => existsSync(candidate));
const executablePath = configuredBrowser ?? (existsSync(bundledBrowser) ? bundledBrowser : localChrome);
const outputDir = process.env.AUTH_E2E_OUTPUT_DIR ?? path.join(tmpdir(), `sparrow-auth-e2e-results-${process.pid}`);

export default defineConfig({
    testDir: './tests/auth/e2e',
    testMatch: 'sso.spec.ts',
    fullyParallel: false,
    workers: 1,
    retries: 0,
    timeout: 35_000,
    expect: {timeout: 5_000},
    reporter: [['list'], ['json', {outputFile: path.join(outputDir, 'report.json')}]],
    outputDir,
    use: {
        browserName: 'chromium',
        headless: true,
        ignoreHTTPSErrors: true,
        launchOptions: {
            executablePath,
            args: [
                // Playwright's default disabled-feature list includes
                // ThirdPartyStoragePartitioning. Chromium takes the final
                // value of a repeated switch; restore its normal feature policy.
                '--disable-features=',
                '--enable-automation',
                '--host-resolver-rules=MAP app.sso.test 127.0.0.1, MAP auth.sso.test 127.0.0.1, MAP app.other.test 127.0.0.1',
                '--no-proxy-server',
            ],
        },
        // No flags disable third-party Cookie protection. Cross-site results are
        // observations of the browser's actual policy, not a promise of support.
        trace: 'retain-on-failure',
    },
});
