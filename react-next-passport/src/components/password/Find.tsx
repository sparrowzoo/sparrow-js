"use client";

import * as React from "react";
import { Send } from "lucide-react";
import { useTranslations } from "next-intl";
import toast from "react-hot-toast";
import PasswordApi from "@/api/password";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import styles from "@/components/passport/passport.module.css";

export default function FindPassword() {
  const t = useTranslations("Passport.find-password");
  const ui = useTranslations("Passport.ui");
  const emailId = React.useId();
  const [email, setEmail] = React.useState("");
  const [sending, setSending] = React.useState(false);

  async function findPasswordHandler(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    event.stopPropagation();
    if (sending) return;

    const address = email.trim();
    if (!address) {
      toast.error(t("input-email-to-find-password"));
      return;
    }

    setSending(true);
    try {
      await PasswordApi.findPassword(address, t);
      toast.success(t("password-reset-email-sent"));
    } catch (error) {
      // Fetcher already displays API errors; transport errors still need feedback.
      if (error instanceof Error) toast.error(error.message);
    } finally {
      setSending(false);
    }
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <button type="button" className={styles.forgotButton}>
          {t("forgot-password")}
        </button>
      </DialogTrigger>
      <DialogContent className={styles.dialog}>
        <DialogHeader>
          <DialogTitle className={styles.dialogTitle}>
            {t("find-password")}
          </DialogTitle>
          <DialogDescription className={styles.dialogDescription}>
            {t("input-email-to-find-password")}
          </DialogDescription>
        </DialogHeader>
        <form
          className={styles.form}
          onSubmit={findPasswordHandler}
          aria-busy={sending}
        >
          <div className={styles.field}>
            <label className={styles.label} htmlFor={emailId}>
              {ui("emailLabel")}
            </label>
            <input
              id={emailId}
              className={styles.input}
              name="email"
              type="email"
              autoComplete="email"
              required
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              placeholder="you@example.com"
              disabled={sending}
            />
          </div>
          <div className={styles.dialogActions}>
            <DialogClose asChild>
              <button type="button" className={styles.secondaryButton}>
                {t("close")}
              </button>
            </DialogClose>
            <button
              type="submit"
              className={styles.primaryButton}
              disabled={sending}
            >
              <Send size={16} aria-hidden="true" />
              {sending ? ui("sending") : t("send-find-password-email")}
            </button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
