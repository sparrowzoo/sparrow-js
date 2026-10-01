"use client";

import {useLocale, useTranslations} from "next-intl";
import {getProductNavigations} from "@/common/lib/protocol/ProductNavigation";
import SiteBanner from "@/common/components/header/site-banner";

/** IM supplies its navigation; the shared Header owns all banner rendering. */
export default function Header({i18n = true, prefile = true}: { i18n?: boolean, prefile?: boolean }) {
    const locale = useLocale();
    const t = useTranslations("Header");
    const productTranslator = useTranslations("product");
    return (
        <SiteBanner
            brandName={t("brand")}
            brandCaption="sparrow Zoo"
            logoSrc="/svg/brand/sparrow-logo.svg"
            homeHref={`/${locale}/`}
            navigationLabel={t("label")}
            items={[
                ...getProductNavigations(t, locale, true, productTranslator)]}
            openMenuLabel=""
            closeMenuLabel=""
            i18n={i18n}
            profile={prefile}
        />
    );
}
