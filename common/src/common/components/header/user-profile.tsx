"use client";

import React, {useEffect, useState} from "react";
import CrosStorage from "@/common/lib/CrosStorage";
import {useLoginUser} from "@/common/lib/LoginUserProvider";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {Button} from "@/components/ui/button";
import {CircleUser} from "lucide-react";
import {useLocale, useTranslations} from "next-intl";
import {PASSPORT_ROOT} from "@/common/lib/Env";
import useNavigating from "@/common/hook/NavigatingHook";
import toast from "react-hot-toast";

export default function UserProfile() {
    const {redirectToLogin} = useNavigating();
    const {user, status, refresh} = useLoginUser();
    const [avatarError, setAvatarError] = useState(false);
    const t = useTranslations("Header");
    const locale = useLocale();

    useEffect(() => {
        setAvatarError(false);
    }, [user?.avatar]);

    if (status === "error") {
        return (
            <span role="alert" className="inline-flex items-center gap-2 text-sm">
        <span>{t("account-load-failed")}</span>
        <Button type="button" variant="ghost" size="sm" onClick={refresh}>
          {t("retry")}
        </Button>
      </span>
        );
    }

    if (status === "loading") {
        return (
            <span className="inline-flex h-[38px] w-[38px] shrink-0 items-center justify-center"
                  role="status" aria-label={t("loading-account")}>
        <CircleUser className="h-5 w-5 animate-pulse motion-reduce:animate-none" aria-hidden="true"/>
      </span>
        );
    }

    if (!user || user.isVisitor()) {
        return <a href={`${PASSPORT_ROOT}/${locale}/sign-in/`} onClick={(event) => {
            event.preventDefault();
            redirectToLogin(true, 0);
        }}>{t("sign-in")}</a>;
    }

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="secondary" size="icon" className="rounded-full overflow-hidden">
                    {avatarError ? (
                        <CircleUser className="h-5 w-5"/>
                    ) : (
                        <img
                            src={user.getAvatar()}
                            alt=""
                            className="h-full w-full rounded-full object-cover"
                            onError={() => setAvatarError(true)}
                        />
                    )}
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
                <DropdownMenuSeparator/>
                <DropdownMenuItem
                    onClick={() => {
                        CrosStorage.logout(redirectToLogin, t("logout-success")).catch(() => {
                            toast.error(t("logout-failed"));
                        });
                    }}
                >
                    {t("logout")}
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    );
}
