"use client";

import {useLocale, useTranslations} from "next-intl";
import {getProductNavigations} from "@/common/lib/protocol/ProductNavigation";
import SiteBanner from "@/common/components/header/site-banner";

/** IM supplies its navigation; the shared Header owns all banner rendering. */
export default function ImHeader() {
    const locale = useLocale();
    const t = useTranslations("IMHeader");
    const productTranslator = useTranslations("product");
    return (
        <SiteBanner
            brandName={t("brand")}
            brandCaption="SPARROW IM"
            logoSrc="/svg/brand/sparrow-logo.svg"
            homeHref={`/${locale}/chat/friends/contact/`}
            navigationLabel={t("label")}
            items={[
                ...getProductNavigations(t, locale, true, productTranslator)]}
            openMenuLabel=""
            closeMenuLabel=""
        />
    );
}
