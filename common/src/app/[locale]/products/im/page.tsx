import {localeAlternates} from "@/lib/site-metadata";
import type {Metadata} from "next";
import {getTranslations} from "next-intl/server";
import ServiceProduct from "../_components/service-product";
import {JsonLd, softwareApplicationJsonLd} from "@/lib/jsonld";

type PageProps = {params: Promise<{locale: string}>};

export async function generateMetadata({params}: PageProps): Promise<Metadata> {
    const {locale} = await params;
    const t = await getTranslations({locale, namespace: "website.products.im.page"});
    return {
    alternates: localeAlternates(locale, "/products/im"),title: `${t("name")} · Sparrow Zoo`, description: t("description"), openGraph: {title: `${t("name")} · Sparrow Zoo`, description: t("description"), type: "website"}};
}

export default async function ImPage({params}: PageProps) {
    const {locale} = await params;
    const t = await getTranslations({locale, namespace: "website.products.im.page"});
    return <>
        <JsonLd data={softwareApplicationJsonLd({locale, name: t("name"), description: t("description"), path: "/products/im", category: "CommunicationApplication"})} />
        <ServiceProduct id="im" locale={locale}/>
    </>;
}
