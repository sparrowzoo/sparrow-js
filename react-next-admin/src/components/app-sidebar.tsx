"use client";

import * as React from "react";
import {useContext} from "react";
import {
    Sidebar,
    SidebarContent,
    SidebarGroup,
    SidebarGroupContent,
    SidebarGroupLabel,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    SidebarRail,
} from "@/components/ui/sidebar";
import {Link, usePathname, useRouter} from "@/common/i18n/navigation";
import {AdminContext} from "@/common/lib/admin/AdminContextProvider";
import {MODULES_BY_KEY, navGroups} from "@/common/lib/admin/navigation";
import {useTranslations} from "next-intl";
import {Package2,} from "lucide-react";

export function AppSidebar({...props}: React.ComponentProps<typeof Sidebar>) {
    const adminContext = useContext(AdminContext);
    const router = useRouter();
    const pathname = usePathname();
    const t = useTranslations("Sidebar");
    const home = useTranslations("Home");

    return (
        <Sidebar {...props}>
            <SidebarHeader className="flex flex-row items-center gap-2 px-4 py-3">
                <Package2 className="h-6 w-6 text-primary"/>
                <Link
                    href="/"
                    className="truncate font-semibold group-data-[collapsible=icon]:hidden"
                >
                    {t("brand")}
                </Link>
            </SidebarHeader>
            <SidebarContent>
                {navGroups.map((group) => (
                    <SidebarGroup key={group.key}>
                        <SidebarGroupLabel>{t(`groups.${group.key}`)}</SidebarGroupLabel>
                        <SidebarGroupContent>
                            <SidebarMenu>
                                {group.items.map((key) => {
                                    const item = MODULES_BY_KEY[key];
                                    const Icon = item.icon;
                                    const title = home(`modules.${key}.title`);
                                    return (
                                        <SidebarMenuItem key={key}>
                                            <SidebarMenuButton
                                                onClick={() =>
                                                    adminContext.adminBroker.access(item.url, router)
                                                }
                                                isActive={pathname === item.url}
                                                tooltip={title}
                                            >
                                                <Icon/>
                                                <span>{title}</span>
                                            </SidebarMenuButton>
                                        </SidebarMenuItem>
                                    );
                                })}
                            </SidebarMenu>
                        </SidebarGroupContent>
                    </SidebarGroup>
                ))}
            </SidebarContent>
            <SidebarRail/>
        </Sidebar>
    );
}
