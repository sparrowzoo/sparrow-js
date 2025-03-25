import {
  SESSION_STORAGE,
  TOKEN_KEY,
  TOKEN_STORAGE,
  USER_INFO_KEY,
} from "@/lib/EnvUtils";
import ChatApi from "@/lib/ChatApi";

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
  token = await ChatApi.getVisitorToken();
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
