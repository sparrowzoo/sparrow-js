import { Fetcher } from "@/lib/Fetcher";
import { TOKEN_KEY } from "@/lib/EnvUtils";
import ChatSession from "@/lib/protocol/ChatSession";
import Message from "@/lib/protocol/Message";

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
}
