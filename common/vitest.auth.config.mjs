import {fileURLToPath} from "node:url";
import {defineConfig} from "vitest/config";

export default defineConfig({
    resolve: {alias: {"@": fileURLToPath(new URL("./src", import.meta.url))}},
    oxc: {jsx: {runtime: "automatic"}},
    test: {
        include: ["tests/auth/**/*.test.ts", "tests/auth/**/*.test.tsx"],
        environment: "jsdom",
        environmentOptions: {jsdom: {url: "https://passport.sparrowzoo.com/"}},
        env: {
            NEXT_PUBLIC_TOKEN_KEY: "sso-test-token",
            NEXT_PUBLIC_TOKEN_STORAGE: "LOCAL",
            NEXT_PUBLIC_STORAGE_PROXY: "https://passport.sparrowzoo.com/cros-storage/",
            NEXT_PUBLIC_CROS_DEBUG: "false",
        },
        clearMocks: true,
        restoreMocks: true,
        unstubEnvs: true,
        maxWorkers: 2,
    },
});
