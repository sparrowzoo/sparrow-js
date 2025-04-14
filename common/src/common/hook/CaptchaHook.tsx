import { useEffect, useRef } from "react";
import { CAPTCHA_URL } from "@/common/lib/Env";
import Fetcher from "@/common/lib/Fetcher";

function loadCaptcha(captcha: HTMLImageElement) {
  const url = `${CAPTCHA_URL}?session=true&t=${Math.random()}`;
  Fetcher.get(url, null, true).then((res: Result) => {
    if (!res.data) {
      setTimeout(() => {
        loadCaptcha(captcha);
      }, 200);
      return;
    }
    captcha.src = `${CAPTCHA_URL}?t=${Math.random()}`;
    console.log("Captcha loading ...");
    captcha.addEventListener("load", () => {
      console.log("Captcha loaded");
      captcha.style.visibility = "visible";
    });
  });
}

export default function useCaptcha() {
  const captchaRef = useRef<HTMLImageElement>(null);
  useEffect(() => {
    const captcha = captchaRef.current;
    if (captcha) {
      captcha.style.visibility = "visible";
      captcha.addEventListener("click", () => {
        captcha.src = `${CAPTCHA_URL}?${Math.random()}`;
      });
      loadCaptcha(captcha);
    }
  }, []);
  return captchaRef;
}
