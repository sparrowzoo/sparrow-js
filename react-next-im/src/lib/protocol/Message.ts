import ChatUser from "@/lib/protocol/ChatUser";
import ChatSession from "@/lib/protocol/session/ChatSession";
import { format } from "date-fns";
import Protocol from "@/lib/protocol/Protocol";

export enum AlignType {
  left = "left",
  right = "right",
}

export default class Message {
  public messageId: string;
  public sender: ChatUser;
  public receiver: ChatUser;
  public content: string;
  public session: ChatSession;
  public clientSendTime: number;
  public serverTime: number;
  private _timeline: number;

  get timeline() {
    return this._timeline;
  }

  set timeline(value) {
    this.messageId = value + "";
    this._timeline = value;
  }

  get align(): AlignType {
    return this.isSender() ? AlignType.right : AlignType.left;
  }

  get sendTime(): string {
    const date = new Date(this.clientSendTime);
    const today = new Date();
    if (date.getDate() == today.getDate()) {
      return format(this.clientSendTime, "HH:mm");
    }
    return format(this.clientSendTime, "MM/dd/yyyy HH:mm");
  }

  static fromProtocol(protocol: Protocol): Message {
    const message = new Message();
    message.sender = protocol.sender;
    message.session = protocol.chatSession;
    message.receiver = protocol.receiver;
    message.content = protocol.getStringContent();
    message.clientSendTime = protocol.clientSendTime;
    message.serverTime = protocol.serverTime;
    message.messageId = protocol.clientSendTime + "" + protocol.sender.id;
    return message;
  }

  static newTimeLine(t: number) {
    const timeline = new Message();
    timeline.timeline = t;
    return timeline;
  }

  static fromMessage(remoteMessage: Message, sessionKey: string): Message {
    const localMessage = new Message();
    localMessage.sender = new ChatUser(
      remoteMessage.sender.id,
      remoteMessage.sender.category
    );
    const session = ChatSession.parse(sessionKey);
    localMessage.session = session as ChatSession;
    if (session?.isOne2One()) {
      localMessage.receiver = new ChatUser(
        remoteMessage.receiver.id,
        remoteMessage.receiver.category
      );
    }
    localMessage.content = remoteMessage.content;
    localMessage.clientSendTime = remoteMessage.clientSendTime;
    localMessage.serverTime = remoteMessage.serverTime;
    localMessage.messageId =
      remoteMessage.clientSendTime + "" + remoteMessage.sender.id;
    return localMessage;
  }

  public getTimeline() {
    const today = new Date();
    const date = new Date(this._timeline);
    if (date.getDate() == today.getDate()) {
      return format(this._timeline, "HH:mm");
    }
    return format(this._timeline, "yyyy-MM-dd HH:mm");
  }

  public isSender() {
    const currentUser = ChatUser.getCurrentUser();
    return this.sender.equals(currentUser);
  }
}
