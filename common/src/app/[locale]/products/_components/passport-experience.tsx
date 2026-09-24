import {ArrowUpRight, Layers3, PanelsTopLeft} from "lucide-react";
import {getTranslations} from "next-intl/server";
import {SectionHeading} from "./product-ui";
import {PASSPORT_ROOT} from "@/common/lib/Env";
import home from "../../home.module.css";
import styles from "../product.module.css";

export default async function PassportExperience({locale}: {locale: string}) {
    const t = await getTranslations("website.products.passport.page.experience");
    const isZh = locale === "zh";
    const entries = [
        {
            icon: PanelsTopLeft,
            title: t("separated.title"),
            caption: t("separated.caption"),
            description: t("separated.description"),
            login: `${PASSPORT_ROOT?.replace(/\/+$/, "")}/${isZh ? "zh" : "en"}/sign-in`,
            register: `${PASSPORT_ROOT?.replace(/\/+$/, "")}/${isZh ? "zh" : "en"}/sign-up`,
        },
        {
            icon: Layers3,
            title: t("monolithic.title"),
            caption: t("monolithic.caption"),
            description: t("monolithic.description"),
            login: "http://api.sparrowzoo.com/login",
            register: "http://api.sparrowzoo.com/register",
        },
    ];
    return <section className={styles.section} id="experience">
        <SectionHeading eyebrow={t("eyebrow")} title={t("title")}
                        description={t("description")}/>
        <div className={styles.experienceGrid}>{entries.map((entry, index) => {
            const Icon = entry.icon;
            return <article key={entry.caption} className={styles.experienceCard} data-featured={index === 0 || undefined}>
                <div className={styles.experienceTop}><Icon size={23} aria-hidden="true"/><span>{entry.caption}</span>{index === 0 && <em>{t("recommended")}</em>}</div>
                <h3>{entry.title}</h3><p>{entry.description}</p>
                <div className={styles.experienceActions}>
                    <a href={entry.login} target="_blank" rel="noopener noreferrer" className={index === 0 ? home.primaryButton : home.secondaryButton}>{t("tryLogin")}<ArrowUpRight size={16} aria-hidden="true"/></a>
                    <a href={entry.register} target="_blank" rel="noopener noreferrer" className={home.secondaryButton}>{t("register")}<ArrowUpRight size={16} aria-hidden="true"/></a>
                </div>
            </article>;
        })}</div>
    </section>;
}
