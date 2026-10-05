import GroupItem from "@/components/contact/GroupItem";
import * as React from "react";
import Group from "@/lib/protocol/contact/Group";
import ThreeDotLoading from "@/common/components/ThreeDotLoading";
import { SidebarMenu, SidebarMenuItem } from "@/components/ui/sidebar";
import { Link } from "@/common/i18n/navigation";

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
      <Link className={"im-contact-empty text-center font-bold text-sm"} href={"/"}>
        No groups found.
      </Link>
    );
  }
  return (
    <SidebarMenu className={"im-contact-list gap-2"}>
      {groupProps?.quns?.map((qun) => (
        <SidebarMenuItem className="im-contact-item" key={qun.qunId}>
          <GroupItem link={true} qun={qun} />
        </SidebarMenuItem>
      ))}
    </SidebarMenu>
  );
}
