import { Fetcher } from "@/lib/Fetcher";
import { TOKEN_KEY } from "@/lib/EnvUtils";

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
    let messages;
    console.log("sessionKey getMessages", sessionKey);
    await Fetcher.post("/chat/v2/messages.json", sessionKey).then(
      async (response: Result) => {
        messages = response.data;
      }
    );
    return messages;
  }
}
