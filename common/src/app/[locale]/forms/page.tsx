"use client";

import {useState} from "react";
import {useForm} from "react-hook-form";
import {useLocale, useTranslations} from "next-intl";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import {Link} from "@/common/i18n/navigation";
import {ArrowLeft} from "lucide-react";
import {ValidatableInput} from "@/common/components/forms/validatable-input";
import {ValidatableSelect} from "@/common/components/forms/validatable-select";
import {ValidatableDate} from "@/common/components/forms/validatable-date";
import {ValidatableTextarea} from "@/common/components/forms/validatable-textarea";
import SearchInput from "@/common/components/forms/search-input";
import SearchSelect from "@/common/components/forms/search-select";
import KeyValue from "@/common/lib/protocol/KeyValue";
import {Button} from "@/components/ui/button";

const genderDict: KeyValue[] = [
    {key: "NULL", value: "NULL"},
    {key: "MALE", value: "MALE"},
    {key: "FEMALE", value: "FEMALE"},
];

const statusDict: KeyValue[] = [
    {key: "ENABLE", value: "ENABLE"},
    {key: "DISABLE", value: "DISABLE"},
];

interface SearchCondition {
    username?: string;
    status?: string;
}

interface FormData {
    username: string;
    password: string;
    email: string;
    age: string;
    gender: string;
    birthday: string;
    description: string;
}

const docZh = `# 表单组件（components/forms）使用说明

## 概述

\`src/common/components/forms/\` 目录包含 6 个通用表单组件，基于 **react-hook-form** 与 **shadcn/ui** 构建，分为两大类：

- **校验表单组件**（配合 \`react-hook-form\` 的 \`register\` / \`setValue\`）：\`ValidatableInput\`、\`ValidatableSelect\`、\`ValidatableDate\`、\`ValidatableTextarea\`
- **表格搜索组件**（把条件写入搜索 state）：\`SearchInput\`、\`SearchSelect\`

> 两者都用 \`pageTranslate\` 翻译字段 label；下拉组件内部还会用 \`useTranslations("KVS")\` 翻译字典项的显示文本。

## ValidatableInput — 校验输入框

受控校验输入框，通过 \`forwardRef\` 配合 \`register("fieldName")\` 使用，\`{...register(...)}\` 会把 \`onChange\` / \`onBlur\` / \`name\` / \`ref\` 透传到内部 \`<input>\`。

\`\`\`tsx
import {ValidatableInput} from "@/common/components/forms/validatable-input";

const {register, formState: {errors, isSubmitted}} = useForm();

<ValidatableInput
    {...register("userName", {required: "必填"})}
    type="text"
    fieldPropertyName="userName"
    pageTranslate={pageTranslate}
    errorMessage={errors.userName?.message}
    isSubmitted={isSubmitted}
/>
\`\`\`

| Prop | 类型 | 必填 | 说明 |
|------|------|------|------|
| fieldPropertyName | string | 是 | 字段名（同时作为 label 翻译 key 与 input name） |
| type | "text" \| "password" \| "email" \| "number" \| "hidden" \| "label" | 是 | 输入类型；\`hidden\` 直接返回隐藏 input，\`label\` 渲染为只读 |
| pageTranslate | (key) => string | 否 | 字段 label 翻译函数 |
| validateTranslate | (key) => string | 否 | 校验文案翻译函数（供外层校验用） |
| errorMessage | string | 否 | 校验错误文案（一般取 \`errors.xxx?.message\`） |
| isSubmitted | boolean | 否 | 是否已提交，用于在合法字段后显示绿色对勾 |
| readonly | boolean | 否 | 是否只读 |

其余属性继承 \`React.InputHTMLAttributes\`（含 \`defaultValue\`、\`className\` 等）。

## ValidatableSelect — 校验下拉框

使用 \`setValue\` 而非 \`register\` 同步值，\`dictionary\` 传入 \`KeyValue[]\`；未命中默认值时会回退到字典第一项。

\`\`\`tsx
import {ValidatableSelect} from "@/common/components/forms/validatable-select";

<ValidatableSelect
    fieldPropertyName="gender"
    dictionary={dictionary}
    defaultValue={original.gender}
    setValue={setValue}
    pageTranslate={pageTranslate}
/>
\`\`\`

| Prop | 类型 | 必填 | 说明 |
|------|------|------|------|
| fieldPropertyName | string | 是 | 字段名 |
| dictionary | KeyValue[] | 是 | 下拉选项字典 |
| setValue | (name, value) => void | 是 | react-hook-form 的 setValue |
| defaultValue | any | 否 | 初始值（字典 key） |
| pageTranslate | (key) => string | 否 | 字段 label 翻译函数 |
| className | string | 否 | 触发器样式 |

\`KeyValue\` 定义：\`{ key: string; value: string }\`，\`key\` 为提交值，\`value\` 既是显示文本、也作为 KVS 翻译 key（\`KVS.<字段>.<value>\`），需与 messages 里的 KVS 键保持一致。

## ValidatableDate — 校验日期

基于 \`Calendar\` + \`Popover\` 的日期选择，内部用 \`dayjs\` 格式化，\`setValue\` 同步值；挂载时用 \`useEffect\` 写入默认值（默认今天）。

\`\`\`tsx
import {ValidatableDate} from "@/common/components/forms/validatable-date";

<ValidatableDate
    fieldPropertyName="birthday"
    defaultValue="1990-01-01"
    format="YYYY-MM-DD"
    setValue={setValue}
    pageTranslate={pageTranslate}
/>
\`\`\`

| Prop | 类型 | 必填 | 说明 |
|------|------|------|------|
| fieldPropertyName | string | 是 | 字段名 |
| setValue | (name, value) => void | 是 | 日期变化时回写 |
| defaultValue | string | 否 | 初始日期字符串，默认今天 |
| format | string | 否 | dayjs 格式，默认 \`YYYY-MM-DD\` |
| pageTranslate | (key) => string | 否 | 字段 label 翻译函数 |
| readonly | boolean | 否 | 只读 |

## ValidatableTextarea — 校验多行文本

与 \`ValidatableInput\` 用法一致，通过 \`register\` 接入，渲染 shadcn 的 \`Textarea\`。

\`\`\`tsx
import {ValidatableTextarea} from "@/common/components/forms/validatable-textarea";

<ValidatableTextarea
    {...register("description")}
    fieldPropertyName="description"
    pageTranslate={pageTranslate}
    errorMessage={errors.description?.message}
    isSubmitted={isSubmitted}
/>
\`\`\`

| Prop | 类型 | 必填 | 说明 |
|------|------|------|------|
| fieldPropertyName | string | 是 | 字段名 |
| pageTranslate | (key) => string | 否 | 字段 label 翻译函数 |
| errorMessage | string | 否 | 校验错误文案 |
| isSubmitted | boolean | 否 | 是否已提交 |
| readonly | boolean | 否 | 只读 |

其余属性继承 \`React.TextareaHTMLAttributes\`。

## SearchInput — 搜索输入框

用于表格搜索栏，把输入写入 \`setSearchCondition\` 的对应字段。

\`\`\`tsx
import SearchInput from "@/common/components/forms/search-input";

<SearchInput
    value={condition.userName || ""}
    propertyName="userName"
    pageTranslate={pageTranslate}
    setSearchCondition={setCondition}
/>
\`\`\`

| Prop | 类型 | 必填 | 说明 |
|------|------|------|------|
| value | string | 否 | 受控值 |
| propertyName | string | 是 | 字段名 |
| pageTranslate | (key) => string | 是 | 占位符翻译函数 |
| setSearchCondition | Dispatch<SetStateAction<T>> | 是 | 回写搜索条件 state |

## SearchSelect — 搜索下拉框

用于表格搜索栏，除字典项外自动追加一个「全部」（value 为 \`-1\`）选项。

\`\`\`tsx
import SearchSelect from "@/common/components/forms/search-select";

<SearchSelect
    propertyName="status"
    pageTranslate={pageTranslate}
    setSearchCondition={setCondition}
    dictionary={dictionary}
/>
\`\`\`

| Prop | 类型 | 必填 | 说明 |
|------|------|------|------|
| propertyName | string | 是 | 字段名 |
| setSearchCondition | Dispatch<SetStateAction<T>> | 是 | 回写搜索条件 state |
| dictionary | KeyValue[] | 否 | 下拉选项字典 |
| pageTranslate | (key) => string | 是 | 占位符翻译函数 |

## 集成约定

1. **register 类组件**（\`ValidatableInput\` / \`ValidatableTextarea\`）：\`{...register("field")}\` 展开接入，\`errorMessage={errors.field?.message}\`。
2. **setValue 类组件**（\`ValidatableSelect\` / \`ValidatableDate\`）：不注册，直接传 \`setValue\` 与 \`defaultValue\`。
3. 下拉字典的 \`value\` 会先尝试用 \`KVS.<field>.<value>\` 翻译，缺失则原样显示，所以需在 messages 里补充 \`KVS\` 命名空间。
`;

const docEn = `# Form Components (components/forms) Usage Guide

## Overview

\`src/common/components/forms/\` contains 6 reusable form components built on **react-hook-form** and **shadcn/ui**, in two groups:

- **Validated form components** (wired to \`react-hook-form\` via \`register\` / \`setValue\`): \`ValidatableInput\`, \`ValidatableSelect\`, \`ValidatableDate\`, \`ValidatableTextarea\`
- **Table search components** (write into a search-condition state): \`SearchInput\`, \`SearchSelect\`

> Both translate field labels via \`pageTranslate\`; select components also translate dictionary values through \`useTranslations("KVS")\`.

## ValidatableInput — validated input

A controlled input wired via \`forwardRef\` and \`register("fieldName")\`; \`{...register(...)}\` forwards \`onChange\` / \`onBlur\` / \`name\` / \`ref\` to the inner \`<input>\`.

\`\`\`tsx
import {ValidatableInput} from "@/common/components/forms/validatable-input";

const {register, formState: {errors, isSubmitted}} = useForm();

<ValidatableInput
    {...register("userName", {required: "Required"})}
    type="text"
    fieldPropertyName="userName"
    pageTranslate={pageTranslate}
    errorMessage={errors.userName?.message}
    isSubmitted={isSubmitted}
/>
\`\`\`

| Prop | Type | Required | Description |
|------|------|----------|-------------|
| fieldPropertyName | string | Yes | Field name (label key and input name) |
| type | "text" \| "password" \| "email" \| "number" \| "hidden" \| "label" | Yes | Input type; \`hidden\` returns a hidden input, \`label\` renders read-only |
| pageTranslate | (key) => string | No | Label translation function |
| validateTranslate | (key) => string | No | Validation message translation function |
| errorMessage | string | No | Validation error text (usually \`errors.xxx?.message\`) |
| isSubmitted | boolean | No | Whether submitted; shows a green check on valid fields |
| readonly | boolean | No | Read-only |

Other props inherit \`React.InputHTMLAttributes\` (including \`defaultValue\`, \`className\`).

## ValidatableSelect — validated select

Uses \`setValue\` (not \`register\`) to sync its value; \`dictionary\` accepts \`KeyValue[]\`; falls back to the first item when the default is not matched.

\`\`\`tsx
import {ValidatableSelect} from "@/common/components/forms/validatable-select";

<ValidatableSelect
    fieldPropertyName="gender"
    dictionary={dictionary}
    defaultValue={original.gender}
    setValue={setValue}
    pageTranslate={pageTranslate}
/>
\`\`\`

| Prop | Type | Required | Description |
|------|------|----------|-------------|
| fieldPropertyName | string | Yes | Field name |
| dictionary | KeyValue[] | Yes | Options dictionary |
| setValue | (name, value) => void | Yes | react-hook-form setValue |
| defaultValue | any | No | Initial value (dictionary key) |
| pageTranslate | (key) => string | No | Label translation function |
| className | string | No | Trigger class |

\`KeyValue\` is \`{ key: string; value: string }\`: \`key\` is the submitted value; \`value\` is both the display text and the KVS translation key (\`KVS.<field>.<value>\`), so it must match your KVS keys.

## ValidatableDate — validated date picker

A date picker built on \`Calendar\` + \`Popover\`, formatted with \`dayjs\`, syncing via \`setValue\`; writes the default value (today) in a \`useEffect\` on mount.

\`\`\`tsx
import {ValidatableDate} from "@/common/components/forms/validatable-date";

<ValidatableDate
    fieldPropertyName="birthday"
    defaultValue="1990-01-01"
    format="YYYY-MM-DD"
    setValue={setValue}
    pageTranslate={pageTranslate}
/>
\`\`\`

| Prop | Type | Required | Description |
|------|------|----------|-------------|
| fieldPropertyName | string | Yes | Field name |
| setValue | (name, value) => void | Yes | Write back on date change |
| defaultValue | string | No | Initial date string, defaults to today |
| format | string | No | dayjs format, default \`YYYY-MM-DD\` |
| pageTranslate | (key) => string | No | Label translation function |
| readonly | boolean | No | Read-only |

## ValidatableTextarea — validated textarea

Same usage as \`ValidatableInput\`, wired via \`register\`, rendering shadcn's \`Textarea\`.

\`\`\`tsx
import {ValidatableTextarea} from "@/common/components/forms/validatable-textarea";

<ValidatableTextarea
    {...register("description")}
    fieldPropertyName="description"
    pageTranslate={pageTranslate}
    errorMessage={errors.description?.message}
    isSubmitted={isSubmitted}
/>
\`\`\`

| Prop | Type | Required | Description |
|------|------|----------|-------------|
| fieldPropertyName | string | Yes | Field name |
| pageTranslate | (key) => string | No | Label translation function |
| errorMessage | string | No | Validation error text |
| isSubmitted | boolean | No | Whether submitted |
| readonly | boolean | No | Read-only |

Other props inherit \`React.TextareaHTMLAttributes\`.

## SearchInput — search input

For table search bars; writes input into the matching field of \`setSearchCondition\`.

\`\`\`tsx
import SearchInput from "@/common/components/forms/search-input";

<SearchInput
    value={condition.userName || ""}
    propertyName="userName"
    pageTranslate={pageTranslate}
    setSearchCondition={setCondition}
/>
\`\`\`

| Prop | Type | Required | Description |
|------|------|----------|-------------|
| value | string | No | Controlled value |
| propertyName | string | Yes | Field name |
| pageTranslate | (key) => string | Yes | Placeholder translation function |
| setSearchCondition | Dispatch<SetStateAction<T>> | Yes | Write back the search condition state |

## SearchSelect — search select

For table search bars; appends an "all" option (value \`-1\`) on top of the dictionary.

\`\`\`tsx
import SearchSelect from "@/common/components/forms/search-select";

<SearchSelect
    propertyName="status"
    pageTranslate={pageTranslate}
    setSearchCondition={setCondition}
    dictionary={dictionary}
/>
\`\`\`

| Prop | Type | Required | Description |
|------|------|----------|-------------|
| propertyName | string | Yes | Field name |
| setSearchCondition | Dispatch<SetStateAction<T>> | Yes | Write back the search condition state |
| dictionary | KeyValue[] | No | Options dictionary |
| pageTranslate | (key) => string | Yes | Placeholder translation function |

## Integration notes

1. **register components** (\`ValidatableInput\` / \`ValidatableTextarea\`): spread \`{...register("field")}\`, pass \`errorMessage={errors.field?.message}\`.
2. **setValue components** (\`ValidatableSelect\` / \`ValidatableDate\`): not registered; pass \`setValue\` and \`defaultValue\` directly.
3. Dictionary \`value\` is first translated via \`KVS.<field>.<value>\` (falls back to raw text), so add a \`KVS\` namespace to your messages.
`;

export default function FormsExamplePage() {
    const t = useTranslations("example.FormsExample");
    const locale = useLocale();
    const doc = locale === "zh" ? docZh : docEn;

    const [condition, setCondition] = useState<SearchCondition>({});
    const [submitted, setSubmitted] = useState<FormData | null>(null);

    const {
        register,
        handleSubmit,
        setValue,
        reset,
        formState: {errors, isSubmitted},
    } = useForm<FormData>();

    const pageTranslate = (key: string) => t(key);

    const onSubmit = (data: FormData) => {
        setSubmitted(data);
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

                {/* 搜索组件示例 */}
                <section className="mt-10 rounded-2xl border border-border bg-card p-6">
                    <h2 className="text-lg font-semibold">{t("search-demo-title")}</h2>
                    <p className="mt-1 text-sm text-muted-foreground">{t("search-demo-desc")}</p>

                    <div className="mt-5 flex flex-wrap items-center gap-4">
                        <SearchInput
                            value={condition.username || ""}
                            propertyName="username"
                            pageTranslate={pageTranslate}
                            setSearchCondition={setCondition}
                        />
                        <SearchSelect
                            propertyName="status"
                            pageTranslate={pageTranslate}
                            setSearchCondition={setCondition}
                            dictionary={statusDict}
                        />
                        <Button variant="outline" onClick={() => setCondition({})}>
                            {t("reset-btn")}
                        </Button>
                    </div>

                    <div className="mt-5 text-sm">
                        <div className="text-muted-foreground">{t("search-condition")}</div>
                        <code className="mt-1 block break-all rounded bg-muted px-3 py-2 font-mono">
                            {JSON.stringify(condition)}
                        </code>
                    </div>
                </section>

                {/* 校验表单组件示例 */}
                <section className="mt-6 rounded-2xl border border-border bg-card p-6">
                    <h2 className="text-lg font-semibold">{t("form-demo-title")}</h2>
                    <p className="mt-1 text-sm text-muted-foreground">{t("form-demo-desc")}</p>

                    <form className="mt-5" onSubmit={handleSubmit(onSubmit)}>
                        <ValidatableInput
                            {...register("username", {
                                required: t("validation.required"),
                                minLength: {value: 2, message: t("validation.minLength", {min: 2})},
                            })}
                            type="text"
                            fieldPropertyName="username"
                            pageTranslate={pageTranslate}
                            errorMessage={errors.username?.message as string}
                            isSubmitted={isSubmitted}
                        />
                        <ValidatableInput
                            {...register("password", {required: t("validation.required")})}
                            type="password"
                            fieldPropertyName="password"
                            pageTranslate={pageTranslate}
                            errorMessage={errors.password?.message as string}
                            isSubmitted={isSubmitted}
                        />
                        <ValidatableInput
                            {...register("email", {required: t("validation.required")})}
                            type="email"
                            fieldPropertyName="email"
                            pageTranslate={pageTranslate}
                            errorMessage={errors.email?.message as string}
                            isSubmitted={isSubmitted}
                        />
                        <ValidatableInput
                            {...register("age")}
                            type="number"
                            fieldPropertyName="age"
                            pageTranslate={pageTranslate}
                            errorMessage={errors.age?.message as string}
                            isSubmitted={isSubmitted}
                        />
                        <ValidatableSelect
                            fieldPropertyName="gender"
                            dictionary={genderDict}
                            defaultValue="MALE"
                            setValue={setValue}
                            pageTranslate={pageTranslate}
                        />
                        <ValidatableDate
                            fieldPropertyName="birthday"
                            defaultValue="2000-01-01"
                            setValue={setValue}
                            pageTranslate={pageTranslate}
                        />
                        <ValidatableTextarea
                            {...register("description")}
                            fieldPropertyName="description"
                            pageTranslate={pageTranslate}
                            errorMessage={errors.description?.message as string}
                            isSubmitted={isSubmitted}
                        />

                        <div className="flex items-center gap-3">
                            <Button type="submit">{t("submit-btn")}</Button>
                            <Button type="button" variant="outline" onClick={() => {
                                reset();
                                setSubmitted(null);
                            }}>
                                {t("reset-btn")}
                            </Button>
                        </div>
                    </form>

                    {submitted && (
                        <div className="mt-5 text-sm">
                            <div className="text-muted-foreground">{t("submitted-data")}</div>
                            <code className="mt-1 block break-all rounded bg-muted px-3 py-2 font-mono">
                                {JSON.stringify(submitted, null, 2)}
                            </code>
                        </div>
                    )}
                </section>

                <div className="prose-doc mt-12">
                    <ReactMarkdown remarkPlugins={[remarkGfm]}>{doc}</ReactMarkdown>
                </div>
            </main>
        </div>
    );
}
