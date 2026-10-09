"use client";

import React, { useEffect } from "react";
import LoginUser from "@/common/lib/protocol/LoginUser";
import useCrosStorage from "@/common/hook/CrosStorageHook";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { CircleUser } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import { PASSPORT_ROOT } from "@/common/lib/Env";
import useNavigating from "@/common/hook/NavigatingHook";
import toast from "react-hot-toast";

export default function UserProfile() {
  const { redirectToLogin } = useNavigating();
  const [loginUser, setLoginUser] = React.useState<LoginUser | null>(null);
  const [readFailed, setReadFailed] = React.useState(false);
  const [readAttempt, setReadAttempt] = React.useState(0);
  const crosStorage = useCrosStorage();
  const t = useTranslations("Header");
  const locale = useLocale();

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }
    if (!crosStorage) {
      return;
    }

    let active = true;
    setLoginUser(null);
    setReadFailed(false);
    // 只更新用户展示信息；不会将 RPC token 回写本域。
    crosStorage.locateToken().then((user) => {
      if (!active) return;
      // 确认无凭证时 locateToken 返回 Visitor；null 表示现有凭证无法提供展示资料。
      if (user) setLoginUser(user);
      else setReadFailed(true);
    }).catch(() => {
      // 读取失败时凭证状态未知，不能当作访客或清除旧展示资料。
      if (active) setReadFailed(true);
    });
    return () => { active = false; };
  }, [crosStorage, readAttempt]);

  if (readFailed) {
    return (
      <span role="alert" className="inline-flex items-center gap-2 text-sm">
        <span>{locale.startsWith("zh") ? "账户读取失败" : "Unable to load account"}</span>
        <Button type="button" variant="ghost" size="sm" onClick={() => setReadAttempt(attempt => attempt + 1)}>
          {locale.startsWith("zh") ? "重试" : "Retry"}
        </Button>
      </span>
    );
  }

  if (loginUser === null) {
    return (
      <span className="inline-flex h-[38px] w-[38px] shrink-0 items-center justify-center"
            role="status" aria-label={locale.startsWith("zh") ? "正在加载账户" : "Loading account"}>
        <CircleUser className="h-5 w-5 animate-pulse motion-reduce:animate-none" aria-hidden="true"/>
      </span>
    );
  }
  if (loginUser?.isVisitor()) {
    return <a href={`${PASSPORT_ROOT}/${locale}/sign-in/`} onClick={(event) => {
      event.preventDefault();
      redirectToLogin(true, 0);
    }}>{t("sign-in")}</a>;
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="secondary" size="icon" className="rounded-full">
          <CircleUser className="h-5 w-5" />
          <span className="sr-only">user account menu</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {/*<DropdownMenuLabel>My Account</DropdownMenuLabel>*/}
        {/*<DropdownMenuSeparator />*/}
        <DropdownMenuItem>
          <a target="_blank" rel="noopener noreferrer" href={`${PASSPORT_ROOT}/${locale}/avatar-editor/`}>
            {t("avatar-setting")}
          </a>
        </DropdownMenuItem>
        {/*<DropdownMenuItem>Support</DropdownMenuItem>*/}
        <DropdownMenuSeparator />
        <DropdownMenuItem
          onClick={() => {
            LoginUser.logout(redirectToLogin, t("logout-success")).catch(() => {
              toast.error(locale.startsWith("zh") ? "退出失败，请重试" : "Sign out failed. Please retry.");
            });
          }}
        >
          {t("logout")}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
