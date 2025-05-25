import { useTranslations } from "next-intl";

export default function Hello() {
  const t = useTranslations("MessageBroker");
  return (
    <div>
      <h1>Hello</h1>
      {t("account")}

      {/*<Talk />*/}
    </div>
  );
}
