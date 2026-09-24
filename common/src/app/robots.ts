import type {MetadataRoute} from "next";
import {WWW_ROOT} from "@/common/lib/Env";

export const dynamic = "force-static";

export default function robots(): MetadataRoute.Robots {
    return {rules: {userAgent: "*", allow: "/", disallow: "/legacy/"}, sitemap: `${WWW_ROOT}/sitemap.xml`};
}
