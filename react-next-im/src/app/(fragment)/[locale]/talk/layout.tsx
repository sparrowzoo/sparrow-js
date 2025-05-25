import { notFound } from "next/navigation";
import { hasLocale, Locale } from "next-intl";
import {
  getMessages,
  getTranslations,
  setRequestLocale,
} from "next-intl/server";
import * as React from "react";
import "@/app/globals.css";
import { routing } from "@/i18n/routing";
import ClientComponent from "@/app/(fragment)/[locale]/talk/ClientComponent";

type Props = {
  children: React.ReactNode;
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
    return notFound();
  }
  // Enable static rendering
  setRequestLocale(locale);
  const messages: Record<string, any> = await getMessages(locale as any);

  return (
    <ClientComponent
      containerId={"content-container"}
      locale={locale}
      messages={messages}
    ></ClientComponent>
  );
}
