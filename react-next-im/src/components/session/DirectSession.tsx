import * as React from "react";
import { Link } from "@/common/i18n/navigation";
import { useTranslations } from "next-intl";

export default function DirectSession(sessionProp: { sessionKey: string }) {
  const t = useTranslations("ButtonText");

  const sessionUrl: any = `/chat/sessions/session?sessionKey=${sessionProp.sessionKey}`;
  return (
    <div className={"flex flex-row items-center justify-center mt-4"}>
      <Link
        className={
          "w-1/6  bg-gray-500 hover:bg-gray-900 text-white font-bold py-2 px-4 rounded"
        }
        href={sessionUrl}
      >
        {t("send")}
      </Link>
    </div>
  );
}
