"use client";

import {type ReactNode, useEffect, useId, useRef, useState} from "react";
import {ArrowUpRight, FlaskConical, GraduationCap, Menu, X} from "lucide-react";
import LocaleSwitcher from "@/common/components/i18n/LocaleSwitcher";
import {ModeToggle} from "./mode-toggle";
import styles from "./site-banner.module.css";

export type BannerMenuItem = {
    /** 稳定标识，作为列表 key 的兜底；同组内 href 可能重复时务必提供。 */
    id?: string;
    /** 菜单项文字，由上游通过 i18n 传入，组件不内置任何文案。 */
    label: string;
    /** 链接地址，原样透传给 <a href>。不校验、不补 locale 前缀，内/外链合法性均由上游决定。 */
    href: string;
    /** 是否高亮强调（一般用于主 CTA 按钮）。 */
    emphasized?: boolean;
    /** 是否标记为当前页。仅接受显式指定，组件不做 pathname 自动匹配。 */
    active?: boolean;
    /** 前置图标，仅支持内置的两种。 */
    icon?: "graduation-cap" | "flask";
    /** 分组：值为 "utility" 时渲染到右侧工具链接区，其余归入主导航。 */
    group?: "utility";
};

export type SiteBannerProps = {
    /** 品牌名（文字）。 */
    brandName: string;
    /** 品牌副标题（文字，可选）。 */
    brandCaption?: string;
    /** logo 图片地址，作为 CSS mask 使用（需为 SVG）。传入 logo 后此字段被忽略。 */
    logoSrc?: string;
    /** 自定义 logo 节点，优先级高于 logoSrc。 */
    logo?: ReactNode;
    /** 品牌/首页链接地址，原样透传，合法性由上游保证。 */
    homeHref?: string;
    /** 导航菜单项，顺序即渲染顺序。 */
    items: BannerMenuItem[];
    /** 导航区域的 aria-label（无障碍，需 i18n）。 */
    navigationLabel: string;
    /** 打开菜单按钮的 aria-label（需 i18n）。 */
    openMenuLabel: string;
    /** 关闭菜单按钮的 aria-label（需 i18n）。 */
    closeMenuLabel: string;
    /** 右侧追加的自定义操作区（如登录按钮）。 */
    actions?: ReactNode;
    /** 追加到根 <header> 上的 className。 */
    className?: string;
};

/** 共享页头基础组件：只负责展示，品牌、导航、文案、链接均由宿主项目提供。 */
export default function SiteBanner({
    brandName,
    brandCaption,
    logoSrc = "/svg/brand/sparrow-logo.svg",
    logo,
    homeHref = "/",
    items,
    navigationLabel,
    openMenuLabel,
    closeMenuLabel,
    actions,
    className,
}: SiteBannerProps) {
    const navigationId = useId();
    const navigationRef = useRef<HTMLElement>(null);
    const toggleRef = useRef<HTMLButtonElement>(null);
    const headerRef = useRef<HTMLElement>(null);
    const [menuOpen, setMenuOpen] = useState(false);
    const mainItems = items.filter((item) => item.group !== "utility");
    const utilityItems = items.filter((item) => item.group === "utility");

    const renderItem = (item: BannerMenuItem) => {
        const Icon = item.icon === "graduation-cap" ? GraduationCap : item.icon === "flask" ? FlaskConical : undefined;
        return (
            <a key={item.id ?? item.href} href={item.href} onClick={() => setMenuOpen(false)}
               className={item.emphasized ? styles.emphasized : undefined}
               aria-current={item.active ? "page" : undefined}>
                <span className={styles.linkLabel}>{Icon && <Icon size={17} strokeWidth={1.7} aria-hidden="true"/>}{item.label}</span>
                {item.emphasized && !Icon && <ArrowUpRight size={14} aria-hidden="true"/>}
            </a>
        );
    };

    useEffect(() => {
        if (!menuOpen) return;
        navigationRef.current?.querySelector<HTMLAnchorElement>("a")?.focus();

        const onKeyDown = (event: KeyboardEvent) => {
            if (event.key === "Escape") {
                setMenuOpen(false);
                toggleRef.current?.focus();
            }
        };
        const onPointerDown = (event: PointerEvent) => {
            if (!headerRef.current?.contains(event.target as Node)) setMenuOpen(false);
        };
        const desktop = window.matchMedia("(min-width: 1101px)");
        const onBreakpointChange = () => {
            if (desktop.matches) setMenuOpen(false);
        };
        window.addEventListener("keydown", onKeyDown);
        document.addEventListener("pointerdown", onPointerDown);
        desktop.addEventListener("change", onBreakpointChange);
        return () => {
            window.removeEventListener("keydown", onKeyDown);
            document.removeEventListener("pointerdown", onPointerDown);
            desktop.removeEventListener("change", onBreakpointChange);
        };
    }, [menuOpen]);

    return (
        <header ref={headerRef} data-has-actions={Boolean(actions) || undefined}
                className={`${styles.banner}${className ? ` ${className}` : ""}`}>
            <div className={styles.inner}>
                <a href={homeHref} className={styles.brand} onClick={() => setMenuOpen(false)}
                   aria-label={brandCaption ? `${brandName} ${brandCaption}` : brandName}>
                    {logo ? <span className={styles.logoSlot} aria-hidden="true">{logo}</span> : (
                        <span className={styles.logo} aria-hidden="true"
                              style={{maskImage: `url("${logoSrc}")`, WebkitMaskImage: `url("${logoSrc}")`}}/>
                    )}
                    <span className={styles.wordmark}><span>{brandName}</span>{brandCaption &&
                        <span className={styles.caption}>{brandCaption}</span>}</span>
                </a>

                <nav ref={navigationRef} id={navigationId} aria-label={navigationLabel}
                     className={`${styles.navigation} ${menuOpen ? styles.navigationOpen : ""}`}>
                    {mainItems.map(renderItem)}
                    {utilityItems.length > 0 && <div className={styles.utilityLinks}>{utilityItems.map(renderItem)}</div>}
                </nav>

                <div className={styles.actions}>
                    <LocaleSwitcher className={styles.localeControl} selectClassName={styles.localeSelect}
                                    contentClassName={styles.themeMenu}/>
                    <ModeToggle className={styles.iconButton} contentClassName={styles.themeMenu}/>
                    {actions && <div className={styles.extraActions}>{actions}</div>}
                    <button ref={toggleRef} type="button" className={`${styles.iconButton} ${styles.menuToggle}`}
                            aria-controls={navigationId} aria-expanded={menuOpen}
                            aria-label={menuOpen ? closeMenuLabel : openMenuLabel}
                            onClick={() => setMenuOpen((open) => !open)}>
                        {menuOpen ? <X size={20} aria-hidden="true"/> : <Menu size={20} aria-hidden="true"/>}
                    </button>
                </div>
            </div>
        </header>
    );
}
