import {ADMIN_ROOT, BLOG_ROOT, IM_ROOT, PASSPORT_ROOT, WWW_ROOT} from "@/common/lib/Env";
import type {Translator} from "@/common/lib/TranslatorType";

export type MenuId = "passport" | "coder" | "im" | "file" | "ui" | "security" | "blog" | "study";

/**
 * 菜单入口。
 * - landing：落地页 / 产品介绍页，官网导航使用。
 * - live：真实入口 / 实际地址，产品站 banner 导航使用。
 */
export type MenuEntry = { landing: string | undefined; live: string | undefined } | null;

/** 菜单定义（单一事实源）：含入口、分类、高亮、可用性。label 为 product 命名空间 key。 */
export type BannerMenuItem = {
    id: MenuId;
    label: string;
    entry: MenuEntry;
    available: boolean;
    emphasized?: boolean;
    active?: boolean;
    icon?: "graduation-cap" | "flask";
    group?: "utility";
};

/** banner 可渲染项：entry 已解析为 href。 */
export type BannerMenuLink = {
    id?: string;
    label: string;
    href: string;
    emphasized?: boolean;
    active?: boolean;
    icon?: "graduation-cap" | "flask";
    group?: "utility";
};

/**
 * Single source of truth for the site menu ecosystem. Edit here, then run
 * `npm run copy` in each product site to propagate.
 * Labels are translated through the `product` message namespace.
 * Property insertion order determines the menu navigation order.
 */
export const menuRegistry: Readonly<Record<MenuId, BannerMenuItem>> = {
    passport: {
        id: "passport", label: "passport", available: true, entry: {
            landing: `${WWW_ROOT}/lang/products/passport/`,
            live: `${PASSPORT_ROOT}/lang/sign-in/`
        }
    },
    im: {
        id: "im", label: "im", available: true, entry: {
            landing: `${WWW_ROOT}/lang/products/im/`,
            live: `${IM_ROOT}/lang/chat/friends/contact/`
        }
    },
    coder: {
        id: "coder", label: "coder", available: true, entry: {
            landing: `${WWW_ROOT}/lang/products/coder/`,
            live: `${ADMIN_ROOT}/lang/`
        }
    },
    file: {
        id: "file", label: "file", available: true, entry: {
            landing: `${WWW_ROOT}/lang/products/file/`,
            live: `${WWW_ROOT}/lang/upload/`
        }
    },
    ui: {
        id: "ui", label: "ui", available: true, entry: {
            landing: `${WWW_ROOT}/lang/ui/`,
            live: `${WWW_ROOT}/lang/ui/`
        }
    },
    security: {id: "security", label: "security", available: false, entry: null},
    blog: {
        id: "blog", label: "blog", available: true,
        entry: BLOG_ROOT ? {landing: BLOG_ROOT, live: BLOG_ROOT} : null
    },
    study: {
        id: "study", label: "study", available: true,
        entry: {landing: `${WWW_ROOT}/lang/study/`, live: `${WWW_ROOT}/lang/study/`},
        emphasized: true, icon: "graduation-cap", group: "utility"
    },
};

/** 解析菜单为 banner 可渲染项：entry → href，label 经 product 命名空间翻译。 */
export function getMenuNavigations(
    locale: string,
    live: boolean,
    productTranslator: NonNullable<Translator>
): BannerMenuLink[] {
    const items: BannerMenuLink[] = [];
    for (const item of Object.values(menuRegistry)) {
        if (!item.available) continue;
        const url = live ? item.entry?.live : item.entry?.landing;
        if (!url) continue;
        items.push({
            id: item.id,
            label: productTranslator(item.label),
            href: url.replace("/lang/", `/${locale}/`),
            emphasized: item.emphasized,
            active: item.active,
            icon: item.icon,
            group: item.group,
        });
    }
    return items;
}
