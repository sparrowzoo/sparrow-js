import {localeAlternates} from "@/lib/site-metadata";
import type {Metadata} from "next";
import Image from "next/image";
import {getTranslations, setRequestLocale} from "next-intl/server";
import {ArrowDown, ArrowRight, ArrowUpRight, BookOpen, Braces, Check, ChevronDown, Compass, GraduationCap, Layers3, MessageCircle, Sparkles, Users} from "lucide-react";
import {IM_ROOT} from "@/common/lib/Env";
import SiteHeader from "../_components/site-header";
import SiteFooter from "../_components/site-footer";
import CourseGallery from "./course-gallery";
import siteStyles from "../home.module.css";
import styles from "./study.module.css";

const OUTLINE_URL = "https://sparrowzoo.feishu.cn/docx/UrHddloNeojIR7xWZFJc1ViRnbe";
const KNOWLEDGE_URL = "https://wx.zsxq.com/group/48848482481288";
const LOTTERY_URL = "https://lottery.sparrowzoo.com/";

const courses = [
    {id: "lottery", icon: Braces, images: [{src: "/study/lottery.png", width: 1218, height: 1208}]},
    {id: "algorithms", icon: Layers3, images: [{src: "/study/ds.webp", width: 1192, height: 1204}, {src: "/study/ds2.webp", width: 1186, height: 1198}]},
    {id: "project", icon: GraduationCap, images: [{src: "/study/pro1.png", width: 1190, height: 1200}, {src: "/study/pro2.png", width: 1192, height: 1202}, {src: "/study/pro3.png", width: 1204, height: 1202}]},
] as const;

type PageProps = {params: Promise<{locale: string}>};

export async function generateMetadata({params}: PageProps): Promise<Metadata> {
    const {locale} = await params;
    const t = await getTranslations({locale, namespace: "study.metadata"});
    return {
    alternates: localeAlternates(locale, "/study"),title: t("title"), description: t("description")};
}

export default async function StudyPage({params}: PageProps) {
    const {locale} = await params;
    setRequestLocale(locale);
    const t = await getTranslations("study");
    const nav = await getTranslations("website.nav");
    const chatHref = `${IM_ROOT?.replace(/\/+$/, "")}/${locale}/chat/friends`;
    const quickLinks = [
        {id: "path", href: "#learning-path", icon: Compass},
        {id: "community", href: "#community", icon: MessageCircle},
        {id: "outline", href: OUTLINE_URL, icon: BookOpen},
    ] as const;

    return (
        <div className={siteStyles.site} id="top">
            <a href="#main-content" className={siteStyles.skipLink}>{nav("skip")}</a>
            <SiteHeader/>
            <main id="main-content">
                <section className={styles.hero} aria-labelledby="study-heading">
                    <div className={siteStyles.heroGrid} aria-hidden="true"/>
                    <div className={styles.heroInner}>
                        <div className={styles.heroCopy}>
                            <p className={siteStyles.eyebrow}>{t("hero.eyebrow")}</p>
                            <h1 id="study-heading">{t("hero.title")}<br/><span>{t("hero.highlight")}</span></h1>
                            <p className={styles.heroDescription}>{t("hero.description")}</p>
                            <div className={styles.heroActions}>
                                <a href="#learning-path" className={`${siteStyles.primaryButton} ${styles.button}`}>{t("hero.primary")}<ArrowDown size={15} aria-hidden="true"/></a>
                                <a href={chatHref} className={styles.textLink}>{t("hero.secondary")}<ArrowUpRight size={15} aria-hidden="true"/></a>
                            </div>
                        </div>
                        <nav className={styles.pathPreview} aria-label={t("path.title")}>
                            <div className={styles.previewHeading}><GraduationCap size={20} aria-hidden="true"/><span>{t("path.eyebrow")}</span></div>
                            <ol>
                                {courses.map(({id, icon: Icon}, index) => (
                                    <li key={id}>
                                        <a href={`#course-${id}`}>
                                            <span className={styles.stepNumber}>{String(index + 1).padStart(2, "0")}</span>
                                            <div><p>{t(`courses.${id}.eyebrow`)}</p><h2>{t(`courses.${id}.title`)}</h2></div>
                                            <Icon size={19} aria-hidden="true"/>
                                        </a>
                                    </li>
                                ))}
                            </ol>
                        </nav>
                    </div>
                </section>

                <div className={styles.container}>
                    <nav className={styles.quickLinks} aria-label={t("quickLinks.label")}>
                        {quickLinks.map(({id, href, icon: Icon}) => (
                            <a key={id} href={href}>
                                <span className={styles.quickIcon}><Icon size={21} strokeWidth={1.6} aria-hidden="true"/></span>
                                <div><h2>{t(`quickLinks.${id}.title`)}</h2><p>{t(`quickLinks.${id}.description`)}</p></div>
                                <ArrowUpRight size={16} aria-hidden="true"/>
                            </a>
                        ))}
                    </nav>

                    <section className={styles.section} id="learning-path" aria-labelledby="path-heading">
                        <div className={styles.sectionHead}>
                            <div><p className={siteStyles.eyebrow}>{t("path.eyebrow")}</p><h2 id="path-heading">{t("path.title")}</h2></div>
                            <p>{t("path.description")}</p>
                        </div>
                        <div className={styles.courseGrid}>
                            {courses.map(({id, images}) => (
                                <article key={id} className={styles.course} id={`course-${id}`}>
                                    <div className={styles.courseHeader}>
                                        <p className={siteStyles.eyebrow}>{t(`courses.${id}.eyebrow`)}</p>
                                        <h3>{t(`courses.${id}.title`)}</h3>
                                        <p className={styles.courseDescription}>{t(`courses.${id}.description`)}</p>
                                    </div>
                                    <CourseGallery images={[...images]} alt={t(`images.${id}`)}/>
                                    <div className={styles.courseBody}>
                                        <p className={styles.audience}><span>{t("courses.audienceLabel")}</span>{t(`courses.${id}.audience`)}</p>
                                        <div className={styles.goal}><span>{t("courses.goalLabel")}</span><p>{t(`courses.${id}.goal`)}</p></div>
                                        <details className={styles.courseDetails}>
                                            <summary>{t("courses.topicsLabel")}<ChevronDown size={15} aria-hidden="true"/></summary>
                                            <ul>{(t.raw(`courses.${id}.topics`) as string[]).map((topic) => <li key={topic}><Check size={13} aria-hidden="true"/><span>{topic}</span></li>)}</ul>
                                            {id === "project" && (
                                                <div className={styles.courseSteps}>
                                                    <h4>{t("courses.stepsLabel")}</h4>
                                                    <ol>{(t.raw("courses.project.steps") as string[]).map((step) => <li key={step}>{step}</li>)}</ol>
                                                </div>
                                            )}
                                        </details>
                                        <a className={styles.courseAction} href={id === "lottery" ? LOTTERY_URL : OUTLINE_URL} target="_blank" rel="noopener noreferrer">{t(`courses.${id}.action`)}<ArrowUpRight size={15} aria-hidden="true"/></a>
                                    </div>
                                </article>
                            ))}
                        </div>
                    </section>

                    <section className={styles.section} id="mentor" aria-labelledby="mentor-heading">
                        <div className={styles.mentor}>
                            <div className={styles.mentorProfile}>
                                <Image src="/study/zhige.webp" alt={t("images.mentor")} width={1092} height={1198} sizes="(max-width: 760px) 180px, 230px" className={styles.portrait}/>
                                <p>{t("mentor.name")}</p>
                                <span>Java · Architecture · Open Source</span>
                            </div>
                            <div className={styles.mentorCopy}>
                                <p className={siteStyles.eyebrow}>{t("mentor.eyebrow")}</p>
                                <h2 id="mentor-heading">{t("mentor.title")}</h2>
                                <p className={styles.description}>{t("mentor.description")}</p>
                                <ul className={styles.experience}>{(t.raw("mentor.experience") as string[]).map((item) => <li key={item}><span aria-hidden="true"/>{item}</li>)}</ul>
                                <details className={styles.contact}>
                                    <summary><MessageCircle size={16} aria-hidden="true"/>{t("mentor.contact")}<ChevronDown size={14} aria-hidden="true"/></summary>
                                    <div><Image src="/study/wexin.jpeg" alt={t("images.wechat")} width={1083} height={1464} sizes="180px"/><p>{t("mentor.contactDescription")}</p></div>
                                </details>
                            </div>
                        </div>
                    </section>

                    <section className={styles.section} id="community" aria-labelledby="community-heading">
                        <div className={styles.sectionHead}>
                            <div><p className={siteStyles.eyebrow}>{t("community.eyebrow")}</p><h2 id="community-heading">{t("community.title")}</h2></div>
                            <p>{t("community.description")}</p>
                        </div>
                        <div className={styles.communityGrid}>
                            <a href={chatHref} className={styles.communityCard}>
                                <span className={styles.communityIcon}><Users size={24} strokeWidth={1.5} aria-hidden="true"/></span>
                                <h3>{t("community.chat.title")}</h3>
                                <p>{t("community.chat.description")}</p>
                                <span className={styles.cardAction}>{t("community.chat.action")}<ArrowUpRight size={14} aria-hidden="true"/></span>
                            </a>
                            <div className={styles.communityCard}>
                                <span className={styles.communityIcon}><Sparkles size={24} strokeWidth={1.5} aria-hidden="true"/></span>
                                <h3>{t("community.knowledge.title")}</h3>
                                <p>{t("community.knowledge.description")}</p>
                                <a href={KNOWLEDGE_URL} target="_blank" rel="noopener noreferrer" className={styles.cardAction}>{t("community.knowledge.action")}<ArrowUpRight size={14} aria-hidden="true"/></a>
                                <details className={styles.knowledgeCode}><summary>{t("community.knowledge.qr")}<ChevronDown size={14} aria-hidden="true"/></summary><Image src="/study/star-ball.png" alt={t("images.knowledge")} width={640} height={778} sizes="190px"/></details>
                            </div>
                            <a href={OUTLINE_URL} target="_blank" rel="noopener noreferrer" className={styles.communityCard}>
                                <span className={styles.communityIcon}><BookOpen size={24} strokeWidth={1.5} aria-hidden="true"/></span>
                                <h3>{t("community.outline.title")}</h3>
                                <p>{t("community.outline.description")}</p>
                                <span className={styles.cardAction}>{t("community.outline.action")}<ArrowUpRight size={14} aria-hidden="true"/></span>
                            </a>
                        </div>
                    </section>

                    <aside className={styles.upcoming}>
                        <div><Sparkles size={17} aria-hidden="true"/><h2>{t("upcoming.title")}</h2></div>
                        <p>{t("upcoming.description")}</p>
                        <a href={OUTLINE_URL} target="_blank" rel="noopener noreferrer" aria-label={t("community.outline.action")}><ArrowRight size={18} aria-hidden="true"/></a>
                    </aside>
                </div>
            </main>
            <SiteFooter/>
        </div>
    );
}
