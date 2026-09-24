"use client";

import {useLocale, useTranslations} from "next-intl";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import {Link} from "@/common/i18n/navigation";
import {ArrowLeft} from "lucide-react";

const docZh = `# 静态导出（output: 'export'）与 src/middleware.ts 的关系

## 一句话结论

\`output: 'export'\`（静态导出）**不支持 middleware**。要做静态导出，必须删除 \`src/middleware.ts\`，并把它的职责（locale 校验、前缀剥离、根路径重定向）改由 \`generateStaticParams\`、\`setRequestLocale\`、\`localePrefix: 'always'\` 和 nginx 重定向来接管。

## 背景：middleware 在普通模式下的作用

在非静态模式下，\`src/middleware.ts\` 用 next-intl 的 \`createMiddleware(routing)\` 做 i18n 路由，核心职责有三：

1. **locale 检测与校验**：根据 URL 判断语言，非法 locale 走 404。
2. **前缀剥离（as-needed）**：当 \`localePrefix: 'as-needed'\` 时，默认语言（如 zh）的 URL 不带前缀，middleware 在运行时把 \`/zh/project-config\` 与 \`/project-config\` 视为同一路由。
3. **根路径重定向**：访问 \`/\` 时重定向到默认语言路径。

关键点：**这些都是在 Node 边缘运行时里动态完成的**。

## 为什么静态导出不支持 middleware

- \`output: 'export'\` 会把 \`next build\` 的产物变成纯静态文件（\`out/\` 目录），交给 nginx 等静态服务器直接托管，**没有 Node 运行时**。
- middleware 运行在边缘/服务器运行时，依赖请求时动态执行。静态文件里没有地方运行这段逻辑。
- 因此 Next.js 在 \`output: 'export'\` 下会忽略（或直接报错）middleware。

## as-needed 与静态导出的根本矛盾

即使强行保留 middleware 也无济于事，因为 \`localePrefix: 'as-needed'\` 本身就和静态导出冲突：

- \`as-needed\` 依赖运行时把默认语言的前缀去掉，让 \`/project-config\` 等价于 \`/zh/project-config\`。
- 静态导出靠 \`generateStaticParams\` 预生成路由，只会产出 \`/en/*\`、\`/zh/*\` 这些带前缀的页面。
- 无前缀的 \`/\`、\`/project-config\` 根本不会被生成 → 访问即 404。

实测：\`generateStaticParams\` 返回 \`['en', 'zh']\` 后，\`out/\` 里只有 \`en/\` 和 \`zh/\` 两个目录，没有根 \`index.html\`。

## 静态导出下的替代方案（职责对照）

| middleware 原职责 | 静态导出下的替代 |
|-------------------|------------------|
| locale 校验（非法 404） | \`[locale]/layout.tsx\` 里 \`hasLocale\` + \`notFound()\` |
| 前缀剥离（as-needed） | 改为 \`localePrefix: 'always'\`，所有路由固定带前缀 |
| 预生成所有路由 | \`[locale]/layout.tsx\` 的 \`generateStaticParams()\` |
| 根路径 \`/\` 重定向 | nginx \`location = / { return 301 /zh/; }\` |
| locale 静态渲染标记 | \`setRequestLocale(locale)\` |

## 落地改动清单

在 \`react-next-admin\` 里把构建切换到静态导出，需要：

1. \`next.config.ts\` 增加 \`output: "export"\`（可选 \`trailingSlash: true\`）。
2. **删除 \`src/middleware.ts\`**。
3. \`src/i18n/routing.ts\` 把 \`localePrefix: 'as-needed'\` 改成 \`'always'\`。
4. 页面里用到 \`useSearchParams()\` 的地方用 \`<Suspense>\` 包裹（静态预渲染要求）。
5. \`[locale]/layout.tsx\` 保留 \`generateStaticParams\` + \`setRequestLocale\` + \`hasLocale\` 校验。
6. 部署时由 nginx 处理根路径重定向。

> 注意：删除 middleware 后 \`next start\` 也不再适用；本地预览 \`out/\` 用任意静态服务器（如 \`npx serve out\`）。
`;

const docEn = `# Static Export (output: 'export') and src/middleware.ts

## TL;DR

\`output: 'export'\` (static export) **does not support middleware**. To enable static export you must remove \`src/middleware.ts\` and hand its responsibilities (locale validation, prefix stripping, root redirect) over to \`generateStaticParams\`, \`setRequestLocale\`, \`localePrefix: 'always'\`, and an nginx redirect.

## What middleware does in normal mode

In non-static mode, \`src/middleware.ts\` uses next-intl's \`createMiddleware(routing)\` for i18n routing. It has three core jobs:

1. **Locale detection & validation** — derive the language from the URL, 404 for invalid locales.
2. **Prefix stripping (as-needed)** — with \`localePrefix: 'as-needed'\`, the default locale (e.g. zh) has no prefix; middleware treats \`/zh/project-config\` and \`/project-config\` as the same route at runtime.
3. **Root redirect** — redirect \`/\` to the default-locale path.

Key point: **all of this happens dynamically in the Node edge runtime**.

## Why static export can't run middleware

- \`output: 'export'\` turns \`next build\` output into pure static files (\`out/\`) served directly by nginx — **there is no Node runtime**.
- Middleware runs in the edge/server runtime and needs request-time execution. There is no place for that logic in static files.
- So Next.js ignores (or errors on) middleware when \`output: 'export'\` is set.

## The fundamental conflict: as-needed vs static export

Even keeping middleware wouldn't help, because \`localePrefix: 'as-needed'\` itself conflicts with static export:

- \`as-needed\` relies on the runtime to strip the default locale's prefix, making \`/project-config\` equivalent to \`/zh/project-config\`.
- Static export pre-generates routes via \`generateStaticParams\`, which only emits prefixed pages (\`/en/*\`, \`/zh/*\`).
- The unprefixed \`/\` and \`/project-config\` are never generated → they 404.

Verified: after \`generateStaticParams\` returns \`['en', 'zh']\`, \`out/\` contains only \`en/\` and \`zh/\` directories — no root \`index.html\`.

## Static-export replacements (responsibility map)

| Middleware responsibility | Static-export replacement |
|---------------------------|---------------------------|
| Locale validation (404) | \`hasLocale\` + \`notFound()\` in \`[locale]/layout.tsx\` |
| Prefix stripping (as-needed) | switch to \`localePrefix: 'always'\` |
| Pre-generate routes | \`generateStaticParams()\` in \`[locale]/layout.tsx\` |
| Root \`/\` redirect | nginx \`location = / { return 301 /zh/; }\` |
| Mark locale for static rendering | \`setRequestLocale(locale)\` |

## Checklist to switch the build to static export

In \`react-next-admin\`:

1. Add \`output: "export"\` (optionally \`trailingSlash: true\`) to \`next.config.ts\`.
2. **Delete \`src/middleware.ts\`.**
3. Change \`localePrefix: 'as-needed'\` to \`'always'\` in \`src/i18n/routing.ts\`.
4. Wrap \`useSearchParams()\` usages in \`<Suspense>\` (required for static prerendering).
5. Keep \`generateStaticParams\` + \`setRequestLocale\` + \`hasLocale\` in \`[locale]/layout.tsx\`.
6. Let nginx handle the root redirect at deploy time.

> Note: after removing middleware, \`next start\` no longer applies; preview \`out/\` with any static server (e.g. \`npx serve out\`).
`;

export default function I18nStaticExportPage() {
    const t = useTranslations("example.I18nStaticExport");
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

                <div className="prose-doc mt-12">
                    <ReactMarkdown remarkPlugins={[remarkGfm]}>{doc}</ReactMarkdown>
                </div>
            </main>
        </div>
    );
}
