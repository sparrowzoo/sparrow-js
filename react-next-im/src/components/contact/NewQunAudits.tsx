import { SidebarMenu } from "@/components/ui/sidebar";
import NewQunAuditItem from "@/components/contact/NewQunAuditItem";
import * as React from "react";
import { useContext, useEffect, useState } from "react";
import AuditWrap from "@/lib/protocol/audit/AuditWrap";
import AuditApi from "@/api/AuditApi";
import ThreeDotLoading from "@/common/components/ThreeDotLoading";
import { WebSocketContext } from "@/lib/im/WebSocketProvider";

export default function NewQunAudits() {
  const webSocketContextValue = useContext(WebSocketContext);
  const messageBroker = webSocketContextValue.messageBroker;

  const [auditWrap, setAuditWrap] = useState<AuditWrap>();
  useEffect(() => {
    AuditApi.getGroupAuditList().then((auditWrap) => {
      setAuditWrap(auditWrap);
      messageBroker.contactContainer.putJsonContact(auditWrap.contactMap);
    });
  }, []);
  if (!auditWrap) {
    return <ThreeDotLoading />;
  }
  return (
    <SidebarMenu className={"gap-2 w-full"}>
      {auditWrap.auditingList.map((audit) => (
        <NewQunAuditItem
          key={audit.auditId}
          audit={audit}
          auditWrap={auditWrap}
        />
      ))}

      {auditWrap.myApplyingList.map((audit) => (
        <NewQunAuditItem
          key={audit.auditId}
          audit={audit}
          auditWrap={auditWrap}
        />
      ))}
    </SidebarMenu>
  );
}
