//重定向url 不要直接读url 更安全些
//重定向到指定url

import { LOGIN_URL, PASSPORT_ROOT, WWW_ROOT } from "@/common/lib/Env";
import { useLocale } from "next-intl";

export default function useNavigating() {
  const locale = useLocale();

  class Navigations {
    public static redirectToIndex(timeout: number = 2000) {
      if (typeof window === "undefined") {
        return;
      }
      const url = `${WWW_ROOT}/${locale}/`;
      setTimeout(() => {
        window.location.href = url;
      }, timeout);
    }

    public static redirectTo(directUrl: string) {
      if (directUrl) {
        window.location.href = directUrl;
        return;
      }
      Navigations.redirectToIndex();
    }

    public static redirectToLogin(
      withRef: boolean = true,
      timeout: number = 2000
    ) {
      let url = `${PASSPORT_ROOT}/${locale}${LOGIN_URL}`;
      if (withRef) {
        url += `?${window.location.href}`;
      }
      setTimeout(() => {
        window.location.href = url;
      }, timeout);
    }
  }

  return Navigations;
}
