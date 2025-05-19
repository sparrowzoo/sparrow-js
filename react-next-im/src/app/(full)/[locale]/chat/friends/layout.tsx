"use client";
import * as React from "react";
import { useContext, useEffect, useState } from "react";
import { WebSocketContext } from "@/lib/im/WebSocketProvider";
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
import Contacts from "@/components/contact/Contacts";
import Groups from "@/components/contact/Groups";
import ThreeDotLoading from "@/common/components/ThreeDotLoading";
import ChatUser from "@/lib/protocol/ChatUser";
import { useTranslations } from "next-intl";
import { Link } from "@/common/i18n/navigation";

export default function ChatLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const t = useTranslations("Contact");
  const toastTranslation = useTranslations("ToastMessage");

  const webSocketContextValue = useContext(WebSocketContext);
  const messageBroker = webSocketContextValue.messageBroker;
  const [contactGroup, setContactGroup] = useState<ContactGroup>();
  const newFriendUrl: any = `/chat/friends/new-friend`;
  useEffect(() => {
    const loginUser = ChatUser.getCurrentUser();
    console.log("contactGroup .....", contactGroup);
    messageBroker.contactContainer.getContactGroup().then((contactGroup) => {
      console.log("fetched contactGroup", contactGroup);
      setContactGroup(contactGroup as ContactGroup);
    });
  }, []);
  if (!contactGroup) {
    return <ThreeDotLoading />;
  }
  return (
    <div className="flex flex-row flex-1">
      <SidebarProvider className={"min-h-full h-full w-auto"}>
        <Sidebar className={"relative min-h-full h-full"}>
          <SidebarContent>
            <SidebarGroup>
              <SidebarGroupLabel>
                <Link
                  className=" text-sm font-bold w-full inline-block text-center"
                  href={newFriendUrl}
                >
                  {t("new-friends")}
                </Link>
              </SidebarGroupLabel>
            </SidebarGroup>

            <Collapsible defaultOpen className="group/collapsible">
              <SidebarGroup>
                <SidebarGroupLabel
                  className={"border-b-1 rounded-none  border-gray-400 "}
                  asChild
                >
                  <CollapsibleTrigger>
                    {t("my-friends")}

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
                  className={"border-b-1 rounded-none  border-gray-400 "}
                  asChild
                >
                  <CollapsibleTrigger>
                    {t("my-groups")}

                    <ChevronDown className="ml-auto transition-transform group-data-[state=open]/collapsible:rotate-180" />
                  </CollapsibleTrigger>
                </SidebarGroupLabel>
                <CollapsibleContent>
                  <SidebarGroupContent>
                    <Groups quns={contactGroup?.quns || []} />
                  </SidebarGroupContent>
                </CollapsibleContent>
              </SidebarGroup>
            </Collapsible>
          </SidebarContent>
        </Sidebar>
      </SidebarProvider>
      <div className={"flex-1"}>{children}</div>
    </div>
  );
}
