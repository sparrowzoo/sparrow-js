import {
    ArrowUpRight,
    FolderOpen,
    Gauge,
    History,
    MessagesSquare,
    MousePointer2,
    PanelsTopLeft,
    Radio,
    UserRound,
    Workflow
} from "lucide-react";
import {getTranslations} from "next-intl/server";
import {type ServiceId} from "../_content/services";
import {getProductUrl} from "@/common/lib/ProductRegistry";
import {ProductHero, ProductLink, SectionHeading} from "./product-ui";
import PassportExperience from "./passport-experience";
import styles from "../product.module.css";

const featureIcons = {
    passport: [UserRound, PanelsTopLeft, Workflow],
    file: [MousePointer2, Gauge, FolderOpen],
    im: [MessagesSquare, Radio, History],
};

export default async function ServiceProduct({id, locale}: {id: ServiceId; locale: string}) {
    const t = await getTranslations(`website.products.${id}.page`);
    const icons = featureIcons[id];
    const experienceUrl = id === "file" ? undefined : getProductUrl(id, locale);
    const tags = t.raw("tags") as string[];
    const features = t.raw("features") as {title: string; description: string}[];
    const flow = t.raw("flow") as {label: string; detail: string}[];
    const resources = t.raw("resources") as {title: string; description: string; href: string; external?: boolean}[];

    return (
        <>
            <ProductHero
                name={t("name")}
                eyebrow={t("eyebrow")}
                title={t("title")}
                highlight={t("highlight")}
                description={t("description")}
                tags={tags}
                primary={experienceUrl ? {
                    label: t("primaryLabel"),
                    href: experienceUrl,
                    newTab: true
                } : {label: t("primaryLabel"), href: resources[0].href}}
                secondary={id === "passport" ? {
                    label: t("secondaryLabel"),
                    href: "#experience"
                } : id === "im" ? {
                    label: t("secondaryLabel"),
                    href: resources[0].href
                } : {label: t("secondaryLabel"), href: "#capabilities"}}
            >
                <h2 className="sr-only">{t("flowLabel")}</h2>
                <ol className={styles.flowPanel} aria-label={t("flowLabel")}>
                    {flow.map((step, index) => (
                        <li className={styles.flowItem} key={step.label}>
                            <span className={styles.flowNumber}
                                  aria-hidden="true">{String(index + 1).padStart(2, "0")}</span>
                            <div className={styles.flowDetail}><h3>{step.label}</h3><p>{step.detail}</p></div>
                        </li>
                    ))}
                </ol>
            </ProductHero>

            {id === "passport" && <PassportExperience locale={locale}/>}

            <section className={styles.section} id="capabilities"
                     aria-label={t("capabilitiesLabel")}>
                <SectionHeading
                    eyebrow={t("capabilitiesEyebrow")}
                    title={t("capabilitiesTitle")}
                />
                <div className={styles.featureGrid}>
                    {features.map((feature, index) => {
                        const Icon = icons[index];
                        return (
                            <article className={styles.feature} key={feature.title}>
                                <Icon size={24} aria-hidden="true"/>
                                <h3>{feature.title}</h3>
                                <p>{feature.description}</p>
                            </article>
                        );
                    })}
                </div>
            </section>

            <section className={`${styles.section} ${styles.integration}`} id="integration"
                     aria-label={t("integrationLabel")}>
                <SectionHeading
                    eyebrow={t("integrationEyebrow")}
                    title={t("integrationTitle")}
                    description={t("integrationDescription")}
                />
                <div className={styles.resources}>
                    {resources.map((resource) => (
                        <ProductLink href={resource.href} className={styles.resource} key={resource.href}>
                            <div><h3>{resource.title}</h3><p>{resource.description}</p></div>
                            <ArrowUpRight size={20} aria-hidden="true"/>
                        </ProductLink>
                    ))}
                </div>
            </section>
        </>
    );
}
