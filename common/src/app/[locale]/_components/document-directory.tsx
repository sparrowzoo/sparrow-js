"use client";

import {useState} from "react";
import {useTranslations} from "next-intl";
import {ArrowUpRight, BookOpen, Search, X} from "lucide-react";
import {documents} from "./site-content";
import styles from "../home.module.css";

export default function DocumentDirectory() {
    const t = useTranslations("website.docs");
    const [category, setCategory] = useState("all");
    const [query, setQuery] = useState("");
    const search = query.trim().toLocaleLowerCase();
    const filtered = documents.filter((document) => (
        (category === "all" || document.category === category) &&
        `${t(`items.${document.id}.title`)} ${t(`items.${document.id}.description`)} ${document.topic} ${document.keywords}`
            .toLocaleLowerCase().includes(search)
    ));

    return (
        <>
            <div className={styles.directoryToolbar}>
                <div className={styles.filters} role="group" aria-label={t("title")}>
                    {["all", "backend", "frontend"].map((key) => (
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
                {filtered.map((document) => (
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
        </>
    );
}
