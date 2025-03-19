import Chat, { ChatType } from "@/lib/protocol/Chat";
import ChatUser, { NullableChatUser } from "@/lib/protocol/ChatUser";

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
    chatSession.chatType = Chat.CHAT_TYPE_1_TO_1;
    chatSession.id = chatSession.generateKey(sender, receiver);
    return chatSession;
  }

  public static createGroupSession(sessionKey: string): ChatSession {
    const chatSession = new ChatSession();
    chatSession.chatType = Chat.CHAT_TYPE_GROUP;
    chatSession.id = sessionKey;
    return chatSession;
  }

  public isGroup(): boolean {
    return this._chatType == Chat.CHAT_TYPE_GROUP;
  }

  public isOne2One() {
    return this._chatType == Chat.CHAT_TYPE_1_TO_1;
  }

  public getOppositeUser(currentUser: ChatUser): ChatUser | null {
    if (currentUser == null) {
      return null;
    }
    if (this._chatType === Chat.CHAT_TYPE_GROUP) {
      return null;
    }

    const userIdArray: string[] = this._id.split(Chat.HORIZON_LINE);
    if (userIdArray.length != 2) {
      return null;
    }
    const userId1: NullableChatUser = ChatUser.parse(userIdArray[0]);
    const userId2: NullableChatUser = ChatUser.parse(userIdArray[1]);
    if (currentUser.equals(userId1)) {
      return userId2;
    }
    if (currentUser.equals(userId2)) {
      return userId1;
    }
    return null;
  }

  public toBytes(): Uint8Array {
    const encoder = new TextEncoder();
    return encoder.encode(this._chatType + this.id);
  }

  private generateKey(sender: ChatUser, receiver: ChatUser): string {
    if (sender == null || receiver == null) {
      return "";
    }
    //保证从小到大排序
    if (sender.getId() <= receiver.getId()) {
      return sender.key + "-" + receiver;
    }
    return receiver.key() + "-" + sender.key();
  }
}
