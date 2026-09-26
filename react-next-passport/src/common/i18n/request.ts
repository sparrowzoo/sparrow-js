import { hasLocale } from "next-intl";
import { getRequestConfig } from "next-intl/server";
import { locale as getRequestLocale } from "next/root-params";
import { routing } from "@/i18n/routing";

export default getRequestConfig(async ({ locale: localeOverride }) => {
  const requested = localeOverride ?? await getRequestLocale();
  const locale = hasLocale(routing.locales, requested)
    ? requested
    : routing.defaultLocale;

  return {
    locale,
    messages: (await import(`../../../messages/${locale}.json`)).default,
  };
});
