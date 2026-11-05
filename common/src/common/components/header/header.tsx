"use client";

import {useLocale, useTranslations} from "next-intl";
import type {MenuRegistry} from "@/common/lib/MenuRegistry";
import SiteBanner from "@/common/components/header/site-banner";
import {WWW_ROOT} from "@/common/lib/Env";

export type HeaderProps = {
    menuRegistry: MenuRegistry;
    translator?: (key: string) => string;
    i18n?: boolean;
    profile?: boolean;
    brandCaption?: string;
    homePath?: string;
    live?: boolean;
};

/** Shared site header: menu comes from MenuRegistry, brand/home are host-provided. */
export default function Header({
                                   menuRegistry,
                                   translator = (key: string) => key,
                                   i18n = true,
                                   profile = true,
                                   brandCaption = "Sparrow Zoo",
                                   homePath = `${WWW_ROOT}`,
                                   live = true,
                               }: HeaderProps) {
    const locale = useLocale();
    const t = useTranslations("Header");
    const homeHref = `${homePath}/${locale}`;
    const items = menuRegistry.getMenuNavigations(locale, live, translator);
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
