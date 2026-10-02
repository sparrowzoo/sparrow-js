import {localeAlternates} from "@/lib/site-metadata";
import type {Metadata} from "next";
import {getTranslations} from "next-intl/server";
import DocumentDirectory from "../_components/document-directory";
import styles from "../home.module.css";

type PageProps = { params: Promise<{ locale: string }> };

export async function generateMetadata({params}: PageProps): Promise<Metadata> {
    const {locale} = await params;
    const t = await getTranslations({locale, namespace: "website.docs"});
    return {
        alternates: localeAlternates(locale, "/doc"),
        title: t("pageTitle"),
        description: t("description"),
    };
}

export default async function DocPage() {
    const t = await getTranslations("website");
    return (
        <div className={styles.site} id="top">
            <a href="#main-content" className={styles.skipLink}>{t("nav.skip")}</a>
            <main id="main-content">
                <section id="docs" className={`${styles.section} ${styles.docSection}`} aria-labelledby="docs-heading">
                    <div className={styles.sectionHead}>
                        <div><p className={styles.eyebrow}>{t("docs.eyebrow")}</p><h2
                            id="docs-heading">{t("docs.title")}</h2></div>
                        <p className={styles.sectionDescription}>{t("docs.description")}</p>
                    </div>
                    <DocumentDirectory/>
                </section>
            </main>
        </div>
    );
}
