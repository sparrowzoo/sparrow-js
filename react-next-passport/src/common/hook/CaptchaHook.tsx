import { useEffect, useRef } from "react";
import { CAPTCHA_URL } from "@/common/lib/Env";
import Fetcher from "@/common/lib/Fetcher";

function getSessionId(captcha: HTMLImageElement) {
  const url = `${CAPTCHA_URL}?session=true&t=${Math.random()}`;
  Fetcher.get(url, null, true).then((res: Result) => {
    if (!res.data) {
      setTimeout(() => {
        getSessionId(captcha);
      }, 200);
      return;
    }
    captcha.src = `${CAPTCHA_URL}?t=${Math.random()}`;
  });
}

export default function useCaptcha() {
  const captchaRef = useRef<HTMLImageElement>(null);
  useEffect(() => {
    const captcha = captchaRef.current;
    if (captcha) {
      captcha.addEventListener("click", () => {
        captcha.src = `${CAPTCHA_URL}?${Math.random()}`;
      });
      getSessionId(captcha);
    }
  }, []);
  return captchaRef;
}
