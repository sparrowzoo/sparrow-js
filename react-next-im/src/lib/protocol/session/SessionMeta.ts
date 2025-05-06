export default class SessionMeta {
  public id: number;
  public sessionKey: string;
  public userId: string;
  public userCategory: number;
  public userName: string;
  public userNickName: string;
  public oppositeId: string;
  public oppositeCategory: number;
  public oppositeName: string;
  public oppositeNickName: string;
  public isVisitor: boolean;
  public gmtCreate: number;

  public static fromRemoteJson(data: any): SessionMeta {
    const sessionMeta = new SessionMeta();
    sessionMeta.id = data.id;
    sessionMeta.sessionKey = data.sessionKey;
    sessionMeta.userId = data.userId;
    sessionMeta.userCategory = data.userCategory;
    sessionMeta.userName = data.userName;
    sessionMeta.userNickName = data.userNickName;
    sessionMeta.oppositeId = data.oppositeId;
    sessionMeta.oppositeCategory = data.oppositeCategory;
    sessionMeta.oppositeName = data.oppositeName;
    sessionMeta.oppositeNickName = data.oppositeNickName;
    sessionMeta.isVisitor = data.isVisitor;
    sessionMeta.gmtCreate = data.gmtCreate;
    return sessionMeta;
  }
}
