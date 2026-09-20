"use client";

import {useState} from "react";
import {useLocale, useTranslations} from "next-intl";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import {Link} from "@/common/i18n/navigation";
import {ArrowLeft} from "lucide-react";
import {Button} from "@/components/ui/button";
import {Input} from "@/components/ui/input";
import ErrorShower from "@/common/components/Error";
import ErrorMessage from "@/common/components/i18n/ErrorMessage";

const docZh = `# 错误信息（Error / ErrorMessage）使用说明

## 概述

项目的错误提示分四类场景：

| 场景 | 实现 | 说明 |
|------|------|------|
| 表单校验 | \`ErrorMessage\` 组件 | 校验失败显示红字、通过显示绿勾 |
| 全屏错误页 | \`ErrorShower\` 组件（\`Error.tsx\`） | 波浪动画的 ERROR 展示 |
| 接口错误 | \`Fetcher\` + \`Result\` + toast | \`code\` 非 \`"0"\` 时 toast 弹出翻译后的 message |
| 错误码文案 | \`ErrorMessage\` 消息命名空间 | error key → 多语言文案映射 |

---

## ErrorMessage —— 表单校验提示

受控的校验提示组件，配合 react-hook-form 的 \`errors\` / \`isSubmitted\` 使用。

\`\`\`tsx
import ErrorMessage from "@/common/components/i18n/ErrorMessage";

<ErrorMessage message={errors.userName?.message} submitted={isSubmitted} />
\`\`\`

| Prop | 类型 | 必填 | 说明 |
|------|------|------|------|
| message | string | 否 | 错误文案；有值则显示红字 |
| submitted | boolean | 是 | 是否已提交；无错误且已提交时显示绿勾 |
| messageClass | string | 否 | 错误文字样式，默认 \`text-red-600\` |
| rightClass | string | 否 | 绿勾样式，默认 \`text-red-600\` |

**渲染逻辑**：有 \`message\` → 红字；无 \`message\` 且 \`submitted\` → 绿勾；否则返回空。

---

## ErrorShower —— 波浪 ERROR 动画

\`Error.tsx\` 导出的全屏错误展示组件，用 \`motion-plus\` 的 \`splitText\` 把 "ERROR" 拆成字符做波浪起伏动画。

\`\`\`tsx
import ErrorShower from "@/common/components/Error";

<ErrorShower error="404 Not Found" />
\`\`\`

| Prop | 类型 | 必填 | 说明 |
|------|------|------|------|
| error | string | 是 | 展示的错误文案 |

**依赖**：\`motion\` + \`motion-plus\`（\`splitText\`）。样式通过组件内 \`<style>\` 注入。

---

## Result —— 接口返回协议

\`Fetcher\` 统一按 \`Result\` 结构解析响应，\`code\` 非 \`"0"\` 即视为业务错误。

\`\`\`ts
interface Result {
    code: string;       // "0" 表示成功
    message?: string;   // 错误文案（未翻译时使用）
    data: any;          // 业务数据
    key?: string;       // 错误码 key（用于多语言翻译）
    instruction?: string;
}
\`\`\`

\`Fetcher\` 内部逻辑（简化）：

\`\`\`ts
const result = await response.json() as Result;
if (result.code != "0") {
    const message = translator ? translator(result.key) : result.message;
    toast.error(message);  // react-hot-toast 弹出
}
\`\`\`

即：优先用 \`result.key\` 查 \`ErrorMessage\` 命名空间翻译，查不到再回退到 \`result.message\`。

---

## ErrorMessage 消息命名空间

\`messages/default/{locale}.json\` 中的 \`ErrorMessage\` 命名空间存放错误码 → 文案映射，服务端返回的 \`key\` 会作为翻译 key 传入 \`translator\`。

| key | 中文 |
|-----|------|
| system_server_error | 系统错误，请稍侯再试... |
| global_parameter_null | 参数不能为空... |
| class_not_found | 找不到类... |

> 新增错误码时，在服务端约定好 \`key\`，并在 \`en.json\` / \`zh.json\` 的 \`ErrorMessage\` 命名空间里同步补充对应文案。
`;

const docEn = `# Error Message (Error / ErrorMessage) Usage Guide

## Overview

Error feedback in the project falls into four scenarios:

| Scenario | Implementation | Notes |
|----------|----------------|-------|
| Form validation | \`ErrorMessage\` component | Red text on error, green check when valid |
| Full-screen error page | \`ErrorShower\` component (\`Error.tsx\`) | Wavy-animated ERROR display |
| API error | \`Fetcher\` + \`Result\` + toast | Shows a translated \`toast.error\` when \`code != "0"\` |
| Error copy | \`ErrorMessage\` message namespace | error key → localized copy mapping |

---

## ErrorMessage — form validation hint

A controlled validation hint, wired to react-hook-form's \`errors\` / \`isSubmitted\`.

\`\`\`tsx
import ErrorMessage from "@/common/components/i18n/ErrorMessage";

<ErrorMessage message={errors.userName?.message} submitted={isSubmitted} />
\`\`\`

| Prop | Type | Required | Description |
|------|------|----------|-------------|
| message | string | No | Error copy; shows red text when set |
| submitted | boolean | Yes | Whether submitted; shows a green check when valid and submitted |
| messageClass | string | No | Error text class, default \`text-red-600\` |
| rightClass | string | No | Green check class, default \`text-red-600\` |

**Render logic**: has \`message\` → red text; no \`message\` and \`submitted\` → green check; otherwise empty.

---

## ErrorShower — wavy ERROR animation

The full-screen error component exported from \`Error.tsx\`; it splits "ERROR" into characters with \`motion-plus\`'s \`splitText\` and animates them in a wave.

\`\`\`tsx
import ErrorShower from "@/common/components/Error";

<ErrorShower error="404 Not Found" />
\`\`\`

| Prop | Type | Required | Description |
|------|------|----------|-------------|
| error | string | Yes | The error copy to display |

**Dependencies**: \`motion\` + \`motion-plus\` (\`splitText\`). Styles are injected via an inline \`<style>\`.

---

## Result — API response protocol

\`Fetcher\` parses every response as a \`Result\`; any \`code\` other than \`"0"\` is treated as a business error.

\`\`\`ts
interface Result {
    code: string;       // "0" means success
    message?: string;   // error copy (used when not translated)
    data: any;          // business payload
    key?: string;       // error key (for i18n)
    instruction?: string;
}
\`\`\`

\`Fetcher\` logic (simplified):

\`\`\`ts
const result = await response.json() as Result;
if (result.code != "0") {
    const message = translator ? translator(result.key) : result.message;
    toast.error(message);  // react-hot-toast
}
\`\`\`

So it first looks up \`result.key\` in the \`ErrorMessage\` namespace, then falls back to \`result.message\`.

---

## ErrorMessage message namespace

The \`ErrorMessage\` namespace in \`messages/default/{locale}.json\` maps error keys to copy; the server-returned \`key\` is passed to \`translator\`.

| key | English (example) |
|-----|-------------------|
| system_server_error | System error, please retry later... |
| global_parameter_null | Parameter must not be empty... |
| class_not_found | Class not found... |

> When adding a new error, agree on a \`key\` on the server and add matching copy to \`en.json\` / \`zh.json\` under \`ErrorMessage\`.
`;

export default function ErrorExamplePage() {
    const t = useTranslations("ErrorExample");
    const locale = useLocale();
    const doc = locale === "zh" ? docZh : docEn;

    const [name, setName] = useState("");
    const [submitted, setSubmitted] = useState(false);

    const validate = () => setSubmitted(true);
    const hasError = submitted && name.trim() === "";

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

                {/* ErrorShower */}
                <section className="mt-10 rounded-2xl border border-border bg-card p-6">
                    <h2 className="text-lg font-semibold">{t("shower-title")}</h2>
                    <p className="mt-1 text-sm text-muted-foreground">{t("shower-desc")}</p>

                    <div className="mt-5 rounded-xl border border-border bg-muted/30 p-6">
                        <ErrorShower error="404 Not Found"/>
                    </div>
                </section>

                {/* ErrorMessage */}
                <section className="mt-6 rounded-2xl border border-border bg-card p-6">
                    <h2 className="text-lg font-semibold">{t("message-title")}</h2>
                    <p className="mt-1 text-sm text-muted-foreground">{t("message-desc")}</p>

                    <div className="mt-5 flex flex-wrap items-center gap-3">
                        <Input
                            className="w-56"
                            value={name}
                            placeholder={t("input-label")}
                            onChange={(e) => {
                                setName(e.target.value);
                                setSubmitted(false);
                            }}
                        />
                        <Button onClick={validate}>{t("validate-btn")}</Button>
                    </div>
                    <div className="mt-4 flex min-h-6 items-center text-sm">
                        {hasError
                            ? <ErrorMessage message={t("required-msg")} submitted={submitted}/>
                            : <ErrorMessage submitted={submitted}/>}
                        {!hasError && submitted && <span className="ml-2 text-muted-foreground">{t("valid-msg")}</span>}
                    </div>
                </section>

                <div className="prose-doc mt-12">
                    <ReactMarkdown remarkPlugins={[remarkGfm]}>{doc}</ReactMarkdown>
                </div>
            </main>
        </div>
    );
}
