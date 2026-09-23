import {defineRouting} from "next-intl/routing";
import {PASSPORT_ROOT, WWW_ROOT} from "@/common/lib/Env";

export const routing = defineRouting({
    locales: ["en", "zh"],
    defaultLocale: "zh",
    localePrefix: 'always', // 静态导出必须 always：as-needed 依赖 middleware 剥离默认语言前缀
    pathnames: {
        "/": "/",
        "/dashboard": "/dashboard",
        "/access-history": "/access-history",
        "/sign-in": {
            en: `${PASSPORT_ROOT}/en/sign-in`,
            zh: `${PASSPORT_ROOT}/zh/sign-in`,
        },
        "/sign-up": {
            en: `${PASSPORT_ROOT}/en/sign-up`,
            zh: `${PASSPORT_ROOT}/zh/sign-up`,
        },
        "/avatar-editor": {
            en: `${PASSPORT_ROOT}/en/avatar-editor`,
            zh: `${PASSPORT_ROOT}/zh/avatar-editor`,
        },
        "/table-config": "/table-config",
        "/project-config": "/project-config",
        "/department": "/department",
        "/blog": {
            en: `${WWW_ROOT}/en/blog`,
            zh: `${WWW_ROOT}/zh/blog`,
        },
        "/chat/friends": {
            en: `${WWW_ROOT}/en/chat/friends`,
            zh: `${WWW_ROOT}/zh/chat/friends`,
        },
        "/pop": {
            en: `${WWW_ROOT}/en/pop`,
            zh: `${WWW_ROOT}/zh/pop`,
        },
        "/shop": {
            en: `${WWW_ROOT}/en/shop`,
            zh: `${WWW_ROOT}/zh/shop`,
        },
        "/coder": "/project-config",
        "/playground": {
            en: `${WWW_ROOT}/en/playground`,
            zh: `${WWW_ROOT}/zh/playground`,
        }
    },
});
