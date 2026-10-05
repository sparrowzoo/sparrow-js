"use client";

import {useEffect} from "react";
import ThreeDotLoading from "@/common/components/ThreeDotLoading";
import {routing} from "@/i18n/routing";

/** Static entry pages keep the original URL's query and fragment during navigation. */
export default function LocaleEntry({locale}: {locale?: string}) {
    useEffect(() => {
        let selectedLocale = locale;
        if (!selectedLocale) {
            try {
                selectedLocale = localStorage.getItem("locale") ?? undefined;
            } catch {
                // Storage may be disabled; the configured default remains usable.
            }
        }
        const validLocale = routing.locales.find((item) => item === selectedLocale)
            ?? routing.defaultLocale;
        window.location.replace(
            `/${validLocale}/chat/friends/contact/${window.location.search}${window.location.hash}`
        );
    }, [locale]);

    return <ThreeDotLoading />;
}
