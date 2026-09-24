import type {ReactNode} from "react";
import {ArrowRight, ArrowUpRight} from "lucide-react";
import {Link} from "@/common/i18n/navigation";
import home from "../../home.module.css";
import styles from "../product.module.css";

export function ProductLink({href, className, children, newTab = false}: {href: string; className?: string; children: ReactNode; newTab?: boolean}) {
    return /^(https?:|#)|\.html(?:#|$)/.test(href)
        ? <a href={href} className={className} target={newTab ? "_blank" : undefined} rel={newTab ? "noopener noreferrer" : undefined}>{children}</a>
        : <Link href={href} className={className}>{children}</Link>;
}

type HeroAction = {label: string; href: string; newTab?: boolean};

type HeroProps = {
    name: string;
    eyebrow: string;
    title: string;
    highlight: string;
    description: string;
    tags: string[];
    primary: HeroAction;
    secondary?: HeroAction;
    children?: ReactNode;
};

export function ProductHero({name, eyebrow, title, highlight, description, tags, primary, secondary, children}: HeroProps) {
    return (
        <section className={styles.hero} aria-labelledby="product-title">
            <div className={home.heroGrid} aria-hidden="true"/>
            <div className={styles.heroInner}>
                <div className={styles.heroCopy}>
                    <p className={styles.eyebrow}>{eyebrow}</p>
                    <p className={styles.productName}>{name}</p>
                    <h1 id="product-title">{title}<br/><span>{highlight}</span></h1>
                    <p className={styles.heroDescription}>{description}</p>
                    <div className={styles.heroActions}>
                        <ProductLink href={primary.href} newTab={primary.newTab} className={home.primaryButton}>{primary.label}{primary.newTab ? <ArrowUpRight size={16} aria-hidden="true"/> : <ArrowRight size={16} aria-hidden="true"/>}</ProductLink>
                        {secondary && <ProductLink href={secondary.href} newTab={secondary.newTab} className={home.secondaryButton}>{secondary.label}<ArrowUpRight size={16} aria-hidden="true"/></ProductLink>}
                    </div>
                    <ul className={styles.heroTags}>{tags.map(tag => <li key={tag}><span/>{tag}</li>)}</ul>
                </div>
                {children && <div className={styles.heroVisual}>{children}</div>}
            </div>
        </section>
    );
}

export function SectionHeading({eyebrow, title, description}: {eyebrow: string; title: string; description?: string}) {
    return <div className={styles.sectionHead}><div><p className={styles.eyebrow}>{eyebrow}</p><h2>{title}</h2></div>{description && <p>{description}</p>}</div>;
}
