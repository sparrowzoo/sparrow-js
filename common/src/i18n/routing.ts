import {defineRouting} from "next-intl/routing";

export const routing = defineRouting({
    locales: ["en", "zh"],
    defaultLocale: "zh",
    localePrefix: 'as-needed' // 关键配置
});
