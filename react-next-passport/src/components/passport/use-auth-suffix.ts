"use client";

import {useEffect, useState} from "react";

/** Preserve the raw callback query, repeated parameters and hash between auth pages. */
export default function useAuthSuffix() {
    const [suffix, setSuffix] = useState("");
    useEffect(() => {
        const update = () => setSuffix(window.location.search + window.location.hash);
        update();
        window.addEventListener("popstate", update);
        window.addEventListener("hashchange", update);
        return () => {
            window.removeEventListener("popstate", update);
            window.removeEventListener("hashchange", update);
        };
    }, []);
    return suffix;
}
