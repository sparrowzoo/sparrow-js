"use client";
import {BookOpen, ChevronRight, House, Search} from "lucide-react";
import {Input} from "@/components/ui/input";
import React from "react";
import Image from "next/image";
import UserProfile from "@/common/components/header/user-profile";
import LocaleSwitcher from "@/common/components/i18n/LocaleSwitcher";
import {ModeToggle} from "@/common/components/header/mode-toggle";
import AccessHistories from "@/common/components/access-histories";
import {SidebarTrigger} from "@/components/ui/sidebar";
import {Link, usePathname} from "@/common/i18n/navigation";
import {modules} from "@/lib/navigation";
import {useLocale, useTranslations} from "next-intl";
import {WWW_ROOT} from "@/common/lib/Env";

type HeaderProps = {
    showProfile?: boolean;
};
export default function Header(headerProps: HeaderProps) {
    const locale = useLocale();
    const t = useTranslations("Header");
    const home = useTranslations("Home");
    const global = useTranslations("GlobalForm");
    const pathname = usePathname();
    const activeModule = modules.find((item) => item.url === pathname);
    const pageTitle = activeModule ? home(`modules.${activeModule.key}.title`) : t("index");
    const PageIcon = activeModule?.icon ?? House;

    return (
        <header className="admin-header sticky top-0 z-30">
            <div className="flex h-18 min-w-0 items-center gap-3 px-4 sm:px-6 lg:px-8">
                <a href={`${WWW_ROOT?.replace(/\/+$/, "")}/${locale}/`}
                   aria-label={t("backHome")} title={t("backHome")}
                   className="flex shrink-0 items-center rounded-md text-foreground transition-colors hover:text-primary focus-visible:outline-2 focus-visible:outline-ring">
                    <Image src="/svg/brand/sparrow-logo.svg" width={32} height={32} unoptimized alt="" className="size-8" aria-hidden="true"/>
                </a>
                <SidebarTrigger className="size-9 shrink-0 text-muted-foreground"/>
                <nav aria-label={home("badge")} className="hidden min-w-0 items-center gap-3 text-sm sm:flex">
                    {activeModule && <>
                        <Link href="/" aria-label={t("index")} className="flex shrink-0 items-center gap-1.5 rounded-md text-muted-foreground transition-colors hover:text-primary focus-visible:outline-2 focus-visible:outline-ring">
                            <House className="size-4" strokeWidth={1.7}/>
                            <span className="hidden lg:inline">{t("index")}</span>
                        </Link>
                        <ChevronRight className="size-3.5 shrink-0 text-muted-foreground/50" aria-hidden="true"/>
                    </>}
                    <span aria-current="page" className="flex min-w-0 items-center gap-2 font-semibold text-foreground">
                        <PageIcon className="size-[18px] shrink-0 text-primary" strokeWidth={1.7}/>
                        <span className="truncate text-base">{pageTitle}</span>
                    </span>
                </nav>
                <div className="ml-auto flex min-w-0 items-center gap-1.5 sm:gap-3">
                    <form className="w-16 min-w-0 sm:w-36 xl:w-56">
                        <div className="relative">
                            <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground"/>
                            <Input
                                type="search"
                                aria-label={global("search")}
                                placeholder={global("search") + "…"}
                                className="h-9 rounded-xl border-0 bg-muted/70 pl-9 shadow-none focus-visible:ring-ring/30"
                            />
                        </div>
                    </form>
                    <LocaleSwitcher className="shrink-0 rounded-xl" selectClassName="h-[38px] rounded-xl px-2.5 text-xs"/>
                    <ModeToggle className="size-[38px] shrink-0 rounded-xl"/>
                    {headerProps.showProfile && <div className="admin-profile flex shrink-0 items-center text-sm"><UserProfile/></div>}
                </div>
            </div>
            <nav className="admin-history flex h-9 min-w-0 items-center gap-3 border-b border-border/60 px-4 sm:px-6 lg:px-8">
                <span aria-current="page" className="flex shrink-0 items-center gap-1.5 border-r pr-3 text-xs font-semibold sm:hidden">
                    <PageIcon className="size-3.5 text-primary" strokeWidth={1.7}/>
                    {pageTitle}
                </span>
                <AccessHistories showSidebarTrigger={false}/>
                <a href={`${WWW_ROOT?.replace(/\/+$/, "")}/${locale}/study/`}
                   className="flex shrink-0 items-center gap-1.5 rounded-md px-2 py-1 text-xs font-medium text-muted-foreground transition-colors hover:bg-accent hover:text-primary focus-visible:outline-2 focus-visible:outline-ring">
                    <BookOpen className="size-3.5" strokeWidth={1.7} aria-hidden="true"/>
                    {t("study")}
                </a>
            </nav>
        </header>
    );
}
