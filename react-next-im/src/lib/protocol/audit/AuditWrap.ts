import Contact from "@/lib/protocol/contact/Contact";
import Group from "@/lib/protocol/contact/Group";
import Audit from "@/lib/protocol/audit/Audit";

export default class AuditWrap {

    /**
     * 待我审核的申请列表
     */
    public  auditingList:Audit[];
    /**
     * 我发起的申请列表
     */
    public  myApplyingList:Audit[];
    public  contactMap:Map<number, Contact>;
    public  qunMap:Map<number, Group>;
}