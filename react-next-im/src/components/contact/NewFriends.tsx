import NewFriendItem from "@/components/contact/NewFriendItem";
import {SidebarMenu} from "@/components/ui/sidebar";
import {useContext, useEffect, useState} from "react";
import AuditWrap from "@/lib/protocol/audit/AuditWrap";
import AuditApi from "@/api/AuditApi";
import ThreeDotLoading from "@/common/components/ThreeDotLoading";
import * as React from "react";
import {WebSocketContext} from "@/lib/im/WebSocketProvider";

export default function NewFriends() {
    const webSocketContextValue = useContext(WebSocketContext);
    const messageBroker = webSocketContextValue.messageBroker;
    const [auditWrap, setAuditWrap] = useState<AuditWrap>();
    useEffect(() => {
        AuditApi.getFriendAuditList().then((res:AuditWrap) => {
            setAuditWrap(res);
            messageBroker.contactContainer.putJsonContact(res.contactMap)
        })
    }, []);
    if (!auditWrap) {
        return <ThreeDotLoading />;
    }
    return (
        <SidebarMenu className={"gap-2 w-full"}>
            {
                auditWrap.auditingList.map(item => (
                    <NewFriendItem key={item.auditId} audit={item} auditWrap={auditWrap} />
                ))
            }
            {
                auditWrap.myApplyingList.map(item => (
                    <NewFriendItem key={item.auditId} audit={item} auditWrap={auditWrap} />
                ))
            }
        </SidebarMenu>
    )
}