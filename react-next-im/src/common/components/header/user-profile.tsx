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

export default function UserProfile() {
  const { redirectToLogin } = useNavigating();
  const [loginUser, setLoginUser] = React.useState<LoginUser | null>(null);
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

    //同步token 到本域，方便后续使用getCurrentUser()
    crosStorage?.locateToken().then((token) => {
      console.log("token located", token);
      setLoginUser(token ?? LoginUser.visitor());
    }).catch(() => setLoginUser(LoginUser.visitor()));
  }, [crosStorage]);

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
            LoginUser.logout(redirectToLogin, t("logout-success"));
          }}
        >
          {t("logout")}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
