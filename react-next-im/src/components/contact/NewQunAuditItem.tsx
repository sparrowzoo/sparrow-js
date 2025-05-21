import { cn } from "@/lib/utils";
import MyAvatar from "@/components/MyAvatar";
import Link from "next/link";
import * as React from "react";
import { SidebarMenuItem } from "@/components/ui/sidebar";
import { AuditStatus } from "@/lib/protocol/audit/AuditStatus";
import { Button } from "@/components/ui/button";
import AuditStatusProps from "@/lib/protocol/audit/AuditStatusProps";
import ChatUser from "@/lib/protocol/ChatUser";
import Contact from "@/lib/protocol/contact/Contact";
import { AVATAR_URL, NEXT_ASSET_PREFIX } from "@/common/lib/Env";
import AuditItemProps from "@/lib/protocol/audit/AuditItemProps";
import Group from "@/lib/protocol/contact/Group";
import AuditApi from "@/api/AuditApi";
import { format } from "util";
import { Utils } from "@/common/lib/Utils";
import { useTranslations } from "next-intl";
import toast from "react-hot-toast";

function AuditStatusComp(props: AuditStatusProps) {
  const t = useTranslations("Contact.Audit");

  function agree() {
    AuditApi.auditQunMember(props.auditId, true, t).then(() => {
      toast.success(t("agree-success"));
    });
  }

  function reject() {
    AuditApi.auditQunMember(props.auditId, false, t).then(() => {
      toast.success(t("reject-success"));
    });
  }

  const { status, isApplying } = props;
  if (status == AuditStatus.PENDING) {
    if (isApplying) {
      return <span className={"text-xs text-gray-400"}>{t("applying")}</span>;
    }
    return (
      <div
        className={
          "flex flex-row justify-center items-center text-xs h-full text-gray-400 gap-2 w-80"
        }
      >
        <Button onClick={agree} className={"w-12 cursor-pointer p-2"}>
          {t("agree")}
        </Button>
        <Button onClick={reject} className={"w-12 cursor-pointer p-2"}>
          {t("reject")}
        </Button>
      </div>
    );
  }
  if (status == AuditStatus.REJECTED) {
    return <span className={"text-xs text-gray-400"}>{t("rejected")}</span>;
  }
  if (status == AuditStatus.APPROVED) {
    return <span className={"text-xs text-gray-400"}>{t("approved")}</span>;
  }
}

export default function NewQunAuditItem(newQunProps: AuditItemProps) {
  const t = useTranslations("Contact.Audit");
  const userInfoMap = newQunProps.auditWrap.contactMap;
  const audit = newQunProps.audit;
  const currentUser = ChatUser.getCurrentUser();
  const isApplying = currentUser.id == audit.applyUserId + "";
  const applyUser: Contact = userInfoMap[audit.applyUserId + ""];
  if (!applyUser) {
    console.error("applyUser not found in userInfoMap");
    return <div>{audit.auditId} not found user</div>;
  }

  const userHomeLink = `${NEXT_ASSET_PREFIX}/chat/friends/contact?friendId=${applyUser.userId}`;
  const userName = applyUser.nickName || applyUser.userName;
  const avatar =
    applyUser.avatar || format(`${AVATAR_URL}`, `${applyUser.userId}`);
  const qun: Group = newQunProps.auditWrap.qunMap[audit.businessId];

  return (
    <SidebarMenuItem
      className={"flex flex-row justify-between items-center w-full h-10 mt-2"}
    >
      <div
        className={
          "flex flex-row  justify-start items-center w-fix h-fit p-0 gap-2"
        }
      >
        <Link
          className={cn("flex flex-row w-64 h-fit p-0 ml-2 gap-2")}
          href={userHomeLink}
        >
          <MyAvatar
            unread={0}
            showUnread={false}
            fallback={userName as string}
            src={avatar}
          />

          <div className={"flex flex-col justify-center items-start w-fix"}>
            <span className={"text-xs"}>
              {userName}-{applyUser.userId}
              {applyUser.nationality && <>【{applyUser.nationality}】</>}
            </span>
            <span
              title={applyUser.signature}
              className={"text-gray-400 text-xs truncate  w-[10rem]"}
            >
              {applyUser.signature}
            </span>
          </div>
        </Link>
        <div
          className={
            "flex flex-col justify-center items-start text-xs text-gray-400 w-32 "
          }
        >
          <strong className={"text-xs text-gray-400"}>
            {t("apply-to-group")}:{qun.qunName}
          </strong>
          <span className={"text-xs text-gray-400 ml-1"}>
            {Utils.dateFormat(audit.applyTime)}
          </span>
        </div>
        <div>
          <MyAvatar
            unread={0}
            showUnread={false}
            fallback={qun.qunName as string}
            src={qun.avatar}
          />
        </div>
        <div>
          <span className={"text-xs text-gray-400 ml-1"}></span>
        </div>
      </div>
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
