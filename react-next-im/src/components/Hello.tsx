import { useTranslations } from "next-intl";
import React from "react";
import Talk from "@/components/im/Talk";

export default function Hello() {
  const t = useTranslations("MessageBroker");
  return (
    <div>
      <h1>Hello</h1>
      {t("account")}
      <Talk />
    </div>
  );
}
