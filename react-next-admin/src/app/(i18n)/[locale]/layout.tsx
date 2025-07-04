import {notFound} from "next/navigation";
import {hasLocale, Locale, NextIntlClientProvider} from "next-intl";
import {getTranslations, setRequestLocale} from "next-intl/server";
import React, {ReactNode} from "react";
import "@/app/globals.css";
import {routing} from "@/i18n/routing";
import AdminRootLayout from "@/components/root-layout";
import {Toaster} from "react-hot-toast";

type Props = {
    children: ReactNode;
    params: Promise<{ locale: Locale }>;
};

export function generateStaticParams() {
    return routing.locales.map((locale) => ({locale}));
}

export async function generateMetadata(props: Omit<Props, "children">) {
    const {locale} = await props.params;

    const t = await getTranslations({locale, namespace: "LocaleLayout"});

    return {
        title: t("title"),
        description: t("description"),
    };
}

export default async function RootLayout({children, params}: Props) {
    // Ensure that the incoming `locale` is valid
    const {locale} = await params;
    if (!hasLocale(routing.locales, locale)) {
        return notFound();
    }

    // Enable static rendering
    setRequestLocale(locale);

    return (
        <html className="h-full" lang={locale}>
        <body
            className={
                "mx-auto text-left justify-center align-middle content-center w-full "
            }
        >
        <NextIntlClientProvider>
            <AdminRootLayout>
                <Toaster position="top-center" reverseOrder={true}/>

                {children}</AdminRootLayout>
        </NextIntlClientProvider>
        </body>
        </html>
    );
}
