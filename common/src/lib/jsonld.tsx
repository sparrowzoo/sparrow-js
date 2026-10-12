import {WWW_ROOT} from "@/common/lib/Env";

type JsonLdNode = Record<string, unknown>;

export function JsonLd({data}: {data: JsonLdNode | JsonLdNode[]}) {
    const payload = Array.isArray(data)
        ? {"@context": "https://schema.org", "@graph": data}
        : {"@context": "https://schema.org", ...data};
    return <script type="application/ld+json" dangerouslySetInnerHTML={{__html: JSON.stringify(payload)}} />;
}

const orgName = (locale: string) => (locale === "zh" ? "麻雀窝 Sparrow Zoo" : "Sparrow Zoo");

export function organizationJsonLd(locale: string): JsonLdNode {
    return {
        "@type": "Organization",
        name: orgName(locale),
        url: WWW_ROOT,
        logo: `${WWW_ROOT}/svg/brand/sparrow-logo.svg`,
    };
}

export function websiteJsonLd(locale: string): JsonLdNode {
    return {
        "@type": "WebSite",
        name: orgName(locale),
        url: WWW_ROOT,
    };
}

export function softwareApplicationJsonLd(opts: {
    locale: string;
    name: string;
    description: string;
    path: string;
    category: string;
}): JsonLdNode {
    return {
        "@type": "SoftwareApplication",
        name: opts.name,
        description: opts.description,
        url: `${WWW_ROOT}/${opts.locale}${opts.path}/`,
        applicationCategory: opts.category,
        operatingSystem: "Web",
        offers: {"@type": "Offer", price: "0", priceCurrency: "USD"},
        provider: {"@type": "Organization", name: orgName(opts.locale), url: WWW_ROOT},
    };
}

export function courseJsonLd(opts: {
    locale: string;
    name: string;
    description: string;
    path: string;
}): JsonLdNode {
    return {
        "@type": "Course",
        name: opts.name,
        description: opts.description,
        url: `${WWW_ROOT}/${opts.locale}${opts.path}/`,
        provider: {"@type": "Organization", name: orgName(opts.locale), url: WWW_ROOT},
    };
}

export function personJsonLd(locale: string): JsonLdNode {
    return {
        "@type": "Person",
        name: locale === "zh" ? "志哥" : "Zhige",
        jobTitle: locale === "zh" ? "讲师 / 架构师" : "Instructor / Architect",
        description: locale === "zh"
            ? "2008 年开始从事开发工作，热爱编程、分享与开源。"
            : "A developer since 2008 who enjoys programming, sharing knowledge, and open source.",
        url: `${WWW_ROOT}/${locale}/study/`,
        worksFor: {"@type": "Organization", name: orgName(locale), url: WWW_ROOT},
    };
}
