import {fileURLToPath} from "node:url";
import {defineConfig} from "vitest/config";

export default defineConfig({
    resolve: {alias: {"@": fileURLToPath(new URL("./src", import.meta.url))}},
    oxc: {jsx: {runtime: "automatic"}},
    test: {
        include: ["tests/menu/**/*.test.ts", "tests/menu/**/*.test.tsx"],
        environment: "node",
    },
});
