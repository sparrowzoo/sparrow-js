"use client";

import {useLocale, useTranslations} from "next-intl";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import {Link} from "@/common/i18n/navigation";
import {ArrowLeft, Move} from "lucide-react";
import Draggable from "@/common/components/Draggable";

const docZh = `# Draggable 组件使用说明

## 概述

\`src/common/components/Draggable.tsx\` 基于 **@dnd-kit/core**，把任意**单个**子元素变成可拖拽对象：内部用 \`useState\` 记录位置，\`useDraggable\` + \`MouseSensor\`（移动 5px 才触发）捕获拖拽，\`onDragEnd\` 时累加位移。

## 基本用法

\`\`\`tsx
import Draggable from "@/common/components/Draggable";

<Draggable>
  <div className="rounded-lg border px-4 py-2">拖拽我</div>
</Draggable>
\`\`\`

| Prop | 类型 | 必填 | 说明 |
|------|------|------|------|
| children | React.ReactNode | 是 | 被拖拽的子元素，必须是**单个**元素（内部用 \`React.Children.only\`） |
| asChild | boolean | 否 | 预留；当前始终按 \`asChild\` 模式把拖拽属性合并到子元素 |

## 工作原理

- \`useDraggable\` 提供 \`listeners\`（\`onPointerDown\` 等）、\`attributes\`（\`role\`/\\\`aria-*\`）、\`setNodeRef\` 与 \`transform\`。
- \`DraggableContainer\` 通过 \`AsChild\` 把这些属性连同 \`ref\`、\`style\`（\`transform\` + \`cursor\`）合并到子元素上。
- 拖拽中 \`transform\` 为本次拖拽的相对位移，叠加到已提交的 \`position\` 上；\`onDragEnd\` 把位移累加回 \`position\`。

## 注意事项

- 子元素请用 \`className\` 设置样式，**不要**用内联 \`style\`，否则会覆盖组件注入的 \`transform\`。
- 每个 \`Draggable\` 拥有独立的 \`DndContext\`，多个实例可并存且互不干扰。
- 目前拖拽 id 写死为 \`"box"\`，如需在同一 \`DndContext\` 下管理多个可拖拽对象，需改为动态 id。
`;

const docEn = `# Draggable Component Usage Guide

## Overview

\`src/common/components/Draggable.tsx\` turns any **single** child element into a draggable object, built on **@dnd-kit/core**: position is stored in \`useState\`, dragging is captured by \`useDraggable\` + \`MouseSensor\` (activates after 5px of movement), and \`onDragEnd\` accumulates the delta.

## Basic usage

\`\`\`tsx
import Draggable from "@/common/components/Draggable";

<Draggable>
  <div className="rounded-lg border px-4 py-2">Drag me</div>
</Draggable>
\`\`\`

| Prop | Type | Required | Description |
|------|------|----------|-------------|
| children | React.ReactNode | Yes | The child to drag; must be a **single** element (uses \`React.Children.only\`) |
| asChild | boolean | No | Reserved; currently always merges drag props into the child |

## How it works

- \`useDraggable\` provides \`listeners\` (\`onPointerDown\`, ...), \`attributes\` (\`role\` / \`aria-*\`), \`setNodeRef\` and \`transform\`.
- \`DraggableContainer\` merges these — plus \`ref\` and \`style\` (\`transform\` + \`cursor\`) — onto the child via \`AsChild\`.
- While dragging, \`transform\` is the relative offset of the current drag, added on top of the committed \`position\`; \`onDragEnd\` adds the delta back into \`position\`.

## Notes

- Style the child with \`className\` — **not** inline \`style\`, or you will clobber the injected \`transform\`.
- Each \`Draggable\` owns its own \`DndContext\`, so multiple instances coexist without interfering.
- The drag id is currently hard-coded to \`"box"\`; to manage multiple draggables under one \`DndContext\`, switch to a dynamic id.
`;

export default function DraggableExamplePage() {
    const t = useTranslations("example.DraggableExample");
    const locale = useLocale();
    const doc = locale === "zh" ? docZh : docEn;

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

                {/* 沙盒演示 */}
                <section className="mt-10 rounded-2xl border border-border bg-card p-6">
                    <h2 className="text-lg font-semibold">{t("sandbox-title")}</h2>
                    <p className="mt-1 text-sm text-muted-foreground">{t("sandbox-desc")}</p>

                    <div
                        className="relative mt-5 h-80 overflow-hidden rounded-xl border border-dashed border-border bg-muted/30">
                        <Draggable>
                            <div
                                className="absolute left-6 top-6 flex items-center gap-2 rounded-xl border border-border bg-card px-4 py-2 shadow-sm">
                                <Move className="h-4 w-4 text-violet-500"/>
                                <span>{t("card-a")}</span>
                            </div>
                        </Draggable>
                        <Draggable>
                            <div
                                className="absolute left-44 top-20 flex items-center gap-2 rounded-xl border border-border bg-card px-4 py-2 shadow-sm">
                                <Move className="h-4 w-4 text-cyan-500"/>
                                <span>{t("card-b")}</span>
                            </div>
                        </Draggable>
                        <Draggable>
                            <div
                                className="absolute left-24 top-40 flex items-center gap-2 rounded-xl border border-border bg-card px-4 py-2 shadow-sm">
                                <Move className="h-4 w-4 text-fuchsia-500"/>
                                <span>{t("card-c")}</span>
                            </div>
                        </Draggable>
                    </div>
                </section>

                {/* 典型用法 */}
                <section className="mt-6 rounded-2xl border border-border bg-card p-6">
                    <h2 className="text-lg font-semibold">{t("usage-title")}</h2>
                    <p className="mt-1 text-sm text-muted-foreground">{t("usage-desc")}</p>

                    <div className="mt-5 flex flex-wrap items-center gap-4">
                        <Draggable>
                            <button
                                className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-violet-500 to-cyan-400 px-5 py-2.5 text-sm font-medium text-white shadow-lg shadow-violet-500/25">
                                <Move className="h-4 w-4"/>
                                {t("drag-btn")}
                            </button>
                        </Draggable>
                        <span className="text-sm text-muted-foreground">{t("drag-hint")}</span>
                    </div>
                </section>

                <div className="prose-doc mt-12">
                    <ReactMarkdown remarkPlugins={[remarkGfm]}>{doc}</ReactMarkdown>
                </div>
            </main>
        </div>
    );
}
