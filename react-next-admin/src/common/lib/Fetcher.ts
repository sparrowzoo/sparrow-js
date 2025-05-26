import { API_BASIC_URL } from "@/common/lib/Env";
import toast from "react-hot-toast";
import CrosStorage from "@/common/lib/CrosStorage";
import Result from "@/common/lib/protocol/Result";
import { Translator } from "@/common/lib/TranslatorType";

//https://nextjs.org/docs/app/getting-started/fetching-data
// https://developer.mozilla.org/zh-CN/docs/Web/API/Window/fetch
export default class Fetcher {
  static async get(
    url: string,
    translate: Translator = null,
    crosStorage: CrosStorage | null = CrosStorage.getCrosStorage(),
    withCookie = false
  ) {
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
          toast.error(translate ? translate(result.key) : result.message);
          return Promise.reject(result);
        }
        return result;
      })
      .catch((error) => {
        console.error(error);
        return Promise.reject(error);
      });
  }

  static async post(
    url: string,
    body: any,
    translator: Translator = null,
    crosStorage: CrosStorage | null = CrosStorage.getCrosStorage(),
    withCookie = false
  ) {
    if (url.indexOf("http") < 0) {
      url = API_BASIC_URL + url;
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
          return Promise.reject(result);
        } else {
          return result;
        }
      })
      .catch((error) => {
        console.error(error);
        return Promise.reject(error);
      });
  }
}
