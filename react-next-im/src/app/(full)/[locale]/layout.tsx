import {notFound} from "next/navigation";
import {hasLocale, Locale, NextIntlClientProvider} from "next-intl";
import {getTranslations} from "next-intl/server";
import {ReactNode} from "react";
import "@/app/globals.css";
import "@/app/(full)/theme.css";
import "@/app/(full)/pages-theme.css";
import "@/components/contact/contact-theme.css";
import "@/components/session/session-theme.css";
import {routing} from "@/i18n/routing";
import Root from "@/components/Root";

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
    };
}

export default async function RootLayout({children, params}: Props) {
    // Ensure that the incoming `locale` is valid
    const {locale} = await params;
    if (!hasLocale(routing.locales, locale)) {
        notFound();
    }

    return (
        <html className="h-full" lang={locale} suppressHydrationWarning>
        <body
            className={
                "im-theme mx-auto text-left justify-center align-middle content-center w-full "
            }
        >
        <NextIntlClientProvider>
            <Root>{children}</Root>
        </NextIntlClientProvider>
        </body>
        </html>
    );
}
