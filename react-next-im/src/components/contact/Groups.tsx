import GroupItem from "@/components/contact/GroupItem";
import * as React from "react";
import Group from "@/lib/protocol/contact/Group";
import Link from "next/link";
import ThreeDotLoading from "@/common/components/ThreeDotLoading";
import { SidebarMenu, SidebarMenuItem } from "@/components/ui/sidebar";

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
    <SidebarMenu className={"gap-2"}>
      {groupProps?.quns?.map((qun) => (
        <SidebarMenuItem key={qun.qunId}>
          <GroupItem link={true} qun={qun} />
        </SidebarMenuItem>
      ))}
    </SidebarMenu>
  );
}
