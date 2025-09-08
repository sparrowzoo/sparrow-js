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
import {Link, useRouter} from "@/common/i18n/navigation";
import {AdminContext} from "@/common/lib/admin/AdminContextProvider";
import {Package2} from "lucide-react";

const data = {
    navMain: [
        {
            title: "Getting Started",
            url: "#",
            items: [
                {
                    title: "Dashboard",
                    url: "/dashboard",
                },
                {
                    title: "About",
                    url: "/access-history",
                },
            ],
        },
        {
            title: "Building Your Application",
            url: "#",
            items: [
                {
                    title: "Menu",
                    url: "/menu",
                },
                {
                    title: "Projects",
                    url: "/project-config",
                    isActive: true,
                },
                {
                    title: "Example",
                    url: "/user-example",
                }
            ],
        }
    ],
};

export function AppSidebar({...props}: React.ComponentProps<typeof Sidebar>) {
    const adminContext = useContext(AdminContext);
    const router = useRouter();
    return (
        <Sidebar {...props}>
            <SidebarHeader className={"flex flex-row items-center justify-center"}>
                <Package2 className="h-6 w-6"/><Link href="/">Index</Link>
            </SidebarHeader>
            <SidebarContent>
                {/* We create a SidebarGroup for each parent. */}
                {data.navMain.map((item) => (
                    <SidebarGroup key={item.title}>
                        <SidebarGroupLabel>{item.title}</SidebarGroupLabel>
                        <SidebarGroupContent>
                            <SidebarMenu>
                                {item.items.map((item) => (
                                    <SidebarMenuItem key={item.title}>
                                        <SidebarMenuButton
                                            variant={"outline"}
                                            onClick={() => {
                                                adminContext.adminBroker.access(item.url, router);
                                            }}
                                            isActive={item.isActive}
                                        >
                                            {item.title}
                                        </SidebarMenuButton>
                                    </SidebarMenuItem>
                                ))}
                            </SidebarMenu>
                        </SidebarGroupContent>
                    </SidebarGroup>
                ))}
            </SidebarContent>
            <SidebarRail/>
        </Sidebar>
    );
}
