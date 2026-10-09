import {hasLocale} from "next-intl";
import {getRequestConfig} from "next-intl/server";
import {locale as getRequestLocale} from "next/root-params";
import {routing} from "@/i18n/routing";

export default getRequestConfig(async ({locale: localeOverride}) => {
    const requested = localeOverride ?? await getRequestLocale();
    const locale = hasLocale(routing.locales, requested)
        ? requested
        : routing.defaultLocale;
    const listFile = "list.json";
    const i18nList = (await import(`../../../messages/${listFile}`)).default;
    let messages = {};
    for (const key in i18nList) {
        const path = i18nList[key];
        const message = await import(`../../../messages/${path}/${locale}.json`);
        if (path === "default") {
            messages = {
                ...message.default
            }
            continue;
        }
        messages[path] = message.default;
    }
    return {
        locale,
        messages: messages
    };
});
