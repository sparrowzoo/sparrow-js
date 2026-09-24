import {ArrowUp} from "lucide-react";
import {useTranslations} from "next-intl";
import {Link} from "@/common/i18n/navigation";
import styles from "../home.module.css";

export default function SiteFooter() {
    const t = useTranslations("website");
    return (
        <footer className={styles.footer}>
            <div className={styles.footerMain}>
                <div><Link href="/" className={styles.brand}><span className={styles.brandMark} aria-hidden="true"/>{t("brand.name")}</Link><p>{t("footer.description")}</p></div>
                <nav aria-label={t("nav.label")}>
                    <Link href={{pathname: "/", hash: "products"}}>{t("nav.products")}</Link>
                    <Link href={{pathname: "/", hash: "docs"}}>{t("nav.docs")}</Link>
                    <Link href="/ui">{t("nav.playground")}</Link>
                </nav>
            </div>
            <div className={styles.footerBottom}><span>© {new Date().getFullYear()} Sparrow Zoo<span className={styles.footerCredit}> · {t("footer.credit")}</span></span><a href="#top">{t("footer.backToTop")}<ArrowUp size={14} aria-hidden="true"/></a></div>
        </footer>
    );
}
