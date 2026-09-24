import {localeAlternates} from "@/lib/site-metadata";
import type {Metadata} from "next";
import {getTranslations, setRequestLocale} from "next-intl/server";
import {Anchor, ArrowDown, ArrowRight, ArrowUpRight, Blocks, BookOpen, CircleAlert, Download, History, Languages, Loader2, Move, Package, Settings, SunMoon, Table2, UploadCloud} from "lucide-react";
import {Link} from "@/common/i18n/navigation";
import SiteHeader from "../_components/site-header";
import SiteFooter from "../_components/site-footer";
import siteStyles from "../home.module.css";
import styles from "./ui.module.css";

const NEXT_INTL_GUIDE_URL = "/frontend/react/next-intl/i18n.html";

const groups = [
    {
        id: "data",
        examples: [
            {id: "forms", href: "/forms", icon: Blocks},
            {id: "table", href: "/table", icon: Table2},
            {id: "accessHistories", href: "/access-histories", icon: History},
        ],
    },
    {
        id: "files",
        examples: [
            {id: "upload", href: "/upload", icon: UploadCloud},
            {id: "zipDownload", href: "/zip-download", icon: Download},
        ],
    },
    {
        id: "interaction",
        examples: [
            {id: "hooks", href: "/hooks", icon: Anchor},
            {id: "loading", href: "/loading", icon: Loader2},
            {id: "error", href: "/error", icon: CircleAlert},
            {id: "draggable", href: "/draggable", icon: Move},
        ],
    },
    {
        id: "engineering",
        examples: [
            {id: "eslintConfig", href: "/eslint-config", icon: Settings},
            {id: "i18nStaticExport", href: "/i18n-static-export", icon: Package},
        ],
    },
] as const;

const features = [
    {id: "i18n", icon: Languages},
    {id: "theme", icon: SunMoon},
    {id: "components", icon: Blocks},
] as const;

const exampleCount = groups.reduce((count, group) => count + group.examples.length, 0);
type PageProps = {params: Promise<{locale: string}>};

export async function generateMetadata({params}: PageProps): Promise<Metadata> {
    const {locale} = await params;
    const t = await getTranslations({locale, namespace: "website.playground.metadata"});
    return {
    alternates: localeAlternates(locale, "/ui"),title: t("title"), description: t("description")};
}

export default async function UIPlayground({params}: PageProps) {
    const {locale} = await params;
    setRequestLocale(locale);
    const t = await getTranslations("website.playground");
    const nav = await getTranslations("website.nav");

    return (
        <div className={siteStyles.site} id="top">
            <a href="#main-content" className={siteStyles.skipLink}>{nav("skip")}</a>
            <SiteHeader/>
            <main id="main-content">
                <section className={styles.hero} aria-labelledby="playground-heading">
                    <div className={siteStyles.heroGrid} aria-hidden="true"/>
                    <div className={styles.heroContent}>
                        <p className={siteStyles.eyebrow}>{t("eyebrow")}</p>
                        <h1 id="playground-heading">{t("hero.title")}<br/><span>{t("hero.highlight")}</span></h1>
                        <p className={styles.heroDescription}>{t("hero.description")}</p>
                        <div className={styles.heroActions}>
                            <a href="#examples" className={`${siteStyles.primaryButton} ${styles.button}`}>
                                {t("hero.primary")}<ArrowDown size={15} aria-hidden="true"/>
                            </a>
                            <Link href={{pathname: "/", hash: "docs"}} className={styles.textLink}>
                                <BookOpen size={16} aria-hidden="true"/>{t("hero.secondary")}<ArrowUpRight size={14} aria-hidden="true"/>
                            </Link>
                        </div>
                        <p className={styles.stack}>React · Next.js · TypeScript</p>
                    </div>
                </section>

                <div className={styles.container}>
                    <ul className={styles.features}>
                        {features.map(({id, icon: Icon}) => (
                            <li key={id}>
                                <span className={styles.featureIcon}><Icon size={20} aria-hidden="true"/></span>
                                <div><h2>{t(`features.${id}.title`)}</h2><p>{t(`features.${id}.description`)}</p></div>
                            </li>
                        ))}
                    </ul>

                    <section id="examples" className={styles.catalog} aria-labelledby="examples-heading">
                        <div className={styles.sectionHead}>
                            <div>
                                <p className={siteStyles.eyebrow}>{t("catalog.eyebrow")}</p>
                                <h2 id="examples-heading">{t("catalog.title")}</h2>
                                <p className={styles.sectionDescription}>{t("catalog.description")}</p>
                            </div>
                            <span className={styles.count}>{t("overview.count", {count: exampleCount})}</span>
                        </div>

                        <nav className={styles.categoryNav} aria-label={t("catalog.title")}>
                            {groups.map((group) => (
                                <a key={group.id} href={`#examples-${group.id}`}>
                                    {t(`groups.${group.id}.title`)}<span>{String(group.examples.length).padStart(2, "0")}</span>
                                </a>
                            ))}
                        </nav>

                        <div className={styles.groups}>
                            {groups.map((group, index) => (
                                <section key={group.id} id={`examples-${group.id}`} className={styles.group} aria-labelledby={`group-${group.id}`}>
                                    <div className={styles.groupHead}>
                                        <div><span className={styles.groupNumber}>{String(index + 1).padStart(2, "0")}</span><h3 id={`group-${group.id}`}>{t(`groups.${group.id}.title`)}</h3></div>
                                        <p>{t(`groups.${group.id}.description`)}</p>
                                    </div>
                                    <ul className={styles.exampleList} data-columns={group.examples.length === 3 ? 3 : 2}>
                                        {group.examples.map(({id, href, icon: Icon}) => (
                                            <li key={id}>
                                                <Link href={href} className={styles.exampleCard}>
                                                    <div className={styles.cardTop}><span className={styles.cardIcon}><Icon size={21} strokeWidth={1.6} aria-hidden="true"/></span><ArrowUpRight className={styles.cardArrow} size={17} aria-hidden="true"/></div>
                                                    <h4>{t(`examples.${id}.title`)}</h4>
                                                    <p>{t(`examples.${id}.description`)}</p>
                                                    <span className={styles.cardLink}>{t("catalog.open")}<ArrowRight size={13} aria-hidden="true"/></span>
                                                </Link>
                                            </li>
                                        ))}
                                    </ul>
                                </section>
                            ))}
                        </div>
                    </section>

                    <section className={styles.guide} aria-labelledby="guide-heading">
                        <div>
                            <p className={siteStyles.eyebrow}>{t("guide.eyebrow")}</p>
                            <h2 id="guide-heading">{t("guide.title")}</h2>
                            <p className={styles.sectionDescription}>{t("guide.description")}</p>
                        </div>
                        <a href={NEXT_INTL_GUIDE_URL} className={styles.textLink}>{t("guide.action")}<ArrowUpRight size={16} aria-hidden="true"/></a>
                    </section>
                </div>
            </main>
            <SiteFooter/>
        </div>
    );
}
