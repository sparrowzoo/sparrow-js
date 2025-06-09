"use client";
import * as React from "react";
import {useEffect, useState} from "react";
import {AdminContext, AdminContextValue,} from "@/common/lib/admin/AdminContextProvider";
import AdminBroker from "@/common/lib/admin/AdminBroker";
import AccessHistoryContainer from "@/common/lib/admin/AccessHistoryContainer";
import {SidebarInset, SidebarProvider} from "@/components/ui/sidebar";
import {AppSidebar} from "@/components/app-sidebar";
import ThreeDotLoading from "@/common/components/ThreeDotLoading";
import {ThemeProvider} from "@/common/components/header/theme-provider";
import Header from "@/components/header";

export default function AdminRootLayout({
                                            children,
                                        }: Readonly<{
    children: React.ReactNode;
}>) {
    console.log("Chat layout render ....");
    const [adminContextValue, setAdminContextValue] =
        useState<AdminContextValue>();

    useEffect(() => {
        const menuMap = new Map<string, string>();
        menuMap.set("/dashboard", "首页");
        menuMap.set("/access-history", "访问历史");
        menuMap.set("/menu", "菜单管理");
        const accessHistoryContainer = new AccessHistoryContainer(menuMap);
        const adminBroker = new AdminBroker(accessHistoryContainer);
        const localContext = AdminContextValue.create(adminBroker);
        adminBroker.newMessageSignal = () => {
            console.log("sessionKey new Message Signal");
            setAdminContextValue(localContext?.newReference());
        };
        setAdminContextValue(localContext);
    }, []);

    if (!adminContextValue) {
        return <ThreeDotLoading/>;
    }

    return (
        <AdminContext.Provider value={adminContextValue as AdminContextValue}>
            <ThemeProvider
                attribute="class"
                defaultTheme="dark"
                enableSystem
                disableTransitionOnChange
            >
                {" "}
                <SidebarProvider>
                    <AppSidebar/>
                    <SidebarInset>
                        <Header showProfile={true}/>
                        {children}
                    </SidebarInset>
                </SidebarProvider>
            </ThemeProvider>
        </AdminContext.Provider>
    );
}
