import ChatUser from "@/lib/protocol/ChatUser";
import ChatSession from "@/lib/protocol/session/ChatSession";
import ArrayBufferUtils from "@/common/lib/protocol/ArrayBufferUtils";
import { ChatType, MessageType } from "@/lib/protocol/Chat";

class Protocol {
  constructor() {}

  private _version: number;

  get version(): number {
    return this._version;
  }

  set version(value: number) {
    this._version = value;
  }

  private _messageType: MessageType;

  get messageType(): MessageType {
    return this._messageType;
  }

  set messageType(value: MessageType) {
    this._messageType = value;
  }

  private _chatType: ChatType;

  get chatType(): ChatType {
    return this._chatType;
  }

  set chatType(value: ChatType) {
    this._chatType = value;
  }

  private _sender: ChatUser;

  get sender(): ChatUser {
    return this._sender;
  }

  set sender(value: ChatUser) {
    this._sender = value;
  }

  private _receiver: ChatUser;

  get receiver(): ChatUser {
    return this._receiver;
  }

  set receiver(value: ChatUser) {
    this._receiver = value;
  }

  private _chatSession: ChatSession;

  get chatSession(): ChatSession {
    return this._chatSession;
  }

  set chatSession(value: ChatSession) {
    this._chatSession = value;
  }

  private _content: Uint8Array;

  get content(): Uint8Array {
    return this._content;
  }

  set content(value: Uint8Array) {
    this._content = value;
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

  public static fromBytes(bytes: ArrayBuffer): Protocol {
    const protocol: Protocol = new Protocol();
    const dataView = new DataView(bytes);
    let offset = 0;
    protocol.version = dataView.getUint8(offset);
    const chatType = dataView.getUint8(offset + 1);
    protocol.chatType = chatType as ChatType;
    const messageType = dataView.getUint8(offset + 2);
    protocol.messageType = messageType as MessageType;
    const senderWithOffset = ChatUser.fromBytes(dataView, offset + 3);
    protocol.sender = senderWithOffset.chatUser as ChatUser;
    offset = senderWithOffset.offset;
    if (chatType === ChatType.CHAT_1_TO_1) {
      const receiverWithOffset = ChatUser.fromBytes(dataView, offset);
      const receiver = receiverWithOffset.chatUser;
      protocol.receiver = receiver as ChatUser;
      offset = receiverWithOffset.offset;
      protocol.chatSession = ChatSession.create121Session(
        protocol.sender,
        protocol.receiver
      ) as ChatSession;
    } else {
      const sessionLength = dataView.getUint8(offset);
      offset += 1;
      const sessionBytes = new Uint8Array(
        bytes.slice(offset, offset + sessionLength)
      );
      const session = sessionBytes.toString();
      protocol.chatSession = ChatSession.createGroupSession(
        session
      ) as ChatSession;
    }
    const contentLength = dataView.getUint32(offset);
    offset += 4;
    protocol.content = new Uint8Array(
      bytes.slice(offset, offset + contentLength)
    );
    offset += contentLength;

    const clientSendTime = new TextDecoder().decode(
      new Uint8Array(bytes.slice(offset, bytes.byteLength))
    ); // 默认 UTF-8 编码

    protocol.clientSendTime = parseInt(clientSendTime, 10);
    return protocol;
  }

  public static create121Chat(
    messageType: MessageType,
    receiver: ChatUser,
    content: string,
    clientSendTime: number
  ): Protocol {
    const protocol: Protocol = new Protocol();
    const loginUser = ChatUser.getCurrentUser();
    protocol.version = 1;
    protocol.chatType = ChatType.CHAT_1_TO_1;
    protocol.messageType = messageType;
    protocol.sender = loginUser as ChatUser;
    protocol.receiver = receiver;
    protocol.chatSession = ChatSession.create121Session(
      protocol.sender,
      receiver
    );
    protocol.content = ArrayBufferUtils.str2Buffer(content);
    protocol.clientSendTime = clientSendTime;
    return protocol;
  }

  public static createGroupChat(
    sessionKey: string,
    messageType: MessageType,
    content: string,
    clientSendTime: number
  ): Protocol {
    const protocol: Protocol = new Protocol();
    protocol.version = 1;
    protocol.chatType = ChatType.GROUP;
    const loginUser = ChatUser.getCurrentUser();
    protocol.sender = loginUser as ChatUser;
    protocol.messageType = messageType;
    protocol.chatSession = ChatSession.parse(sessionKey) as ChatSession;
    protocol.content = ArrayBufferUtils.str2Buffer(content);
    protocol.clientSendTime = clientSendTime;
    return protocol;
  }

  public toBytes(): Uint8Array {
    if (this.chatType === ChatType.CHAT_1_TO_1) {
      return this.to121Bytes();
    }
    return this.toGroupBytes();
  }

  public to121Bytes(): Uint8Array {
    const headerLength = 3;
    const senderBytes: Uint8Array = this.sender.toBytes();
    const receiverBytes: Uint8Array = this.receiver.toBytes();
    const contentLength = 4;
    const clientSendTimeBytes = ArrayBufferUtils.str2Buffer(
      this.clientSendTime + ""
    );
    const capacity: number =
      headerLength +
      senderBytes.byteLength +
      receiverBytes.byteLength +
      contentLength +
      this.content.byteLength +
      clientSendTimeBytes.byteLength;
    let offset: number = 0;
    let protocol: Uint8Array = new Uint8Array(capacity);
    offset = ArrayBufferUtils.appendBytes(
      protocol,
      new Uint8Array([this._version, this.chatType, this.messageType]),
      offset
    );
    offset = ArrayBufferUtils.appendBytes(protocol, senderBytes, offset);
    offset = ArrayBufferUtils.appendBytes(protocol, receiverBytes, offset);
    offset = ArrayBufferUtils.appendBytes(
      protocol,
      ArrayBufferUtils.number2Buffer(this.content.byteLength),
      offset
    );
    offset = ArrayBufferUtils.appendBytes(protocol, this.content, offset);
    ArrayBufferUtils.appendBytes(protocol, clientSendTimeBytes, offset);
    return protocol;
  }

  public toGroupBytes(): Uint8Array {
    let offset: number = 0;
    const headerLength = 3;
    const senderBytes: Uint8Array = this.sender.toBytes();
    const sessionLength = 1;
    const sessionBytes: Uint8Array = this.chatSession.toBytes();
    const contentLength = 4;
    const clientSendTimeBytes = ArrayBufferUtils.str2Buffer(
      this.clientSendTime + ""
    );
    let capacity: number =
      headerLength +
      senderBytes.byteLength +
      sessionLength +
      sessionBytes.byteLength +
      contentLength +
      this.content.byteLength +
      clientSendTimeBytes.byteLength;

    let protocol: Uint8Array = new Uint8Array(capacity);
    offset = ArrayBufferUtils.appendBytes(
      protocol,
      new Uint8Array([this._version, this.chatType, this.messageType]),
      offset
    );
    offset = ArrayBufferUtils.appendBytes(protocol, senderBytes, offset);
    offset = ArrayBufferUtils.appendBytes(
      protocol,
      new Uint8Array([sessionBytes.byteLength]),
      offset
    );
    offset = ArrayBufferUtils.appendBytes(protocol, sessionBytes, offset);
    offset = ArrayBufferUtils.appendBytes(
      protocol,
      ArrayBufferUtils.number2Buffer(this.content.byteLength),
      offset
    );
    offset = ArrayBufferUtils.appendBytes(protocol, this.content, offset);
    ArrayBufferUtils.appendBytes(protocol, clientSendTimeBytes, offset);
    return protocol;
  }

  public getStringContent(): string {
    return new TextDecoder().decode(this.content); // 默认 UTF-8 编码
  }
}

export default Protocol;
