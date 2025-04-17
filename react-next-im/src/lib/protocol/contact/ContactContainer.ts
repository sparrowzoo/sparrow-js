import CrosStorage from "@/common/lib/CrosStorage";
import ContactGroup from "@/lib/protocol/contact/ContactGroup";
import ChatApi from "@/lib/ChatApi";
import ChatSession from "@/lib/protocol/session/ChatSession";
import Contact from "@/lib/protocol/contact/Contact";
import ChatUser from "@/lib/protocol/ChatUser";

export default class ContactContainer {
  public chatSessions: ChatSession[] | null = null;
  private crosStorage: CrosStorage;
  private container: Map<string, Contact> = new Map<string, Contact>();
  private contactGroup: ContactGroup | null = null;

  constructor(crosStorage: CrosStorage) {
    this.crosStorage = crosStorage;
  }

  public async getContactGroup() {
    let localGroup = this.contactGroup;
    if (localGroup) {
      console.log("getContactGroup from local " + new Date().getTime());
      return localGroup;
    }
    await ChatApi.getContacts(this.crosStorage).then((group) => {
      console.log("fetch contact group from server " + new Date().getTime());
      localGroup = group;
      this.contactGroup = localGroup;
      debugger;
      for (const contact of localGroup.contacts) {
        this.container.set(contact.userId + "", contact);
      }
    });
    return localGroup;
  }

  public getGroupDetail(groupId: string) {
    return this.contactGroup?.quns.find((qun) => qun.qunId == groupId);
  }

  public async getContactDetail(user: ChatUser) {
    if (user.isVisitor()) {
      return Contact.visitor(user);
    }
    const userId = user.id;
    if (this.container.has(userId)) {
      return this.container.get(userId);
    }
    await ChatApi.getUsersByIds(this.crosStorage, [userId])
      .then((users: Contact[]) => {
        if (users.length == 0) {
          this.container.set(userId, Contact.notFound(user));
          return;
        }
        this.container.set(userId, users[0]);
      })
      .catch((error) => {
        console.log(error);
      });
    return this.container.get(userId);
  }

  public getContactFromLocal(user: ChatUser) {
    if (user.isVisitor()) {
      return Contact.visitor(user);
    }
    return this.container.get(user.id);
  }

  public getLocalSessions() {
    return this.chatSessions;
  }

  public getDefaultSession() {
    if (this.chatSessions && this.chatSessions.length > 0) {
      return this.chatSessions[0];
    }
    return null;
  }

  public async getChatSessions() {
    let localSession = this.chatSessions;
    if (localSession) {
      return localSession;
    }
    //会话依赖联系人列表
    await this.getContactGroup().then(async (group) => {
      await ChatApi.getSessions(this.crosStorage).then((sessions) => {
        console.log(sessions.length);
        localSession = sessions;
        this.chatSessions = localSession;
      });
    });
    return localSession;
  }

  public newSession(sessionKey: string) {
    let session = this.chatSessions?.find(
      (session) => session.key() === sessionKey
    );
    if (!session) {
      session = ChatSession.parse(sessionKey) as ChatSession;
      this.chatSessions?.push(session);
    }
    session.lastReadTime = new Date().getTime();
    this.chatSessions?.sort((a: ChatSession, b: ChatSession) => {
      return b.lastReadTime - a.lastReadTime;
    });
  }
}
