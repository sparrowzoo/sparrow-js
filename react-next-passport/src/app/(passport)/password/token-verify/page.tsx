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

export default function Page() {
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
      errors.push("请从您的邮箱链接跳转至该页面");
    }
    if (password == "") {
      errors.push("请输入新密码");
    } else {
      const regExp = new RegExp(
        /^(?=.*[A-Za-z])(?=.*\d)(?=.*[$@$!%*#?&])[A-Za-z\d$@$!%*#?&]{8,}$/
      );
      if (!regExp.test(password)) {
        errors.push("密码格式错误");
      }
    }
    if (confirmPassword == "") {
      errors.push("请确认新密码");
    }
    if (password != confirmPassword) {
      errors.push("新密码和确认密码不一致");
    }

    if (errors.length > 0) {
      toast.error(errors.join("\n"));
      return;
    }
    PasswordApi.resetPassword(password, token);
  }

  return (
    <Card className="w-[450px]">
      <CardHeader>
        <CardTitle>重置密码</CardTitle>
        <CardDescription>
          密码格式 至少8个字符，至少1个字母，1个数字和1个特殊字符
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid w-full items-center gap-4">
          <div className="flex flex-row items-center justify-center space-y-1.5">
            <Label className={"w-1/5 inline-block"} htmlFor="newPassword">
              新密码
            </Label>
            <Input
              type={"password"}
              value={password}
              onChange={(event) => {
                setPassword(event.target.value);
              }}
              id="newPassword"
              placeholder="请输入新密码"
            />
          </div>
          <div className="flex flex-row items-center justify-center space-y-1.5">
            <Label className={"w-1/5 inline-block"} htmlFor="configmPassword">
              确认密码
            </Label>
            <Input
              type={"password"}
              value={confirmPassword}
              onChange={(event) => {
                setConfirmPassword(event.target.value);
              }}
              id="configmPassword"
              placeholder="请输入确认密码"
            />
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex justify-end">
        <Button onClick={resetHandler}>确认</Button>
      </CardFooter>
    </Card>
  );
}
