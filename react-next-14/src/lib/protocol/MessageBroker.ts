import ChatApi from "@/lib/ChatApi";
import Message from "@/lib/protocol/Message";
import Protocol from "@/lib/protocol/Protocol";
import SparrowWebSocket from "@/lib/SparrowWebSocket";
import ChatSession from "@/lib/protocol/ChatSession";
import Chat from "@/lib/protocol/Chat";
import ChatUser from "@/lib/protocol/ChatUser";
import toast from "react-hot-toast";

export default class MessageBroker {
  //key:session key,value:message list
  private messageMap: Map<string, Message[]> = new Map();

  constructor(webSocket: SparrowWebSocket) {
    this._webSocket = webSocket;
    this._webSocket.onMsgCallback = (buf: ArrayBuffer) => {
      this.websocketMsgCallback(buf);
    };
    this._webSocket.offlineCallback = () => {
      toast.error("消息已推送，对方已离线....");
    };
  }

  private _webSocket: SparrowWebSocket;

  get webSocket(): SparrowWebSocket {
    return this._webSocket;
  }

  public closeWebSocket() {
    this._webSocket.close();
  }

  public putMessage(protocol: Protocol): void {
    const message = Message.fromProtocol(protocol);
    const sessionKey = protocol.chatSession.key();
    let messageList = this.messageMap.get(sessionKey);
    if (messageList == null) {
      messageList = [];
      this.messageMap.set(sessionKey, messageList);
    }
    messageList.push(message);
  }

  public sendMessage(sessionKey: string, content: string): void {
    const chatSession = ChatSession.parse(sessionKey);
    let protocol;
    if (chatSession?.chatType == Chat.CHAT_TYPE_1_TO_1) {
      const oppositeUser = chatSession.getOppositeUser();
      protocol = Protocol.create121Chat(
        Chat.TEXT_MESSAGE,
        oppositeUser as ChatUser,
        content,
        new Date().getTime()
      );
    }
    this.putMessage(protocol);
    this._webSocket?.sendMessage(protocol.toBytes());
  }

  public async getMessageList(sessionKey: string) {
    console.log("getMessageList", sessionKey);
    let messageList = this.messageMap.get(sessionKey);
    if (messageList != null) {
      return messageList;
    }
    messageList = await ChatApi.getMessages(sessionKey);
    this.messageMap.set(sessionKey, messageList);
    return messageList;
  }

  public newMessageSignal = () => {};

  public websocketMsgCallback(buf: ArrayBuffer) {
    const protocol = Protocol.fromBytes(buf);
    this.putMessage(protocol);
    this.newMessageSignal();
  }
}
