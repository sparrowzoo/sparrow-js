
"use client";
import * as React from "react";
import {
    Sidebar,
    SidebarContent,
    SidebarGroup,
    SidebarGroupContent,
    SidebarGroupLabel,
    SidebarProvider,
} from "@/components/ui/sidebar";
import {ChevronDown} from "lucide-react";
import {Collapsible, CollapsibleContent, CollapsibleTrigger,} from "@/components/ui/collapsible";
import NewFriends from "@/components/contact/NewFriends";
import NewQunAudits from "@/components/contact/NewQunAudits";

export default function NewFriendPage() {

    return (
        <SidebarProvider className={"block min-h-full h-full w-full"}>
            <Sidebar className={"relative min-h-full h-full w-full"}>
                <SidebarContent>
                    <Collapsible defaultOpen className="group/collapsible">
                        <SidebarGroup>
                            <SidebarGroupLabel
                                className={"border-b-1 rounded-none  border-gray-400 "}
                                asChild
                            >
                                <CollapsibleTrigger>
                                    新朋友
                                    <ChevronDown className="ml-auto transition-transform group-data-[state=open]/collapsible:rotate-180" />
                                </CollapsibleTrigger>
                            </SidebarGroupLabel>
                            <CollapsibleContent>
                                <SidebarGroupContent>
                                    <NewFriends />
                                </SidebarGroupContent>
                            </CollapsibleContent>
                        </SidebarGroup>
                    </Collapsible>
                    <Collapsible defaultOpen className="group/collapsible">
                        <SidebarGroup>
                            <SidebarGroupLabel
                                className={"border-b-1 rounded-none  border-gray-400 "}
                                asChild
                            >
                                <CollapsibleTrigger>
                                    新群友
                                    <ChevronDown className="ml-auto transition-transform group-data-[state=open]/collapsible:rotate-180" />
                                </CollapsibleTrigger>
                            </SidebarGroupLabel>
                            <CollapsibleContent>
                                <SidebarGroupContent>
                                    <NewQunAudits/>
                                </SidebarGroupContent>
                            </CollapsibleContent>
                        </SidebarGroup>
                    </Collapsible>
                </SidebarContent>
            </Sidebar>
        </SidebarProvider>
    )
}