import {localeAlternates} from "@/lib/site-metadata";
import type {Metadata} from "next";
import {getTranslations, setRequestLocale} from "next-intl/server";
import {ArrowDown, ArrowRight, ArrowUpRight, Blocks, BookOpen, Boxes, Braces, Check, Code2, FileUp, Layers3, LockKeyhole, MessageCircle, Radio, ShieldCheck} from "lucide-react";
import {Link} from "@/common/i18n/navigation";
import DocumentDirectory from "./_components/document-directory";
import SiteHeader from "./_components/site-header";
import SiteFooter from "./_components/site-footer";
import {documents, productIds} from "./_components/site-content";
import styles from "./home.module.css";

type PageProps = {params: Promise<{locale: string}>};

export async function generateMetadata({params}: PageProps): Promise<Metadata> {
    const {locale} = await params;
    const t = await getTranslations({locale, namespace: "website.metadata"});
    return {
    alternates: localeAlternates(locale, ""),
        title: t("title"),
        description: t("description"),
        openGraph: {title: t("title"), description: t("description"), siteName: "Sparrow Zoo", type: "website"},
    };
}

const products = [
    {id: "passport", icon: ShieldCheck, href: "/products/passport", color: "violet"},
    {id: "file", icon: FileUp, href: "/products/file", color: "cyan"},
    {id: "security", icon: LockKeyhole, href: null, color: "violet"},
    {id: "im", icon: MessageCircle, href: "/products/im", color: "cyan"},
    {id: "coder", icon: Code2, href: "/products/coder", color: "pink"},
    {id: "ui", icon: Blocks, href: "/ui", color: "cyan"},
] as const;

const capabilities = [
    {id: "auth", icon: ShieldCheck},
    {id: "engineering", icon: Layers3},
    {id: "realtime", icon: Radio},
    {id: "modular", icon: Boxes},
] as const;

export default async function Home({params}: PageProps) {
    const {locale} = await params;
    setRequestLocale(locale);
    const t = await getTranslations("website");

    return (
        <div className={styles.site} id="top">
            <a href="#main-content" className={styles.skipLink}>{t("nav.skip")}</a>
            <SiteHeader/>
            <main id="main-content">
                <section className={styles.hero} aria-labelledby="hero-heading">
                    <div className={styles.heroGrid} aria-hidden="true"/>
                    <div className={styles.heroContent}>
                        <div className={styles.eyebrowPill}><span/>{t("hero.eyebrow")}</div>
                        <h1 id="hero-heading">{t("hero.title")}<br/><span>{t("hero.highlight")}</span></h1>
                        <p className={styles.heroDescription}>{t("hero.description")}</p>
                        <div className={styles.heroActions}>
                            <a href="#products" className={styles.primaryButton}>{t("hero.primary")}<ArrowRight size={17} aria-hidden="true"/></a>
                            <a href="#docs" className={styles.secondaryButton}><BookOpen size={17} aria-hidden="true"/>{t("hero.secondary")}</a>
                        </div>
                        <p className={styles.heroNote}><span/>{t("hero.note")}</p>
                    </div>
                    <div className={styles.stats}>
                        <div><strong>{String(productIds.length).padStart(2, "0")}<span> / </span></strong><span>{t("stats.products")}</span></div>
                        <div><strong>{String(documents.length).padStart(2, "0")}<span> / </span></strong><span>{t("stats.docs")}</span></div>
                        <div><strong className={styles.stackStat}>Spring Boot <span>+</span> React</strong><span>{t("stats.stack")}</span></div>
                    </div>
                </section>

                <section id="products" className={styles.section} aria-labelledby="products-heading">
                    <div className={styles.sectionHead}>
                        <div><p className={styles.eyebrow}>{t("products.eyebrow")}</p><h2 id="products-heading">{t("products.title")}</h2></div>
                        <p className={styles.sectionDescription}>{t("products.description")}</p>
                    </div>
                    <div className={styles.productGrid}>
                        <a href="/backend/java/maven/sparrow-parent-bom.html" className={`${styles.productCard} ${styles.foundation}`}>
                            <div className={styles.foundationContent}>
                                <div className={styles.productTop}><span className={styles.productIcon}><Layers3 size={25} aria-hidden="true"/></span><span className={styles.foundationBadge}>{t("products.foundation")}</span></div>
                                <p className={styles.productSubtitle}>{t("products.scaffold.subtitle")}</p>
                                <h3>{t("products.scaffold.title")}</h3>
                                <p className={styles.productDescription}>{t("products.scaffold.description")}</p>
                                <div className={styles.tags}>{(t.raw("products.scaffold.tags") as string[]).map((tag) => <span key={tag}>{tag}</span>)}</div>
                                <span className={styles.foundationLink}>{t("products.guide")}<ArrowUpRight size={17} aria-hidden="true"/></span>
                            </div>
                            <div className={styles.foundationDiagram} aria-hidden="true">
                                <div className={styles.diagramHeader}><span/><span/><span/><code>sparrow / foundation</code></div>
                                <div className={styles.diagramBody}>
                                    <div><Layers3 size={17}/><code>sparrow-parent</code><span>01</span></div>
                                    <ArrowDown size={17} className={styles.diagramArrow}/>
                                    <div><Boxes size={17}/><code>sparrow-bom</code><span>02</span></div>
                                    <ArrowDown size={17} className={styles.diagramArrow}/>
                                    <div className={styles.diagramApplication}><Braces size={17}/><code>your-application</code><Check size={16}/></div>
                                </div>
                                <div className={styles.diagramFooter}><span/>Java · Spring Boot · Maven</div>
                            </div>
                        </a>
                        {products.map((product, index) => {
                            const Icon = product.icon;
                            const content = <>
                                <div className={styles.productTop}>
                                    <span className={styles.productIcon} data-color={product.color}><Icon size={24} aria-hidden="true"/></span>
                                    <span className={product.href ? styles.availableBadge : styles.plannedBadge}><span/>{t(product.href ? "products.available" : "products.planned")}</span>
                                </div>
                                <p className={styles.productSubtitle}>{t(`products.${product.id}.subtitle`)}</p>
                                <h3>{t(`products.${product.id}.title`)}</h3>
                                <p className={styles.productDescription}>{t(`products.${product.id}.description`)}</p>
                                <div className={styles.tags}>{(t.raw(`products.${product.id}.tags`) as string[]).map((tag) => <span key={tag}>{tag}</span>)}</div>
                                <div className={styles.productFooter}><span className={styles.productNumber}>{String(index + 2).padStart(2, "0")}</span><span>{t(product.href ? "products.details" : "products.planned")}{product.href && <ArrowUpRight size={17} aria-hidden="true"/>}</span></div>
                            </>;
                            return product.href ? (
                                <Link key={product.id} href={product.href} className={`${styles.productCard} ${index < 2 ? styles.availableCard : styles.compactCard}`}>{content}</Link>
                            ) : (
                                <article key={product.id} className={`${styles.productCard} ${styles.compactCard}`}>{content}</article>
                            );
                        })}
                    </div>
                </section>

                <section id="docs" className={`${styles.section} ${styles.docsSection}`} aria-labelledby="docs-heading">
                    <div className={styles.sectionHead}>
                        <div><p className={styles.eyebrow}>{t("docs.eyebrow")}</p><h2 id="docs-heading">{t("docs.title")}</h2></div>
                        <p className={styles.sectionDescription}>{t("docs.description")}</p>
                    </div>
                    <DocumentDirectory/>
                </section>

                <section id="ecosystem" className={styles.section} aria-labelledby="ecosystem-heading">
                    <div className={styles.sectionHead}>
                        <div><p className={styles.eyebrow}>{t("ecosystem.eyebrow")}</p><h2 id="ecosystem-heading">{t("ecosystem.title")}</h2></div>
                        <p className={styles.sectionDescription}>{t("ecosystem.description")}</p>
                    </div>
                    <div className={styles.capabilities}>
                        {capabilities.map(({id, icon: Icon}) => <div key={id} className={styles.capability}>
                            <Icon size={23} aria-hidden="true"/>
                            <h3>{t(`ecosystem.${id}.title`)}</h3>
                            <p>{t(`ecosystem.${id}.description`)}</p>
                        </div>)}
                    </div>
                </section>

                <section className={`${styles.section} ${styles.ctaSection}`} aria-labelledby="cta-heading">
                    <div className={styles.cta}>
                        <div><p className={styles.eyebrow}>{t("cta.eyebrow")}</p><h2 id="cta-heading">{t("cta.title")}</h2><p className={styles.ctaDescription}>{t("cta.description")}</p></div>
                        <div className={styles.ctaActions}>
                            <a href="/backend/java/maven/sparrow-parent-bom.html" className={styles.primaryButton}>{t("cta.primary")}<ArrowRight size={16} aria-hidden="true"/></a>
                            <a href="#docs" className={styles.textButton}>{t("cta.secondary")}<ArrowUpRight size={16} aria-hidden="true"/></a>
                        </div>
                    </div>
                </section>
            </main>
            <SiteFooter/>
        </div>
    );
}
