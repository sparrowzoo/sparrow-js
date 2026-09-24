import {hasLocale} from "next-intl";
import {getRequestConfig} from "next-intl/server";
import {routing} from "@/i18n/routing";

export default getRequestConfig(async ({requestLocale}) => {
    // Typically corresponds to the `[locale]` segment
    const requested = await requestLocale;
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
