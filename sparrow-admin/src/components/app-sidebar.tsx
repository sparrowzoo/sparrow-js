"use client";

import * as React from "react";
import {useContext, useState} from "react";
import {
    Sidebar,
    SidebarContent,
    SidebarHeader,
    SidebarFooter,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    SidebarMenuSub,
    SidebarMenuSubItem,
    SidebarRail,
} from "@/components/ui/sidebar";
import {Link, usePathname, useRouter} from "@/common/i18n/navigation";
import {AdminContext} from "@/common/lib/admin/AdminContextProvider";
import {MODULES_BY_KEY, navParents} from "@/lib/navigation";
import DynamicIcon from "@/common/components/DynamicIcon";
import {useTranslations} from "next-intl";
import {ChevronRight, Layers3} from "lucide-react";

export function AppSidebar({...props}: React.ComponentProps<typeof Sidebar>) {
    const adminContext = useContext(AdminContext);
    const router = useRouter();
    const pathname = usePathname();
    const t = useTranslations("Sidebar");
    const home = useTranslations("Home");
    const [openParents, setOpenParents] = useState<Record<string, boolean>>(() =>
        Object.fromEntries(navParents.map((parent) => [parent.key, true]))
    );

    const toggleParent = (key: string) =>
        setOpenParents((prev) => ({...prev, [key]: !prev[key]}));

    return (
        <Sidebar {...props}>
            <SidebarHeader className="h-18 justify-center px-5">
                <Link
                    href="/"
                    className="flex items-center gap-3 rounded-lg outline-none focus-visible:ring-2 focus-visible:ring-sidebar-ring"
                >
                    <span
                        aria-hidden="true"
                        className="admin-brand-mark h-9 w-10 shrink-0"
                        style={{
                            mask: "url('/svg/brand/sparrow-logo.svg') center / contain no-repeat",
                            WebkitMask: "url('/svg/brand/sparrow-logo.svg') center / contain no-repeat",
                        }}
                    />
                    <span className="min-w-0 group-data-[collapsible=icon]:hidden">
                        <span className="block truncate text-base font-semibold tracking-tight">{t("brand")}</span>
                        <span className="mt-0.5 block text-[10px] font-medium tracking-[0.18em] text-muted-foreground">SPARROW ADMIN</span>
                    </span>
                </Link>
            </SidebarHeader>
            <SidebarContent className="gap-6 px-3 py-5">
                <SidebarMenu className="gap-2">
                    {navParents.map((parent) => {
                        const open = openParents[parent.key] ?? true;
                        return (
                            <SidebarMenuItem key={parent.key}>
                                <SidebarMenuButton
                                    onClick={() => toggleParent(parent.key)}
                                    data-state={open ? "open" : "closed"}
                                    className="h-11 gap-3 rounded-xl px-3 font-medium text-sidebar-foreground/75 transition-colors data-[state=open]:text-foreground [&>svg]:size-[18px]"
                                >
                                    <DynamicIcon name={parent.icon} strokeWidth={1.7}/>
                                    <span>{t(`parents.${parent.key}`)}</span>
                                    <ChevronRight
                                        strokeWidth={1.7}
                                        className={`ml-auto size-4 shrink-0 transition-transform ${open ? "rotate-90" : ""}`}
                                    />
                                </SidebarMenuButton>
                                {open && (
                                    <SidebarMenuSub>
                                        {parent.items.map((key) => {
                                            const item = MODULES_BY_KEY[key];
                                            const title = home(`modules.${key}.title`);
                                            return (
                                                <SidebarMenuSubItem key={key}>
                                                    <SidebarMenuButton
                                                        onClick={() =>
                                                            adminContext.adminBroker.access(item.url, router)
                                                        }
                                                        isActive={pathname === item.url}
                                                        tooltip={title}
                                                        aria-current={pathname === item.url ? "page" : undefined}
                                                        className="h-8 gap-3 rounded-lg px-2.5 font-medium text-sidebar-foreground/75 transition-colors data-[active=true]:text-primary [&>svg]:size-[16px]"
                                                    >
                                                        <DynamicIcon name={item.icon} strokeWidth={1.7}/>
                                                        <span>{title}</span>
                                                        {pathname === item.url && <span className="ml-auto size-1.5 shrink-0 rounded-full bg-primary" aria-hidden="true"/>}
                                                    </SidebarMenuButton>
                                                </SidebarMenuSubItem>
                                            );
                                        })}
                                    </SidebarMenuSub>
                                )}
                            </SidebarMenuItem>
                        );
                    })}
                </SidebarMenu>
            </SidebarContent>
            <SidebarFooter className="mx-5 mb-5 gap-3 px-0 pt-5 group-data-[collapsible=icon]:hidden">
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
