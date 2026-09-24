import { useLocale, useTranslations } from "next-intl";
import LocaleSwitcherSelect from "./LocaleSwitcherSelect";
import { routing } from "@/i18n/routing";

export type LocaleSwitcherProps = {
  className?: string;
  selectClassName?: string;
  contentClassName?: string;
};

export default function LocaleSwitcher({
  className,
  selectClassName,
  contentClassName,
}: LocaleSwitcherProps = {}) {
  const t = useTranslations("LocaleSwitcher");
  const locale = useLocale();
  const { locales } = routing;
  return (
    <LocaleSwitcherSelect
      defaultValue={locale}
      label={t("label")}
      className={className}
      selectClassName={selectClassName}
      contentClassName={contentClassName}
      shortLabels={{zh: "中文", en: "EN"}}
    >
      {locales.map((cur) => (
        <option key={cur} value={cur} className="bg-popover text-popover-foreground">
          {t("locale", { locale: cur })}
        </option>
      ))}
    </LocaleSwitcherSelect>
  );
}
