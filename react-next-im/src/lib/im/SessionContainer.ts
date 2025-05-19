import ChatApi from "@/api/ChatApi";
import ChatSession from "@/lib/protocol/session/ChatSession";
import ContactContainer from "@/lib/im/ContactContainer";
import CrosStorage from "@/common/lib/CrosStorage";
import Message from "@/lib/protocol/Message";
import ChatUser from "@/lib/protocol/ChatUser";
import UserCategory from "@/common/lib/UserCategory";
import { format } from "util";
import {
  AVATAR_URL,
  SESSION_CATEGORY_GROUP,
  SESSION_CATEGORY_NAME_MAPPING,
} from "@/common/lib/Env";
import toast from "react-hot-toast";

export enum SessionType {
  VISITOR = 0,
  GROUP = 10,
  REGISTER = 1,
  INTERMEDIARY = 2,
}

export class GroupedSession {
  public sessions: ChatSession[] = [];
  public unreadCount: number = 0;
  public name: string = "";

  constructor(sessions: ChatSession[], unreadCount: number) {
    this.sessions = sessions;
    this.unreadCount = unreadCount;
  }
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

  public async initSessions(contacts: string[]) {
    this.chatSessions = [];
    const currentUser = ChatUser.getCurrentUser();
    for (const contact of contacts) {
      //从后台获取用户类别，此时暂不知道用户类型，都暂设为普通用户
      const oppositeUser = new ChatUser(contact, UserCategory.REGISTER);
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

  public async getGroupedSessions(
    currentCategory: number
  ): Promise<Map<number, GroupedSession> | null> {
    const sessions = await this.getChatSessions();
    if (sessions == null) {
      return null;
    }
    const categories: number[] = SESSION_CATEGORY_GROUP[currentCategory];
    const categoryMap = SESSION_CATEGORY_NAME_MAPPING;
    const groupedSessions: Map<number, GroupedSession> = new Map<
      number,
      GroupedSession
    >();
    if (!categories) {
      toast.error("您没有权限哟，找志哥~~~");
      return new Map<number, GroupedSession>();
    }
    for (const category of categories) {
      const currentGroupSession = new GroupedSession([], 0);
      groupedSessions.set(category, currentGroupSession);
      currentGroupSession.name = categoryMap[category] as string;
    }
    for (const session of sessions) {
      const category = session.isGroup()
        ? 99
        : (session.getOppositeUser()?.category as number);

      const currentGroupSession = groupedSessions.get(category);
      if (!currentGroupSession) {
        continue;
      }
      currentGroupSession.sessions.push(session);
      currentGroupSession.unreadCount += session.unreadCount;
    }
    return groupedSessions;
  }

  public async newSession(sessionKey: string) {
    const session = ChatSession.parse(sessionKey) as ChatSession;
    let localSession = this.getLocalSession(session);
    if (!localSession) {
      if (!this.chatSessions) {
        this.chatSessions = [];
      }
      this.chatSessions?.push(session);
      await this.fillSessions([session]).then(() => {
        console.log("fill from remote ");
      });
      session.lastReadTime = new Date().getTime();
      session.unreadCount = 0;
      console.log("new session last time " + session.lastReadTime);
      this.sort();
    }
  }

  public fill(session: ChatSession) {
    if (session?.isOne2One()) {
      const oppositeUser = session.getOppositeUser();
      const contact = this.contactContainer.getContactDetail(
        oppositeUser as ChatUser
      );
      //获取对方用户类型后重新构建
      const newOppositeUser = new ChatUser(
        contact?.userId as string,
        contact?.category as number
      );
      //根据后台的类型重新生成session id
      const newSession = ChatSession.create121Session(
        newOppositeUser,
        ChatUser.getCurrentUser()
      );
      session.name = contact?.userName as string;
      session.avatarUrl = contact?.avatar as string;
      session.id = newSession.id;
      return;
    }
    const group = this.contactContainer.getGroupDetail(session?.id as string);
    session.name = group?.qunName as string;
    session.avatarUrl = format(AVATAR_URL, group?.qunId);
  }

  public fetchNewMessageCount() {
    if (!this.chatSessions) {
      return 0;
    }
    let unreadCount = 0;
    for (const session of this.chatSessions) {
      if (session.unreadCount > 0) {
        unreadCount += session.unreadCount;
      }
    }
    return unreadCount;
  }

  /**
   * 该方法支持
   * 1. 已经存在session列表
   * 2. 不存在的session列表数据填充(用户类型未知)
   * @param sessions
   * @private
   */
  private async fillSessions(sessions: ChatSession[]) {
    //先从联系人中获取,游客没有联系人
    await this.contactContainer.getContactGroup().then(async (group) => {
      //抽取所有会话中的用户ID
      const userIds = this.extractAllUserIds();
      //摘取本地不存在的用户
      await this.contactContainer.fetchRemoteUsers(userIds);
    });
    for (const session of sessions) {
      this.fill(session);
    }
  }
}
