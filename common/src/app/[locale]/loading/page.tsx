"use client";

import {useState} from "react";
import {useLocale, useTranslations} from "next-intl";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import {Link} from "@/common/i18n/navigation";
import {ArrowLeft} from "lucide-react";
import {Button} from "@/components/ui/button";
import ThreeDotLoading from "@/common/components/ThreeDotLoading";
import LoadingSpinner from "@/common/components/LoadingSpinner";

const docZh = `# Loading 组件使用说明

## 概述

项目提供两个加载指示器，均**无 props、开箱即用**，直接渲染即可：

| 组件 | 文件 | 实现 |
|------|------|------|
| \`ThreeDotLoading\` | \`ThreeDotLoading.tsx\` | 纯 Tailwind \`animate-bounce\` 三点弹跳 |
| \`LoadingSpinner\` | \`LoadingSpinner.tsx\` | \`motion/react\` 三点脉冲 + 内联样式 |

两者职责单一，适用于「数据加载中」占位。

---

## ThreeDotLoading —— 三点弹跳

纯 CSS（Tailwind）实现的三点弹跳动画，带 SSR 挂载保护（首帧返回空节点，挂载后再渲染，避免 hydration 闪烁），并附带无障碍标记。

\`\`\`tsx
import ThreeDotLoading from "@/common/components/ThreeDotLoading";

{loading ? <ThreeDotLoading /> : <Content />}
\`\`\`

| 特性 | 说明 |
|------|------|
| 依赖 | 无（纯 Tailwind） |
| props | 无 |
| SSR 保护 | 挂载前返回空，挂载后渲染 |
| 无障碍 | \`role="status"\` + \`aria-label="loading"\` |

---

## LoadingSpinner —— 三点脉冲

基于 \`motion/react\`（Framer Motion）的三点缩放脉冲动画，样式通过组件内 \`<style>\` 注入，无外部 CSS 依赖。

\`\`\`tsx
import LoadingSpinner from "@/common/components/LoadingSpinner";

<LoadingSpinner />
\`\`\`

| 特性 | 说明 |
|------|------|
| 依赖 | \`motion/react\` |
| props | 无 |
| 动画 | scale 1 → 1.5 → 1 循环 |
| 样式 | 组件内 \`<style>\` 注入 |

---

## 选用建议

- 追求零依赖、体积小、与现有 Tailwind 体系一致 → \`ThreeDotLoading\`
- 已引入 motion、想要更顺滑的脉冲动画 → \`LoadingSpinner\`
`;

const docEn = `# Loading Components Usage Guide

## Overview

The project ships two loading indicators, both with **no props and ready out of the box**:

| Component | File | Implementation |
|-----------|------|----------------|
| \`ThreeDotLoading\` | \`ThreeDotLoading.tsx\` | Pure Tailwind \`animate-bounce\` three-dot bounce |
| \`LoadingSpinner\` | \`LoadingSpinner.tsx\` | \`motion/react\` three-dot pulse + inline styles |

Both are single-purpose placeholders for the "loading data" state.

---

## ThreeDotLoading — bouncing dots

A pure-CSS (Tailwind) three-dot bounce with an SSR mount guard (returns an empty node on the first frame, then renders after mount to avoid hydration flicker), plus accessibility attributes.

\`\`\`tsx
import ThreeDotLoading from "@/common/components/ThreeDotLoading";

{loading ? <ThreeDotLoading /> : <Content />}
\`\`\`

| Feature | Description |
|---------|-------------|
| Dependency | None (pure Tailwind) |
| props | None |
| SSR guard | Empty until mounted |
| A11y | \`role="status"\` + \`aria-label="loading"\` |

---

## LoadingSpinner — pulsing dots

A three-dot scale pulse built on \`motion/react\` (Framer Motion); styles are injected via an inline \`<style>\`, so there is no external CSS dependency.

\`\`\`tsx
import LoadingSpinner from "@/common/components/LoadingSpinner";

<LoadingSpinner />
\`\`\`

| Feature | Description |
|---------|-------------|
| Dependency | \`motion/react\` |
| props | None |
| Animation | scale 1 → 1.5 → 1, looping |
| Styles | Injected via inline \`<style>\` |

---

## Choosing

- Zero deps, small footprint, consistent with the Tailwind system → \`ThreeDotLoading\`
- Already using motion, want a smoother pulse → \`LoadingSpinner\`
`;

export default function LoadingExamplePage() {
    const t = useTranslations("LoadingExample");
    const locale = useLocale();
    const doc = locale === "zh" ? docZh : docEn;

    const [simulating, setSimulating] = useState(false);
    const simulate = () => {
        setSimulating(true);
        setTimeout(() => setSimulating(false), 1500);
    };

    return (
        <div className="relative min-h-screen bg-background text-foreground">
            <div aria-hidden className="pointer-events-none absolute inset-0 -z-10">
                <div
                    className="absolute -top-40 left-1/2 h-[420px] w-[640px] -translate-x-1/2 rounded-full bg-gradient-to-r from-violet-500/15 via-cyan-400/15 to-fuchsia-500/15 blur-[120px]"/>
            </div>

            <main className="mx-auto max-w-3xl px-6 py-16">
                <Link
                    href="/"
                    className="inline-flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground">
                    <ArrowLeft className="h-4 w-4"/>
                    {t("back")}
                </Link>

                <h1 className="mt-8 text-3xl font-bold tracking-tight sm:text-4xl">{t("title")}</h1>
                <p className="mt-3 text-muted-foreground">{t("desc")}</p>

                {/* 组件展示 */}
                <section className="mt-10 rounded-2xl border border-border bg-card p-6">
                    <h2 className="text-lg font-semibold">{t("showcase-title")}</h2>
                    <p className="mt-1 text-sm text-muted-foreground">{t("showcase-desc")}</p>

                    <div className="mt-5 grid gap-6 sm:grid-cols-2">
                        <div className="flex flex-col items-center gap-3 rounded-xl border border-border bg-muted/30 p-6">
                            <span className="font-mono text-sm text-muted-foreground">ThreeDotLoading</span>
                            <ThreeDotLoading/>
                        </div>
                        <div className="flex flex-col items-center gap-3 rounded-xl border border-border bg-muted/30 p-6">
                            <span className="font-mono text-sm text-muted-foreground">LoadingSpinner</span>
                            <LoadingSpinner/>
                        </div>
                    </div>
                </section>

                {/* 典型用法 */}
                <section className="mt-6 rounded-2xl border border-border bg-card p-6">
                    <h2 className="text-lg font-semibold">{t("usage-title")}</h2>
                    <p className="mt-1 text-sm text-muted-foreground">{t("usage-desc")}</p>

                    <div className="mt-5 flex items-center gap-3">
                        <Button onClick={simulate} disabled={simulating}>
                            {t("simulate-btn")}
                        </Button>
                    </div>
                    <div className="mt-5 flex min-h-12 items-center rounded-xl border border-border bg-muted/30 px-4">
                        {simulating ? <ThreeDotLoading/> : <span className="text-sm">{t("done")}</span>}
                    </div>
                </section>

                <div className="prose-doc mt-12">
                    <ReactMarkdown remarkPlugins={[remarkGfm]}>{doc}</ReactMarkdown>
                </div>
            </main>
        </div>
    );
}
