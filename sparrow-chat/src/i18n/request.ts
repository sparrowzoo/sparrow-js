import {hasLocale} from "next-intl";
import {getRequestConfig} from "next-intl/server";
import {locale as getRequestLocale} from "next/root-params";
import {routing} from "./routing";
import en from "../../messages/en.json";
import zh from "../../messages/zh.json";

// 消息文件归宿主应用所有；公共组件通过 next-intl 使用同一份请求配置。
const messages = {en, zh};
export default getRequestConfig(async ({locale: localeOverride}) => {
    const requested = localeOverride ?? await getRequestLocale();
    const locale = hasLocale(routing.locales, requested) ? requested : routing.defaultLocale;
    return {locale, messages: messages[locale]};
});
