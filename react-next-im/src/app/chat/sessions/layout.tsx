import * as React from "react";
import Sessions from "@/components/Sessions";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarProvider,
} from "@/components/ui/sidebar";
import { Collapsible, CollapsibleTrigger } from "@/components/ui/collapsible";
import { ChevronDown } from "lucide-react";

export default function ChatLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
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
                    会话
                    <ChevronDown className="ml-auto transition-transform group-data-[state=open]/collapsible:rotate-180" />
                  </CollapsibleTrigger>
                </SidebarGroupLabel>
                <Sessions />
              </SidebarGroup>
            </Collapsible>
          </SidebarContent>
        </Sidebar>
      </SidebarProvider>
      {children}
    </div>
  );
}
