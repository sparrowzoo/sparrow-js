"use client";

import {useLocale, useTranslations} from "next-intl";
import type {BannerMenuLink} from "@/common/lib/MenuRegistry";
import {getMenuNavigations} from "@/common/lib/MenuRegistry";
import SiteBanner from "@/common/components/header/site-banner";
import {WWW_ROOT} from "@/common/lib/Env";

type HeaderProps = {
    i18n?: boolean;
    profile?: boolean;
    brandCaption?: string;
    homePath?: string;
    live?: boolean;
};

/** Shared site header: menu comes from MenuRegistry, brand/home are host-provided. */
export default function Header({
                                   i18n = true,
                                   profile = true,
                                   brandCaption = "Sparrow Zoo",
                                   homePath = `${WWW_ROOT}`,
                                   live = true,
                               }: HeaderProps) {
    const locale = useLocale();
    const t = useTranslations("Header");
    const productTranslator = useTranslations("product");
    const homeHref = `${homePath}/${locale}`;
    const items: BannerMenuLink[] = [...getMenuNavigations(locale, live, productTranslator)];
    return (
        <SiteBanner
            brandName={t("brand")}
            brandCaption={brandCaption}
            logoSrc="/svg/brand/sparrow-logo.svg"
            homeHref={homeHref}
            navigationLabel={t("label")}
            items={items}
            openMenuLabel=""
            closeMenuLabel=""
            i18n={i18n}
            profile={profile}
        />
    );
}
