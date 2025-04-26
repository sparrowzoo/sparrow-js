import Fetcher from "@/common/lib/Fetcher";
import Result from "@/common/lib/protocol/Result";
import CrosStorage from "@/common/lib/CrosStorage";
import AuditWrap from "@/lib/protocol/audit/AuditWrap";

export default class AuditApi {
    public static async getFriendAuditList(): Promise<any> {
        let auditWrap: AuditWrap|null = null;
        await Fetcher.get("/audit/friend-apply-list.json", CrosStorage.getCrosStorage()).then(
            (response: Result) => {
                const remoteAuditList: AuditWrap = response.data;
                auditWrap = remoteAuditList;
            }
        );
        return auditWrap;
    }

    public static async getGroupAuditList(): Promise<any> {
        let auditWrap: AuditWrap|null = null;
        await Fetcher.get("/audit/qun-member-apply-list.json", CrosStorage.getCrosStorage()).then(
            (response: Result) => {
                const remoteAuditList: AuditWrap = response.data;
                auditWrap = remoteAuditList;
            }
        );
        return auditWrap;
    }
}