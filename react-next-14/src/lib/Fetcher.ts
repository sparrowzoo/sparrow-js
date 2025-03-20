import { getToken } from "@/lib/TokenUtils";
import { API_BASIC_URL } from "@/lib/EnvUtils";
import toast from "react-hot-toast";

//https://nextjs.org/docs/app/getting-started/fetching-data
// https://developer.mozilla.org/zh-CN/docs/Web/API/Window/fetch
class Fetcher {
  static async get(url, withToken = true) {
    url = API_BASIC_URL + url;
    let token: string | null = null;
    if (withToken) {
      token = await getToken(false).then((token) => token);
    }
    return new Promise((resolve, reject) => {
      fetch(url, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: token as string,
        },
      })
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

  static async post(url, body, withToken = true) {
    url = API_BASIC_URL + url;
    let token: string | null = null;
    if (withToken) {
      token = await getToken(false).then((token) => token);
    }

    return new Promise((resolve, reject) => {
      fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: token as string,
        },
        body: body,
      })
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

export { Fetcher };
