import {cn} from "@/lib/utils";
import MyAvatar from "@/components/MyAvatar";
import Link from "next/link";
import * as React from "react";
import {SidebarMenuItem} from "@/components/ui/sidebar";
import {AuditStatus} from "@/lib/protocol/audit/AuditStatus";
import {Button} from "@/components/ui/button";
import AuditStatusProps from "@/lib/protocol/audit/AuditStatusProps";
import ChatUser from "@/lib/protocol/ChatUser";
import Contact from "@/lib/protocol/contact/Contact";
import {AVATAR_URL, NEXT_ASSET_PREFIX} from "@/common/lib/Env";
import {format} from "util";
import AuditItemProps from "@/lib/protocol/audit/AuditItemProps";
import Group from "@/lib/protocol/contact/Group";

function AuditStatusComp(props: AuditStatusProps) {
    const {status, isApplying} = props;
    console.log(status + "-" + typeof status);
    console.log(status == AuditStatus.PENDING);
    console.log(AuditStatus.APPROVED + "-" + typeof AuditStatus.APPROVED);
    console.log(status + "-" + AuditStatus.APPROVED + "-" + AuditStatus.REJECTED + "-" + AuditStatus.PENDING);
    if (status == AuditStatus.PENDING) {
        if (isApplying) {
            return <span className={"text-xs text-gray-400"}>待对方确认</span>
        }
        return (<div className={"flex flex-row justify-center items-center text-xs h-full text-gray-400 gap-2 w-80"}>
                <Button className={"w-12 cursor-pointer p-2"}>同意</Button>
                <Button className={"w-12 cursor-pointer p-2"}>拒绝</Button>
            </div>
        )
    }
    if (status == AuditStatus.REJECTED) {
        return <span className={"text-xs text-gray-400"}>拒绝</span>
    }
    if (status == AuditStatus.APPROVED) {
        return <span className={"text-xs text-gray-400"}>已同意</span>
    }
}

export default function NewQunAuditItem(newQunProps: AuditItemProps) {

    const userInfoMap = newQunProps.auditWrap.contactMap;
    const audit = newQunProps.audit;
    const currentUser = ChatUser.getCurrentUser();
    const isApplying = currentUser.id == audit.applyUserId + "";
    const applyUser: Contact = userInfoMap[audit.applyUserId + ""];
    const userHomeLink = `${NEXT_ASSET_PREFIX}/friends/contact?friendId=${applyUser.userId}`;
    const userName = applyUser.nickName || applyUser.userName;
    const avatar = applyUser.avatar || format(`${AVATAR_URL}`, `${applyUser.userId}`);
    const qun: Group = newQunProps.auditWrap.qunMap[audit.businessId];

    return (<SidebarMenuItem className={"flex flex-row justify-between items-center w-full h-10 mt-2"}>
            <div className={"flex flex-row  justify-start items-center w-fix h-fit p-0 gap-2"}>
                <Link className={cn("flex flex-row w-fit h-fit p-0 ml-2 gap-2")} href={userHomeLink}>
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
                <div className={"flex flex-col justify-center items-start text-xs text-gray-400 w-32 "}>
                    <strong className={"text-xs text-gray-400"}>申请加入{qun.qunName}群</strong>
                    <span className={"text-xs text-gray-400 ml-1"}>2022-03-15 10:00</span>
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
                    <span className={"text-xs text-gray-400 ml-1"}>找志哥</span>
                </div>
            </div>
            <div className={"flex  justify-center items-center text-xs h-full text-gray-400 w-80"}>
                <AuditStatusComp status={audit.status} isApplying={isApplying}/>
            </div>
        </SidebarMenuItem>
    )
}