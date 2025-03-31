import {useEffect, useRef} from "react";
import CAPTCHA_URL from "@/utils/constant";

export default function useCaptcha() {
    const captchaRef = useRef<HTMLImageElement>(null);
    useEffect(() => {
        const captcha = captchaRef.current;
        if (captcha) {
            captcha.addEventListener("click", () => {
                captcha.src = `${CAPTCHA_URL}?${Math.random()}`;
            });
        }
    }, []);
    return captchaRef;
}