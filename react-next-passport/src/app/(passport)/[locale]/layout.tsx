import React, {ReactNode, Suspense} from "react";
import "./globals.css";
import {ThemeProvider} from "@/components/theme-provider";
import {Toaster} from "react-hot-toast";
import {hasLocale, Locale, NextIntlClientProvider} from "next-intl";
import {getMessages, getTranslations} from "next-intl/server";
import {routing} from "@/i18n/routing";
import {notFound} from "next/navigation";
import PassportHeader from "@/components/passport/passport-header";
import PassportFooter from "@/components/passport/passport-footer";
import styles from "@/components/passport/passport.module.css";

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
        notFound();
    }

    const t = await getTranslations({locale, namespace: "Passport.navigation"});
    const messages = await getMessages({locale});
    return (
            <html lang={locale} suppressHydrationWarning>
            <body>
                <ThemeProvider
                    attribute="class"
                    defaultTheme="system"
                    enableSystem
                    disableTransitionOnChange
                >
                    <NextIntlClientProvider locale={locale} messages={messages}>
                        <div className={styles.site}>
                            <a href="#main-content" className={styles.skipLink}>{t("skip")}</a>
                            <Suspense fallback={<div className={styles.headerPlaceholder}/> }><PassportHeader/></Suspense>
                            <main id="main-content" className={styles.main}>{children}</main>
                            <PassportFooter/>
                        </div>
                        <Toaster position="top-center" reverseOrder={false} toastOptions={{className: styles.toast}}/>
                    </NextIntlClientProvider>
                </ThemeProvider>
            </body>
            </html>
    );
}
