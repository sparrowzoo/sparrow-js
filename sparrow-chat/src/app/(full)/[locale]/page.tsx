import LocaleEntry from "@/components/LocaleEntry";

export default async function Page({params}: {params: Promise<{locale: string}>}) {
    const {locale} = await params;
    return <LocaleEntry locale={locale} />;
}
