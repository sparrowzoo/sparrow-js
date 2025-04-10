import GroupItem from "@/components/GroupItem";
import * as React from "react";
import Group from "@/lib/protocol/contact/Group";
import Link from "next/link";
import ThreeDotLoading from "@/common/components/ThreeDotLoading";
import { CollapsibleContent } from "@radix-ui/react-collapsible";
import { SidebarGroupContent, SidebarMenu } from "@/components/ui/sidebar";

interface GroupsProps {
  quns: Group[] | undefined;
}

export default function Groups(groupProps: GroupsProps) {
  console.log(groupProps.quns);
  if (!groupProps.quns) {
    return <ThreeDotLoading />;
  }
  if (groupProps.quns.length === 0) {
    return (
      <Link className={"text-center font-bold text-sm"} href={"/"}>
        No groups found.
      </Link>
    );
  }
  return (
    <CollapsibleContent>
      <SidebarGroupContent>
        <SidebarMenu>
          {groupProps?.quns?.map((qun) => (
            <GroupItem qun={qun} key={qun.qunId + ""} />
          ))}
        </SidebarMenu>
      </SidebarGroupContent>
    </CollapsibleContent>
  );
}
