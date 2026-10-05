import Group from "@/lib/protocol/contact/Group";
import Contact from "@/lib/protocol/contact/Contact";
import QunMember from "@/lib/protocol/contact/QunMember";

export default class QunDetailWrap {
  public detail: Group;
  public members: QunMember[];
  public userDicts: Map<string, Contact>;

  constructor(
    detail: Group,
    members: QunMember[],
    userDicts: Map<string, Contact>
  ) {
    this.detail = detail;
    this.members = members;
    this.userDicts = userDicts;
  }

  public static fromJson(json: any): QunDetailWrap {
    const detail = Group.fromJson(json.detail);
    const members = json.members.map(QunMember.fromJson);
    const userDicts = new Map<string, Contact>();
    for (const key in json.userDicts) {
      const userDetail = Contact.fromRemoteJson(json.userDicts[key]);
      userDicts.set(userDetail.userId, userDetail);
    }
    return new QunDetailWrap(detail, members, userDicts);
  }
}
