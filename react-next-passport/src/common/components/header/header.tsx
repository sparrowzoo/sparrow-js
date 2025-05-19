"use client";
import { Menu, Package2, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import React from "react";
import UserProfile from "@/common/components/header/user-profile";
import { useTranslations } from "next-intl";
import LocaleSwitcher from "@/common/components/i18n/LocaleSwitcher";
import { Link } from "@/common/i18n/navigation";
import { ModeToggle } from "@/common/components/header/mode-toggle";

type HeaderProps = {
  showProfile?: boolean;
};
export default function Header(headerProps: HeaderProps) {
  const t = useTranslations("Header");
  return (
    <header className="sticky top-0 flex h-16 items-center gap-4 border-b bg-background px-4 md:px-6 z-50">
      <nav className="md:flex md:flex-row md:items-center md:gap-5 md:text-sm lg:gap-6 hidden md:w-full">
        <Link
          href={"/"}
          className="flex items-center gap-2 text-lg font-semibold md:text-base"
        >
          <Package2 className="h-6 w-6" />
          <span className="sr-only">Sparrow Zoo</span>
        </Link>
        <Link
          href={"/"}
          className="text-foreground transition-colors hover:text-foreground"
        >
          {t("index")}
        </Link>
        <Link
          href="/blog"
          className="text-muted-foreground transition-colors hover:text-foreground"
        >
          {t("blog")}
        </Link>
        <Link
          href={"/chat/friends"}
          className="text-muted-foreground transition-colors hover:text-foreground"
        >
          {t("im")}
        </Link>
        <Link
          href={"/pop"}
          className="text-muted-foreground transition-colors hover:text-foreground"
        >
          {t("client-server")}
        </Link>
        <Link
          href={"/shop"}
          className="text-muted-foreground transition-colors hover:text-foreground"
        >
          {t("shop")}
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
              href={"/"}
              className="flex items-center gap-2 text-lg font-semibold md:text-base"
            >
              <Package2 className="h-6 w-6" />
              <span className="sr-only">Sparrow Zoo</span>
            </Link>
            <Link
              href={"/"}
              className="text-foreground transition-colors hover:text-foreground"
            >
              {t("index")}
            </Link>
            <Link
              href="/blog"
              className="text-muted-foreground hover:text-foreground"
            >
              {t("blog")}
            </Link>
            <Link
              href={"/chat/friends"}
              className="text-muted-foreground hover:text-foreground"
            >
              {t("im")}
            </Link>
            <Link
              href={"/pop"}
              className="text-muted-foreground transition-colors hover:text-foreground"
            >
              {t("client-server")}
            </Link>
            <Link
              href="/shop"
              className="text-muted-foreground hover:text-foreground"
            >
              {t("shop")}
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
        <Link href={"/playground"}>{t("playground")}</Link>
        <LocaleSwitcher />

        <ModeToggle />
        {headerProps.showProfile && <UserProfile />}
      </div>
    </header>
  );
}
