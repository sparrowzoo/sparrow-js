"use client";

import { AuthForm } from "@/components/auth-form";
import AuthShell from "@/components/passport/auth-shell";
import { useTranslations } from "next-intl";

export default function Page() {
  const t = useTranslations("Passport.sign-up");

  return (
    <AuthShell
      variant="sign-up"
      title={t("sign-up-title")}
      description={t("sign-up-description")}
    >
      <AuthForm />
    </AuthShell>
  );
}
