import {
  SESSION_STORAGE,
  TOKEN_KEY,
  TOKEN_STORAGE,
  USER_INFO_KEY,
} from "@/common/lib/Env";

export function removeToken() {
  sessionStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(TOKEN_KEY);
  sessionStorage.removeItem(USER_INFO_KEY);
}

async function getToken(generateVisitorToken?: () => Promise<string>) {
  document.domain;
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
  token = await generateVisitorToken();
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
