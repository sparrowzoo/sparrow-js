import {
  API_BASIC_URL,
  SESSION_STORAGE,
  TOKEN_KEY,
  TOKEN_STORAGE,
  USER_INFO_KEY,
} from "@/lib/EnvUtils";
import toast from "react-hot-toast";
import { Fetcher } from "@/lib/Fetcher";

export function removeToken() {
  sessionStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(TOKEN_KEY);
  sessionStorage.removeItem(USER_INFO_KEY);
}

async function getToken(generateVisitorToken?: boolean) {
  if (generateVisitorToken === undefined || generateVisitorToken === null) {
    generateVisitorToken = false;
  }

  let token = sessionStorage.getItem(TOKEN_KEY);
  if (token) {
    return token;
  }
  token = localStorage.getItem(TOKEN_KEY);
  if (token) {
    return token;
  }
  if (!generateVisitorToken) {
    return "";
  }
  await Fetcher.get("/chat/v2/get-visitor-token.json", false)
    .then(async (response: Result) => {
      if (response.code == "0") {
        token = response.data;
        sessionStorage.setItem(TOKEN_KEY, response.data);
      } else {
        toast.error(response.message);
      }
    })
    .catch((error) => {
      toast.error(error.message);
      console.error(error);
    });
  return token;
}

function setToken(token: string) {
  //注意大小写
  if (TOKEN_STORAGE == SESSION_STORAGE) {
    sessionStorage.setItem(TOKEN_KEY, token);
    return;
  }
  localStorage.setItem(TOKEN_KEY, token);
}

export { getToken, setToken };
