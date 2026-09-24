import type {ReactNode} from "react";
import {getTranslations, setRequestLocale} from "next-intl/server";
import SiteHeader from "../_components/site-header";
import SiteFooter from "../_components/site-footer";
import styles from "../home.module.css";

export default async function ProductLayout({children, params}: {children: ReactNode; params: Promise<{locale: string}>}) {
    const {locale} = await params;
    setRequestLocale(locale);
    const t = await getTranslations("website.nav");
    return (
        <div className={styles.site} id="top">
            <a href="#main-content" className={styles.skipLink}>{t("skip")}</a>
            <SiteHeader/>
            <main id="main-content">{children}</main>
            <SiteFooter/>
        </div>
    );
}
