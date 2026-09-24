import {API_BASIC_URL} from "@/common/lib/Env";
import toast from "react-hot-toast";
import CrosStorage from "@/common/lib/CrosStorage";
import Result from "@/common/lib/protocol/Result";
import {Translator} from "@/common/lib/TranslatorType";
//https://nextjs.org/docs/app/getting-started/fetching-data
// https://developer.mozilla.org/zh-CN/docs/Web/API/Window/fetch

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

export default class Fetcher {
    static async get<T = unknown>(
        {url, translator, crosStorage, withCookie, redirectToLogin}: GetProps
    ) {
        if (!crosStorage) {
            crosStorage = CrosStorage.getCrosStorage();
        }
        if (!withCookie) {
            withCookie = false;
        }
        if (url.indexOf("http") < 0) {
            url = API_BASIC_URL + url;
        }
        let token: string | null = null;
        if (crosStorage) {
            token = await crosStorage?.getToken().then((token) => token);
        }
        const options: RequestInit = {
            method: "GET",
            //  credentials: "include", // 允许携带cookie
            headers: {
                Authorization: token as string,
            },
        };
        if (withCookie) {
            options.credentials = "include"; //跨域时携带cookie
        }
        return fetch(url, options)
            .then(async (response) => {
                const result = (await response.json()) as Result<T>;
                if (result.code != "0") {
                    const message: string = translator ? translator(result.key as string) : result.message as string;
                    toast.error(message);
                    if (result.key == "user_not_login") {
                        if (redirectToLogin) {
                            redirectToLogin();
                        }
                    }
                    return Promise.reject(result);
                }
                return result;
            });
    }

    static async post<T = unknown>(
        {url, translator, crosStorage, withCookie, redirectToLogin, body}: PostProps,
    ) {
        if (url.indexOf("http") < 0) {
            url = API_BASIC_URL + url;
        }
        if (!withCookie) {
            withCookie = false;
        }
        if (!crosStorage) {
            crosStorage = CrosStorage.getCrosStorage();
        }
        let token: string | null = null;
        if (crosStorage) {
            token = await crosStorage.getToken().then((token) => token);
        }

        const data = typeof body === "object" ? JSON.stringify(body) : body;
        const options: RequestInit = {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: token as string,
            },
            body: data,
        };
        if (withCookie) {
            options.credentials = "include"; //跨域时携带cookie
        }
        return fetch(url, options)
            .then(async (response) => {
                const result = (await response.json()) as Result<T>;
                if (result.code != "0") {
                    const message: string = translator ? translator(result.key as string) : result.message as string;
                    toast.error(message);
                    
                    if (result.key == "user_not_login") {
                        if (redirectToLogin) {
                            redirectToLogin();
                        }
                    }
                    return Promise.reject(result);
                }
                return result;
            });
    }

    /**
     * 下载文件（二进制流）。
     * 与 post 不同：后台约定出错时返回标准 Result JSON（Content-Type: application/json），
     * 成功时直接返回 zip 二进制流（application/zip），因此这里按响应头 Content-Type 分流处理。
     */
    static async download(
        {url, translator, crosStorage, withCookie, redirectToLogin, body}: PostProps,
    ): Promise<DownloadResult> {
        if (url.indexOf("http") < 0) {
            url = API_BASIC_URL + url;
        }
        if (!withCookie) {
            withCookie = false;
        }
        if (!crosStorage) {
            crosStorage = CrosStorage.getCrosStorage();
        }
        let token: string | null = null;
        if (crosStorage) {
            token = await crosStorage.getToken().then((token) => token);
        }

        const data = typeof body === "object" ? JSON.stringify(body) : body;
        const options: RequestInit = {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: token as string,
            },
            body: data,
        };
        if (withCookie) {
            options.credentials = "include"; //跨域时携带cookie
        }
        const response = await fetch(url, options);

        // 出错分支：复用与 post 一致的错误提示与未登录跳转
        const contentType = response.headers.get("content-type") || "";
        if (contentType.indexOf("application/json") >= 0) {
            const result = (await response.json()) as Result;
            const message: string = translator ? translator(result.key as string) : result.message as string;
            toast.error(message);
            if (result.key == "user_not_login") {
                if (redirectToLogin) {
                    redirectToLogin();
                }
            }
            return Promise.reject(result);
        }

        // 成功分支：读取二进制流，并从 Content-Disposition 解析下载文件名
        const blob = await response.blob();
        let filename = "download.zip";
        const disposition = response.headers.get("content-disposition");
        if (disposition) {
            // 优先解析 RFC 5987 编码文件名（filename*=UTF-8''...），否则回退到普通 filename="..."
            const starMatch = disposition.match(/filename\*=UTF-8''([^;]+)/i);
            if (starMatch) {
                try {
                    filename = decodeURIComponent(starMatch[1]);
                } catch {
                    filename = starMatch[1];
                }
            } else {
                const match = disposition.match(/filename="?([^";]+)"?/i);
                if (match) {
                    filename = match[1];
                }
            }
        }
        return {blob, filename};
    }
}
