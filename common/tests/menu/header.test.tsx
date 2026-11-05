import {renderToStaticMarkup} from "react-dom/server";
import {describe, expect, it, vi} from "vitest";
import {MenuRegistry} from "../../src/common/lib/MenuRegistry";

vi.mock("next-intl", () => ({
    useLocale: () => "zh",
    useTranslations: (namespace: string) => {
        if (namespace !== "Header") throw new Error("Shared Header must not load product messages");
        return (key: string) => `${namespace}:${key}`;
    },
}));
vi.mock("../../src/common/components/header/site-banner", () => ({
    default: (props: unknown) => <pre>{JSON.stringify(props)}</pre>,
}));

import Header from "../../src/common/components/header/header";

describe("shared Header", () => {
    it("uses upstream menus and translation while preserving existing options", () => {
        const registry = new MenuRegistry();
        registry.register([{id: "orders", label: "orders", available: true,
            entry: {landing: "/lang/intro/", live: "/lang/orders/"}}]);
        const html = renderToStaticMarkup(<Header menuRegistry={registry} translator={key => `业务:${key}`}
            live={false} i18n={false} profile={false} brandCaption="Test" homePath="https://example.com"/>);
        expect(html).toContain("业务:orders");
        expect(html).toContain("/zh/intro/");
        expect(html).toContain("https://example.com/zh");
        expect(html).toContain("&quot;profile&quot;:false");
        expect(html).toContain("&quot;i18n&quot;:false");
        expect(html).toContain("Test");
    });

    it("uses labels directly when translator is omitted", () => {
        const registry = new MenuRegistry();
        registry.register([{id: "orders", label: "订单", available: true,
            entry: {landing: undefined, live: "/orders/"}}]);
        expect(renderToStaticMarkup(<Header menuRegistry={registry}/>)).toContain("订单");
    });
});
