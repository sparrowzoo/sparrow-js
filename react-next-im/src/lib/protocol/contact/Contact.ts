import ChatUser from "@/lib/protocol/ChatUser";
import { VISITOR_AVATAR_URL } from "@/common/lib/Env";

export default class Contact {
  /**
   * 国籍
   */
  public nationality: string;

  /**
   * 国旗url
   */
  public flagUrl: string;
  /**
   * 用户名
   */
  public userName: string;

  /**
   * 昵称
   */
  public nickName: string;
  /**
   * 头象
   */
  public avatar: string;
  public signature: string;

  /**
   * 用户id
   */
  private _userId: string;

  get userId(): string {
    return this._userId;
  }

  set userId(value: string | number) {
    //保证userId为字符串
    this._userId = value + "";
  }

  public static visitor(user: ChatUser) {
    const contact = new Contact();
    contact.userId = user.id;
    contact.userName = "VISITOR" + user.id;
    contact.nickName = contact.userName;
    contact.avatar = `${VISITOR_AVATAR_URL}`;
    contact.flagUrl = "";
    contact.nationality = "";
    return contact;
  }

  public static notFound(user: ChatUser) {
    const contact = new Contact();
    contact.userId = user.id;
    contact.userName = "VISITOR:" + user.id;
    contact.nickName = contact.nickName;
    contact.avatar = `${VISITOR_AVATAR_URL}`;
    contact.flagUrl = "";
    contact.nationality = "";
    return contact;
  }
}
