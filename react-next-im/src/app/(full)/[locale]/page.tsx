import {setRequestLocale} from "next-intl/server";
import LocaleEntry from "@/components/LocaleEntry";

export default async function Page({params}: {params: Promise<{locale: string}>}) {
    const {locale} = await params;
    setRequestLocale(locale);
    return <LocaleEntry locale={locale} />;
}
