import auth from "./vitest.auth.config.mjs";

export default {
    ...auth,
    test: {...auth.test, include: ["tests/messaging/**/*.test.ts"]},
};
