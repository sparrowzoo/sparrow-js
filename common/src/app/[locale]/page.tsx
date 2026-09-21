import {ModeToggle} from "@/common/components/header/mode-toggle";
import {useTranslations} from "next-intl";
import LocaleSwitcher from "@/common/components/i18n/LocaleSwitcher";
import {Link} from "@/common/i18n/navigation";
import {Anchor, ArrowRight, Bird, Blocks, CircleAlert, Download, History, Languages, Loader2, Move, Package, Settings, Sparkles, SunMoon, Table2, UploadCloud} from "lucide-react";

const NEXT_INTL_GUIDE_URL = "/docs/next-intl/权威指南及使用说明.html";

export default function Home() {
    const t = useTranslations("Home");

    const features = [
        {icon: Languages, title: t("features.i18n.title"), desc: t("features.i18n.desc")},
        {icon: SunMoon, title: t("features.theme.title"), desc: t("features.theme.desc")},
        {icon: Blocks, title: t("features.components.title"), desc: t("features.components.desc")},
    ];

    return (
        <div className="relative min-h-screen overflow-hidden bg-background text-foreground">
            {/* 背景柔光 */}
            <div aria-hidden className="pointer-events-none absolute inset-0 -z-10">
                <div className="absolute -top-40 left-1/2 h-[480px] w-[720px] -translate-x-1/2 rounded-full bg-gradient-to-r from-violet-500/20 via-cyan-400/20 to-fuchsia-500/20 blur-[120px] dark:from-violet-600/25 dark:via-cyan-400/20 dark:to-fuchsia-600/25"/>
                <div className="absolute bottom-0 left-1/4 h-[320px] w-[420px] rounded-full bg-cyan-400/10 blur-[100px] dark:bg-cyan-500/15"/>
            </div>

            {/* 顶部导航 */}
            <header className="sticky top-0 z-50 border-b border-border/60 bg-background/70 backdrop-blur-xl">
                <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-6">
                    <div className="flex items-center gap-2">
                        <span
                            className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-violet-500 to-cyan-400 text-white">
                            <Bird className="h-4 w-4"/>
                        </span>
                        <span className="text-lg font-semibold tracking-tight">{t("title")}</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <LocaleSwitcher/>
                        <ModeToggle/>
                    </div>
                </div>
            </header>

            {/* Hero */}
            <main className="mx-auto max-w-6xl px-6">
                <section className="flex flex-col items-center pb-16 pt-24 text-center sm:pt-32">
                    <span
                        className="inline-flex items-center gap-2 rounded-full border border-border bg-card/60 px-4 py-1.5 text-sm text-muted-foreground backdrop-blur">
                        <Sparkles className="h-3.5 w-3.5 text-violet-500"/>
                        {t("badge")}
                    </span>

                    <h1 className="mt-8 max-w-3xl text-5xl font-bold tracking-tight sm:text-7xl">
                        <span className="bg-gradient-to-r from-violet-500 via-cyan-400 to-fuchsia-500 bg-clip-text text-transparent">
                            {t("title")}
                        </span>
                        <br/>
                        <span>{t("subtitle")}</span>
                    </h1>

                    <p className="mt-6 max-w-2xl text-lg text-muted-foreground">
                        {t("description")}
                    </p>

                    <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
                        <a
                            href="#"
                            className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-violet-500 to-cyan-400 px-6 py-3 text-sm font-medium text-white shadow-lg shadow-violet-500/25 transition-transform hover:-translate-y-0.5">
                            {t("cta-primary")}
                            <ArrowRight className="h-4 w-4"/>
                        </a>
                        <a
                            href={NEXT_INTL_GUIDE_URL}
                            className="inline-flex items-center gap-2 rounded-full border border-border bg-card/60 px-6 py-3 text-sm font-medium backdrop-blur transition-colors hover:bg-card">
                            {t("cta-secondary")}
                        </a>
                        <Link
                            href="/upload"
                            className="inline-flex items-center gap-2 rounded-full border border-border bg-card/60 px-6 py-3 text-sm font-medium backdrop-blur transition-colors hover:bg-card">
                            <UploadCloud className="h-4 w-4"/>
                            {t("upload-example")}
                        </Link>
                        <Link
                            href="/zip-download"
                            className="inline-flex items-center gap-2 rounded-full border border-border bg-card/60 px-6 py-3 text-sm font-medium backdrop-blur transition-colors hover:bg-card">
                            <Download className="h-4 w-4"/>
                            {t("zip-download-example")}
                        </Link>
                        <Link
                            href="/forms"
                            className="inline-flex items-center gap-2 rounded-full border border-border bg-card/60 px-6 py-3 text-sm font-medium backdrop-blur transition-colors hover:bg-card">
                            <Blocks className="h-4 w-4"/>
                            {t("forms-example")}
                        </Link>
                        <Link
                            href="/access-histories"
                            className="inline-flex items-center gap-2 rounded-full border border-border bg-card/60 px-6 py-3 text-sm font-medium backdrop-blur transition-colors hover:bg-card">
                            <History className="h-4 w-4"/>
                            {t("access-histories-example")}
                        </Link>
                        <Link
                            href="/hooks"
                            className="inline-flex items-center gap-2 rounded-full border border-border bg-card/60 px-6 py-3 text-sm font-medium backdrop-blur transition-colors hover:bg-card">
                            <Anchor className="h-4 w-4"/>
                            {t("hooks-example")}
                        </Link>
                        <Link
                            href="/loading"
                            className="inline-flex items-center gap-2 rounded-full border border-border bg-card/60 px-6 py-3 text-sm font-medium backdrop-blur transition-colors hover:bg-card">
                            <Loader2 className="h-4 w-4"/>
                            {t("loading-example")}
                        </Link>
                        <Link
                            href="/error"
                            className="inline-flex items-center gap-2 rounded-full border border-border bg-card/60 px-6 py-3 text-sm font-medium backdrop-blur transition-colors hover:bg-card">
                            <CircleAlert className="h-4 w-4"/>
                            {t("error-example")}
                        </Link>
                        <Link
                            href="/draggable"
                            className="inline-flex items-center gap-2 rounded-full border border-border bg-card/60 px-6 py-3 text-sm font-medium backdrop-blur transition-colors hover:bg-card">
                            <Move className="h-4 w-4"/>
                            {t("draggable-example")}
                        </Link>
                        <Link
                            href="/table"
                            className="inline-flex items-center gap-2 rounded-full border border-border bg-card/60 px-6 py-3 text-sm font-medium backdrop-blur transition-colors hover:bg-card">
                            <Table2 className="h-4 w-4"/>
                            {t("table-example")}
                        </Link>
                        <Link
                            href="/eslint-config"
                            className="inline-flex items-center gap-2 rounded-full border border-border bg-card/60 px-6 py-3 text-sm font-medium backdrop-blur transition-colors hover:bg-card">
                            <Settings className="h-4 w-4"/>
                            {t("eslint-config-example")}
                        </Link>
                        <Link
                            href="/i18n-static-export"
                            className="inline-flex items-center gap-2 rounded-full border border-border bg-card/60 px-6 py-3 text-sm font-medium backdrop-blur transition-colors hover:bg-card">
                            <Package className="h-4 w-4"/>
                            {t("i18n-static-export-example")}
                        </Link>
                    </div>
                </section>

                {/* 特性卡片 */}
                <section className="grid gap-6 pb-24 sm:grid-cols-3">
                    {features.map((f) => {
                        const Icon = f.icon;
                        return (
                            <div
                                key={f.title}
                                className="group rounded-2xl border border-border bg-card p-6 transition-all hover:-translate-y-1 hover:border-violet-500/40 hover:shadow-xl hover:shadow-violet-500/10">
                                <span
                                    className="inline-flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-violet-500/15 to-cyan-400/15 text-violet-500 dark:text-cyan-300">
                                    <Icon className="h-5 w-5"/>
                                </span>
                                <h3 className="mt-4 text-lg font-semibold">{f.title}</h3>
                                <p className="mt-2 text-sm text-muted-foreground">{f.desc}</p>
                            </div>
                        );
                    })}
                </section>
            </main>

            {/* 底部 */}
            <footer className="border-t border-border/60 py-8 text-center text-sm text-muted-foreground">
                {t("footer")} · {new Date().getFullYear()}
            </footer>
        </div>
    );
}
