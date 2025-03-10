import Protocol from "@/lib/protocol/Protocol";
import { format } from "date-fns";

export type AlignType = "left" | "right";

export class Message {
  public constructor(protocol: Protocol) {
    this._messageId = protocol.clientSendTime + Math.random();
    this._align = protocol.align();
    this._senderName = protocol.sender.getId();
    this._senderCategory = protocol.sender.getCategoryName();
    this._receiverName = protocol.receiver.getId();
    this._receiverCategory = protocol.receiver.getCategoryName();
    this._content = protocol.getStringContent();
    const date = new Date(protocol.clientSendTime);
    this._sendTime = format(date, "yyyy-MM-dd");
  }

  private _align: AlignType;
  get align(): AlignType {
    return this._align;
  }

  private _messageId: number;

  get messageId(): number {
    return this._messageId;
  }

  private _senderName: string;

  get senderName(): string {
    return this._senderName;
  }

  private _senderCategory: string;

  get senderCategory(): string {
    return this._senderCategory;
  }

  private _receiverName: string;

  get receiverName(): string {
    return this._receiverName;
  }

  private _receiverCategory: string;

  get receiverCategory(): string {
    return this._receiverCategory;
  }

  private _content: string;

  get content(): string {
    return this._content;
  }

  private _sendTime: string;

  get sendTime(): string {
    return this._sendTime;
  }
}
