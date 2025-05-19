"use client";

import { useTranslations } from "next-intl";
import React from "react";
import LocaleSwitcher from "@/common/components/i18n/LocaleSwitcher";

export default function Page() {
  const t = useTranslations("LocaleLayout");

  return (
    <div className="flex items-center">
      <h1>{t("title")}</h1>
      <LocaleSwitcher />
    </div>
  );
}
