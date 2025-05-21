import ContactGroup from "@/lib/protocol/contact/ContactGroup";
import ChatApi from "@/api/ChatApi";
import Contact from "@/lib/protocol/contact/Contact";
import ChatUser from "@/lib/protocol/ChatUser";
import QunDetailWrap from "@/lib/protocol/contact/QunDetailWrap";
import QunAPI from "@/api/QunApi";
import { Translator } from "@/common/lib/TranslatorType";

export default class ContactContainer {
  /**
   * key: userId, value: Contact
   * @private
   */
  private container: Map<string, Contact> = new Map<string, Contact>();
  private translator: Translator = null;
  private groupContainer: Map<string, QunDetailWrap> = new Map<
    string,
    QunDetailWrap
  >();
  private contactGroup: ContactGroup | null = null;

  constructor(translator: Translator) {
    this.translator = translator;
  }

  public initContact(contacts: Contact[]) {
    for (const contact of contacts) {
      this.container.set(contact.userId, contact);
    }
    this.contactGroup = new ContactGroup();
    this.contactGroup.contacts = contacts;
    this.contactGroup.quns = [];
  }

  public async getContactGroup() {
    let localGroup = this.contactGroup;
    if (localGroup) {
      console.log("getContactGroup from local " + new Date().getTime());
      return localGroup;
    }
    const currentUser = ChatUser.getCurrentUser();
    //游客没有联系人
    if (currentUser?.isVisitor()) {
      return new ContactGroup();
    }
    console.log("fetching  from server " + new Date().getTime());
    await ChatApi.getContacts(this.translator).then((group) => {
      console.log("fetch contact group from server " + new Date().getTime());
      localGroup = group;
      this.contactGroup = localGroup;
      for (const [userId, contact] of localGroup.userMap) {
        this.container.set(userId + "", contact);
      }
    });
    return localGroup;
  }

  public getGroupDetail(groupId: string) {
    return this.contactGroup?.quns.find((qun) => qun.qunId == groupId);
  }

  public async fetchGroupDetail(groupId: string) {
    if (this.groupContainer.has(groupId)) {
      return this.groupContainer.get(groupId);
    }
    const groupDetail = await QunAPI.qunDetail(groupId, this.translator);
    this.groupContainer.set(groupId, groupDetail);
    for (const [userId, userDetail] of groupDetail.userDicts) {
      this.container.set(userId, userDetail);
    }
    return groupDetail;
  }

  /**
   * 本地获取某个用户的信息，在之前要保证用户信息已经批量拉取本地
   * 1 会话列表
   * 2 群成员列表
   * 3 联系人列表
   * @param user
   */
  public getContactDetail(user: ChatUser) {
    if (user.isVisitor()) {
      return Contact.visitor(user);
    }
    const userId = user.id;
    if (this.container.has(userId)) {
      return this.container.get(userId);
    }
    return Contact.notFound(user);
  }

  public async fetchRemoteUsers(userIds: string[]) {
    const remoteUsers: string[] = [];
    for (const userId of userIds) {
      if (!this.container.has(userId)) {
        remoteUsers.push(userId);
      }
    }

    if (remoteUsers.length == 0) {
      return;
    }
    await ChatApi.getUsersByIds(remoteUsers, this.translator)
      .then((users: Contact[]) => {
        for (const user of users) {
          this.container.set(user.userId + "", user);
        }
      })
      .catch((error) => {
        console.log(error);
      });
  }

  public putJsonContact(contactMap: Map<number, Contact>) {
    if (contactMap.size <= 0) {
      return;
    }

    for (const key in contactMap) {
      if (contactMap.hasOwnProperty(key)) {
        this.container.set(key, contactMap[key]);
      }
    }
  }
}
