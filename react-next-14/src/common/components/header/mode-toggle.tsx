"use client";

import * as React from "react";
import { useTheme } from "next-themes";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Monitor, Moon, Sun } from "lucide-react";
import { useTranslations } from "next-intl";
import { cn } from "@/lib/utils";

type ModeToggleProps = {
  className?: string;
  contentClassName?: string;
};

export function ModeToggle({className, contentClassName}: ModeToggleProps = {}) {
  const { theme, setTheme } = useTheme();
  const t = useTranslations("Header");

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button type="button" variant="ghost" size="icon"
                className={cn("relative size-10 rounded-full border-0 bg-transparent text-muted-foreground shadow-none transition-[color,background-color] duration-200 ease-out hover:bg-accent/50 hover:text-foreground motion-reduce:transition-none", className)}
                title={t("theme-toggle")}>
          <Sun aria-hidden="true" strokeWidth={1.7} className="size-[18px] rotate-0 scale-100 opacity-100 transition-[transform,opacity] duration-300 ease-out dark:-rotate-90 dark:scale-75 dark:opacity-0 motion-reduce:transition-none" />
          <Moon aria-hidden="true" strokeWidth={1.7} className="absolute size-[18px] rotate-90 scale-75 opacity-0 transition-[transform,opacity] duration-300 ease-out dark:rotate-0 dark:scale-100 dark:opacity-100 motion-reduce:transition-none" />
          <span className="sr-only">{t("theme-toggle")}</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" sideOffset={8}
                           className={cn("min-w-40 rounded-xl border-0 p-1.5 shadow-lg shadow-black/10 duration-200 dark:shadow-black/30 motion-reduce:animate-none", contentClassName)}>
        <DropdownMenuRadioGroup value={theme} onValueChange={setTheme}>
          <DropdownMenuRadioItem value="light"><Sun aria-hidden="true"/>{t("light-mode")}</DropdownMenuRadioItem>
          <DropdownMenuRadioItem value="dark"><Moon aria-hidden="true"/>{t("dark-mode")}</DropdownMenuRadioItem>
          <DropdownMenuRadioItem value="system"><Monitor aria-hidden="true"/>{t("system-mode")}</DropdownMenuRadioItem>
        </DropdownMenuRadioGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
