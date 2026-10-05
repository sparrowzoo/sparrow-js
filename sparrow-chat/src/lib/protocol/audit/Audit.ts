export default class Audit {
    public  auditId:number;
    public  auditBusiness:number;
    /**
     * 业务ID  与业务类型对应
     * 如果是群，则为群ID
     * 如果是好友，则为好友ID
     */
    public  businessId:number;
    /**
     * 申请人ID
     */
    public  applyUserId:number;
    /**
     * 申请时间
     */
    public applyTime:number;
    /**
     * 审核时间
     */
    public  auditTime:number;
    /**
     * 审核人ID
     */
    public  auditUserId:number;
    /**
     * 申请的理由
     */
    public applyReason:string;
    /**
     * 审核的理由
     */
    public auditReason:string;
    /**
     * 审核的状态
     */
    public status:number;
}