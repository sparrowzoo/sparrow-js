"use client";

import {useLocale, useTranslations} from "next-intl";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import {Link} from "@/common/i18n/navigation";
import {ArrowLeft} from "lucide-react";

const docZh = `# 编译报错根因分析：react-next-admin vs common

## 现象

同一份源码 \`src/common/lib/table/DataTableProperty.ts\`，在 \`react-next-admin\` 项目里 \`next build\` 报两条错误，而在 \`common\` 项目里却编译正常：

\`\`\`text
6:17   Error: 'PagerResult' is defined but never used.  @typescript-eslint/no-unused-vars
33:14  Error: The \`{}\` ("empty object") type allows any non-nullish value...
\`\`\`

## 根因总结

关键点：**两个项目里的这份文件是同一份源码**，差异不在代码，而在各自的 ESLint 配置。

\`react-next-admin/package.json\` 里有一个拷贝脚本，把 \`common\` 的共享目录同步进本项目：

\`\`\`json
"copy": "cpy ./../common/src/common ./src/ --parents"
\`\`\`

所以 \`react-next-admin/src/common\` 是从 \`common/src/common\` 拷贝来的，代码完全一致。报错差异源于两个项目用了不同的 ESLint 预设：

| 项目 | eslint.config.mjs extends | 是否启用 TS 严格规则 |
|------|---------------------------|---------------------|
| react-next-admin | \`next/core-web-vitals\` + \`next/typescript\` | 是 |
| common | \`next\` | 否 |

其中 \`next/typescript\` 展开后就是 \`plugin:@typescript-eslint/recommended\`，它打开了两条规则，正好对应两条报错：

1. \`@typescript-eslint/no-unused-vars\` → \`PagerResult\` 被 import 却未使用
2. \`@typescript-eslint/ban-types\` → \`parent?: {}\` 里的空对象类型 \`{}\`

而 \`common\` 只 extends \`next\`，没有 \`next/typescript\`，这两条规则根本没开启，自然不报错。

## 与编译的关系

这两条报错是 **ESLint 规则错误，不是 TypeScript（tsc）类型错误**。

\`next build\` 在构建阶段会先运行 ESLint；当规则级别为 \`error\` 时，lint 失败会直接中断构建，所以对外表现为「编译报错」。也就是说：

- TypeScript 类型系统本身并不认为这两个地方有错（\`{}\` 是合法类型，未使用的命名 import 也不影响类型检查）；
- 是 ESLint 的静态检查把问题抬到了 \`error\` 级别，进而卡住了 \`next build\`。

## 修复建议

- **根治源码**（推荐）：删除未使用的 \`PagerResult\` import；把 \`parent?: {}\` 改为 \`parent?: object\`（或更具体的类型）。
- **统一配置**：让两个项目的 ESLint 预设一致——要么都 extends \`next/typescript\` 并修源码，要么都在 \`common\` 侧显式关闭这两条规则。

> 注意：\`react-next-admin/src/common\` 是拷贝产物，直接改它会在下次 \`npm run copy\` 时被覆盖；正确的修改位置是 \`common/src/common\`（源头），改完再执行 copy 同步。
`;

const docEn = `# Compile Error Root Cause: react-next-admin vs common

## Symptom

The same source file \`src/common/lib/table/DataTableProperty.ts\` produces two errors in \`react-next-admin\` during \`next build\`, while \`common\` compiles fine:

\`\`\`text
6:17   Error: 'PagerResult' is defined but never used.  @typescript-eslint/no-unused-vars
33:14  Error: The \`{}\` ("empty object") type allows any non-nullish value...
\`\`\`

## Root Cause

Key point: **the file is identical in both projects** — the difference is not in the code but in each project's ESLint config.

\`react-next-admin/package.json\` has a copy script that syncs \`common\`'s shared directory into this project:

\`\`\`json
"copy": "cpy ./../common/src/common ./src/ --parents"
\`\`\`

So \`react-next-admin/src/common\` is copied from \`common/src/common\` and the code is exactly the same. The error difference comes from the two projects using different ESLint presets:

| Project | eslint.config.mjs extends | TS strict rules enabled |
|---------|---------------------------|-------------------------|
| react-next-admin | \`next/core-web-vitals\` + \`next/typescript\` | Yes |
| common | \`next\` | No |

\`next/typescript\` expands to \`plugin:@typescript-eslint/recommended\`, which turns on two rules matching the two errors:

1. \`@typescript-eslint/no-unused-vars\` → \`PagerResult\` is imported but never used
2. \`@typescript-eslint/ban-types\` → the empty object type \`{}\` in \`parent?: {}\`

\`common\` only extends \`next\` (without \`next/typescript\`), so these rules are never enabled and no error appears.

## Relationship to Compilation

Both errors are **ESLint rule errors, not TypeScript (tsc) type errors**.

\`next build\` runs ESLint during the build phase; when a rule is at the \`error\` level, a lint failure aborts the build — which is why it surfaces as a "compile error". In other words:

- The TypeScript type system does not consider either spot an error (\`{}\` is a legal type, and an unused named import does not affect type checking);
- It is ESLint's static check that escalates them to \`error\`, which then blocks \`next build\`.

## Fix Suggestions

- **Fix the source** (recommended): remove the unused \`PagerResult\` import; change \`parent?: {}\` to \`parent?: object\` (or a more specific type).
- **Align the configs**: make both projects use the same ESLint preset — either both extend \`next/typescript\` and fix the source, or explicitly disable these two rules on the \`common\` side.

> Note: \`react-next-admin/src/common\` is a copy artifact; editing it directly will be overwritten on the next \`npm run copy\`. The correct place to fix is \`common/src/common\` (the source), then run the copy to sync.
`;

export default function LinkConfigPage() {
    const t = useTranslations("LinkConfig");
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
