"use client";

import {useEffect} from "react";
import {routing} from "@/i18n/routing";

/** Keep the bare product URL usable with Next.js static export. */
export default function PassportEntry() {
    useEffect(() => {
        let locale: string = routing.defaultLocale;
        try {
            const saved = localStorage.getItem("locale");
            if (routing.locales.some((value) => value === saved)) locale = saved!;
        } catch {
            // Continue with the default locale when browser storage is unavailable.
        }
        window.location.replace(`/${locale}/sign-in/${window.location.search}${window.location.hash}`);
    }, []);

    return <main style={{maxWidth: 480, margin: "15vh auto", padding: 24, fontFamily: "system-ui, sans-serif", lineHeight: 1.8}}>
        <h1>Sparrow Passport</h1>
        <p>正在进入登录页面… / Opening sign-in…</p>
        <nav aria-label="选择语言 / Choose language">
            <a href="/zh/sign-in/">中文</a>{" · "}<a href="/en/sign-in/">English</a>
        </nav>
    </main>;
}
