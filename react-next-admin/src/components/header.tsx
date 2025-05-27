"use client";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import React from "react";
import UserProfile from "@/common/components/header/user-profile";
import { useTranslations } from "next-intl";
import LocaleSwitcher from "@/common/components/i18n/LocaleSwitcher";
import { ModeToggle } from "@/common/components/header/mode-toggle";
import AccessHistories from "@/components/access-histories";

type HeaderProps = {
  showProfile?: boolean;
};
export default function Header(headerProps: HeaderProps) {
  const t = useTranslations("Header");
  return (
    <header className="sticky top-0 flex h-16 items-center gap-4 border-b bg-background px-4 md:px-6 z-50">
      <nav className="md:flex md:flex-row md:items-center md:gap-5 md:text-sm lg:gap-6 hidden md:w-full">
        <AccessHistories />
      </nav>
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
        {/*<Link href={"/playground"}>{t("playground")}</Link>*/}
        <LocaleSwitcher />
        <ModeToggle />
        {headerProps.showProfile && <UserProfile />}
      </div>
    </header>
  );
}
