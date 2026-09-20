"use client";

import {useMemo} from "react";
import {useLocale, useTranslations} from "next-intl";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import AccessHistories from "@/common/components/access-histories";
import {AdminContext, AdminContextValue} from "@/common/lib/admin/AdminContextProvider";
import AdminBroker from "@/common/lib/admin/AdminBroker";
import AccessHistoryContainer from "@/common/lib/admin/AccessHistoryContainer";
import {Link} from "@/common/i18n/navigation";
import {ArrowLeft, MousePointerClick} from "lucide-react";

const docZh = `# AccessHistories 访问历史组件使用说明

## 概述

\`AccessHistories\` 是「最近访问」面包屑组件，通常放在侧边栏触发按钮旁边，展示用户最近访问过的管理菜单页面（最多 20 条）。点击胶囊跳转页面，点 × 移除单条，点垃圾桶一键清空。

- **位置**：\`src/common/components/access-histories.tsx\`
- **技术栈**：React（客户端组件）+ next-intl + shadcn/ui（Tooltip / Sidebar）

## 数据流

\`\`\`
AccessLog（单条记录）
  └─ AccessHistoryContainer（存取/排序/删除/清空）
       └─ AdminBroker（业务代理 + 变更订阅）
            └─ AdminContext（React Context）
                 └─ AccessHistories（UI 消费）
\`\`\`

## 快速开始

\`\`\`tsx
import {useMemo} from "react";
import AccessHistories from "@/common/components/access-histories";
import {AdminContext, AdminContextValue} from "@/common/lib/admin/AdminContextProvider";
import AdminBroker from "@/common/lib/admin/AdminBroker";
import AccessHistoryContainer from "@/common/lib/admin/AccessHistoryContainer";

// 1. 全量菜单表：url -> 标题
const MENU = new Map<string, string>([
    ["/dashboard", "仪表盘"],
    ["/users", "用户管理"],
]);

// 2. 构建 broker 与 Context（每个应用只建一次）
const {broker, contextValue} = useMemo(() => {
    const container = new AccessHistoryContainer(MENU);
    const b = new AdminBroker(container);
    return {broker: b, contextValue: AdminContextValue.create(b)};
}, []);

// 3. 用 Provider 包裹，渲染组件
<AdminContext.Provider value={contextValue}>
    <AccessHistories />
</AdminContext.Provider>

// 4. 页面跳转时记录访问（内部会触发订阅刷新）
broker.access("/users", router);
\`\`\`

> 组件通过 \`AdminBroker.subscribe()\` 订阅变更，增删/清空后自动刷新，无需手动 setState。

## Props

| Prop | 类型 | 必填 | 默认值 | 说明 |
|------|------|------|--------|------|
| showSidebarTrigger | boolean | 否 | true | 是否渲染左侧 SidebarTrigger 与分隔线；独立使用时设为 false |

## AdminBroker API

| 方法 | 说明 |
|------|------|
| access(url, router) | 记录一次访问并 \`router.push(url)\` |
| deleteHistory(url) | 移除单条历史 |
| clearHistory() | 清空全部历史 |
| subscribe(listener) | 订阅变更，返回取消订阅函数 |

## AccessHistoryContainer API

| 方法 | 说明 |
|------|------|
| getAccessHistories() | 按访问时间倒序返回记录副本 |
| access(url) | 新增或更新时间戳（超过 20 条时移除最旧） |
| delete(url) | 按 url 移除 |
| clear() | 清空 |

## 国际化

| Key | 中文 | 英文 |
|-----|------|------|
| label | 访问历史 | History |
| empty | 暂无记录 | No history |
| remove | 移除 | Remove |
| clear-all | 清空全部 | Clear all |
`;

const docEn = `# AccessHistories Usage Guide

## Overview

\`AccessHistories\` is a "recently visited" breadcrumb component, usually placed next to the sidebar trigger. It shows the admin pages the user recently visited (up to 20). Click a chip to navigate, the × to remove one entry, and the trash icon to clear all.

- **Location**: \`src/common/components/access-histories.tsx\`
- **Stack**: React (client) + next-intl + shadcn/ui (Tooltip / Sidebar)

## Data Flow

\`\`\`
AccessLog (single entry)
  └─ AccessHistoryContainer (store/sort/delete/clear)
       └─ AdminBroker (business proxy + change subscription)
            └─ AdminContext (React Context)
                 └─ AccessHistories (UI consumer)
\`\`\`

## Quick Start

\`\`\`tsx
import {useMemo} from "react";
import AccessHistories from "@/common/components/access-histories";
import {AdminContext, AdminContextValue} from "@/common/lib/admin/AdminContextProvider";
import AdminBroker from "@/common/lib/admin/AdminBroker";
import AccessHistoryContainer from "@/common/lib/admin/AccessHistoryContainer";

// 1. Full menu map: url -> title
const MENU = new Map<string, string>([
    ["/dashboard", "Dashboard"],
    ["/users", "Users"],
]);

// 2. Build broker & context (once per app)
const {broker, contextValue} = useMemo(() => {
    const container = new AccessHistoryContainer(MENU);
    const b = new AdminBroker(container);
    return {broker: b, contextValue: AdminContextValue.create(b)};
}, []);

// 3. Wrap with Provider and render
<AdminContext.Provider value={contextValue}>
    <AccessHistories />
</AdminContext.Provider>

// 4. Record a visit on navigation (triggers auto refresh)
broker.access("/users", router);
\`\`\`

> The component subscribes via \`AdminBroker.subscribe()\`, so add/remove/clear auto-refresh — no manual setState needed.

## Props

| Prop | Type | Required | Default | Description |
|------|------|----------|---------|-------------|
| showSidebarTrigger | boolean | No | true | Render the leading SidebarTrigger + divider; set to false when used standalone |

## AdminBroker API

| Method | Description |
|--------|-------------|
| access(url, router) | Record a visit and \`router.push(url)\` |
| deleteHistory(url) | Remove one entry |
| clearHistory() | Clear all entries |
| subscribe(listener) | Subscribe to changes, returns an unsubscribe fn |

## AccessHistoryContainer API

| Method | Description |
|--------|-------------|
| getAccessHistories() | Return a copy sorted by visit time (desc) |
| access(url) | Add or refresh the timestamp (drops oldest past 20) |
| delete(url) | Remove by url |
| clear() | Clear all |

## i18n

| Key | zh | en |
|-----|----|----|
| label | 访问历史 | History |
| empty | 暂无记录 | No history |
| remove | 移除 | Remove |
| clear-all | 清空全部 | Clear all |
`;

export default function AccessHistoriesExamplePage() {
    const t = useTranslations("AccessHistoriesExample");
    const locale = useLocale();
    const doc = locale === "zh" ? docZh : docEn;

    const demoMenu = useMemo(() => {
        return locale === "zh"
            ? new Map<string, string>([
                  ["/", "首页"],
                  ["/upload", "文件上传"],
                  ["/forms", "表单组件"],
              ])
            : new Map<string, string>([
                  ["/", "Home"],
                  ["/upload", "File Upload"],
                  ["/forms", "Form Components"],
              ]);
    }, [locale]);

    const {broker, contextValue} = useMemo(() => {
        const container = new AccessHistoryContainer(demoMenu);
        const b = new AdminBroker(container);
        return {broker: b, contextValue: AdminContextValue.create(b)};
    }, [demoMenu]);

    return (
        <div className="relative min-h-screen bg-background text-foreground">
            <div aria-hidden className="pointer-events-none absolute inset-0 -z-10">
                <div className="absolute -top-40 left-1/2 h-[420px] w-[640px] -translate-x-1/2 rounded-full bg-gradient-to-r from-violet-500/15 via-cyan-400/15 to-fuchsia-500/15 blur-[120px]"/>
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

                <div className="mt-8 rounded-2xl border border-border bg-card p-6">
                    <h2 className="text-lg font-semibold">{t("demo-title")}</h2>
                    <p className="mt-2 text-sm text-muted-foreground">{t("demo-desc")}</p>

                    <AdminContext.Provider value={contextValue}>
                        <div className="mt-4 flex items-center gap-3 rounded-xl border border-border bg-background px-3 py-2">
                            <AccessHistories showSidebarTrigger={false}/>
                        </div>

                        <div className="mt-4 flex flex-wrap items-center gap-2">
                            {[...demoMenu.entries()].map(([url, title]) => (
                                <button
                                    key={url}
                                    type="button"
                                    onClick={() => broker.access(url, {push: () => {}})}
                                    className="inline-flex items-center gap-1.5 rounded-full border border-border bg-background px-4 py-1.5 text-xs font-medium transition-colors hover:border-violet-500/40 hover:bg-accent hover:text-violet-600 dark:hover:text-violet-300"
                                >
                                    <MousePointerClick className="h-3.5 w-3.5"/>
                                    {title}
                                </button>
                            ))}
                        </div>
                    </AdminContext.Provider>
                </div>

                <div className="prose-doc mt-12">
                    <ReactMarkdown remarkPlugins={[remarkGfm]}>{doc}</ReactMarkdown>
                </div>
            </main>
        </div>
    );
}
