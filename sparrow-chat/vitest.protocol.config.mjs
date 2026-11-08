import {fileURLToPath} from "node:url";
import {defineConfig} from "vitest/config";

export default defineConfig({
    oxc: {jsx: {runtime: "automatic"}},
    resolve: {alias: {
        "@/common": fileURLToPath(new URL("../common/src/common", import.meta.url)),
        "@": fileURLToPath(new URL("./src", import.meta.url)),
    }},
    test: {include: ["tests/protocol/**/*.test.ts"], environment: "node", maxWorkers: 2},
});
