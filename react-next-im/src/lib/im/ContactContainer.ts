import CrosStorage from "@/common/lib/CrosStorage";
import ContactGroup from "@/lib/protocol/contact/ContactGroup";
import ChatApi from "@/lib/ChatApi";
import Contact from "@/lib/protocol/contact/Contact";
import ChatUser from "@/lib/protocol/ChatUser";

export default class ContactContainer {
  private crosStorage: CrosStorage;
  /**
   * key: userId, value: Contact
   * @private
   */
  private container: Map<string, Contact> = new Map<string, Contact>();
  private contactGroup: ContactGroup | null = null;

  constructor(crosStorage: CrosStorage) {
    this.crosStorage = crosStorage;
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
      return localGroup;
    }
    await ChatApi.getContacts(this.crosStorage).then((group) => {
      console.log("fetch contact group from server " + new Date().getTime());
      localGroup = group;
      this.contactGroup = localGroup;
      for (const contact of localGroup.contacts) {
        this.container.set(contact.userId + "", contact);
      }
    });
    return localGroup;
  }

  public getGroupDetail(groupId: string) {
    return this.contactGroup?.quns.find((qun) => qun.qunId == groupId);
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
    await ChatApi.getUsersByIds(this.crosStorage, remoteUsers)
      .then((users: Contact[]) => {
        for (const user of users) {
          this.container.set(user.userId + "", user);
        }
      })
      .catch((error) => {
        console.log(error);
      });
  }
}
