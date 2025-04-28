import { cn } from "@/lib/utils";
import MyAvatar from "@/components/MyAvatar";
import Link from "next/link";
import * as React from "react";
import { SidebarMenuItem } from "@/components/ui/sidebar";
import AuditItemProps from "@/lib/protocol/audit/AuditItemProps";
import ChatUser from "@/lib/protocol/ChatUser";
import { AVATAR_URL, NEXT_ASSET_PREFIX } from "@/common/lib/Env";
import { Button } from "@/components/ui/button";
import { AuditStatus } from "@/lib/protocol/audit/AuditStatus";
import Contact from "@/lib/protocol/contact/Contact";
import { format } from "util";
import AuditStatusProps from "@/lib/protocol/audit/AuditStatusProps";

function AuditStatusComp(props: AuditStatusProps) {
  const { status, isApplying } = props;
  if (status == AuditStatus.PENDING) {
    if (isApplying) {
      return <span className={"text-xs text-gray-400"}>待对方确认</span>;
    }
    return (
      <div
        className={
          "flex flex-row justify-center items-center text-xs h-full text-gray-400 gap-2 w-80"
        }
      >
        <Button className={"w-12 cursor-pointer p-2"}>同意</Button>
        <Button className={"w-12 cursor-pointer p-2"}>拒绝</Button>
      </div>
    );
  }
  if (status == AuditStatus.REJECTED) {
    return <span className={"text-xs text-gray-400"}>拒绝</span>;
  }
  if (status == AuditStatus.APPROVED) {
    return <span className={"text-xs text-gray-400"}>已同意</span>;
  }
}

export default function NewFriendItem(newFriendProps: AuditItemProps) {
  const userInfoMap = newFriendProps.auditWrap.contactMap;
  const audit = newFriendProps.audit;
  const currentUser = ChatUser.getCurrentUser();
  const isApplying = currentUser.id == audit.applyUserId + "";
  const newFriendId = isApplying ? audit.businessId : audit.applyUserId;
  const newFriend: Contact = userInfoMap[newFriendId];
  if (!newFriend) {
    return <div>user not found {audit.auditId}</div>;
  }
  const userHomeLink = `${NEXT_ASSET_PREFIX}/chat/friends/contact?friendId=${newFriend.userId}`;
  const userName = newFriend.nickName || newFriend.userName;
  const avatar =
    newFriend.avatar || format(`${AVATAR_URL}`, `${newFriend.userId}`);
  return (
    <SidebarMenuItem
      className={"flex flex-row justify-between items-center w-full h-10 mt-2 "}
    >
      <Link
        className={cn(
          "flex flex-row  gap-2  justify-start items-center ml-2  w-fit h-full p-0"
        )}
        href={userHomeLink}
      >
        <MyAvatar
          unread={0}
          showUnread={false}
          fallback={userName}
          src={avatar}
        />

        <div className={"flex flex-col justify-center items-start flex-1"}>
          <span className={"text-xs"}>
            {userName}-{newFriend.userId}
            {newFriend.nationality && <>【{newFriend.nationality}】</>}
          </span>
          <span
            title={newFriend.signature}
            className={"text-gray-400 text-xs truncate"}
          >
            {newFriend.signature}
          </span>
        </div>
      </Link>
      <div
        className={
          "flex  justify-center items-center text-xs h-full text-gray-400 w-80"
        }
      >
        <AuditStatusComp
          auditId={audit.auditId}
          status={audit.status}
          isApplying={isApplying}
        />
      </div>
    </SidebarMenuItem>
  );
}
