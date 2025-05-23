import ChatApi from "@/api/ChatApi";
import Message from "@/lib/protocol/Message";
import Protocol from "@/lib/protocol/Protocol";
import SparrowWebSocket from "@/common/lib/SparrowWebSocket";
import ChatSession from "@/lib/protocol/session/ChatSession";
import { ChatType, MessageType } from "@/lib/protocol/Chat";
import ChatUser from "@/lib/protocol/ChatUser";
import toast from "react-hot-toast";
import { WEBSOCKET } from "@/common/lib/Env";
import { ContactStatus } from "@/lib/protocol/ContactStatus";
import ContactContainer from "@/lib/im/ContactContainer";
import SessionContainer from "@/lib/im/SessionContainer";
import { Translator } from "@/common/lib/TranslatorType";

export default class MessageBroker {
  public contactContainer: ContactContainer;
  public sessionContainer: SessionContainer;
  public translator: Translator;
  public webSocket: SparrowWebSocket;
  //key:session key,value:message list
  private messageMap: Map<string, Message[]> = new Map();

  constructor(translator: Translator, redirectLogin: () => void) {
    this.translator = translator;
    this.contactContainer = new ContactContainer(this.translator);
    this.sessionContainer = new SessionContainer(
      this.translator,
      this.contactContainer
    );
    const sparrowWebSocket = new SparrowWebSocket(
      WEBSOCKET as string,
      this.translator
    );
    sparrowWebSocket.connect();
    this.webSocket = sparrowWebSocket;
    sparrowWebSocket.redirectLogin = redirectLogin;
    this.webSocket.onMsgCallback = (buf: ArrayBuffer) => {
      this.websocketMsgCallback(buf);
    };
    this.webSocket.offlineCallback = () => {
      if (this.translator) {
        toast.error(this.translator("offline"));
      }
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
      this.webSocket?.sendMessage(protocol.toBytes());
      this.newMessageSignal();
    });
  }

  public async getMessageList(sessionKey: string) {
    let messageList = this.messageMap.get(sessionKey);
    if (messageList != null) {
      return this.wrapMessages(messageList);
    }
    messageList = await ChatApi.getMessages(sessionKey, this.translator);
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
  public async initSessionsByContacts(contacts: string[]) {
    this?.contactContainer?.initContact([]);
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
