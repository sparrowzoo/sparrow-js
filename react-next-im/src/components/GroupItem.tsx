"use client";
import Link from "next/link";
import * as React from "react";
import { NEXT_ASSET_PREFIX } from "@/common/lib/Env";
import { DynamicImage } from "@/components/img/DynamicImage";
import Group from "@/lib/protocol/contact/Group";
import {
  SidebarMenuBadge,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";

interface GroupProps {
  qun: Group;
}

export default function GroupItem(groupProps: GroupProps) {
  const { qun } = groupProps;

  const groupUrl = `${NEXT_ASSET_PREFIX}/chat/friends/group?groupId=${qun.qunId}`;
  const avatar = `${NEXT_ASSET_PREFIX}/avatar/${qun.qunId}.jpg`;
  return (
    // <div className="flex items-center text-left">
    //   <Link href={groupUrl}>
    //     <DynamicImage
    //       className={"w-16 h-16 rounded-full mr-4"}
    //       quality={40}
    //       src={headSrc}
    //       alt="Group head"
    //       width={50}
    //       height={50}
    //     />
    //   </Link>
    //   <div>
    //     <Link href={groupUrl}>
    //       <strong>{qun.qunName}</strong>
    //       <br />
    //       <span>{qun.nationality}</span>
    //     </Link>
    //   </div>
    // </div>

    <SidebarMenuItem>
      <SidebarMenuButton asChild>
        <Link href={groupUrl}>
          <DynamicImage
            src={avatar}
            alt={"header"}
            width={0}
            height={0}
            className={"w-8 h-8 rounded-full mr-4"}
          />
          <span>
            {qun.qunName}-{qun.nationality}
          </span>
        </Link>
      </SidebarMenuButton>
      <SidebarMenuBadge>24</SidebarMenuBadge>
    </SidebarMenuItem>
  );
}
