import {API_BASIC_URL} from "@/common/lib/Env";
import toast from "react-hot-toast";
import CrosStorage from "@/common/lib/CrosStorage";
import Result from "@/common/lib/protocol/Result";
import {Translator} from "@/common/lib/TranslatorType";

const HTTP_STATUS_KEYS: Record<number, string> = {
    400: "http_bad_request",
    401: "user_not_login",
    403: "http_forbidden",
};

interface GetProps {
    url: string,
    translator?: Translator,
    crosStorage?: CrosStorage,
    withCookie?: boolean,
    redirectToLogin?: () => void
}

interface PostProps extends GetProps {
    body: object | string
}

export interface DownloadResult {
    blob: Blob
    filename: string
}

export class FetchError extends Error {
    constructor(message: string, public readonly status: number) {
        super(message);
        this.name = "FetchError";
    }
}

async function parseResult<T>(response: Response): Promise<Result<T> | null> {
    try {
        const body: unknown = await response.json();
        if (!body || typeof body !== "object" || !("code" in body) || typeof body.code !== "string") {
            return null;
        }
        return body as Result<T>;
    } catch (e) {
        console.error(e);
        // 框架可能返回空内容或 HTML，此时由 HTTP 状态处理错误。
        return null;
    }
}

function translate(translator: Translator | undefined, key: string, values: Record<string, string> | undefined, fallback: string): string {
    if (!translator) return fallback;
    try {
        const message = translator(key, values);
        if (message && message !== key && !message.endsWith(`.${key}`)) {
            return message;
        }
    } catch (e) {
        console.error(e);
    }
    // 部分调用方没有传 translator，或页面命名空间缺少此键。
    return fallback;
}

function httpErrorMessage(response: Response, translator: Translator | undefined): string {
    const status = response.status;
    const otherKey = response.ok ? "http_invalid_response" : "http_request_failed";
    const key = HTTP_STATUS_KEYS[status] ?? (status >= 500 ? "system_server_error" : otherKey);
    // HTTP 成功却无法解析为 Result 时，属于响应格式错误。
    return translate(translator, key, {status: String(status)}, `HTTP ${status}`);
}

function businessError(result: Result, translator: Translator | undefined): string {
    const fallback = result.message || result.code;
    if (result.key) {
        return translate(translator, result.key, result.parameters, fallback);
    }
    return result.message || translate(translator, "business_error", {code: result.code}, fallback);
}

function rejectResponse(response: Response, result: Result | null, props: GetProps): never {
    const message = result && result.code !== "0"
        ? businessError(result, props.translator)
        : undefined;
    const error = new FetchError(message || httpErrorMessage(response, props.translator), response.status);
    toast.error(error.message);
    if (response.status === 401 || result?.key === "user_not_login") {
        props.redirectToLogin?.();
    }
    throw error;
}

async function readResult<T>(response: Response, props: GetProps): Promise<Result<T>> {
    const result = await parseResult<T>(response);
    if (!response.ok || !result || result.code !== "0") {
        rejectResponse(response, result, props);
    }
    return result;
}

async function sendRequest(method: "GET" | "POST", props: GetProps, body?: object | string): Promise<Response> {
    const storage = props.crosStorage || CrosStorage.getCrosStorage();
    const token = storage ? await storage.getToken() : null;
    const url = props.url.startsWith("http") ? props.url : API_BASIC_URL + props.url;
    const options: RequestInit = {
        method,
        headers: method === "POST"
            ? {"Content-Type": "application/json", Authorization: token as string}
            : {Authorization: token as string},
    };
    if (method === "POST") {
        options.body = typeof body === "object" ? JSON.stringify(body) : body;
    }
    if (props.withCookie) {
        options.credentials = "include";
    }
    return fetch(url, options);
}

function downloadFilename(response: Response): string {
    const disposition = response.headers.get("content-disposition");
    if (!disposition) return "download.zip";

    // 优先使用 RFC 5987 编码的文件名，再尝试普通 filename。
    const encoded = disposition.match(/filename\*=UTF-8''([^;]+)/i);
    if (encoded) {
        try {
            return decodeURIComponent(encoded[1]);
        } catch {
            return encoded[1];
        }
    }
    return disposition.match(/filename="?([^";]+)"?/i)?.[1] || "download.zip";
}

export default class Fetcher {
    static async get<T = unknown>(props: GetProps): Promise<Result<T>> {
        const response = await sendRequest("GET", props);
        return readResult<T>(response, props);
    }

    static async post<T = unknown>(props: PostProps): Promise<Result<T>> {
        const response = await sendRequest("POST", props, props.body);
        return readResult<T>(response, props);
    }

    /**
     * 下载文件（二进制流）。
     * 与 post 不同：后台约定出错时返回标准 Result JSON（Content-Type: application/json），
     * 成功时直接返回 zip 二进制流（application/zip），因此这里按响应头 Content-Type 分流处理。
     */
    static async download(props: PostProps): Promise<DownloadResult> {
        const response = await sendRequest("POST", props, props.body);
        const contentType = response.headers.get("content-type") || "";
        const isJson = contentType.includes("json");
        const isFile = response.ok && response.status !== 204 && !isJson && !contentType.includes("text/html");

        // 下载成功时必须是文件；JSON、HTML 或空响应都不能作为文件保存。
        if (!isFile) {
            const result = isJson ? await parseResult(response) : null;
            rejectResponse(response, result, props);
        }

        return {blob: await response.blob(), filename: downloadFilename(response)};
    }
}
