import { API_BASIC_URL } from "@/common/lib/Env";
import toast from "react-hot-toast";
import CrosStorage from "@/common/lib/CrosStorage";

//https://nextjs.org/docs/app/getting-started/fetching-data
// https://developer.mozilla.org/zh-CN/docs/Web/API/Window/fetch
export default class Fetcher {
  static async get(
    url: string,
    translate: (key: string) => string,
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
    return new Promise((resolve, reject) => {
      fetch(url, options)
        .then(async (response) => {
          const result = (await response.json()) as any;
          if (result.code != "0") {
            toast.error(translate(result.key));
            if (reject) {
              reject(result);
            }
          } else {
            if (resolve) {
              resolve(result);
            }
          }
        })
        .catch((error) => {
          toast.error(error.message);
          if (reject) {
            reject(error);
          }
        });
    });
  }

  static async post(
    url: string,
    body: any,
    translate: (key: string) => string,
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
    return new Promise((resolve, reject) => {
      fetch(url, options)
        .then(async (response) => {
          const result = (await response.json()) as any;
          if (result.code != "0") {
            toast.error(translate(result.key));
            if (reject) {
              reject(result);
            }
          } else {
            if (resolve) {
              resolve(result);
            }
          }
        })
        .catch((error) => {
          toast.error(error.message);
          if (reject) {
            reject(error);
          }
        });
    });
  }
}
