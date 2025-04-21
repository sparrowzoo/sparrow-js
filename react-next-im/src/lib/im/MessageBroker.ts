import ChatApi from "@/lib/ChatApi";
import Message from "@/lib/protocol/Message";
import Protocol from "@/lib/protocol/Protocol";
import SparrowWebSocket from "@/common/lib/SparrowWebSocket";
import ChatSession from "@/lib/protocol/session/ChatSession";
import { ChatType, MessageType } from "@/lib/protocol/Chat";
import ChatUser from "@/lib/protocol/ChatUser";
import toast from "react-hot-toast";
import { WEBSOCKET } from "@/common/lib/Env";
import { ContactStatus } from "@/lib/protocol/ContactStatus";
import CrosStorage from "@/common/lib/CrosStorage";
import ContactContainer from "@/lib/im/ContactContainer";
import SessionContainer from "@/lib/im/SessionContainer";
import Contact from "@/lib/protocol/contact/Contact";

export default class MessageBroker {
  public contactContainer: ContactContainer;
  public sessionContainer: SessionContainer;
  public crosStorage: CrosStorage;
  public webSocket: SparrowWebSocket;
  //key:session key,value:message list
  private messageMap: Map<string, Message[]> = new Map();

  constructor(crosStorage: CrosStorage) {
    this.crosStorage = crosStorage;
    this.contactContainer = new ContactContainer(this.crosStorage);
    this.sessionContainer = new SessionContainer(
      this.crosStorage,
      this.contactContainer
    );
    const sparrowWebSocket = new SparrowWebSocket(
      WEBSOCKET as string,
      crosStorage
    );
    sparrowWebSocket.connect();
    this.webSocket = sparrowWebSocket;
    this.webSocket.onMsgCallback = (buf: ArrayBuffer) => {
      this.websocketMsgCallback(buf);
    };
    this.webSocket.offlineCallback = () => {
      toast.error("消息已推送，对方已离线....");
    };
    this.webSocket.monitorStatus = () => {
      console.log("websocket monitor status");
      return [];
    };
    this.webSocket.monitorStatusCallback = (data: ContactStatus[]) => {
      console.log("websocket monitor status callback", JSON.stringify(data));
    };
  }

  public closeWebSocket() {
    this.webSocket.close();
  }

  public async putMessage(message: Message) {
    const sessionKey = message.session.sessionKey;
    let messageList = this.messageMap.get(sessionKey);
    if (messageList == null) {
      messageList = [];
      this.messageMap.set(sessionKey, messageList);
    }
    messageList.push(message);
    await this.sessionContainer.newSession(sessionKey).then(() => {
      this.sessionContainer.appendLastMessage(message);
    });
  }

  public sendMessage(sessionKey: string, content: string): void {
    const chatSession = ChatSession.parse(sessionKey);
    let protocol;
    if (chatSession?.chatType == ChatType.CHAT_1_TO_1) {
      const oppositeUser = chatSession.getOppositeUser();
      protocol = Protocol.create121Chat(
        MessageType.TEXT_MESSAGE,
        oppositeUser as ChatUser,
        content,
        new Date().getTime()
      );
    } else {
      protocol = Protocol.createGroupChat(
        sessionKey,
        MessageType.TEXT_MESSAGE,
        content,
        new Date().getTime()
      );
    }
    const message = Message.fromProtocol(protocol);
    this.putMessage(message).then(() => {
      this.sessionContainer.read(message.session);
    });
    this.webSocket?.sendMessage(protocol.toBytes());
    this.newMessageSignal();
  }

  public async getMessageList(sessionKey: string) {
    console.log("getMessageList", sessionKey);
    this.sessionContainer.pullSession(
      ChatSession.parse(sessionKey) as ChatSession
    );
    let messageList = this.messageMap.get(sessionKey);
    if (messageList != null) {
      return this.wrapMessages(messageList);
    }
    messageList = await ChatApi.getMessages(sessionKey, this.crosStorage);
    this.messageMap.set(sessionKey, messageList);
    return this.wrapMessages(messageList);
  }

  public newMessageSignal = () => {};

  public websocketMsgCallback(buf: ArrayBuffer) {
    const protocol = Protocol.fromBytes(buf);
    const message = Message.fromProtocol(protocol);
    this.putMessage(message).then(() => {
      this.sessionContainer.plusUnreadCount(message);
      this.newMessageSignal();
    });
  }

  /**
   * 指定联系人初始化会话 普通用户或者游客
   * @param contacts
   */
  public async initSessionsByContacts(contacts: Contact[]) {
    this?.contactContainer?.initContact(contacts);
    await this?.sessionContainer.initSessions(contacts);
  }

  //平台客服初始化，无联系人
  public initSessions() {
    this.contactContainer.initContact([]);
    return this.sessionContainer.getChatSessions();
  }

  private wrapMessages(messages: Message[]): Message[] {
    let preTime: number = 0;
    const newMessages: Message[] = [];
    for (const message of messages) {
      newMessages.push(message);
      if (message.clientSendTime - preTime > 1000 * 60 * 5) {
        newMessages.push(Message.newTimeLine(message.clientSendTime));
      }
      preTime = message.clientSendTime;
    }
    return newMessages;
  }
}
