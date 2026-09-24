import {WWW_ROOT} from "@/common/lib/Env";

export const publicSitePaths = ["", "/products", "/products/coder", "/products/passport", "/products/im", "/products/file", "/study", "/ui"];

export function localeAlternates(locale: string, path: string) {
    const url = (language: string) => `${WWW_ROOT}/${language}${path}/`;
    return {canonical: url(locale), languages: {zh: url("zh"), en: url("en"), "x-default": url("zh")}};
}
