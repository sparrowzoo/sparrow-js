import {localeAlternates} from "@/lib/site-metadata";
import type {Metadata} from "next";
import {getTranslations} from "next-intl/server";
import {ArrowUpRight, Blocks, Code2, FileUp, MessageCircle, ShieldCheck} from "lucide-react";
import {Link} from "@/common/i18n/navigation";
import {getProductUrl} from "@/common/lib/ProductRegistry";
import {ProductLink} from "./_components/product-ui";
import styles from "./product.module.css";

type PageProps = {params: Promise<{locale: string}>};
const products = [
    {id: "coder", icon: Code2, href: "/products/coder"},
    {id: "passport", icon: ShieldCheck, href: "/products/passport"},
    {id: "file", icon: FileUp, href: "/products/file"},
    {id: "im", icon: MessageCircle, href: "/products/im"},
    {id: "ui", icon: Blocks, href: "/ui"},
] as const;

export async function generateMetadata({params}: PageProps): Promise<Metadata> {
    const {locale} = await params;
    const t = await getTranslations({locale, namespace: "website.products"});
    return {
    alternates: localeAlternates(locale, "/products"),title: `${t("title")} · Sparrow Zoo`, description: t("description")};
}

export default async function ProductsPage({params}: PageProps) {
    const {locale} = await params;
    const t = await getTranslations("website.products");
    return <section className={`${styles.section} ${styles.catalog}`}>
        <div className={styles.eyebrow}>{t("eyebrow")}</div>
        <h1>{t("title")}</h1>
        <p>{t("description")}</p>
        <div className={styles.catalogGrid}>{products.map(({id, icon: Icon, href}) => <article key={id} className={styles.catalogCard}>
            <Icon size={27} aria-hidden="true"/><p>{t(`${id}.subtitle`)}</p><h2><Link href={href}>{t(`${id}.title`)}</Link></h2><span>{t(`${id}.description`)}</span>
            <div className={styles.catalogActions}>
                {id !== "file" && id !== "ui" && <ProductLink href={getProductUrl(id, locale)} newTab className={styles.catalogExperience}>{locale === "zh" ? "立即体验" : "Try it now"}<span className="sr-only"> {t(`${id}.title`)}</span><ArrowUpRight size={15} aria-hidden="true"/></ProductLink>}
                <Link href={href}>{t("details")}<ArrowUpRight size={15} aria-hidden="true"/></Link>
            </div>
        </article>)}</div>
    </section>;
}
