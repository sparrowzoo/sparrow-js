import {notFound} from "next/navigation";
import {hasLocale, Locale, NextIntlClientProvider} from "next-intl";
import {getTranslations} from "next-intl/server";
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

    return (
        <html className="h-full" lang={locale} suppressHydrationWarning>
        <body
            className={
                "min-h-svh w-full text-left antialiased"
            }
        >
        <NextIntlClientProvider>
            <AdminRootLayout>
                <Toaster position="top-center" reverseOrder={true} toastOptions={{
                    style: {
                        background: "var(--popover)",
                        color: "var(--popover-foreground)",
                        border: "1px solid var(--border)",
                        borderRadius: "var(--radius)",
                        boxShadow: "0 8px 30px rgb(0 0 0 / 12%)",
                    },
                }}/>

                {children}</AdminRootLayout>
        </NextIntlClientProvider>
        </body>
        </html>
    );
}
