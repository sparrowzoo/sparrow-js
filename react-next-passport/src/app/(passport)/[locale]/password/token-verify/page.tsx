"use client";
import * as React from "react";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import toast from "react-hot-toast";
import UrlUtils from "@/common/lib/UrlUtils";
import PasswordApi from "@/api/password";
import { useTranslations } from "next-intl";
import useNavigating from "@/common/hook/NavigatingHook";

export default function Page() {
  const Navigations = useNavigating();
  const t = useTranslations("Passport.PasswordTokenVerify");
  const [token, setToken] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [confirmPassword, setConfirmPassword] = useState<string>("");

  useEffect(() => {
    const token = UrlUtils.getQueryString();
    if (token) {
      setToken(token);
    }
  }, []);

  function resetHandler() {
    const errors: string[] = [];
    if (token == "") {
      errors.push(t("token-not-found"));
    }
    if (password == "") {
      errors.push(t("new-password"));
    } else {
      const regExp = new RegExp(
        /^(?=.*[A-Za-z])(?=.*\d)(?=.*[$@$!%*#?&])[A-Za-z\d$@$!%*#?&]{8,}$/
      );
      if (!regExp.test(password)) {
        errors.push(t("password-format-error"));
      }
    }
    if (confirmPassword == "") {
      errors.push(t("confirm-password-not-empty"));
    }
    if (password != confirmPassword) {
      errors.push(t("password-not-match"));
    }

    if (errors.length > 0) {
      toast.error(errors.join("\n"));
      return;
    }
    PasswordApi.resetPassword(password, token, t).then(() => {
      toast.success(t("password-reset-success"));
      Navigations.redirectToLogin();
    });
  }

  return (
    <Card className="w-[450px]">
      <CardHeader>
        <CardTitle>{t("password-reset-title")}</CardTitle>
        <CardDescription>{t("password-reset-description")}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid w-full items-center gap-4">
          <div className="flex flex-row items-center justify-center space-y-1.5">
            <Label className={"w-1/5 inline-block"} htmlFor="newPassword">
              {t("new-password-title")}
            </Label>
            <Input
              type={"password"}
              value={password}
              onChange={(event) => {
                setPassword(event.target.value);
              }}
              id="newPassword"
              placeholder={t("new-password")}
            />
          </div>
          <div className="flex flex-row items-center justify-center space-y-1.5">
            <Label className={"w-1/5 inline-block"} htmlFor="configmPassword">
              {t("confirm-password-title")}
            </Label>
            <Input
              type={"password"}
              value={confirmPassword}
              onChange={(event) => {
                setConfirmPassword(event.target.value);
              }}
              id="configmPassword"
              placeholder={t("confirm-password-title")}
            />
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex justify-end">
        <Button onClick={resetHandler}>{t("confirm")}</Button>
      </CardFooter>
    </Card>
  );
}
