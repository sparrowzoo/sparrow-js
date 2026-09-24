import {ADMIN_ROOT, IM_ROOT, PASSPORT_ROOT, WWW_ROOT} from "@/common/lib/Env";

export type ProductId = "passport" | "coder" | "im" | "file" | "ui" | "security";

export type Item = {
    id: string,
    label: string,
    href: string
}
/**
 * 产品入口。
 * - landing：产品介绍落地页，导航菜单使用。
 * - live：产品真实入口 / 实际演示地址，"立即体验"等 CTA 使用。
 */
export type ProductEntry = { landing: string | undefined; live: string | undefined } | null;

export type Product = {
    id: ProductId;
    available: boolean;
    entry: ProductEntry
};
/**
 * Single source of truth for the product ecosystem. Edit here, then run
 * `npm run copy` in each product site to propagate.
 * Labels are translated through the `product` message namespace.
 * Property insertion order determines the product navigation order.
 */
export const productRegistry: Readonly<Record<ProductId, Product>> = {
    passport: {
        id: "passport", available: true, entry: {
            landing: `${WWW_ROOT}/lang/products/passport/`,
            live: `${PASSPORT_ROOT}/lang/sign-in/`
        }
    },
    im: {
        id: "im", available: true, entry: {
            landing: `${WWW_ROOT}/lang/products/im/`,
            live: `${IM_ROOT}/lang/chat/friends/contact/`
        }
    },
    coder: {
        id: "coder", available: true, entry: {
            landing: `${WWW_ROOT}/lang/products/coder/`,
            live: `${ADMIN_ROOT}/lang/`
        }
    },
    file: {
        id: "file", available: true, entry: {
            landing: `${WWW_ROOT}/lang/products/file/`,
            live: `${WWW_ROOT}/lang/upload/`
        }
    },
    ui: {
        id: "ui", available: true, entry: {
            landing: `${WWW_ROOT}/lang/ui/`,
            live: `${WWW_ROOT}/lang/ui/`
        }
    },
    security: {id: "security", available: false, entry: null},
};

/**
 * 按产品 id 获取真实入口（live），并将 `lang` 占位符替换为 locale。
 * 未配置 live 地址时返回 undefined。
 */
export function getProductUrl(id: ProductId, locale: string): string | undefined {
    const url = productRegistry[id].entry?.live;
    return url ? url.replace("/lang/", `/${locale}/`) : undefined;
}
