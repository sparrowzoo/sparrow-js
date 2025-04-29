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
    await Fetcher.get("/chat/v2/get-visitor-token.json", null).then(
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
          messages.push(Message.fromMessage(message, sessionKey));
        }
      }
    );
    return messages;
  }

  static async getSessions(crosStorage: CrosStorage) {
    let sessions: ChatSession[] = [];
    await Fetcher.get("/chat/v2/sessions.json", crosStorage).then(
      (response: Result) => {
        const chatSessions: ChatSession[] = response.data;
        for (let session of chatSessions) {
          const localSession = ChatSession.newLocalSession(session);
          sessions.push(localSession);
        }
      }
    );
    return sessions;
  }

  static async getContacts(crosStorage: CrosStorage) {
    let localContactGroup: ContactGroup = new ContactGroup();
    await Fetcher.get("/contact/contacts.json", crosStorage).then(
      async (response: Result) => {
        if (response.data) {
          const remoteContactGroup = response.data;
          const userMap = remoteContactGroup.userMap;
          localContactGroup.userMap = new Map();
          for (const userId in userMap) {
            if (!userMap.hasOwnProperty(userId)) {
              continue;
            }
            const remoteContact = userMap[userId];
            if (!remoteContact.avatar) {
              remoteContact.avatar = format(AVATAR_URL, userId);
            }
            localContactGroup.userMap.set(userId, remoteContact);
          }

          const contacts: Contact[] = [];
          for (const contactId of remoteContactGroup.contactIds) {
            const localContact = localContactGroup.userMap.get(contactId + "");
            if (localContact) {
              contacts.push(localContact);
            }
          }
          localContactGroup.contacts = contacts;

          const groups = remoteContactGroup.quns;
          for (let group of groups) {
            group.avatar = format(AVATAR_URL, group.qunId);
          }
          localContactGroup.quns = groups;
        }
      }
    );
    return localContactGroup;
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
