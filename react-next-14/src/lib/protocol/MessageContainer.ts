import { Message } from "@/lib/protocol/Message";
import ChatApi from "@/lib/ChatApi";

export default class MessageContainer {
  //key:session key,value:message list
  private messageMap: Map<string, Message[]> = new Map();

  public putMessage(sessionKey: string, message: Message): void {
    let messageList = this.messageMap.get(sessionKey);
    if (messageList == null) {
      messageList = [];
      this.messageMap.set(sessionKey, messageList);
    }
    messageList.push(message);
  }

  public putMessages(sessionKey: string, messages: Message[]): void {
    let messageList = this.messageMap.get(sessionKey);
    if (messageList == null) {
      messageList = [];
      this.messageMap.set(sessionKey, messageList);
    }
    messageList.push(...messages);
  }

  public async getMessageList(sessionKey: string) {
    console.log("getMessageList", sessionKey);
    let messageList = this.messageMap.get(sessionKey);
    if (messageList == null) {
      messageList = await ChatApi.getMessages(sessionKey);
      if (messageList == null) {
        messageList = [];
      }
      this.messageMap.set(sessionKey, messageList);
    }
    return messageList;
  }
}
