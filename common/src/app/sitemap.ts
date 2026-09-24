import type {MetadataRoute} from "next";
import {WWW_ROOT} from "@/common/lib/Env";
import {localeAlternates, publicSitePaths} from "@/lib/site-metadata";
import {documents} from "./[locale]/_components/site-content";

export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
    return [
        ...publicSitePaths.flatMap((path) => ["zh", "en"].map((locale) => {
            const {canonical, languages} = localeAlternates(locale, path);
            return {url: canonical, alternates: {languages}};
        })),
        ...documents.map(({href}) => ({url: `${WWW_ROOT}${href}`})),
    ];
}
