//重定向url 不要直接读url 更安全些
//重定向到指定url
import { LOGIN_URL, WWW_ROOT } from "@/common/lib/Env";

export function redirectTo(directUrl: string) {
  if (typeof window === "undefined") {
    return;
  }
  if (directUrl) {
    window.location.href = directUrl;
    return;
  }
  window.location.href = "/";
}

export function redirectToLogin(
  withRef: boolean = true,
  timeout: number = 2000
) {
  if (typeof window === "undefined") {
    return;
  }
  setTimeout(() => {
    if (withRef) {
      window.location.href = `${LOGIN_URL}?${window.location.href}`;
    } else {
      window.location.href = `${LOGIN_URL}`;
    }
  }, timeout);
}

export function redirectToIndex(timeout: number = 2000) {
  if (typeof window === "undefined") {
    return;
  }
  setTimeout(() => {
    window.location.href = `${WWW_ROOT}`;
  }, timeout);
}
