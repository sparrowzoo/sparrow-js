import {describe, expect, it} from "vitest";
import {MenuRegistry, type BannerMenuItem} from "../../src/common/lib/MenuRegistry";

const translate = (key: string) => `translated:${key}`;
const menu = (id: string): BannerMenuItem => ({
    id, label: id, available: true,
    entry: {landing: `/lang/${id}/intro/`, live: `/lang/${id}/`},
});

describe("MenuRegistry", () => {
    it("accepts application ids and preserves order, presentation and entry selection", () => {
        const registry = new MenuRegistry();
        registry.register([
            {...menu("orders"), emphasized: true, active: true, icon: "flask", group: "utility"},
            menu("customers"),
        ]);
        expect(registry.getMenuNavigations("zh", false, translate)).toEqual([
            {id: "orders", label: "translated:orders", href: "/zh/orders/intro/",
                emphasized: true, active: true, icon: "flask", group: "utility"},
            {id: "customers", label: "translated:customers", href: "/zh/customers/intro/"},
        ]);
        expect(registry.getMenuNavigations("en", true, key => key).map(item => item.href))
            .toEqual(["/en/orders/", "/en/customers/"]);
    });

    it("filters unavailable and missing entries and leaves external links intact", () => {
        const registry = new MenuRegistry();
        registry.register([
            {...menu("hidden"), available: false},
            {...menu("empty"), entry: null},
            {...menu("intro"), entry: {landing: "/intro/", live: undefined}},
            {...menu("external"), entry: {landing: undefined, live: "https://example.com/help"}},
        ]);
        expect(registry.getMenuNavigations("en", true, translate).map(item => item.href))
            .toEqual(["https://example.com/help"]);
        expect(registry.getMenuNavigations("zh", false, translate).map(item => item.href))
            .toEqual(["/intro/"]);
    });

    it("replaces registration, supports empty menus and isolates applications", () => {
        const first = new MenuRegistry();
        const second = new MenuRegistry();
        first.register([menu("orders")]);
        second.register([menu("passport")]);
        first.register([menu("customers")]);
        expect(first.getMenuNavigations("en", true, translate).map(item => item.id)).toEqual(["customers"]);
        expect(second.getMenuNavigations("en", true, translate).map(item => item.id)).toEqual(["passport"]);
        first.register([]);
        expect(first.getMenuNavigations("en", true, translate)).toEqual([]);
    });

    it("rejects duplicate ids without replacing a valid registration", () => {
        const registry = new MenuRegistry();
        registry.register([menu("original")]);
        expect(() => registry.register([menu("duplicate"), menu("duplicate")])).toThrow("菜单 id 重复");
        expect(registry.getMenuNavigations("en", true, translate)[0].id).toBe("original");
    });

    it("does not retain mutable input objects or expose internal state", () => {
        const registry = new MenuRegistry();
        const input = [menu("orders")];
        registry.register(input);
        input[0].entry!.live = "/wrong/";
        input[0].label = "wrong";
        input.length = 0;
        const rendered = registry.getMenuNavigations("en", true, translate);
        expect(rendered[0]).toMatchObject({label: "translated:orders", href: "/en/orders/"});
        rendered[0].href = "/mutated/";
        expect(registry.getMenuNavigations("zh", true, translate)[0].href).toBe("/zh/orders/");
    });
});
