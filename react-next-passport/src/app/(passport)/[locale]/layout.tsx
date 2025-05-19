import React, { ReactNode } from "react";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { Toaster } from "react-hot-toast";
import { hasLocale, Locale, NextIntlClientProvider } from "next-intl";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { routing } from "@/i18n/routing";
import { notFound } from "next/navigation";
import Header from "@/common/components/header/header";

type Props = {
  children: ReactNode;
  params: Promise<{ locale: Locale }>;
};

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export async function generateMetadata(props: Omit<Props, "children">) {
  const { locale } = await props.params;

  const t = await getTranslations({ locale, namespace: "LocaleLayout" });

  return {
    title: t("title"),
  };
}

export default async function RootLayout({ children, params }: Props) {
  // Ensure that the incoming `locale` is valid
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }

  // Enable static rendering
  setRequestLocale(locale);
  return (
    <>
      <html lang="en" suppressHydrationWarning>
        <body className={"container"}>
          <Toaster position="top-center" reverseOrder={true} />
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            <NextIntlClientProvider>
              <Header />
              {children}
            </NextIntlClientProvider>
          </ThemeProvider>
        </body>
      </html>
    </>
  );
}
