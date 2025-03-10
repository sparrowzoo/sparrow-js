import getToken from "@/lib/TokenUtils";
import { API_BASIC_URL } from "@/lib/EnvUtils";

//https://nextjs.org/docs/app/getting-started/fetching-data

async function get(url) {
  url = API_BASIC_URL + url;
  const token = await getToken(url, false).then((token) => token);
  fetch(url, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: token as string,
    },
  }).then((response) => {
    if (!response.ok) throw new Error("HTTP状态异常: " + response.status); // 检查响应状态‌:ml-citation{ref="5" data="citationList"}
    return response.json();
  });
}

async function post(url, body) {
  url = API_BASIC_URL + url;
  const token = await getToken("", false).then((token) => token);
  fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: token as string,
    },
    body: body,
  }).then((response) => {
    if (!response.ok) throw new Error("HTTP状态异常: " + response.status); // 检查响应状态‌:ml-citation{ref="5" data="citationList"}
    return response.json();
  });
}

export { get, post };
