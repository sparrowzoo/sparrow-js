import {defineRouting} from "next-intl/routing";

export const routing = defineRouting({
    locales: ["en", "zh"],
    defaultLocale: "zh",
    // Every localized URL maps directly to an exported directory.
    localePrefix: "always",
    localeDetection: false,
});
