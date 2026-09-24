import {productRegistry, type Item} from "@/common/lib/ProductRegistry";
import {WWW_ROOT} from "@/common/lib/Env";
import type {Translator} from "@/common/lib/TranslatorType";

/**
 * 导航菜单项：主站（官网）入口 + 各产品入口。
 * live=true 时产品直连真实地址，并前置主站入口。
 * homeTranslator 使用宿主导航命名空间，productTranslator 使用 product 命名空间。
 */
export function getProductNavigations(
    homeTranslator: NonNullable<Translator>,
    locale: string,
    live: boolean,
    productTranslator: NonNullable<Translator>
): Item[] {
    const items: Item[] = [];
    for (const product of Object.values(productRegistry)) {
        if (!product.available) continue;
        const url = live ? product.entry?.live : product.entry?.landing;
        if (!url) continue;
        items.push({
            id: product.id,
            label: productTranslator(product.id),
            href: url.replace("lang", locale)
        });
    }
    if (live) {
        items.unshift({
            id: "home",
            label: homeTranslator("home"),
            href: `${WWW_ROOT}/${locale}`
        });
    }
    return items;
}
