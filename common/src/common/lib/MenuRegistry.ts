/**
 * 菜单入口。
 * - landing：落地页 / 产品介绍页，官网导航使用。
 * - live：真实入口 / 实际地址，产品站 banner 导航使用。
 */
export type MenuEntry = { landing: string | undefined; live: string | undefined } | null;

/** 菜单定义：label 的翻译规则由上游提供。 */
export type BannerMenuItem = {
    id: string;
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

/** 每个应用持有自己的实例，注册器不内置业务菜单。 */
export class MenuRegistry {
    private items: BannerMenuItem[] = [];

    /** 整组替换；重复 id 会抛错，保留原注册结果。注册完成后再交给 Header 渲染。 */
    register(items: readonly BannerMenuItem[]): void {
        const ids = new Set<string>();
        for (const item of items) {
            if (ids.has(item.id)) {
                throw new Error(`菜单 id 重复：${item.id}`);
            }
            ids.add(item.id);
        }
        this.items = items.map(item => ({
            ...item,
            entry: item.entry ? {...item.entry} : null,
        }));
    }

    /** 选择入口、替换语言占位符，再由上游提供的函数翻译文字。 */
    getMenuNavigations(
        locale: string,
        live: boolean,
        translator: (key: string) => string
    ): BannerMenuLink[] {
        const items: BannerMenuLink[] = [];
        for (const item of this.items) {
            if (!item.available) continue;
            const url = live ? item.entry?.live : item.entry?.landing;
            if (!url) continue;
            items.push({
                id: item.id,
                label: translator(item.label),
                href: url.replace("/lang/", `/${locale}/`),
                emphasized: item.emphasized,
                active: item.active,
                icon: item.icon,
                group: item.group,
            });
        }
        return items;
    }
}
