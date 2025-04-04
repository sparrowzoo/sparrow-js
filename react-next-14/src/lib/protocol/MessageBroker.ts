import ChatApi from "@/lib/ChatApi";
import Message from "@/lib/protocol/Message";
import Protocol from "@/lib/protocol/Protocol";
import SparrowWebSocket from "@/common/lib/SparrowWebSocket";
import ChatSession from "@/lib/protocol/ChatSession";
import { ChatType, MessageType } from "@/lib/protocol/Chat";
import ChatUser from "@/lib/protocol/ChatUser";
import toast from "react-hot-toast";
import { LOGIN_URL, USER_INFO_KEY, WEBSOCKET } from "@/common/lib/Env";
import { ContactStatus } from "@/lib/protocol/ContactStatus";
import ContactGroup from "@/lib/protocol/contact/ContactGroup";
import CrosStorage from "@/common/lib/CrosStorage";

export default class MessageBroker {
  //key:session key,value:message list
  private messageMap: Map<string, Message[]> = new Map();
  private crosStorage: CrosStorage;
  private chatSessions: ChatSession[] | null = null;
  private contactGroup: ContactGroup | null = null;

  constructor(crosStorage: CrosStorage) {
    this.crosStorage = crosStorage;
    const sparrowWebSocket = new SparrowWebSocket(
      WEBSOCKET as string,
      crosStorage
    );
    sparrowWebSocket.connect();
    this._webSocket = sparrowWebSocket;
    this._webSocket.onMsgCallback = (buf: ArrayBuffer) => {
      this.websocketMsgCallback(buf);
    };
    this._webSocket.offlineCallback = () => {
      toast.error("消息已推送，对方已离线....");
    };
    this._webSocket.userAuthCallback = (data: Result) => {
      console.log("userValidCallback", JSON.stringify(data));
      if (data.code == "0") {
        sessionStorage.setItem(USER_INFO_KEY, JSON.stringify(data.data));
      } else {
        this.crosStorage.removeToken();
        toast.error(data.message);
        setTimeout(() => {
          window.location.href = `${LOGIN_URL}?${window.location.href}`;
        }, 2000);
      }
    };
    this._webSocket.monitorStatus = () => {
      console.log("websocket monitor status");
      return [];
    };
    this._webSocket.monitorStatusCallback = (data: ContactStatus[]) => {
      console.log("websocket monitor status callback", JSON.stringify(data));
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
    if (chatSession?.chatType == ChatType.CHAT_1_TO_1) {
      const oppositeUser = chatSession.getOppositeUser();
      protocol = Protocol.create121Chat(
        MessageType.TEXT_MESSAGE,
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
    messageList = await ChatApi.getMessages(sessionKey, this.crosStorage);
    this.messageMap.set(sessionKey, messageList);
    return messageList;
  }

  public newMessageSignal = () => {};

  public websocketMsgCallback(buf: ArrayBuffer) {
    const protocol = Protocol.fromBytes(buf);
    this.putMessage(protocol);
    this.newMessageSignal();
  }

  public async getChatSessions() {
    let localSession = this.chatSessions;
    if (localSession) {
      return localSession;
    }
    await ChatApi.getSessions(this.crosStorage).then((sessions) => {
      console.log(sessions.length);
      localSession = sessions;
      this.chatSessions = localSession;
    });
    return localSession;
  }

  public async getContactGroup() {
    debugger;
    let localGroup = this.contactGroup;
    if (localGroup) {
      return localGroup;
    }
    await ChatApi.getContacts(this.crosStorage).then((group) => {
      console.log(group);
      localGroup = group;
      this.contactGroup = localGroup;
    });
    return localGroup;
  }

  public getGroupDetail(groupId: string) {
    return this.contactGroup?.quns.find((qun) => qun.qunId === groupId);
  }

  public getContactDetail(userId: number) {
    return this.contactGroup?.contacts.find(
      (contact) => contact.userId === userId
    );
  }
}
