import { defineRouting } from "next-intl/routing";
import { PASSPORT_ROOT } from "@/common/lib/Env";

export const routing = defineRouting({
  locales: ["en", "zh"],
  defaultLocale: "en",
  pathnames: {
    "/": "/",
    "/i18n": {
      zh: "/guojihua",
    },
    "/sign-in": {
      en: `${PASSPORT_ROOT}/en/sign-in`,
      zh: `${PASSPORT_ROOT}/zh/sign-in`,
    },
    "/sign-up": {
      en: `${PASSPORT_ROOT}/en/sign-up`,
      zh: `${PASSPORT_ROOT}/zh/sign-up`,
    },
    "/chat/friends": "/chat/friends",
    "/chat/friends/contact": "chat/friends/contact",
    "/chat/sessions/session": "/chat/sessions/session",
    "/shop": "/shop",
    "/pop": "/pop",
    "/pop/server": "/pop/server",
    "/blog": "/blog",
    "/chat/friends/new-friend": "/chat/friends/new-friend",
    "/playground": "/playground",
  },
});
