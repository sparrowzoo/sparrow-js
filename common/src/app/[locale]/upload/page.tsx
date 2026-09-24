"use client";

import {useState} from "react";
import {useLocale, useTranslations} from "next-intl";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import FileUploader from "@/common/components/file/FileUploader";
import {Link} from "@/common/i18n/navigation";
import {UPLOAD_URL} from "@/common/lib/Env";
import {ArrowLeft, CheckCircle2, UploadCloud} from "lucide-react";

const docZh = `# FileUploader 文件上传组件使用说明

## 概述

\`FileUploader\` 是通用文件上传组件，封装了「选择文件 → 携带 token 上传 → 进度回调 → 结果回调」的完整流程。

- **位置**：\`src/common/components/file/FileUploader.tsx\`
- **技术栈**：React（客户端组件）+ axios + react-hot-toast + next-intl

## 快速开始

\`\`\`tsx
import FileUploader from "@/common/components/file/FileUploader";
import {UPLOAD_URL} from "@/common/lib/Env";

<FileUploader
    url={UPLOAD_URL}
    uploadCallback={(url, fileName) => console.log(url, fileName)}
    uploadIcon={<button>上传</button>}
    id="my-uploader"
/>
\`\`\`

## 环境变量

上传地址由环境变量 **NEXT_PUBLIC_UPLOAD_URL** 配置，代码通过 \`Env.ts\` 统一读取。

| 环境 | 配置值 |
|------|--------|
| development | \`http://localhost:8888/upload.json\` |
| production | http://api.sparrowzoo.com/upload.json |

> 前缀 \`NEXT_PUBLIC_\` 必须保留，Next.js 只会把带该前缀的变量内联到客户端。

## Props

| Prop | 类型 | 必填 | 默认值 | 说明 |
|------|------|------|--------|------|
| url | string | 是 | - | 上传接口地址 |
| uploadCallback | (url, fileName) => void | 是 | - | 成功回调 |
| uploadIcon | ReactNode | 是 | - | 触发上传的图标 |
| id | string | 是 | - | input 唯一 id |
| pathType | string | 否 | "im" | 上传路径类型 |

## 上传流程

1. 点击 uploadIcon 触发文件选择
2. 校验文件（空则提示「请选择文件」）
3. 组装 FormData（file + pathType）
4. 从 CrosStorage 获取 token
5. axios POST 上传，实时上报进度
6. 判断 result.code（非 "0" 则提示错误）
7. 成功则回调 uploadCallback
8. 复位 uploading 与 progress

## 返回结构 Result

\`\`\`ts
interface Result {
    code: string;      // "0" 表示成功
    message?: string;  // 失败提示
    data: any;         // 文件地址等业务数据
}
\`\`\`

## 国际化

| Key | 中文 | 英文 |
|-----|------|------|
| select-file | 请选择文件 | Please select a file |
| upload-success | 上传成功 | Upload successful |
| upload-failed | 上传失败: {message} | Upload failed: {message} |
`;

const docEn = `# FileUploader Usage Guide

## Overview

\`FileUploader\` is a reusable upload component that wraps the full flow: select file → upload with token → progress → callback.

- **Location**: \`src/common/components/file/FileUploader.tsx\`
- **Stack**: React (client) + axios + react-hot-toast + next-intl

## Quick Start

\`\`\`tsx
import FileUploader from "@/common/components/file/FileUploader";
import {UPLOAD_URL} from "@/common/lib/Env";

<FileUploader
    url={UPLOAD_URL}
    uploadCallback={(url, fileName) => console.log(url, fileName)}
    uploadIcon={<button>Upload</button>}
    id="my-uploader"
/>
\`\`\`

## Environment Variables

The upload URL is configured via **NEXT_PUBLIC_UPLOAD_URL**, read from \`Env.ts\`.

| Environment | Value |
|-------------|-------|
| development | \`http://localhost:8888/upload.json\` |
| production | http://api.sparrowzoo.com/upload.json |

> The \`NEXT_PUBLIC_\` prefix is required; Next.js only inlines prefixed vars to the client.

## Props

| Prop | Type | Required | Default | Description |
|------|------|----------|---------|-------------|
| url | string | Yes | - | Upload endpoint |
| uploadCallback | (url, fileName) => void | Yes | - | Success callback |
| uploadIcon | ReactNode | Yes | - | Trigger icon |
| id | string | Yes | - | Unique input id |
| pathType | string | No | "im" | Upload path type |

## Upload Flow

1. Click uploadIcon to open the file picker
2. Validate file (empty → toast "select-file")
3. Build FormData (file + pathType)
4. Get token from CrosStorage
5. axios POST with live progress
6. Check result.code (non-"0" → error toast)
7. On success, invoke uploadCallback
8. Reset uploading & progress

## Result Type

\`\`\`ts
interface Result {
    code: string;      // "0" means success
    message?: string;  // error message
    data: any;         // business data (file url etc.)
}
\`\`\`

## i18n

| Key | zh | en |
|-----|----|----|
| select-file | 请选择文件 | Please select a file |
| upload-success | 上传成功 | Upload successful |
| upload-failed | 上传失败: {message} | Upload failed: {message} |
`;

export default function UploadExamplePage() {
    const t = useTranslations("example.UploadExample");
    const locale = useLocale();
    const [result, setResult] = useState<{url: string; fileName: string} | null>(null);
    const doc = locale === "zh" ? docZh : docEn;

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

                <div className="mt-8">
                    <FileUploader
                        url={UPLOAD_URL}
                        uploadCallback={(url, fileName) => setResult({url, fileName})}
                        uploadIcon={
                            <span className="flex flex-col items-center gap-3 rounded-2xl border border-dashed border-border bg-card p-12 transition-colors hover:border-violet-500/50 hover:bg-violet-500/5">
                                <UploadCloud className="h-10 w-10 text-violet-500"/>
                                <span className="text-sm text-muted-foreground">{t("upload-hint")}</span>
                            </span>
                        }
                        id="upload-example"
                    />
                </div>

                {result && (
                    <div className="mt-6 rounded-2xl border border-border bg-card p-6">
                        <div className="flex items-center gap-2 text-emerald-500">
                            <CheckCircle2 className="h-5 w-5"/>
                            <span className="font-medium">{t("success")}</span>
                        </div>
                        <div className="mt-4 space-y-3 text-sm">
                            <div>
                                <div className="text-muted-foreground">{t("file-name")}</div>
                                <code className="mt-1 block break-all rounded bg-muted px-2 py-1 font-mono">{result.fileName}</code>
                            </div>
                            <div>
                                <div className="text-muted-foreground">{t("file-url")}</div>
                                <code className="mt-1 block break-all rounded bg-muted px-2 py-1 font-mono">{result.url}</code>
                            </div>
                        </div>
                    </div>
                )}

                <div className="mt-6 rounded-2xl border border-border bg-card p-6">
                    <h2 className="text-lg font-semibold">{t("config-title")}</h2>
                    <div className="mt-4 space-y-2 text-sm text-muted-foreground">
                        <div className="flex flex-wrap items-center gap-2">
                            <span className="w-28 shrink-0">NEXT_PUBLIC_UPLOAD_URL</span>
                            <code className="break-all rounded bg-muted px-2 py-1 font-mono">{UPLOAD_URL}</code>
                        </div>
                        <div className="flex flex-wrap items-center gap-2">
                            <span className="w-28 shrink-0">pathType</span>
                            <code className="rounded bg-muted px-2 py-1 font-mono">im</code>
                        </div>
                    </div>
                </div>

                <div className="prose-doc mt-12">
                    <ReactMarkdown remarkPlugins={[remarkGfm]}>{doc}</ReactMarkdown>
                </div>
            </main>
        </div>
    );
}
