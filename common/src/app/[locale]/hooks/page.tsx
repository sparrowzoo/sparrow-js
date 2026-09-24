"use client";

import {useState} from "react";
import {useLocale, useTranslations} from "next-intl";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import {Link} from "@/common/i18n/navigation";
import {ArrowLeft, Loader2} from "lucide-react";
import {Button} from "@/components/ui/button";
import {Input} from "@/components/ui/input";
import useReachBottom from "@/common/hook/ReachBottomHook";
import useCrosStorage from "@/common/hook/CrosStorageHook";
import useCaptcha from "@/common/hook/CaptchaHook";
import useNavigating from "@/common/hook/NavigatingHook";

const docZh = `# 自定义 Hooks（src/common/hook）使用说明

## 概述

\`src/common/hook/\` 目录封装了 4 个通用 React Hook，覆盖分页加载、跨域存储、验证码、重定向四类场景：

| Hook | 文件 | 用途 |
|------|------|------|
| \`useReachBottom\` | \`ReachBottomHook.tsx\` | 滚动触底自动加载下一页（无限滚动 / 分页） |
| \`useCrosStorage\` | \`CrosStorageHook.tsx\` | 跨域（iframe postMessage）/ 同域统一读写存储 |
| \`useCaptcha\` | \`CaptchaHook.tsx\` | 验证码图片加载与点击刷新 |
| \`useNavigating\` | \`NavigatingHook.tsx\` | 带 locale 前缀的安全重定向 |

四个 Hook 职责单一，且都对 SSR（\`typeof window === "undefined"\`）做了防御。

---

## useReachBottom —— 触底加载

监听滚动容器的 \`scroll\` 事件，滚动到距底部 20px 内时调用 \`reachBottomHandler(lastId)\` 拉取下一页，并用 \`globalLoading\`（ref）防抖避免重复请求。

\`\`\`tsx
import useReachBottom from "@/common/hook/ReachBottomHook";

const { loading, lastId, containerRef } = useReachBottom(
  async (lastId) => {
    const page = await fetchNextPage(lastId); // 返回 Promise
    return page.newLastId;                     // resolve 出新的游标
  },
  0 // initialLastId
);

return <div ref={containerRef} className="h-96 overflow-y-auto">{/* 列表 */}</div>;
\`\`\`

**参数**

| 参数 | 类型 | 说明 |
|------|------|------|
| reachBottomHandler | (lastId: any) => Promise<any> | 触底回调，resolve 出新的 lastId |
| initialLastId | any | 初始游标 |

**返回值**

| 字段 | 类型 | 说明 |
|------|------|------|
| loading | boolean | 是否加载中 |
| lastId | any | 当前游标 |
| setLastId | (id) => void | 手动更新游标 |
| startLoading | () => void | 手动标记加载中 |
| finishLoading | (newLastId) => void | 结束加载并更新游标 |
| containerRef | RefObject<HTMLDivElement> | 挂到滚动容器上 |

**注意**

- 触发阈值 20px；请求完成后 \`globalLoading\` 延迟 100ms 复位，避免滚动事件短时间重复触发。
- 内部 \`useEffect\` 依赖 \`[loading]\`：每次请求完成、\`loading\` 翻转时重新绑定 scroll 监听，从而拿到最新的 \`lastId\`，避免闭包缓存旧值。

---

## useCrosStorage —— 跨域存储

跨域场景下通过隐藏 iframe + \`postMessage\` 与代理页通信；同域（或未配置 \`STORAGE_PROXY\`）时直接回退到 \`localStorage\` / \`sessionStorage\`。常用于多子域共享登录 token。

\`\`\`tsx
import useCrosStorage from "@/common/hook/CrosStorageHook";

const crosStorage = useCrosStorage(); // CrosStorage | undefined（首帧为 undefined）

await crosStorage?.set("token-value", "my_token");   // 写入
const v = await crosStorage?.get("my_token");        // 读取
await crosStorage?.remove("my_token");               // 删除
\`\`\`

**返回值**

返回 \`CrosStorage | undefined\`，实例提供以下方法：

| 方法 | 说明 |
|------|------|
| set(value, key?, storage?) | 写入；key 默认 \`TOKEN_KEY\`，storage 默认 \`AUTOMATIC\` |
| get(key?, storage?) | 读取，resolve 出字符串或 null |
| remove(key?, storage?) | 删除，resolve 出被删除的值 |
| getToken / setToken / removeToken | 针对 token 的快捷方法 |
| locateToken(token?) | 定位 / 本地化当前登录用户 |
| destroy() | 移除 iframe（Hook 卸载时会自动调用） |

**storage 取值**：\`LOCAL\` / \`SESSION\` / \`AUTOMATIC\`；\`AUTOMATIC\` 由环境变量 \`NEXT_PUBLIC_TOKEN_STORAGE\` 决定。

**注意**：首帧返回 \`undefined\`（\`useEffect\` 里才 \`setCrosStorage\`），使用前需判空。

---

## useCaptcha —— 验证码

返回一个 \`ref\`，把它挂到 \`<img>\` 上即可：挂载后自动加载验证码，点击图片刷新。加载成功后会把图片 \`visibility\` 设为 \`visible\`。

\`\`\`tsx
import useCaptcha from "@/common/hook/CaptchaHook";

const captchaRef = useCaptcha();

return <img ref={captchaRef} alt="captcha" />;
\`\`\`

**返回值**：\`RefObject<HTMLImageElement>\`。

**注意**：依赖环境变量 \`NEXT_PUBLIC_CAPTCHA_URL\`；未配置时图片无法加载。

---

## useNavigating —— 安全重定向

基于 \`useLocale()\` 拼出带正确语言前缀的跳转地址，避免手写 URL 导致 locale 丢失。

\`\`\`tsx
import useNavigating from "@/common/hook/NavigatingHook";

const Navigate = useNavigating();
// 或按需解构静态方法
const { redirectToLogin } = useNavigating();

Navigate.redirectToIndex();               // 2s 后跳转首页
Navigate.redirectTo("/some/path");        // 立即跳转指定地址
Navigate.redirectToLogin(true, 2000);     // 2s 后跳转登录（可带 ref）
\`\`\`

**静态方法**

| 方法 | 说明 |
|------|------|
| redirectToIndex(timeout=2000) | 延迟跳转到 \`WWW_ROOT/{locale}/\` |
| redirectTo(directUrl) | 立即跳转到指定 URL；为空则走 redirectToIndex |
| redirectToLogin(withRef=true, timeout=2000) | 延迟跳转到 \`PASSPORT_ROOT/{locale}{LOGIN_URL}\`；withRef 为 true 时带上当前 URL 作为 ref |

**依赖环境变量**：\`NEXT_PUBLIC_WWW_ROOT\`、\`NEXT_PUBLIC_PASSPORT_ROOT\`、\`NEXT_PUBLIC_LOGIN_URL\`。
`;

const docEn = `# Custom Hooks (src/common/hook) Usage Guide

## Overview

\`src/common/hook/\` bundles 4 reusable React hooks covering pagination, cross-origin storage, captcha and redirect:

| Hook | File | Purpose |
|------|------|---------|
| \`useReachBottom\` | \`ReachBottomHook.tsx\` | Auto-load next page when scrolled to the bottom (infinite scroll / pagination) |
| \`useCrosStorage\` | \`CrosStorageHook.tsx\` | Unified storage read/write across origins (iframe postMessage) or same origin |
| \`useCaptcha\` | \`CaptchaHook.tsx\` | Captcha image loading + click-to-refresh |
| \`useNavigating\` | \`NavigatingHook.tsx\` | Locale-prefixed safe redirect |

All four are single-purpose and guard against SSR (\`typeof window === "undefined"\`).

---

## useReachBottom — reach-bottom loading

Listens to a scroll container's \`scroll\` event; when within 20px of the bottom it calls \`reachBottomHandler(lastId)\` to fetch the next page, using a \`globalLoading\` ref to debounce duplicate requests.

\`\`\`tsx
import useReachBottom from "@/common/hook/ReachBottomHook";

const { loading, lastId, containerRef } = useReachBottom(
  async (lastId) => {
    const page = await fetchNextPage(lastId); // returns a Promise
    return page.newLastId;                     // resolve to the new cursor
  },
  0 // initialLastId
);

return <div ref={containerRef} className="h-96 overflow-y-auto">{/* list */}</div>;
\`\`\`

**Parameters**

| Param | Type | Description |
|-------|------|-------------|
| reachBottomHandler | (lastId: any) => Promise<any> | Bottom callback; resolves to the new lastId |
| initialLastId | any | Initial cursor |

**Return value**

| Field | Type | Description |
|-------|------|-------------|
| loading | boolean | Whether loading |
| lastId | any | Current cursor |
| setLastId | (id) => void | Manually update the cursor |
| startLoading | () => void | Manually mark loading |
| finishLoading | (newLastId) => void | End loading and update the cursor |
| containerRef | RefObject<HTMLDivElement> | Attach to the scroll container |

**Notes**

- Threshold is 20px; after a request \`globalLoading\` resets 100ms later to avoid repeated triggers.
- The inner \`useEffect\` depends on \`[loading]\`: it rebinds the scroll listener each time \`loading\` flips, so it always captures the latest \`lastId\` instead of a stale closure.

---

## useCrosStorage — cross-origin storage

In cross-origin mode it talks to a proxy page through a hidden iframe + \`postMessage\`; in same-origin mode (or when \`STORAGE_PROXY\` is unset) it falls back to \`localStorage\` / \`sessionStorage\`. Typically used to share a login token across subdomains.

\`\`\`tsx
import useCrosStorage from "@/common/hook/CrosStorageHook";

const crosStorage = useCrosStorage(); // CrosStorage | undefined (undefined on first render)

await crosStorage?.set("token-value", "my_token");   // write
const v = await crosStorage?.get("my_token");        // read
await crosStorage?.remove("my_token");               // remove
\`\`\`

**Return value**

Returns \`CrosStorage | undefined\`; the instance exposes:

| Method | Description |
|--------|-------------|
| set(value, key?, storage?) | Write; key defaults to \`TOKEN_KEY\`, storage to \`AUTOMATIC\` |
| get(key?, storage?) | Read, resolves to a string or null |
| remove(key?, storage?) | Remove, resolves to the removed value |
| getToken / setToken / removeToken | Convenience methods for the token |
| locateToken(token?) | Locate / localize the current login user |
| destroy() | Remove the iframe (called automatically on unmount) |

**storage values**: \`LOCAL\` / \`SESSION\` / \`AUTOMATIC\`; \`AUTOMATIC\` is decided by \`NEXT_PUBLIC_TOKEN_STORAGE\`.

**Note**: the first render returns \`undefined\` (set inside a \`useEffect\`), so guard before use.

---

## useCaptcha — captcha

Returns a \`ref\` to attach to an \`<img>\`: it auto-loads the captcha on mount and refreshes on click. After loading it sets the image \`visibility\` to \`visible\`.

\`\`\`tsx
import useCaptcha from "@/common/hook/CaptchaHook";

const captchaRef = useCaptcha();

return <img ref={captchaRef} alt="captcha" />;
\`\`\`

**Return value**: \`RefObject<HTMLImageElement>\`.

**Note**: depends on \`NEXT_PUBLIC_CAPTCHA_URL\`; the image cannot load without it.

---

## useNavigating — safe redirect

Builds redirect URLs with the correct locale prefix from \`useLocale()\`, so the locale is never lost.

\`\`\`tsx
import useNavigating from "@/common/hook/NavigatingHook";

const Navigate = useNavigating();
// or destructure a static method
const { redirectToLogin } = useNavigating();

Navigate.redirectToIndex();               // redirect home after 2s
Navigate.redirectTo("/some/path");        // redirect immediately
Navigate.redirectToLogin(true, 2000);     // redirect to login after 2s (optionally with ref)
\`\`\`

**Static methods**

| Method | Description |
|--------|-------------|
| redirectToIndex(timeout=2000) | Delayed redirect to \`WWW_ROOT/{locale}/\` |
| redirectTo(directUrl) | Immediate redirect; falls back to redirectToIndex when empty |
| redirectToLogin(withRef=true, timeout=2000) | Delayed redirect to \`PASSPORT_ROOT/{locale}{LOGIN_URL}\`; appends the current URL as ref when withRef is true |

**Env vars**: \`NEXT_PUBLIC_WWW_ROOT\`, \`NEXT_PUBLIC_PASSPORT_ROOT\`, \`NEXT_PUBLIC_LOGIN_URL\`.
`;

export default function HooksExamplePage() {
    const t = useTranslations("example.HooksExample");
    const locale = useLocale();
    const doc = locale === "zh" ? docZh : docEn;

    // —— useReachBottom 触底加载 ——
    const [items, setItems] = useState<number[]>(() => Array.from({length: 20}, (_, i) => i + 1));
    const reachBottomHandler = async (lastId: number) => {
        await new Promise((r) => setTimeout(r, 800)); // 模拟网络
        const start = (lastId as number) + 1;
        const next = Array.from({length: 10}, (_, i) => start + i);
        setItems((prev) => [...prev, ...next]);
        return start + 9;
    };
    const {loading, lastId, containerRef} = useReachBottom(reachBottomHandler, 20);

    // —— useCrosStorage 跨域存储 ——
    const crosStorage = useCrosStorage();
    const [storageKey, setStorageKey] = useState("demo_token");
    const [storageValue, setStorageValue] = useState("hello-sparrow");
    const [storageResult, setStorageResult] = useState("—");

    const storageSet = async () => {
        if (!crosStorage) return;
        const v = await crosStorage.set(storageValue, storageKey);
        setStorageResult(`${storageKey} = ${v}`);
    };
    const storageGet = async () => {
        if (!crosStorage) return;
        const v = await crosStorage.get(storageKey);
        setStorageResult(`${storageKey} = ${v ?? "(null)"}`);
    };
    const storageRemove = async () => {
        if (!crosStorage) return;
        const v = await crosStorage.remove(storageKey);
        setStorageResult(`${storageKey} 已删除（原值 ${v ?? "(null)"}）`);
    };

    // —— useCaptcha 验证码 ——
    const captchaRef = useCaptcha();

    // —— useNavigating 重定向 ——
    const Navigate = useNavigating();
    const [customUrl, setCustomUrl] = useState("/");
    const guardNavigate = (fn: () => void) => {
        if (window.confirm(t("navigating-confirm"))) fn();
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

                {/* useReachBottom */}
                <section className="mt-10 rounded-2xl border border-border bg-card p-6">
                    <h2 className="text-lg font-semibold">{t("reach-bottom-title")}</h2>
                    <p className="mt-1 text-sm text-muted-foreground">{t("reach-bottom-desc")}</p>

                    <div
                        ref={containerRef}
                        className="mt-5 h-72 overflow-y-auto rounded-lg border border-border bg-muted/30 p-3">
                        {items.map((i) => (
                            <div
                                key={i}
                                className="mb-2 rounded-md border border-border bg-card px-3 py-2 text-sm">
                                {t("reach-bottom-item", {n: i})}
                            </div>
                        ))}
                        {loading && (
                            <div className="flex items-center justify-center gap-2 py-3 text-sm text-muted-foreground">
                                <Loader2 className="h-4 w-4 animate-spin"/>
                                {t("reach-bottom-loading")}
                            </div>
                        )}
                    </div>
                    <p className="mt-3 text-xs text-muted-foreground">
                        {t("reach-bottom-tip", {count: items.length, lastId: lastId})}
                    </p>
                </section>

                {/* useCrosStorage */}
                <section className="mt-6 rounded-2xl border border-border bg-card p-6">
                    <h2 className="text-lg font-semibold">{t("storage-title")}</h2>
                    <p className="mt-1 text-sm text-muted-foreground">{t("storage-desc")}</p>

                    <div className="mt-5 flex flex-wrap items-center gap-3">
                        <label className="text-sm text-muted-foreground">{t("storage-key")}</label>
                        <Input
                            className="w-40"
                            value={storageKey}
                            onChange={(e) => setStorageKey(e.target.value)}
                        />
                        <label className="text-sm text-muted-foreground">{t("storage-value")}</label>
                        <Input
                            className="w-40"
                            value={storageValue}
                            onChange={(e) => setStorageValue(e.target.value)}
                        />
                    </div>
                    <div className="mt-4 flex flex-wrap items-center gap-3">
                        <Button onClick={storageSet}>{t("storage-set")}</Button>
                        <Button variant="outline" onClick={storageGet}>{t("storage-get")}</Button>
                        <Button variant="outline" onClick={storageRemove}>{t("storage-remove")}</Button>
                    </div>
                    <p className="mt-4 text-sm">
                        <span className="text-muted-foreground">{t("storage-result")}：</span>
                        <code className="rounded bg-muted px-2 py-0.5 font-mono">{storageResult}</code>
                    </p>
                </section>

                {/* useCaptcha */}
                <section className="mt-6 rounded-2xl border border-border bg-card p-6">
                    <h2 className="text-lg font-semibold">{t("captcha-title")}</h2>
                    <p className="mt-1 text-sm text-muted-foreground">{t("captcha-desc")}</p>

                    <div className="mt-5">
                        {/* eslint-disable-next-line @next/next/no-img-element -- useCaptcha 需要直接操作 <img> 的 src/ref */}
                        <img
                            ref={captchaRef}
                            alt="captcha"
                            style={{visibility: "hidden"}}
                            className="h-12 cursor-pointer rounded-md border border-border bg-muted"
                        />
                    </div>
                    <p className="mt-2 text-xs text-muted-foreground">{t("captcha-hint")}</p>
                </section>

                {/* useNavigating */}
                <section className="mt-6 rounded-2xl border border-border bg-card p-6">
                    <h2 className="text-lg font-semibold">{t("navigating-title")}</h2>
                    <p className="mt-1 text-sm text-muted-foreground">{t("navigating-desc")}</p>

                    <div className="mt-5 flex flex-wrap items-center gap-3">
                        <Button onClick={() => guardNavigate(() => Navigate.redirectToIndex(2000))}>
                            {t("navigating-index")}
                        </Button>
                        <Button variant="outline" onClick={() => guardNavigate(() => Navigate.redirectToLogin(true, 2000))}>
                            {t("navigating-login")}
                        </Button>
                    </div>
                    <div className="mt-4 flex flex-wrap items-center gap-3">
                        <label className="text-sm text-muted-foreground">{t("navigating-custom")}</label>
                        <Input
                            className="w-56"
                            value={customUrl}
                            onChange={(e) => setCustomUrl(e.target.value)}
                        />
                        <Button variant="outline" onClick={() => guardNavigate(() => Navigate.redirectTo(customUrl))}>
                            {t("navigating-go")}
                        </Button>
                    </div>
                </section>

                <div className="prose-doc mt-12">
                    <ReactMarkdown remarkPlugins={[remarkGfm]}>{doc}</ReactMarkdown>
                </div>
            </main>
        </div>
    );
}
