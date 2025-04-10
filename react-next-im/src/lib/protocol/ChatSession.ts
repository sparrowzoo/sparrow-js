import { ChatType } from "@/lib/protocol/Chat";
import ChatUser from "@/lib/protocol/ChatUser";

export default class ChatSession {
  private _chatType: ChatType;

  get chatType(): ChatType {
    return this._chatType;
  }

  set chatType(value: ChatType) {
    this._chatType = value;
  }

  private _id: string;

  get id(): string {
    return this._id;
  }

  set id(value: string) {
    this._id = value;
  }

  public static create121Session(sender: ChatUser, receiver: ChatUser) {
    const chatSession = new ChatSession();
    chatSession.chatType = ChatType.CHAT_1_TO_1;
    chatSession.id = chatSession.generateKey(sender, receiver);
    return chatSession;
  }

  public static createSession(chatType: ChatType, id: string) {
    const chatSession = new ChatSession();
    chatSession.chatType = chatType;
    chatSession.id = id;
    return chatSession;
  }

  public static parse(sessionKey: string) {
    if (sessionKey == null) {
      return null;
    }
    const chatSession = new ChatSession();
    const chatType: ChatType = parseInt(
      sessionKey.substring(0, 1),
      10
    ) as ChatType;
    const id = sessionKey.substring(1);
    chatSession._chatType = chatType;
    chatSession.id = id;
    return chatSession;
  }

  public static createGroupSession(sessionKey: string): ChatSession {
    const chatSession = new ChatSession();
    chatSession.chatType = ChatType.GROUP;
    chatSession.id = sessionKey;
    return chatSession;
  }

  public isGroup(): boolean {
    return this._chatType == ChatType.GROUP;
  }

  public isOne2One() {
    return this._chatType == ChatType.CHAT_1_TO_1;
  }

  public getOppositeUser(): ChatUser | null {
    const currentUser = ChatUser.getCurrentUser();
    if (currentUser == null) {
      return null;
    }
    if (this._chatType === ChatType.GROUP) {
      return null;
    }

    const bigUserCategory = this.id.substring(0, 1);
    const smallUserCategory = this.id.substring(1, 2);
    const bitUserLength = parseInt(this.id.substring(2, 4), 10);
    const bigUserId = this.id.substring(4, 4 + bitUserLength);
    const smallUserId = this.id.substring(4 + bitUserLength);

    const bigUser = new ChatUser(bigUserId, parseInt(bigUserCategory, 10));
    const smallUser = new ChatUser(
      smallUserId,
      parseInt(smallUserCategory, 10)
    );

    if (bigUser.equals(currentUser)) {
      return smallUser;
    }
    return bigUser;
  }

  public toBytes(): Uint8Array {
    const encoder = new TextEncoder();
    return encoder.encode(this._chatType + this.id);
  }

  public key(): string {
    return this.chatType + this.id;
  }

  private generateKey(sender: ChatUser, receiver: ChatUser): string {
    if (sender == null || receiver == null) {
      return "";
    }
    let bigUser = sender;
    let smallUser = receiver;
    if (sender.id <= receiver.id) {
      debugger;
      bigUser = receiver;
      smallUser = sender;
    }

    let length = (bigUser.id + "").length;
    let len = length + "";
    if (length < 10) {
      len = "0" + length;
    }
    return (
      bigUser.category +
      "" +
      smallUser.category +
      "" +
      len +
      "" +
      bigUser.id +
      smallUser.id
    );
  }
}
