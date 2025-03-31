import { getToken } from "@/common/lib/TokenUtils";
import { API_BASIC_URL } from "@/common/lib/Env";
import toast from "react-hot-toast";

//https://nextjs.org/docs/app/getting-started/fetching-data
// https://developer.mozilla.org/zh-CN/docs/Web/API/Window/fetch
export default class Fetcher {
  static async get(url: string, withToken = true, withCookie = false) {
    url = API_BASIC_URL + url;
    let token: string | null = null;
    if (withToken) {
      token = await getToken().then((token) => token);
    }
    const options: RequestInit = {
      method: "GET",
      //  credentials: "include", // 允许携带cookie
      headers: {
        "Content-Type": "application/json",
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
            toast.error(result?.message);
            reject(result);
          } else {
            resolve(result);
          }
        })
        .catch((error) => {
          toast.error(error.message);
          reject(error);
        });
    });
  }

  static async post(
    url: string,
    body: any,
    withToken = true,
    withCookie = false
  ) {
    url = API_BASIC_URL + url;
    let token: string | null = null;
    if (withToken) {
      token = await getToken().then((token) => token);
    }

    const options: RequestInit = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: token as string,
      },
      body: body,
    };
    if (withCookie) {
      options.credentials = "include"; //跨域时携带cookie
    }
    return new Promise((resolve, reject) => {
      fetch(url, options)
        .then(async (response) => {
          const result = (await response.json()) as any;
          if (result.code != "0") {
            toast.error(result?.message);
            reject(result);
          } else {
            resolve(result);
          }
        })
        .catch((error) => {
          toast.error(error.message);
          reject(error);
        });
    });
  }
}
