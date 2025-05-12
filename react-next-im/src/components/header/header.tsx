"use client";
import Link from "next/link";
import { CircleUser, Menu, Package2, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { ModeToggle } from "@/components/header/mode-toggle";
import { PASSPORT_ROOT, WWW_ROOT } from "@/common/lib/Env";
import LoginUser from "@/common/lib/protocol/LoginUser";
import React, { useEffect } from "react";
import useCrosStorage from "@/common/hook/CrosStorageHook";
import { StorageType } from "@/common/lib/protocol/CrosProtocol";
import ChatApi from "@/api/ChatApi";
import ThreeDotLoading from "@/common/components/ThreeDotLoading";

export default function Header() {
  const [loginUser, setLoginUser] = React.useState<LoginUser | null>(null);

  let crosStorage = useCrosStorage();
  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }
    if (!crosStorage) {
      return;
    }
    crosStorage
      .getToken(StorageType.AUTOMATIC, ChatApi.getVisitorToken)
      .then((token) => {
        if (!token) {
          console.log("token is null");
          setLoginUser(LoginUser.getCurrentUser());
          return;
        }
        //同步token 到本域，方便后续使用getCurrentUser()
        crosStorage?.locateToken().then((token) => {
          console.log("token located", token);
          setLoginUser(token as LoginUser);
        });
      });
  }, [crosStorage]);

  if (loginUser === null) {
    return <ThreeDotLoading />;
  }

  return (
    <header className="sticky top-0 flex h-16 items-center gap-4 border-b bg-background px-4 md:px-6 z-50">
      <nav className="md:flex md:flex-row md:items-center md:gap-5 md:text-sm lg:gap-6 hidden md:w-full">
        <a
          href={`${WWW_ROOT}`}
          className="flex items-center gap-2 text-lg font-semibold md:text-base"
        >
          <Package2 className="h-6 w-6" />
          <span className="sr-only">Sparrow Zoo</span>
        </a>
        <a
          href={`${WWW_ROOT}`}
          className="text-foreground transition-colors hover:text-foreground"
        >
          首页
        </a>
        <Link
          href="#"
          className="text-muted-foreground transition-colors hover:text-foreground"
        >
          博客
        </Link>
        <Link
          href={`${WWW_ROOT}/chat/friends`}
          className="text-muted-foreground transition-colors hover:text-foreground"
        >
          IM
        </Link>
        <Link
          href={`${WWW_ROOT}/pop`}
          className="text-muted-foreground transition-colors hover:text-foreground"
        >
          客服体验
        </Link>
        <Link
          href="#"
          className="text-muted-foreground transition-colors hover:text-foreground"
        >
          商城
        </Link>
      </nav>
      <Sheet>
        <SheetTrigger asChild>
          <Button variant="outline" size="icon" className="shrink-0 md:hidden">
            <Menu className="h-5 w-5" />
            <span className="sr-only">Toggle navigation menu</span>
          </Button>
        </SheetTrigger>
        <SheetContent side="left">
          <nav className="grid gap-6 text-lg font-medium">
            <Link
              href="#"
              className="flex items-center gap-2 text-lg font-semibold"
            >
              <Package2 className="h-6 w-6" />
              <span className="sr-only">Acme Inc</span>
            </Link>
            <Link href="#" className="hover:text-foreground">
              首页
            </Link>
            <Link
              href="#"
              className="text-muted-foreground hover:text-foreground"
            >
              博客
            </Link>
            <Link
              href="#"
              className="text-muted-foreground hover:text-foreground"
            >
              IM
            </Link>
            <Link
              href="#"
              className="text-muted-foreground hover:text-foreground"
            >
              商城
            </Link>
            <Link
              href="#"
              className="text-muted-foreground hover:text-foreground"
            >
              Analytics
            </Link>
          </nav>
        </SheetContent>
      </Sheet>
      <div className="flex w-full items-center gap-4 md:ml-auto md:gap-2 lg:gap-4">
        <form className="ml-auto flex-1 sm:flex-initial">
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search products..."
              className="pl-8 sm:w-[300px] md:w-[200px] lg:w-[300px]"
            />
          </div>
        </form>
        <a href={"/playground"}>写文章</a>

        <ModeToggle />

        {loginUser?.isVisitor() && (
          <a href={`${PASSPORT_ROOT}/sign-in`}>Sign In</a>
        )}

        {!loginUser?.isVisitor() && (
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
        )}
      </div>
    </header>
  );
}
