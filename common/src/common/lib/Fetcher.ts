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
    redirectToLogin?: () =>void
}

interface PostProps extends GetProps {
    body: any
}

export default class Fetcher {
    static async get(
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
                const result = (await response.json()) as Result;
                if (result.code != "0") {
                    toast.error(translator ? translator(result.key) : result.message);
                    if (result.key == "user_not_login") {
                        if(redirectToLogin) {
                            redirectToLogin();
                        }
                    }
                    return Promise.reject(result);
                }
                return result;
            });
    }

    static async post(
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
                const result = (await response.json()) as Result;
                if (result.code != "0") {
                    toast.error(translator ? translator(result.key) : result.message);
                    if (result.key == "user_not_login") {
                        if(redirectToLogin) {
                            redirectToLogin();
                        }
                    }
                    return Promise.reject(result);
                }
                return result;
            });
    }
}
