import {hasLocale} from "next-intl";
import {getRequestConfig} from "next-intl/server";
// @ts-ignore
import {routing} from "@/i18n/routing";

export default getRequestConfig(async ({requestLocale}) => {
    // Typically corresponds to the `[locale]` segment
    const requested = await requestLocale;
    const locale = hasLocale(routing.locales, requested)
        ? requested
        : routing.defaultLocale;
    //@ts-ignore
    const i18nList = (await import(`../../../messages/list.json`)).default;
    console.log("i18n file list", i18nList);
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
        console.log("i18n path ", path);
        messages[path] = message.default;
        console.log(messages)
    }
    return {
        locale,
        messages: messages
    };
});
