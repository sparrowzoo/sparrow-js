import ChatUser from "@/lib/protocol/ChatUser";
import ChatSession from "@/lib/protocol/session/ChatSession";
import { format } from "date-fns";
import Protocol from "@/lib/protocol/Protocol";
import { ChatType } from "@/lib/protocol/Chat";

export enum AlignType {
  left = "left",
  right = "right",
}

export default class Message {
  constructor() {}

  private _timeline: number;

  get timeline() {
    return this._timeline;
  }

  set timeline(value) {
    this._messageId = value + "";
    this._timeline = value;
  }

  get align(): AlignType {
    return this.isSender() ? AlignType.right : AlignType.left;
  }

  private _messageId: string;

  get messageId(): string {
    return this._messageId;
  }

  private _sender: ChatUser;

  get sender(): ChatUser {
    return this._sender;
  }

  private _receiver: ChatUser;

  get receiver(): ChatUser {
    return this._receiver;
  }

  private _content: string;

  get content(): string {
    return this._content;
  }

  private _session: ChatSession;

  get session(): ChatSession {
    return this._session;
  }

  set session(value: ChatSession) {
    this._session = value;
  }

  private _clientSendTime: number;

  get clientSendTime(): number {
    return this._clientSendTime;
  }

  set clientSendTime(value: number) {
    this._clientSendTime = value;
  }

  private _serverTime: number;

  get serverTime(): number {
    return this._serverTime;
  }

  set serverTime(value: number) {
    this._serverTime = value;
  }

  get sendTime(): string {
    const date = new Date(this._clientSendTime);
    return format(date, "yyyy-MM-dd");
  }

  static fromProtocol(protocol: Protocol): Message {
    const message = new Message();
    message._sender = protocol.sender;
    message._receiver = protocol.receiver;
    message._content = protocol.getStringContent();
    message._clientSendTime = protocol.clientSendTime;
    message._serverTime = protocol.serverTime;
    message._messageId = protocol.clientSendTime + "" + protocol.sender.id;
    return message;
  }

  static fromMessage(oldMessage: Message): Message {
    const message = new Message();
    message._sender = new ChatUser(
      oldMessage.sender.id,
      oldMessage.sender.category
    );
    debugger;
    if (oldMessage.session.chatType == ChatType.CHAT_1_TO_1) {
      message._receiver = new ChatUser(
        oldMessage.receiver.id,
        oldMessage.receiver.category
      );
      message.session = ChatSession.create121Session(
        message.sender,
        message.receiver
      );
    } else {
      message.session = ChatSession.createGroupSession(oldMessage.session.id);
    }
    message._content = oldMessage.content;
    message._clientSendTime = oldMessage.clientSendTime;
    message._serverTime = oldMessage.serverTime;
    message._messageId = oldMessage.clientSendTime + "" + oldMessage.sender.id;
    return message;
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
