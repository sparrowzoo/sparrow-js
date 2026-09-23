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
    SidebarFooter,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    SidebarRail,
} from "@/components/ui/sidebar";
import {Link, usePathname, useRouter} from "@/common/i18n/navigation";
import {AdminContext} from "@/common/lib/admin/AdminContextProvider";
import {MODULES_BY_KEY, navGroups} from "@/lib/navigation";
import {useTranslations} from "next-intl";
import {Layers3} from "lucide-react";

export function AppSidebar({...props}: React.ComponentProps<typeof Sidebar>) {
    const adminContext = useContext(AdminContext);
    const router = useRouter();
    const pathname = usePathname();
    const t = useTranslations("Sidebar");
    const home = useTranslations("Home");

    return (
        <Sidebar {...props}>
            <SidebarHeader className="h-16 justify-center border-b border-sidebar-border px-5">
                <Link
                    href="/"
                    className="flex items-center gap-3 rounded-lg outline-none focus-visible:ring-2 focus-visible:ring-sidebar-ring"
                >
                    <span
                        aria-hidden="true"
                        className="size-10 shrink-0 bg-primary"
                        style={{
                            mask: "url('/brand/sparrow-logo.svg') center / contain no-repeat",
                            WebkitMask: "url('/brand/sparrow-logo.svg') center / contain no-repeat",
                        }}
                    />
                    <span className="min-w-0 group-data-[collapsible=icon]:hidden">
                        <span className="block truncate text-base font-semibold tracking-tight">{t("brand")}</span>
                        <span className="mt-0.5 block text-[10px] font-medium tracking-[0.18em] text-muted-foreground">SPARROW ADMIN</span>
                    </span>
                </Link>
            </SidebarHeader>
            <SidebarContent className="gap-5 px-3 py-6">
                {navGroups.map((group) => (
                    <SidebarGroup key={group.key} className="p-0">
                        <SidebarGroupLabel className="mb-2 px-3 text-[11px] font-medium tracking-wide text-muted-foreground">{t(`groups.${group.key}`)}</SidebarGroupLabel>
                        <SidebarGroupContent>
                            <SidebarMenu className="gap-1.5">
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
                                                aria-current={pathname === item.url ? "page" : undefined}
                                                className="h-11 gap-3 rounded-lg px-3 font-medium text-sidebar-foreground/75 transition-colors data-[active=true]:text-primary [&>svg]:size-[18px]"
                                            >
                                                <Icon strokeWidth={1.7}/>
                                                <span>{title}</span>
                                                {pathname === item.url && <span className="ml-auto size-1.5 shrink-0 rounded-full bg-primary" aria-hidden="true"/>}
                                            </SidebarMenuButton>
                                        </SidebarMenuItem>
                                    );
                                })}
                            </SidebarMenu>
                        </SidebarGroupContent>
                    </SidebarGroup>
                ))}
            </SidebarContent>
            <SidebarFooter className="mx-5 mb-5 gap-3 border-t border-sidebar-border px-0 pt-5 group-data-[collapsible=icon]:hidden">
                <div className="flex items-center gap-2.5 text-sm font-medium">
                    <Layers3 className="size-4 text-primary" strokeWidth={1.7}/>
                    {home("badge")}
                </div>
                <span className="text-[10px] font-medium tracking-[0.14em] text-muted-foreground">SPARROW / WORKSPACE</span>
            </SidebarFooter>
            <SidebarRail/>
        </Sidebar>
    );
}
