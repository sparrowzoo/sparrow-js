import Fetcher from "@/common/lib/Fetcher";
import AuditWrap from "@/lib/protocol/audit/AuditWrap";

export default class AuditApi {
  public static async getFriendAuditList(
    translator: (key: string) => string
  ): Promise<AuditWrap> {
    const response = await Fetcher.get<AuditWrap>({url: "/audit/friend-apply-list.json", translator});
    return response.data;
  }

  public static async getGroupAuditList(
    translator: (key: string) => string
  ): Promise<AuditWrap> {
    const response = await Fetcher.get<AuditWrap>({url: "/audit/qun-member-apply-list.json", translator});
    return response.data;
  }

  public static async auditQunMember(
    auditId: number,
    agree: boolean,
    translator: (key: string) => string
  ): Promise<void> {
    const audit = {
      isAgree: agree,
      auditId: auditId,
      reason: "",
    };
    await Fetcher.post({url: "/audit/audit-qun-apply.json", body: audit, translator});
  }
}
