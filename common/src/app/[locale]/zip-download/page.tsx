"use client";

import {useLocale, useTranslations} from "next-intl";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import {Link} from "@/common/i18n/navigation";
import {ArrowLeft} from "lucide-react";

const docZh = `# ZIP 打包下载踩坑日志

> 前端下载逻辑已在 \`Fetcher.download()\`（\`src/common/lib/Fetcher.ts\`）实现完毕，本页是对该实现 + 后端 \`/coder/zip-download.json\` 的踩坑总结。

## 背景

后台「生成代码」后，需要把整个脚手架项目目录打包成 zip 下载到本地。完整链路：

前端按钮 → \`CoderApi.zipDownload()\` → \`Fetcher.download()\` → \`POST /coder/zip-download.json\` → 后端 \`CoderController.zipDownload\` 用 \`CompressUtility.zipDir\` 把项目目录流式写入响应。

踩坑集中在四类问题：**文件过滤**、**跨域响应头**、**中文文件名**、**前端 Blob 保存**。

示例请参考 react-next-admin：http://localhost:3002/zh/table-config/?projectId=28

## 一、文件过滤：防止打包过大导致异常

生成的项目目录里包含 \`node_modules\`、\`target\`、\`.next\`、\`.idea\`、\`out\` 等构建产物，动辄几千个文件、几百 MB。直接打包会导致：

- 打包耗时过长，请求超时；
- 内存占用过高（zip 缓冲），可能 OOM；
- 响应体过大，连接被重置 / 中断。

**方案**：\`CompressUtility.zipDir\` 支持 \`FolderFilter\` 过滤回调，\`filter()\` 返回 \`true\` 表示跳过该文件 / 目录：

\`\`\`java
FolderFilter folderFilter = sourceFile ->
    sourceFile.endsWith("node_modules")
        || sourceFile.endsWith("out")
        || sourceFile.endsWith(".idea")
        || sourceFile.endsWith(".next")
        || sourceFile.endsWith("target");

CompressUtility.zipDir(targetPath, response.getOutputStream(), folderFilter);
\`\`\`

> 过滤的是**完整路径后缀**，注意别误伤以 \`out\` / \`target\` 结尾的正常文件。

## 二、跨域响应头：response.reset() 的坑

CORS 过滤器在 controller **之前**执行，先把 \`Access-Control-Allow-Origin\` 等头写到 response 上。若下载接口里用 \`response.reset()\`，会**清空缓冲 + 清空所有响应头 + 重置状态码**，把 CORS 头一并抹掉，浏览器直接拦截下载。

**方案**：只想清空缓冲里的残留内容时，用 \`resetBuffer()\`（只清 body，不动响应头和状态码）：

\`\`\`java
response.resetBuffer(); // 而非 response.reset()
\`\`\`

## 三、Content-Disposition 拿不到：Access-Control-Expose-Headers

浏览器跨域时**默认只暴露少量“安全”响应头**给 JS（Cache-Control、Content-Language、Content-Length、Content-Type、Expires、Last-Modified、Pragma）。\`Content-Disposition\` 不在其中，所以后端设了文件名，前端 \`response.headers.get("Content-Disposition")\` 也拿到 null。

**方案**：服务端把这个头加进 \`Access-Control-Expose-Headers\`：

\`\`\`java
response.setHeader("Access-Control-Expose-Headers", "Content-Disposition");
\`\`\`

## 四、中文文件名乱码：RFC 5987

HTTP 响应头默认按 ISO-8859-1 解释，直接 \`filename="中文.zip"\` 会乱码。

**方案**：保留 \`filename\` 兼容老客户端，同时按 RFC 5987 追加 \`filename*=UTF-8''...\`（百分号编码）：

\`\`\`java
String encoded = URLEncoder.encode(fileName, StandardCharsets.UTF_8).replaceAll("\\\\+", "%20");
response.setHeader("Content-Disposition",
    "attachment;filename=\\"" + fileName + "\\";filename*=UTF-8''" + encoded);
\`\`\`

> \`URLEncoder.encode\` 把空格编成 \`+\`，需替换回 \`%20\`，否则空格解码错误。

## 五、全局返回值包装：下载场景必须跳过 Result 封装

sparrow-starter 里有一个全局 \`@ControllerAdvice\`（\`ControllerReturnAdvice implements ResponseBodyAdvice\`），默认把所有返回值包装成 \`Result\`。但下载接口是直接往 \`response.getOutputStream()\` 写 zip 二进制流的，不能被包装成 JSON，否则响应体会被污染。

**为什么不能用 \`supports()\` 来过滤下载场景？**

\`supports(MethodParameter, Class)\` 只能拿到**编译期返回类型**和 HttpMessageConverter 类型，**拿不到 request/response**，因此看不到方法体里才设置的 \`Content-Disposition: attachment\` 响应头。而下载方法返回 \`void\`、直接写输出流——单看返回类型（\`void\`）既区分不了「下载」和「普通 void 接口」，也判断不出是否 attachment。

所以判断只能放在 \`beforeBodyWrite()\` 里：它入参带 \`ServerHttpResponse\`，能读到响应头：

\`\`\`java
String contentDisposition = response.getHeaders().getFirst(HttpHeaders.CONTENT_DISPOSITION);
if (contentDisposition != null && contentDisposition.toLowerCase().contains("attachment")) {
    return data; // 下载场景不包装，直接返回原始数据
}
\`\`\`

> 一句话：\`supports()\` 决定「要不要走这个 advice」（静态类型层面），\`beforeBodyWrite()\` 才决定「这一次要不要包装」（能看响应头、运行时层面）。下载标记是运行时响应头，只能在 \`beforeBodyWrite()\` 判。

## 六、前端：按 Content-Type 分流（Fetcher.download 已实现）

下载接口**成功返回 zip 二进制**，**失败返回标准 Result JSON**（Content-Type: application/json）。fetch 不能直接 \`response.json()\`，必须先看响应头分流：

\`\`\`ts
const contentType = response.headers.get("content-type") || "";
if (contentType.indexOf("application/json") >= 0) {
    const result = await response.json(); // 失败：解析 Result 并 toast
    return Promise.reject(result);
}
const blob = await response.blob(); // 成功：读取二进制
\`\`\`

## 七、前端：解析文件名（Fetcher.download 已实现）

优先解析 \`filename*=UTF-8''...\` 并 \`decodeURIComponent\`，否则回退普通 \`filename="..."\`：

\`\`\`ts
const star = disposition.match(/filename\\*=UTF-8''([^;]+)/i);
filename = star
    ? decodeURIComponent(star[1])
    : disposition.match(/filename="?([^";]+)"?/i)?.[1] || "download.zip";
\`\`\`

## 八、前端：Blob 保存到本地

\`Fetcher.download\` 返回 \`{blob, filename}\`，业务侧拿到后这样触发浏览器下载（\`react-next-admin\` 的 \`operation.tsx\` 已用此写法）：

\`\`\`ts
const url = URL.createObjectURL(blob);
const a = document.createElement("a");
a.href = url;
a.download = filename;
document.body.appendChild(a);
a.click();
document.body.removeChild(a);
setTimeout(() => URL.revokeObjectURL(url), 0);
\`\`\`

## 官方文档

- [fetch](https://developer.mozilla.org/en-US/docs/Web/API/Window/fetch)
- [Blob](https://developer.mozilla.org/en-US/docs/Web/API/Blob)
- [URL.createObjectURL](https://developer.mozilla.org/en-US/docs/Web/API/URL/createObjectURL)
- [URL.revokeObjectURL](https://developer.mozilla.org/en-US/docs/Web/API/URL/revokeObjectURL)
- [Content-Disposition](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Content-Disposition)
- [Access-Control-Expose-Headers](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Access-Control-Expose-Headers)
- [CORS safelisted response headers](https://developer.mozilla.org/en-US/docs/Glossary/CORS-safelisted_response_header)
- [RFC 5987](https://datatracker.ietf.org/doc/html/rfc5987)
`;

const docEn = `# ZIP Download Pitfall Log

> The frontend download logic is already implemented in \`Fetcher.download()\` (\`src/common/lib/Fetcher.ts\`). This page summarizes the pitfalls of that implementation + the backend \`/coder/zip-download.json\`.

## Background

After "generate code", the whole scaffold project directory is packaged into a zip and downloaded. Full chain:

Frontend button → \`CoderApi.zipDownload()\` → \`Fetcher.download()\` → \`POST /coder/zip-download.json\` → backend \`CoderController.zipDownload\` streams the project dir via \`CompressUtility.zipDir\`.

Four problem areas: **file filtering**, **CORS response headers**, **non-ASCII filenames**, **frontend Blob saving**.

Live example in react-next-admin: http://localhost:3002/zh/table-config/?projectId=28

## 1. File filtering: avoid huge archives

The generated dir contains \`node_modules\`, \`target\`, \`.next\`, \`.idea\`, \`out\` — thousands of files, hundreds of MB. Packaging them directly causes: slow/timeout, high memory (OOM), oversized response → connection reset.

**Fix**: \`CompressUtility.zipDir\` accepts a \`FolderFilter\`; \`filter()\` returning \`true\` skips that file/dir:

\`\`\`java
FolderFilter folderFilter = sourceFile ->
    sourceFile.endsWith("node_modules")
        || sourceFile.endsWith("out")
        || sourceFile.endsWith(".idea")
        || sourceFile.endsWith(".next")
        || sourceFile.endsWith("target");

CompressUtility.zipDir(targetPath, response.getOutputStream(), folderFilter);
\`\`\`

> The filter matches **full-path suffixes** — be careful not to skip legit files ending with \`out\` / \`target\`.

## 2. CORS headers: the response.reset() trap

The CORS filter runs **before** the controller and writes \`Access-Control-Allow-Origin\` etc. onto the response. \`response.reset()\` clears the buffer **and all headers and the status code**, wiping the CORS headers so the browser blocks the download.

**Fix**: when you only want to clear buffered content, use \`resetBuffer()\` (clears body only, keeps headers & status):

\`\`\`java
response.resetBuffer(); // not response.reset()
\`\`\`

## 3. Content-Disposition unreadable: Access-Control-Expose-Headers

Cross-origin, the browser only exposes a few "safelisted" headers to JS (Cache-Control, Content-Language, Content-Length, Content-Type, Expires, Last-Modified, Pragma). \`Content-Disposition\` is not among them, so \`response.headers.get("Content-Disposition")\` is null.

**Fix**: expose it on the server:

\`\`\`java
response.setHeader("Access-Control-Expose-Headers", "Content-Disposition");
\`\`\`

## 4. Non-ASCII filenames: RFC 5987

HTTP headers are treated as ISO-8859-1 by default, so \`filename="中文.zip"\` gets garbled.

**Fix**: keep \`filename\` for legacy clients and append an RFC 5987 \`filename*=UTF-8''...\` (percent-encoded):

\`\`\`java
String encoded = URLEncoder.encode(fileName, StandardCharsets.UTF_8).replaceAll("\\\\+", "%20");
response.setHeader("Content-Disposition",
    "attachment;filename=\\"" + fileName + "\\";filename*=UTF-8''" + encoded);
\`\`\`

> \`URLEncoder.encode\` turns spaces into \`+\`; replace them back to \`%20\`.

## 5. Global result wrapping: skip download responses

sparrow-starter has a global \`@ControllerAdvice\` (\`ControllerReturnAdvice implements ResponseBodyAdvice\`) that wraps every return value in \`Result\`. But the download endpoint streams raw zip bytes to \`response.getOutputStream()\` — wrapping it as JSON would corrupt the response body.

**Why not filter the download case in \`supports()\`?**

\`supports(MethodParameter, Class)\` only receives the **compile-time return type** and the converter type — it has **no access to request/response**, so it can't see the \`Content-Disposition: attachment\` header that's set inside the method body. The download method returns \`void\` and writes to the stream directly; the return type alone (\`void\`) can't tell "download" apart from a normal void endpoint.

So the check must live in \`beforeBodyWrite()\`, which receives \`ServerHttpResponse\` and can read the headers:

\`\`\`java
String contentDisposition = response.getHeaders().getFirst(HttpHeaders.CONTENT_DISPOSITION);
if (contentDisposition != null && contentDisposition.toLowerCase().contains("attachment")) {
    return data; // download: don't wrap, return as-is
}
\`\`\`

> In short: \`supports()\` decides whether this advice applies (static type level); \`beforeBodyWrite()\` decides whether to wrap this particular response (runtime, header-aware). The download marker is a runtime header, so it can only be checked in \`beforeBodyWrite()\`.

## 6. Frontend: branch on Content-Type (implemented in Fetcher.download)

Success returns a zip binary; failure returns standard Result JSON (Content-Type: application/json). You can't just \`response.json()\`, branch on the header first:

\`\`\`ts
const contentType = response.headers.get("content-type") || "";
if (contentType.indexOf("application/json") >= 0) {
    const result = await response.json(); // failure: parse Result and toast
    return Promise.reject(result);
}
const blob = await response.blob(); // success: read binary
\`\`\`

## 7. Frontend: parse the filename (implemented in Fetcher.download)

Prefer \`filename*=UTF-8''...\` + \`decodeURIComponent\`, fall back to plain \`filename="..."\`:

\`\`\`ts
const star = disposition.match(/filename\\*=UTF-8''([^;]+)/i);
filename = star
    ? decodeURIComponent(star[1])
    : disposition.match(/filename="?([^";]+)"?/i)?.[1] || "download.zip";
\`\`\`

## 8. Frontend: save the Blob locally

\`Fetcher.download\` returns \`{blob, filename}\`; the caller triggers the browser download like this (\`react-next-admin\`'s \`operation.tsx\` already uses this pattern):

\`\`\`ts
const url = URL.createObjectURL(blob);
const a = document.createElement("a");
a.href = url;
a.download = filename;
document.body.appendChild(a);
a.click();
document.body.removeChild(a);
setTimeout(() => URL.revokeObjectURL(url), 0);
\`\`\`

## Official docs

- [fetch](https://developer.mozilla.org/en-US/docs/Web/API/Window/fetch)
- [Blob](https://developer.mozilla.org/en-US/docs/Web/API/Blob)
- [URL.createObjectURL](https://developer.mozilla.org/en-US/docs/Web/API/URL/createObjectURL)
- [URL.revokeObjectURL](https://developer.mozilla.org/en-US/docs/Web/API/URL/revokeObjectURL)
- [Content-Disposition](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Content-Disposition)
- [Access-Control-Expose-Headers](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Access-Control-Expose-Headers)
- [CORS safelisted response headers](https://developer.mozilla.org/en-US/docs/Glossary/CORS-safelisted_response_header)
- [RFC 5987](https://datatracker.ietf.org/doc/html/rfc5987)
`;

export default function ZipDownloadExamplePage() {
    const t = useTranslations("ZipDownloadExample");
    const locale = useLocale();
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

                <div className="prose-doc mt-8">
                    <ReactMarkdown remarkPlugins={[remarkGfm]}>{doc}</ReactMarkdown>
                </div>
            </main>
        </div>
    );
}
