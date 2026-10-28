import {ArrowUpRight, Bot, Headset} from "lucide-react";
import {getTranslations} from "next-intl/server";
import {IM_ROOT} from "@/common/lib/Env";
import {SectionHeading} from "./product-ui";
import home from "../../home.module.css";
import styles from "../product.module.css";

export default async function ImCustomerService({locale}: {locale: string}) {
    const t = await getTranslations("website.products.im.page.customerService");
    const imRoot = IM_ROOT?.replace(/\/+$/, "") ?? "";
    const entries = [
        {id: "human", icon: Headset, path: `/${locale}/pop/`},
        {id: "ai", icon: Bot, path: `/${locale}/pop/ai/`},
    ];

    return <section className={styles.section} id="customer-service" aria-label={t("title")}>
        <SectionHeading eyebrow={t("eyebrow")} title={t("title")} description={t("description")}/>
        <div className={styles.experienceGrid}>
            {entries.map(({id, icon: Icon, path}) => (
                <article className={styles.experienceCard} key={id}>
                    <div className={styles.experienceTop}>
                        <Icon size={23} aria-hidden="true"/>
                        <span>{t(`${id}.caption`)}</span>
                    </div>
                    <h3>{t(`${id}.title`)}</h3>
                    <p>{t(`${id}.description`)}</p>
                    <div className={styles.experienceActions}>
                        <a href={`${imRoot}${path}`} target="_blank" rel="noopener noreferrer"
                           className={home.primaryButton}>
                            {t(`${id}.action`)}<ArrowUpRight size={16} aria-hidden="true"/>
                        </a>
                    </div>
                </article>
            ))}
        </div>
    </section>;
}
