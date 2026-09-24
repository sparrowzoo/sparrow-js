"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { Icons } from "@/components/ui/icons";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { SubmitHandler, useForm } from "react-hook-form";
import { FormData, OuterSchema } from "@/schema/sign-up";
import { valibotResolver } from "@hookform/resolvers/valibot";
import { ErrorMessage } from "@hookform/error-message";
import signUp from "@/api/signup";
import toast from "react-hot-toast";
import useCaptcha from "@/common/hook/CaptchaHook";
import { useLocale, useTranslations } from "next-intl";
import useAuthSuffix from "@/components/passport/use-auth-suffix";
import CaptchaImage from "@/components/passport/captcha-image";
import styles from "@/components/passport/passport.module.css";

type UserAuthFormProps = React.HTMLAttributes<HTMLDivElement>;

export function AuthForm({ className, ...props }: UserAuthFormProps) {
  const t = useTranslations("Passport.sign-up");
  const locale = useLocale();
  const authSuffix = useAuthSuffix();
  const [isLoading, setIsLoading] = React.useState(false);
  const [submitError, setSubmitError] = React.useState("");
  const captchaRef = useCaptcha();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    mode: "onChange",
    resolver: valibotResolver(OuterSchema, { abortEarly: false }),
  });

  const onSubmit: SubmitHandler<FormData> = async (data) => {
    setIsLoading(true);
    setSubmitError("");
    try {
      await signUp(data, t);
      toast.success(t("sign-up-success"));
      window.location.assign(`/${locale}/sign-in/${window.location.search}${window.location.hash}`);
    } catch {
      setSubmitError(t("sign-up-error"));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={cn("grid gap-6", className)} {...props}>
      <form
        className={styles.form}
        onSubmit={handleSubmit(onSubmit)}
        aria-busy={isLoading}
        noValidate
      >
        <div className={styles.field}>
          <Label className={styles.label} htmlFor="email">
            {t("email")}
          </Label>
          <Input
            {...register("email")}
            className={styles.input}
            id="email"
            type="email"
            autoCapitalize="none"
            autoComplete="email"
            autoCorrect="off"
            placeholder={t("email")}
            disabled={isLoading}
            required
            aria-invalid={Boolean(errors.email)}
            aria-describedby={errors.email ? "email-error" : undefined}
          />
          <ErrorMessage
            errors={errors}
            name="email"
            render={({ message }) => (
              <p id="email-error" className={styles.fieldError} role="alert">
                {message}
              </p>
            )}
          />
        </div>

        <div className={styles.field}>
          <Label className={styles.label} htmlFor="userName">
            {t("username")}
          </Label>
          <Input
            {...register("userName")}
            className={styles.input}
            id="userName"
            type="text"
            autoCapitalize="none"
            autoComplete="username"
            autoCorrect="off"
            placeholder={t("username")}
            disabled={isLoading}
            required
            aria-invalid={Boolean(errors.userName)}
            aria-describedby={errors.userName ? "username-error" : undefined}
          />
          <ErrorMessage
            errors={errors}
            name="userName"
            render={({ message }) => (
              <p id="username-error" className={styles.fieldError} role="alert">
                {message}
              </p>
            )}
          />
        </div>

        <div className={styles.field}>
          <Label className={styles.label} htmlFor="password">
            {t("password")}
          </Label>
          <Input
            {...register("password")}
            className={styles.input}
            id="password"
            type="password"
            autoComplete="new-password"
            placeholder={t("password")}
            disabled={isLoading}
            required
            aria-invalid={Boolean(errors.password)}
            aria-describedby={errors.password ? "password-error" : undefined}
          />
          <ErrorMessage
            errors={errors}
            name="password"
            render={({ message }) => (
              <p id="password-error" className={styles.fieldError} role="alert">
                {message}
              </p>
            )}
          />
        </div>

        <div className={styles.field}>
          <Label className={styles.label} htmlFor="passwordConfirm">
            {t("password-confirm")}
          </Label>
          <Input
            {...register("passwordConfirm")}
            className={styles.input}
            id="passwordConfirm"
            type="password"
            autoComplete="new-password"
            placeholder={t("password-confirm")}
            disabled={isLoading}
            required
            aria-invalid={Boolean(errors.passwordConfirm)}
            aria-describedby={
              errors.passwordConfirm ? "password-confirm-error" : undefined
            }
          />
          <ErrorMessage
            errors={errors}
            name="passwordConfirm"
            render={({ message }) => (
              <p
                id="password-confirm-error"
                className={styles.fieldError}
                role="alert"
              >
                {message}
              </p>
            )}
          />
        </div>

        <div className={styles.field}>
          <Label className={styles.label} htmlFor="captcha">
            {t("captcha")}
          </Label>
          <div className={styles.captchaRow}>
            <Input
              {...register("captcha")}
              className={styles.input}
              id="captcha"
              type="text"
              autoComplete="off"
              autoCapitalize="none"
              autoCorrect="off"
              placeholder={t("captcha")}
              disabled={isLoading}
              required
              aria-invalid={Boolean(errors.captcha)}
              aria-describedby={errors.captcha ? "captcha-error" : undefined}
            />
            <CaptchaImage
              imageRef={captchaRef}
              alt={t("captcha")}
              refreshLabel={t("captcha-refresh")}
              disabled={isLoading}
            />
          </div>
          <ErrorMessage
            errors={errors}
            name="captcha"
            render={({ message }) => (
              <p id="captcha-error" className={styles.fieldError} role="alert">
                {message}
              </p>
            )}
          />
        </div>

        {submitError && (
          <p className={styles.fieldError} role="alert">
            {submitError}
          </p>
        )}

        <Button type="submit" className={styles.primaryButton} disabled={isLoading}>
          {isLoading && (
            <Icons.spinner className="mr-2 h-4 w-4 animate-spin" aria-hidden="true" />
          )}
          {isLoading ? t("submitting") : t("sign-up")}
        </Button>
      </form>

      <p className={styles.formSwitch}>
        {t("to-sign-in")} <a href={`/${locale}/sign-in/${authSuffix}`}>{t("sign-in")}</a>
      </p>
    </div>
  );
}
