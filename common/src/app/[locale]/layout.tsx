import type {Metadata} from "next";
import {hasLocale, NextIntlClientProvider} from "next-intl";
import {getTranslations} from "next-intl/server";
import {notFound} from "next/navigation";
import {routing} from "@/i18n/routing";
import {ThemeProvider} from "@/common/components/header/theme-provider";
import "../globals.css";
import Header from "@/common/components/header/header";
import SiteFooter from "@/app/[locale]/_components/site-footer";

export function generateStaticParams() {
    return routing.locales.map((locale) => ({locale}));
}

export async function generateMetadata({params}: { params: Promise<{ locale: string }> }): Promise<Metadata> {
    const {locale} = await params;
    const validLocale = hasLocale(routing.locales, locale) ? locale : routing.defaultLocale;
    const t = await getTranslations({locale: validLocale, namespace: "LocaleLayout"});
    return {
        title: t("title"),
        description: t("description"),
    };
}

export default async function RootLayout({
                                             children,
                                             params,
                                         }: Readonly<{
    children: React.ReactNode;
    params: Promise<{ locale: string }>;
}>) {
    const {locale} = await params;
    if (!hasLocale(routing.locales, locale)) {
        notFound();
    }
    return (
        <html lang={locale} suppressHydrationWarning>
        <body
            className="antialiased"
        >
        <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
        >
            <NextIntlClientProvider>
                <Header live={false} profile={true}/>
                {children}
                <SiteFooter/>
            </NextIntlClientProvider>
        </ThemeProvider>
        </body>
        </html>
    );
}
