"use client";

import {useEffect} from "react";
import Link from "next/link";
import {routing} from "@/i18n/routing";

/** A real index.html entry for static hosting, without requiring middleware. */
export default function EntryPage() {
    useEffect(() => {
        let locale: string = routing.defaultLocale;
        try {
            const savedLocale = localStorage.getItem("locale");
            if (savedLocale && routing.locales.some((item) => item === savedLocale)) {
                locale = savedLocale;
            }
        } catch {
            // Storage can be disabled; the default locale remains a valid entry.
        }
        window.location.replace(`/${locale}/${window.location.search}${window.location.hash}`);
    }, []);

    return <main className="flex min-h-svh flex-col items-center justify-center gap-5 px-6 text-center">
        <p className="text-xs font-semibold tracking-[0.2em] text-primary">SPARROW ZOO</p>
        <h1 className="text-2xl font-semibold tracking-tight">正在打开 Sparrow Zoo</h1>
        <p className="text-sm text-muted-foreground" lang="en">Opening Sparrow Zoo…</p>
        <nav aria-label="选择语言 / Choose language" className="flex gap-6 text-sm text-primary">
            <Link href="/zh/" lang="zh" prefetch={false} className="underline underline-offset-4">简体中文</Link>
            <Link href="/en/" lang="en" prefetch={false} className="underline underline-offset-4">English</Link>
        </nav>
    </main>;
}
