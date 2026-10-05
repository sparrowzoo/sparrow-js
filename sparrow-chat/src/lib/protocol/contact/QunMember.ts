export default class QunMember {
  public id: number;
  public memberId: string;
  public applyTime: number;
  public auditTime: number;

  public static fromJson(json: any): QunMember {
    const member = new QunMember();
    member.id = json.id;
    member.memberId = json.memberId + "";
    member.applyTime = json.applyTime;
    member.auditTime = json.auditTime;
    return member;
  }
}
