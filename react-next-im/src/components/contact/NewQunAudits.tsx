import NewFriendItem from "@/components/contact/NewFriendItem";
import {SidebarMenu} from "@/components/ui/sidebar";
import NewQunAuditItem from "@/components/contact/NewQunAuditItem";
import {useEffect, useState} from "react";
import AuditWrap from "@/lib/protocol/audit/AuditWrap";
import AuditApi from "@/api/AuditApi";
import ThreeDotLoading from "@/common/components/ThreeDotLoading";
import * as React from "react";

export default function NewQunAudits() {
    const [auditWrap, setAuditWrap] = useState<AuditWrap>();
    useEffect(() => {
        AuditApi.getGroupAuditList().then(setAuditWrap);
    }, []);
    if (!auditWrap) {
        return <ThreeDotLoading />;
    }
    return (
        <SidebarMenu className={"gap-2 w-full"}>
            {auditWrap.auditingList.map((audit) => (
                <NewQunAuditItem key={audit.auditId} audit={audit} auditWrap={auditWrap} />))
            }

            {auditWrap.myApplyingList.map((audit) => (
                <NewQunAuditItem key={audit.auditId} audit={audit} auditWrap={auditWrap} />))
            }
        </SidebarMenu>
    )
}