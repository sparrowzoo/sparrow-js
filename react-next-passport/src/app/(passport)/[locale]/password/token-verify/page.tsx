"use client";

import * as React from "react";
import { useEffect, useState } from "react";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { useTranslations } from "next-intl";
import toast from "react-hot-toast";
import PasswordApi from "@/api/password";
import useNavigating from "@/common/hook/NavigatingHook";
import { Link } from "@/common/i18n/navigation";
import AuthShell from "@/components/passport/auth-shell";
import styles from "@/components/passport/passport.module.css";

export default function Page() {
  const Navigations = useNavigating();
  const t = useTranslations("Passport.PasswordTokenVerify");
  const ui = useTranslations("Passport.ui");
  const [token, setToken] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [resetting, setResetting] = useState(false);

  useEffect(() => {
    const query = window.location.search.slice(1);
    const namedToken = new URLSearchParams(query).get("token");

    // Existing reset emails use a raw query; also accept an explicit token parameter.
    try {
      setToken(namedToken ?? decodeURIComponent(query));
    } catch {
      setToken("");
    }
  }, []);

  async function resetHandler(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (resetting) return;

    const errors: string[] = [];
    if (!token) {
      errors.push(t("token-not-found"));
    }
    if (!password) {
      errors.push(t("new-password"));
    } else if (
      !/^(?=.*[A-Za-z])(?=.*\d)(?=.*[$@$!%*#?&])[A-Za-z\d$@$!%*#?&]{8,}$/.test(
        password
      )
    ) {
      errors.push(t("password-format-error"));
    }
    if (!confirmPassword) {
      errors.push(t("confirm-password-not-empty"));
    }
    if (password !== confirmPassword) {
      errors.push(t("password-not-match"));
    }

    if (errors.length > 0) {
      toast.error(errors.join("\n"));
      return;
    }

    setResetting(true);
    try {
      await PasswordApi.resetPassword(password, token, t);
      toast.success(t("password-reset-success"));
      Navigations.redirectToLogin();
    } catch (error) {
      // Fetcher already displays API errors; transport errors still need feedback.
      if (error instanceof Error) toast.error(error.message);
    } finally {
      setResetting(false);
    }
  }

  return (
    <AuthShell
      variant="reset"
      title={t("password-reset-title")}
      description={t("password-reset-description")}
    >
      <form
        className={styles.form}
        onSubmit={resetHandler}
        aria-busy={resetting}
        noValidate
      >
        <div className={styles.field}>
          <label className={styles.label} htmlFor="newPassword">
            {t("new-password-title")}
          </label>
          <input
            id="newPassword"
            name="newPassword"
            className={styles.input}
            type="password"
            autoComplete="new-password"
            required
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            placeholder={t("new-password")}
            disabled={resetting}
          />
        </div>
        <div className={styles.field}>
          <label className={styles.label} htmlFor="confirmPassword">
            {t("confirm-password-title")}
          </label>
          <input
            id="confirmPassword"
            name="confirmPassword"
            className={styles.input}
            type="password"
            autoComplete="new-password"
            required
            value={confirmPassword}
            onChange={(event) => setConfirmPassword(event.target.value)}
            placeholder={t("confirm-password-title")}
            disabled={resetting}
          />
        </div>
        <button
          className={styles.primaryButton}
          type="submit"
          disabled={resetting}
        >
          {resetting ? ui("resetPending") : t("confirm")}
          <ArrowRight size={17} aria-hidden="true" />
        </button>
      </form>
      <div className={styles.formSwitch}>
        <Link href="/sign-in">
          <ArrowLeft size={15} aria-hidden="true" />
          {ui("backToSignIn")}
        </Link>
      </div>
    </AuthShell>
  );
}
