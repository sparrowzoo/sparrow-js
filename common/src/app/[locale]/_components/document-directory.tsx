"use client";

import {useState} from "react";
import {useTranslations} from "next-intl";
import {ArrowUpRight, BookOpen, Search, X} from "lucide-react";
import {Link} from "@/common/i18n/navigation";
import {documents} from "./site-content";
import styles from "../home.module.css";

export default function DocumentDirectory({limit, showAllHref}: {limit?: number; showAllHref?: string}) {
    const t = useTranslations("website.docs");
    const [category, setCategory] = useState("all");
    const [query, setQuery] = useState("");
    const search = query.trim().toLocaleLowerCase();
    const sorted = [...documents].sort((a, b) => b.date.localeCompare(a.date));
    const filtered = sorted.filter((document) => (
        (category === "all" || document.category === category) &&
        `${t(`items.${document.id}.title`)} ${t(`items.${document.id}.description`)} ${document.topic} ${document.keywords}`
            .toLocaleLowerCase().includes(search)
    ));
    const visible = limit ? filtered.slice(0, limit) : filtered;

    return (
        <>
            <div className={styles.directoryToolbar}>
                <div className={styles.filters} role="group" aria-label={t("title")}>
                    {["all", "backend", "frontend", "ai-coding"].map((key) => (
                        <button key={key} type="button" aria-pressed={category === key} onClick={() => setCategory(key)}>
                            {t(key)}
                            <span>{key === "all" ? documents.length : documents.filter((document) => document.category === key).length}</span>
                        </button>
                    ))}
                </div>
                <div className={styles.searchField}>
                    <Search size={17} aria-hidden="true"/>
                    <input type="search" value={query} onChange={(event) => setQuery(event.target.value)}
                           aria-label={t("search")} placeholder={t("search")} aria-controls="document-results"/>
                    {query && <button type="button" onClick={() => {setQuery(""); setCategory("all");}} aria-label={t("clear")}><X size={15} aria-hidden="true"/></button>}
                </div>
            </div>
            <div className={styles.directoryMeta}>
                <p>{t("languageNote")}</p>
                <span role="status" aria-live="polite" aria-atomic="true">{t("count", {count: filtered.length})}</span>
            </div>
            <div id="document-results" className={styles.documentGrid}>
                {visible.map((document) => (
                    <a key={document.id} href={document.href} className={styles.documentCard}>
                        <div className={styles.documentTop}><span>{document.topic}</span><ArrowUpRight size={17} aria-hidden="true"/></div>
                        <h3>{t(`items.${document.id}.title`)}</h3>
                        <p>{t(`items.${document.id}.description`)}</p>
                        <span className={styles.documentCategory}><BookOpen size={13} aria-hidden="true"/>{t(document.category)}<span> / {document.subcategory}</span></span>
                    </a>
                ))}
                {filtered.length === 0 && (
                    <div className={styles.emptyState}>
                        <Search size={28} aria-hidden="true"/>
                        <p>{t("empty")}</p>
                        <button type="button" onClick={() => {setQuery(""); setCategory("all");}}>{t("clear")}</button>
                    </div>
                )}
            </div>
            {limit && showAllHref && filtered.length > visible.length && (
                <div className={styles.directoryFooter}>
                    <Link href={showAllHref} className={styles.viewAllButton}>{t("viewAll")}<ArrowUpRight size={16} aria-hidden="true"/></Link>
                </div>
            )}
        </>
    );
}
