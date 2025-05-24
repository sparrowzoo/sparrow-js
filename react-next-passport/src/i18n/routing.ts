import { defineRouting } from "next-intl/routing";
import { WWW_ROOT } from "@/common/lib/Env";

export const routing = defineRouting({
  locales: ["en", "zh"],
  defaultLocale: "en",
  pathnames: {
    "/": {
      en: "http://localhost:3001/en/hi",
      zh: "http://localhost:3001/zh/hi",
    },
    "/sign-in": "/sign-in",
    "/sign-up": "/sign-up",
    "/chat/friends": {
      en: `${WWW_ROOT}/en/chat/friends`,
      zh: `${WWW_ROOT}/zh/chat/friends`,
    },
    "/pop": {
      en: `${WWW_ROOT}/en/pop`,
      zh: `${WWW_ROOT}/zh/pop`,
    },
    "/playground": {
      en: `${WWW_ROOT}/en/playground`,
      zh: `${WWW_ROOT}/zh/playground`,
    },
    "/blog": {
      en: `${WWW_ROOT}/en/blog`,
      zh: `${WWW_ROOT}/zh/blog`,
    },
    "/shop": {
      en: `${WWW_ROOT}/en/shop`,
      zh: `${WWW_ROOT}/zh/shop`,
    },
    "/avatar-editor": "/avatar-editor",
  },
});
