import {localeAlternates} from "@/lib/site-metadata";
import type {Metadata} from "next";
import {getTranslations, setRequestLocale} from "next-intl/server";
import {
    ArrowDown,
    ArrowRight,
    ArrowUpRight,
    Braces,
    Check,
    ChevronDown,
    Code2,
    Database,
    FileCode2,
    FolderTree,
    Layers3,
    Monitor,
    Settings2
} from "lucide-react";
import {getProductUrl} from "@/common/lib/ProductRegistry";
import {getCoderGuide} from "../_content/coder-guide";
import {ProductHero, ProductLink, SectionHeading} from "../_components/product-ui";
import CodeBlock from "../_components/code-block";
import home from "../../home.module.css";
import styles from "../product.module.css";

type PageProps = { params: Promise<{ locale: string }> };

const poExample = `package com.yourcompany.po;

@Table(name = "t_user_example")
@Data
public class UserExample extends PO {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id", columnDefinition = "int COMMENT 'ID'")
    private Long id;

    @Column(name = "user_name", nullable = false,
            columnDefinition = "varchar(32) COMMENT '用户名'")
    private String userName;

    @Column(name = "department_id",
            columnDefinition = "int COMMENT '部门ID'")
    @ListDatasource(type = ListDatasourceType.TABLE,
            params = "t_department")
    private Long departmentId;
}`;

export async function generateMetadata({params}: PageProps): Promise<Metadata> {
    const {locale} = await params;
    const t = await getTranslations({locale, namespace: "website.products.coder.page"});
    return {
    alternates: localeAlternates(locale, "/products/coder"),
        title: t("meta"),
        description: t("description"),
        openGraph: {title: t("meta"), description: t("description"), type: "website"}
    };
}

export default async function CoderPage({params}: PageProps) {
    const {locale} = await params;
    setRequestLocale(locale);
    const t = await getTranslations("website.products.coder.page");
    const guide = await getCoderGuide();
    const experienceUrl = getProductUrl("coder", locale);
    const icons = [Code2, Layers3, Settings2];
    const tags = t.raw("tags") as string[];
    const nav = t.raw("nav") as string[];
    const features = t.raw("features") as { title: string; description: string }[];
    const layers = t.raw("layers") as string[];
    return <>
        <ProductHero name="sparrow-coder" eyebrow={t("eyebrow")} title={t("title")} highlight={t("highlight")}
                     description={t("description")} tags={tags}
                     primary={{label: t("experience"), href: experienceUrl, newTab: true}}
                     secondary={{label: t("source"), href: "https://github.com/sparrowzoo/sparrow-coder"}}>
            <div className={styles.generatorDiagram}>
                <div className={styles.diagramTop}><span/><span/><span/><code>model → application</code><Braces
                    size={15} aria-hidden="true"/></div>
                <div className={styles.generatorBody}>
                    <div className={styles.modelNode}><FileCode2 size={22} aria-hidden="true"/>
                        <div><span>{t("input")}</span><strong>UserExample.java</strong></div>
                        <span className={styles.nodeBadge}>PO</span></div>
                    <ArrowDown className={styles.flowArrow} size={20} aria-hidden="true"/>
                    <div className={styles.engineNode}><Settings2 size={22} aria-hidden="true"/>
                        <div><strong>sparrow-coder</strong><span>{t("engine")}</span></div>
                        <Check size={18} aria-hidden="true"/></div>
                    <ArrowDown className={styles.flowArrow} size={20} aria-hidden="true"/>
                    <p className={styles.outputLabel}>{t("output")}</p>
                    <div className={styles.outputGrid}>
                        <div><Layers3 size={21} aria-hidden="true"/><strong>Spring
                            Boot</strong><span>{t("backend")}</span><code>sparrow-example</code></div>
                        <div><Monitor size={21} aria-hidden="true"/><strong>React /
                            Next.js</strong><span>{t("frontend")}</span><code>react-next-admin</code></div>
                    </div>
                </div>
                <div className={styles.diagramNote}><span/>{t("diagramNote")}</div>
            </div>
        </ProductHero>

        <nav className={styles.sectionNav} aria-label={t("navLabel")}>
            {["features", "architecture", "workflow", "po-example", "quickstart"].map((id, i) => <a key={id}
                                                                                                    href={`#${id}`}><span>0{i + 1}</span>{nav[i]}
            </a>)}
        </nav>

        <section id="features" className={styles.section}>
            <SectionHeading eyebrow="01 / CAPABILITIES" title={t("featuresTitle")}
                            description={t("featuresDescription")}/>
            <div className={styles.featureGrid}>{features.map((feature, i) => {
                const Icon = icons[i];
                return <article className={styles.feature} key={feature.title}><Icon size={25} aria-hidden="true"/>
                    <h3>{feature.title}</h3><p>{feature.description}</p></article>;
            })}</div>
        </section>

        <section id="architecture" className={styles.section}>
            <SectionHeading eyebrow="02 / CLEAN ARCHITECTURE" title={t("architectureTitle")}
                            description={t("architectureDescription")}/>
            <div className={styles.architecturePanel}>
                <div className={styles.scaffolds}>
                    <div><Layers3 size={20} aria-hidden="true"/><span>{t("backendScaffold")}</span><a
                        href="https://github.com/sparrowzoo/sparrow-example">sparrow-example<ArrowUpRight size={14}
                                                                                                          aria-hidden="true"/></a>
                    </div>
                    <div><Monitor size={20} aria-hidden="true"/><span>{t("frontendScaffold")}</span><a
                        href="https://github.com/sparrowzoo/sparrow-js">react-next-admin<ArrowUpRight size={14}
                                                                                                      aria-hidden="true"/></a>
                    </div>
                </div>
                <div className={styles.layerGrid}>{["Adapter", "Domain", "Infrastructure", "DAO"].map((name, i) => <div
                    key={name}><span>0{i + 1}</span><h3>{name}</h3><p>{layers[i]}</p></div>)}</div>
                <p className={styles.panelNote}>{t("layerNote")}</p>
                <div className={styles.stackLine}><code>Spring Boot + React / Next.js</code><span>{t("separate")}</span>
                </div>
            </div>
        </section>

        <section id="workflow" className={styles.section}>
            <SectionHeading eyebrow="03 / WORKFLOW" title={t("workflowTitle")} description={t("workflowDescription")}/>
            <ol className={styles.workflow}>{guide.workflow.map((step, i) => <li key={step.title}><span
                className={styles.stepNumber}>0{i + 1}</span><h3>{step.title}</h3><p>{step.description}</p></li>)}</ol>
        </section>

        <section id="po-example" className={styles.section}>
            <SectionHeading eyebrow="04 / MODEL FIRST" title={t("modelTitle")} description={t("modelDescription")}/>
            <div className={styles.modelSection}>
                <div className={styles.modelExplanation}>
                    <Database size={27} aria-hidden="true"/><h3>{t("relation")}</h3><p>{t("relationDescription")}</p>
                    <div className={styles.relation}><code>Department</code><span>1 → N</span><code>UserExample</code>
                    </div>
                    <aside className={styles.notice}><FolderTree size={19} aria-hidden="true"/>
                        <h4>{t("cautionTitle")}</h4><p>{t("caution")}</p></aside>
                </div>
                <CodeBlock code={poExample} language="java" label={t("snippet")} locale={locale}/>
            </div>
        </section>

        <section id="quickstart" className={styles.section}>
            <SectionHeading eyebrow="05 / QUICK START" title={t("quickTitle")} description={t("quickDescription")}/>
            <div className={styles.requirements}>{guide.requirements.map(item => <div key={item.name}>
                <span>{item.name}</span><strong>{item.version}</strong></div>)}</div>
            <p className={styles.requirementNote}>{t("requirementsNote")}</p>
            <div className={styles.setup}>{guide.setup.map((step, i) => <details className={styles.disclosure}
                                                                                 key={step.title}>
                <summary><span className={styles.disclosureNumber}>0{i + 1}</span><h3>{step.title}</h3><ChevronDown
                    size={18} aria-hidden="true"/></summary>
                <div className={styles.disclosureBody}><p>{step.description}</p>{step.code &&
                    <CodeBlock code={step.code} language={step.language} locale={locale}/>} {step.note &&
                    <p className={styles.setupNote}>{step.note}</p>}</div>
            </details>)}</div>
            <div className={styles.referenceGrid}>
                <details className={styles.disclosure}>
                    <summary><h3>{t("repos")}</h3><ChevronDown size={18} aria-hidden="true"/></summary>
                    <dl className={styles.definitionList}>{guide.repositories.map(repo => <div key={repo.name}>
                        <dt><a href={repo.href}>{repo.name}<ArrowUpRight size={13} aria-hidden="true"/></a></dt>
                        <dd>{repo.role}</dd>
                    </div>)}</dl>
                </details>
                <details className={styles.disclosure}>
                    <summary><h3>{t("modules")}</h3><ChevronDown size={18} aria-hidden="true"/></summary>
                    <dl className={styles.definitionList}>{guide.modules.map(module => <div key={module.name}>
                        <dt><code>{module.name}</code></dt>
                        <dd>{module.description}</dd>
                    </div>)}</dl>
                </details>
            </div>
        </section>

        <section className={styles.section}>
            <SectionHeading eyebrow="SUPPORT / FAQ" title={t("faqTitle")}/>
            <div className={styles.faq}>{guide.faq.map(item => <details className={styles.disclosure}
                                                                        key={item.question}>
                <summary><h3>{item.question}</h3><ChevronDown size={18} aria-hidden="true"/></summary>
                <p className={styles.faqAnswer}>{item.answer}</p></details>)}</div>
        </section>

        <section className={`${styles.section} ${styles.ctaSection}`}>
            <div className={styles.cta}>
                <div><p className={styles.eyebrow}>BUILD WITH SPARROW</p><h2>{t("ctaTitle")}</h2>
                    <p>{t("ctaDescription")}</p></div>
                <div className={styles.ctaActions}><ProductLink href={experienceUrl} newTab
                                                                className={home.primaryButton}>{t("experience")}<ArrowUpRight
                    size={16} aria-hidden="true"/></ProductLink><a href="#quickstart"
                                                                   className={home.textButton}>{t("start")}<ArrowRight
                    size={15} aria-hidden="true"/></a><ProductLink href="/products"
                                                                   className={home.textButton}>{t("allProducts")}<ArrowUpRight
                    size={15} aria-hidden="true"/></ProductLink></div>
            </div>
        </section>
    </>;
}
