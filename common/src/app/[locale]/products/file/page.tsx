import {localeAlternates} from "@/lib/site-metadata";
import type {Metadata} from "next";
import {getTranslations, setRequestLocale} from "next-intl/server";
import ServiceProduct from "../_components/service-product";

type PageProps = {params: Promise<{locale: string}>};

export async function generateMetadata({params}: PageProps): Promise<Metadata> {
    const {locale} = await params;
    const t = await getTranslations({locale, namespace: "website.products.file.page"});
    return {
    alternates: localeAlternates(locale, "/products/file"),title: `${t("name")} · Sparrow Zoo`, description: t("description")};
}

export default async function FilePage({params}: PageProps) {
    const {locale} = await params;
    setRequestLocale(locale);
    return <ServiceProduct id="file" locale={locale}/>;
}
