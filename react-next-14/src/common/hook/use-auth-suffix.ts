"use client";

import {useEffect, useState} from "react";

/** Preserve the raw callback query + hash between auth pages (OAuth flows). */
export default function useAuthSuffix(enabled = true) {
    const [suffix, setSuffix] = useState("");
    useEffect(() => {
        if (!enabled) return;
        const update = () => setSuffix(window.location.search + window.location.hash);
        update();
        window.addEventListener("popstate", update);
        window.addEventListener("hashchange", update);
        return () => {
            window.removeEventListener("popstate", update);
            window.removeEventListener("hashchange", update);
        };
    }, [enabled]);
    return suffix;
}
