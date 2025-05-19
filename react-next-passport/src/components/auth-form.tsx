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
import toast, { Toaster } from "react-hot-toast";
import useCaptcha from "@/common/hook/CaptchaHook";
import Result from "@/common/lib/protocol/Result";
import { Link } from "@/common/i18n/navigation";
import { useTranslations } from "next-intl";
import useNavigating from "@/common/hook/NavigatingHook";

interface UserAuthFormProps extends React.HTMLAttributes<HTMLDivElement> {}

export function AuthForm({ className, ...props }: UserAuthFormProps) {
  const t = useTranslations("Passport.sign-up");
  const { redirectToLogin } = useNavigating();
  const [isLoading, setIsLoading] = React.useState<boolean>(false);
  const captchaRef = useCaptcha();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    mode: "onChange",
    //相当于v.parse
    resolver: valibotResolver(
      OuterSchema,
      //https://valibot.dev/guides/parse-data/
      { abortEarly: false }
    ), // Useful to check TypeScript regressions
  });
  const onSubmit: SubmitHandler<FormData> = (
    data: FormData,
    event: React.BaseSyntheticEvent | undefined
  ) => {
    setIsLoading(true);
    signUp(data, t)
      .then((result: Result) => {
        setIsLoading(false);
        toast.success(t("sign-up-success"));
        debugger;
        redirectToLogin(false);
      })
      .catch((error) => {
        console.error(error.message);
        setIsLoading(false);
      });
  };

  return (
    <div className={cn("grid gap-6", className)} {...props}>
      <Toaster position="top-center" reverseOrder={false} />
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="grid gap-2">
          <div className="grid gap-1">
            <Label className="sr-only" htmlFor="email">
              {t("email-placeholder")}
            </Label>
            <Input
              {...register("email")}
              id="email"
              type="email"
              autoCapitalize="none"
              autoComplete="email"
              autoCorrect="off"
              placeholder={t("email")}
            />
            <ErrorMessage
              errors={errors}
              name="email"
              render={({ message }) => (
                <p className="text-red-700 text-sm">{message}</p>
              )}
            />
          </div>
          <div className="grid gap-1">
            <Label className="sr-only" htmlFor="userName">
              {t("username")}
            </Label>
            <Input
              {...register("userName")}
              id="userName"
              type="text"
              placeholder={t("username")}
            />
            <ErrorMessage
              errors={errors}
              name="userName"
              render={({ message }) => (
                <p className="text-red-700 text-sm">{message}</p>
              )}
            />
          </div>
          <div className="grid gap-1">
            <div className="flex items-center">
              <Label htmlFor="password"> {t("password")}</Label>
            </div>
            <Input {...register("password")} id="password" type="password" />
            <ErrorMessage
              errors={errors}
              name="password"
              render={({ message }) => (
                <p className="text-red-700 text-sm">{message}</p>
              )}
            />
          </div>
          <div className="grid gap-1">
            <Label htmlFor="passwordConfirm">{t("password-confirm")}</Label>
            <Input
              {...register("passwordConfirm")}
              id="passwordConfirm"
              type="password"
            />
            <ErrorMessage
              errors={errors}
              name="passwordConfirm"
              render={({ message }) => (
                <p className="text-red-700 text-sm">{message}</p>
              )}
            />
          </div>

          <div className="flex-col items-left ">
            <Label className="w-32" htmlFor="captcha">
              {t("captcha")}
            </Label>
            <div className="flex flex-row items-left">
              <Input
                {...register("captcha")}
                className="w-32"
                id="captcha"
                type="text"
              />
              <img
                ref={captchaRef}
                alt="captcha"
                className="w-16 h-8 cursor-pointer"
              />
            </div>
            <ErrorMessage
              errors={errors}
              name="captcha"
              render={({ message }) => (
                <p className="text-red-700 text-sm">{message}</p>
              )}
            />
          </div>

          <Button disabled={isLoading}>
            {isLoading && (
              <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
            )}
            {t("sign-up")}
          </Button>
        </div>
      </form>
      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t" />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-background px-2 text-muted-foreground">
            {t("continue-with")}
          </span>
        </div>
      </div>
      <Button variant="outline" type="button" disabled={isLoading}>
        {isLoading ? (
          <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
        ) : (
          <Icons.gitHub className="mr-2 h-4 w-4" />
        )}{" "}
        GitHub
      </Button>

      <div className="mt-4 text-center text-sm">
        {t("to-sign-in")}
        <Link href="/sign-in" className="underline">
          {t("sign-in")}
        </Link>
      </div>
    </div>
  );
}
