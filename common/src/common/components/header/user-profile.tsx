import React, { useEffect } from "react";
import LoginUser from "@/common/lib/protocol/LoginUser";
import useCrosStorage from "@/common/hook/CrosStorageHook";
import ThreeDotLoading from "@/common/components/ThreeDotLoading";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { CircleUser } from "lucide-react";
import { useTranslations } from "next-intl";
import { Link } from "@/common/i18n/navigation";
import useNavigating from "@/common/hook/NavigatingHook";

export default function UserProfile() {
  const { redirectToLogin } = useNavigating();
  const [loginUser, setLoginUser] = React.useState<LoginUser | null>(null);
  let crosStorage = useCrosStorage();
  const t = useTranslations("Header");

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
      setLoginUser(token as LoginUser);
    });
  }, [crosStorage]);

  if (loginUser === null) {
    return <ThreeDotLoading />;
  }
  if (loginUser?.isVisitor()) {
    return <Link href={`/sign-in`}>{t("sign-in")}</Link>;
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
          <Link target={"_blank"} href={`/avatar-editor`}>
            {t("avatar-setting")}
          </Link>
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
