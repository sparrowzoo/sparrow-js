import Fetcher from "@/common/lib/Fetcher";
import Result from "@/common/lib/protocol/Result";
import CrosStorage from "@/common/lib/CrosStorage";
import AuditWrap from "@/lib/protocol/audit/AuditWrap";
import toast from "react-hot-toast";

export default class AuditApi {
  public static async getFriendAuditList(): Promise<any> {
    let auditWrap: AuditWrap | null = null;
    await Fetcher.get(
      "/audit/friend-apply-list.json",
      CrosStorage.getCrosStorage()
    ).then((response: Result) => {
      const remoteAuditList: AuditWrap = response.data;
      auditWrap = remoteAuditList;
    });
    return auditWrap;
  }

  public static async getGroupAuditList(): Promise<any> {
    let auditWrap: AuditWrap | null = null;
    await Fetcher.get(
      "/audit/qun-member-apply-list.json",
      CrosStorage.getCrosStorage()
    ).then((response: Result) => {
      const remoteAuditList: AuditWrap = response.data;
      auditWrap = remoteAuditList;
    });
    return auditWrap;
  }

  public static async auditQunMember(
    auditId: number,
    agree: boolean
  ): Promise<any> {
    let audit = {
      isAgree: agree,
      auditId: auditId,
      reason: "",
    };
    const body = JSON.stringify(audit);
    await Fetcher.post(
      "/audit/audit-qun-apply.json",
      body,
      CrosStorage.getCrosStorage()
    )
      .then((response: Result) => {
        toast.success("操作成功");
      })
      .catch((error: any) => {
        console.log(error);
      });
  }
}
