import ChatUser from "@/lib/protocol/ChatUser";
import ChatSession from "@/lib/protocol/ChatSession";
import { format } from "date-fns";
import Protocol from "@/lib/protocol/Protocol";

export enum AlignType {
  left = "left",
  right = "right",
}

export default class Message {
  constructor() {}

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

  static fromMessage(json: Message): Message {
    const message = new Message();
    message._sender = new ChatUser(json.sender.id, json.sender.category);
    message._receiver = new ChatUser(json.receiver.id, json.receiver.category);
    message._content = json.content;
    message._clientSendTime = json.clientSendTime;
    message._serverTime = json.serverTime;
    message._messageId = json.clientSendTime + "" + json.sender.id;
    return message;
  }

  public isSender() {
    const currentUser = ChatUser.getCurrentUser();
    return this.sender.equals(currentUser);
  }
}
