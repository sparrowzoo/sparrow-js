import {useLocale, useTranslations} from "next-intl";
import {getPathname} from "@/common/i18n/navigation";
import {getProductNavigations} from "@/common/lib/protocol/ProductNavigation";
import SiteBanner from "../../../common/components/header/site-banner";

export default function SiteHeader() {
    const t = useTranslations("website");
    const tProduct = useTranslations("product");
    const locale = useLocale();
    return (
        <SiteBanner
            logoSrc="/svg/brand/sparrow-logo.svg"
            brandName={t("brand.name")}
            brandCaption={t("brand.tagline")}
            navigationLabel={t("nav.label")}
            openMenuLabel={t("nav.openMenu")}
            closeMenuLabel={t("nav.closeMenu")}
            items={[
                ...getProductNavigations(t, locale, false, tProduct),
                {label: t("nav.docs"), href: `${getPathname({locale, href: "/"})}#docs`},
                {label: t("nav.study"), href: getPathname({locale, href: "/study"}), emphasized: true, icon: "graduation-cap", group: "utility"},
            ]}
        />
    );
}
