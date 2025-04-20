import ChatApi from "@/lib/ChatApi";
import ChatSession from "@/lib/protocol/session/ChatSession";
import ContactContainer from "@/lib/im/ContactContainer";
import CrosStorage from "@/common/lib/CrosStorage";
import Message from "@/lib/protocol/Message";
import Contact from "@/lib/protocol/contact/Contact";
import ChatUser from "@/lib/protocol/ChatUser";
import { UserCategory } from "@/lib/protocol/UserCategory";

export enum SessionType {
  VISITOR = 0,
  GROUP = 10,
  REGISTER = 1,
  INTERMEDIARY = 2,
}

export class GroupedSessions {
  public visitorSessions: ChatSession[] = [];
  public groupSessions: ChatSession[] = [];
  public registerSessions: ChatSession[] = [];
  public agentSessions: ChatSession[] = [];
  public clientSessions: ChatSession[] = [];
}

export default class SessionContainer {
  public chatSessions: ChatSession[] | null = null;
  public currentSession: ChatSession;
  private contactContainer: ContactContainer;
  private crosStorage: CrosStorage;

  constructor(crosStorage: CrosStorage, contactContainer: ContactContainer) {
    this.crosStorage = crosStorage;
    this.contactContainer = contactContainer;
  }

  public async initSessions(contacts: Contact[]) {
    this.chatSessions = [];
    const currentUser = ChatUser.getCurrentUser();
    for (const contact of contacts) {
      const oppositeUser = new ChatUser(contact.userId, UserCategory.REGISTER);
      const session = ChatSession.create121Session(
        currentUser as ChatUser,
        oppositeUser
      );
      this.chatSessions?.push(session);
    }
    if (this.chatSessions) {
      await this.fillSessions(this.chatSessions);
    }
  }

  public pullSession(session: ChatSession) {
    const chatSession = this.getLocalSession(session);
    if (chatSession) {
      this.currentSession = chatSession;
      chatSession.isPulled = true;
      chatSession.lastReadTime = new Date().getTime();
      this.sort();
      console.log(
        "sessionKey " +
          chatSession.sessionKey +
          " pull update last time " +
          chatSession.lastReadTime
      );
      chatSession.unreadCount = 0;
    }
  }

  public getLocalSession(session: ChatSession) {
    return this.chatSessions?.find((chatSession) => {
      return chatSession.sessionKey === session.sessionKey;
    });
  }

  public async getChatSession(session: ChatSession): Promise<void> {
    const chatSession = this.getLocalSession(session);
    if (!chatSession) {
      return this.newSession(session.sessionKey);
    }
  }

  public plusUnreadCount(message: Message) {
    const session = this.getLocalSession(message.session);
    if (session) {
      if (session.sessionKey != this.currentSession?.sessionKey) {
        session.unreadCount++;
        console.log("plus unread count sessionKey " + session.sessionKey);
      }
    }
  }

  public appendLastMessage(message: Message) {
    const session: ChatSession = this.getLocalSession(
      message.session
    ) as ChatSession;
    session.lastMessage = message;
    console.log("append last message");
  }

  public sort() {
    if (this.chatSessions) {
      this.chatSessions.sort((a, b) => {
        return b.lastReadTime - a.lastReadTime;
      });
    }
  }

  public read(session: ChatSession) {
    const chartSession = this.getLocalSession(session);
    if (chartSession) {
      chartSession.lastReadTime = new Date().getTime();
      console.log(
        "update last read time sessionKey" +
          session.sessionKey +
          " at " +
          chartSession.lastReadTime
      );
      this.sort();
      chartSession.unreadCount = 0;
    }
  }

  public getDefaultSession() {
    if (this.chatSessions && this.chatSessions.length > 0) {
      return this.chatSessions[0];
    }
    return null;
  }

  public extractAllUserIds() {
    const userIds: string[] = [];
    this.chatSessions?.forEach((session) => {
      if (session.isOne2One()) {
        const oppositeUser = session.getOppositeUser();
        if (!oppositeUser?.isVisitor()) {
          userIds.push(oppositeUser?.id as string);
        }
      }
    });
    return userIds;
  }

  public async getChatSessions() {
    if (this.chatSessions) {
      for (const session of this.chatSessions) {
        console.log(
          "sessionKey" +
            session.sessionKey +
            " last time" +
            session.lastReadTime
        );
      }
      return this.chatSessions;
    }
    await ChatApi.getSessions(this.crosStorage).then(async (sessions) => {
      console.log(sessions.length);
      this.chatSessions = sessions;
      await this.fillSessions(this.chatSessions).then(() => {
        console.log("fill sessions done");
      });
    });
    console.log("return chat sessions ...");
    return this.chatSessions;
  }

  public async getGroupedSessions(): Promise<GroupedSessions | null> {
    const sessions = await this.getChatSessions();
    if (sessions == null) {
      return null;
    }
    const groupedSessions = new GroupedSessions();
    for (const session of sessions) {
      if (session.isGroup()) {
        groupedSessions.groupSessions.push(session);
        continue;
      }
      const oppositeUser = session.getOppositeUser();
      if (oppositeUser?.isVisitor()) {
        groupedSessions.visitorSessions.push(session);
        continue;
      }
      if (oppositeUser?.isAgent()) {
        groupedSessions.agentSessions.push(session);
        continue;
      }

      if (oppositeUser?.isClient()) {
        groupedSessions.clientSessions.push(session);
      }
    }
    return groupedSessions;
  }

  public async newSession(sessionKey: string) {
    const session = ChatSession.parse(sessionKey) as ChatSession;
    let localSession = this.getLocalSession(session);
    if (!localSession) {
      await this.fillSessions([session]).then(() => {
        console.log("fill from remote ");
      });

      session.lastReadTime = new Date().getTime();
      session.unreadCount = 0;
      console.log("new session last time " + session.lastReadTime);
      if (!this.chatSessions) {
        this.chatSessions = [];
      }
      this.chatSessions?.push(session);
      this.sort();
    }
  }

  private async fillSessions(sessions: ChatSession[]) {
    //先从联系人中获取,游客没有联系人
    await this.contactContainer.getContactGroup().then(async (group) => {
      //抽取所有会话中的用户ID
      const userIds = this.extractAllUserIds();
      //摘取本地不存在的用户
      await this.contactContainer.fetchRemoteUsers(userIds);
    });
    for (const session of sessions) {
      session.fill(this.contactContainer);
    }
  }
}
