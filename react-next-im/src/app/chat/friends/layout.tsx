"use client";
import * as React from "react";
import { useContext, useEffect, useState } from "react";
import { WebSocketContext } from "@/lib/WebSocketProvider";
import ContactGroup from "@/lib/protocol/contact/ContactGroup";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarProvider,
} from "@/components/ui/sidebar";
import { ChevronDown } from "lucide-react";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import Contacts from "@/components/Contacts";
import Groups from "@/components/Groups";
import ThreeDotLoading from "@/common/components/ThreeDotLoading";

export default function ChatLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const webSocketContextValue = useContext(WebSocketContext);
  const messageBroker = webSocketContextValue.messageBroker;
  const [contactGroup, setContactGroup] = useState<ContactGroup>();
  useEffect(() => {
    messageBroker.getContactGroup().then((contactGroup) => {
      setContactGroup(contactGroup as ContactGroup);
    });
  }, [messageBroker]);
  if (!contactGroup) {
    return <ThreeDotLoading />;
  }
  return (
    <div className="flex flex-row flex-1">
      <SidebarProvider className={"min-h-full h-full w-auto"}>
        <Sidebar className={"relative min-h-full h-full"}>
          <SidebarContent>
            <Collapsible defaultOpen className="group/collapsible">
              <SidebarGroup>
                <SidebarGroupLabel
                  className={
                    "border-b-1 rounded-none  border-gray-400 text-black "
                  }
                  asChild
                >
                  <CollapsibleTrigger>
                    联系人
                    <ChevronDown className="ml-auto transition-transform group-data-[state=open]/collapsible:rotate-180" />
                  </CollapsibleTrigger>
                </SidebarGroupLabel>
                <CollapsibleContent>
                  <SidebarGroupContent>
                    <Contacts contacts={contactGroup?.contacts || []} />
                  </SidebarGroupContent>
                </CollapsibleContent>
              </SidebarGroup>
            </Collapsible>
            <Collapsible defaultOpen className="group/collapsible">
              <SidebarGroup>
                <SidebarGroupLabel
                  className={
                    "border-b-1 rounded-none  border-gray-400 text-black "
                  }
                  asChild
                >
                  <CollapsibleTrigger>
                    群组
                    <ChevronDown className="ml-auto transition-transform group-data-[state=open]/collapsible:rotate-180" />
                  </CollapsibleTrigger>
                </SidebarGroupLabel>
                <Groups quns={contactGroup?.quns || []} />
              </SidebarGroup>
            </Collapsible>
          </SidebarContent>
        </Sidebar>
      </SidebarProvider>
      <div className={"flex-1"}>{children}</div>
    </div>
  );
}
