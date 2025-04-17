import Fetcher from "@/common/lib/Fetcher";
import ChatSession from "@/lib/protocol/session/ChatSession";
import Message from "@/lib/protocol/Message";
import ContactGroup from "@/lib/protocol/contact/ContactGroup";
import CrosStorage from "@/common/lib/CrosStorage";
import Contact from "@/lib/protocol/contact/Contact";
import { format } from "util";
import { AVATAR_URL } from "@/common/lib/Env";
import Result from "@/common/lib/protocol/Result";

export default class ChatApi {
  static async getVisitorToken(): Promise<string> {
    let token;
    await Fetcher.get("/chat/v2/get-visitor-token.json").then(
      async (response: Result) => {
        token = response.data;
      }
    );
    return token;
  }

  static async getMessages(sessionKey: string, crosStorage: CrosStorage) {
    let messages: Message[] = [];
    console.log("sessionKey getMessages", sessionKey);
    await Fetcher.post("/chat/v2/messages.json", sessionKey, crosStorage).then(
      async (response: Result) => {
        let messageList: Message[] = response.data;
        if (messageList == null) {
          messageList = [];
        }
        for (let message of messageList) {
          messages.push(Message.fromMessage(message));
        }
      }
    );
    return messages;
  }

  static async getSessions(crosStorage: CrosStorage) {
    let sessions: ChatSession[] = [];
    await Fetcher.get("/chat/v2/sessions.json", crosStorage).then(
      async (response: Result) => {
        const chatSessions: ChatSession[] = response.data;
        for (let session of chatSessions) {
          sessions.push(
            ChatSession.createSession(session.chatType, session.id)
          );
        }
      }
    );
    return sessions;
  }

  static async getContacts(crosStorage: CrosStorage) {
    let contactGroup: ContactGroup = new ContactGroup();
    await Fetcher.get("/contact/contacts.json", crosStorage).then(
      async (response: Result) => {
        if (response.data) {
          contactGroup = response.data;
          const contacts: Contact[] = contactGroup.contacts;
          for (let remoteContact of contacts) {
            if (!remoteContact.avatar) {
              remoteContact.avatar = format(AVATAR_URL, remoteContact.userId);
            }
          }
          const groups = contactGroup.quns;
          for (let group of groups) {
            group.avatar = format(AVATAR_URL, group.qunId);
          }
          contactGroup.contacts = contacts;
        }
      }
    );
    return contactGroup;
  }

  static async getUsersByIds(
    crosStorage: CrosStorage,
    userIds: string[]
  ): Promise<Contact[] | null> {
    let users: Contact[] | null = null;
    await Fetcher.post(
      "/contact/get-users-by-ids.json",
      userIds,
      crosStorage
    ).then(async (response: Result) => {
      if (!response.data) {
        users = [];
        return;
      }
      users = response.data;
      if (users == null) {
        users = [];
        return;
      }
      for (let user of users) {
        if (!user.avatar) {
          user.avatar = format(AVATAR_URL, user.userId);
        }
      }
    });
    return users;
  }
}
