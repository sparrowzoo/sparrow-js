import Fetcher from "@/common/lib/Fetcher";
import { TOKEN_KEY } from "@/common/lib/Env";
import ChatSession from "@/lib/protocol/ChatSession";
import Message from "@/lib/protocol/Message";
import ContactGroup from "@/lib/protocol/contact/ContactGroup";

export default class ChatApi {
  static async getVisitorToken() {
    let token;
    await Fetcher.get("/chat/v2/get-visitor-token.json", false).then(
      async (response: Result) => {
        token = response.data;
        sessionStorage.setItem(TOKEN_KEY, response.data);
      }
    );
    return token;
  }

  static async getMessages(sessionKey: string) {
    let messages: Message[] = [];
    console.log("sessionKey getMessages", sessionKey);
    await Fetcher.post("/chat/v2/messages.json", sessionKey).then(
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

  static async getSessions() {
    let sessions: ChatSession[] = [];
    await Fetcher.get("/chat/v2/sessions.json").then(
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

    static async getContacts() {
        let contactGroup: ContactGroup=new ContactGroup();
        await Fetcher.get("/contact/contacts.json").then(
            async (response: Result) => {
                if(response.data) {
                    contactGroup = response.data;
                }
            }
        );
        return contactGroup;
    }
}
