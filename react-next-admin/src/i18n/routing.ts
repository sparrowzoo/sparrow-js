import { defineRouting } from "next-intl/routing";
import { PASSPORT_ROOT } from "@/common/lib/Env";

export const routing = defineRouting({
  locales: ["en", "zh"],
  defaultLocale: "en",
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
  },
});
