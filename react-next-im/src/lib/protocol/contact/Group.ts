export default class Group {
  public qunId: string;
  public qunName: string;
  public announcement: string;
  public nationality: string;
  public remark: string;
  public ownerId: string;
  public ownerName: string;
  public categoryId: number;
  public categoryName: string;
  public avatar: string;

  public static fromJson(json: Group): Group {
    const group = new Group();
    group.qunId = json.qunId;
    group.qunName = json.qunName;
    group.announcement = json.announcement;
    group.nationality = json.nationality;
    group.remark = json.remark;
    group.ownerId = json.ownerId;
    group.ownerName = json.ownerName;
    group.categoryId = json.categoryId;
    group.categoryName = json.categoryName;
    group.avatar = json.avatar;
    return group;
  }
}
