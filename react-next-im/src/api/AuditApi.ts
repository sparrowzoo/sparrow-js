import Fetcher from "@/common/lib/Fetcher";
import Result from "@/common/lib/protocol/Result";
import AuditWrap from "@/lib/protocol/audit/AuditWrap";

export default class AuditApi {
  public static async getFriendAuditList(
    translator: (key: string) => string
  ): Promise<any> {
    let auditWrap: AuditWrap | null = null;
    await Fetcher.get("/audit/friend-apply-list.json", translator).then(
      (response: Result) => {
        const remoteAuditList: AuditWrap = response.data;
        auditWrap = remoteAuditList;
      }
    );
    return auditWrap;
  }

  public static async getGroupAuditList(
    translator: (key: string) => string
  ): Promise<any> {
    let auditWrap: AuditWrap | null = null;
    await Fetcher.get("/audit/qun-member-apply-list.json", translator).then(
      (response: Result) => {
        const remoteAuditList: AuditWrap = response.data;
        auditWrap = remoteAuditList;
      }
    );
    return auditWrap;
  }

  public static async auditQunMember(
    auditId: number,
    agree: boolean,
    translator: (key: string) => string
  ): Promise<any> {
    let audit = {
      isAgree: agree,
      auditId: auditId,
      reason: "",
    };
    const body = JSON.stringify(audit);
    await Fetcher.post("/audit/audit-qun-apply.json", body, translator);
  }
}
