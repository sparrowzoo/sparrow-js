import React, { useEffect } from "react";
import LoginUser from "@/common/lib/protocol/LoginUser";
import useCrosStorage from "@/common/hook/CrosStorageHook";
import ThreeDotLoading from "@/common/components/ThreeDotLoading";
import { PASSPORT_ROOT } from "@/common/lib/Env";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { CircleUser } from "lucide-react";

export default function UserProfile() {
  const [loginUser, setLoginUser] = React.useState<LoginUser | null>(null);
  let crosStorage = useCrosStorage();
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
    return <a href={`${PASSPORT_ROOT}/sign-in`}>Sign In</a>;
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
          <a target={"_blank"} href={`${PASSPORT_ROOT}/avatar-editor`}>
            设置头像
          </a>
        </DropdownMenuItem>
        {/*<DropdownMenuItem>Support</DropdownMenuItem>*/}
        <DropdownMenuSeparator />
        <DropdownMenuItem
          onClick={() => {
            LoginUser.logout();
          }}
        >
          Logout
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
