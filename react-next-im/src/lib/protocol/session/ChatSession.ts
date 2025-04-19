import { ChatType } from "@/lib/protocol/Chat";
import ChatUser from "@/lib/protocol/ChatUser";
import { format } from "util";
import { AVATAR_URL, NEXT_ASSET_PREFIX } from "@/common/lib/Env";
import Message from "@/lib/protocol/Message";
import ContactContainer from "@/lib/im/ContactContainer";

export default class ChatSession {
  // Fields
  public id: string;
  public name: string;
  public chatType: ChatType;
  public avatarUrl: string;
  //发消息和每次拉取时更新已读
  public lastReadTime: number = 0;
  //接受消息时更新未读和最后一条消息
  public unreadCount: number;
  //收发时更要更新最后一条消息
  public lastMessage: Message;
  public isPulled: boolean = false;
  private _sessionUrl: string;

  get sessionUrl(): string {
    if (this._sessionUrl == null) {
      this._sessionUrl = `${NEXT_ASSET_PREFIX}/chat/sessions/session?sessionKey=${this.sessionKey}`;
    }
    return this._sessionUrl;
  }

  set sessionUrl(value: string) {
    this._sessionUrl = value;
  }

  private _sessionKey: string;

  get sessionKey(): string {
    if (this._sessionKey == null) {
      this._sessionKey = this.chatType + this.id;
    }
    return this._sessionKey;
  }

  set sessionKey(value: string) {
    this._sessionKey = value;
  }

  public static newLocalSession(remoteSession: ChatSession) {
    const localSession = new ChatSession();
    localSession.chatType = remoteSession.chatType;
    localSession.id = remoteSession.id;
    localSession.name = remoteSession.name;
    localSession.avatarUrl = remoteSession.avatarUrl;
    localSession.unreadCount = remoteSession.unreadCount;
    localSession.lastReadTime = remoteSession.lastReadTime;
    if (remoteSession.lastMessage) {
      localSession.lastMessage = Message.fromMessage(
        remoteSession.lastMessage,
        remoteSession.sessionKey
      );
    }
    localSession.sessionUrl = remoteSession.sessionUrl;
    localSession.isPulled = remoteSession.isPulled;
    localSession.sessionKey = remoteSession.sessionKey;
    return localSession;
  }

  public static create121Session(sender: ChatUser, receiver: ChatUser) {
    const chatSession = new ChatSession();
    chatSession.chatType = ChatType.CHAT_1_TO_1;
    chatSession.id = chatSession.generateId(sender, receiver);
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
    chatSession.chatType = chatType;
    chatSession.id = id;
    chatSession.avatarUrl = format(AVATAR_URL, id);
    return chatSession;
  }

  public static createGroupSession(groupId: string): ChatSession {
    const chatSession = new ChatSession();
    chatSession.chatType = ChatType.GROUP;
    chatSession.id = groupId;
    return chatSession;
  }

  public isGroup(): boolean {
    return this.chatType == ChatType.GROUP;
  }

  public isOne2One() {
    return this.chatType == ChatType.CHAT_1_TO_1;
  }

  public getOppositeUser(): ChatUser | null {
    const currentUser = ChatUser.getCurrentUser();
    if (currentUser == null) {
      return null;
    }
    if (this.chatType === ChatType.GROUP) {
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
    return encoder.encode(this.chatType + this.id);
  }

  public fill(contactContainer: ContactContainer) {
    if (!contactContainer) {
      return;
    }
    if (this?.isOne2One()) {
      const oppositeUser = this.getOppositeUser();
      const contact = contactContainer.getContactDetail(
        oppositeUser as ChatUser
      );
      this.name = contact?.userName as string;
      this.avatarUrl = contact?.avatar as string;
      return;
    }
    const group = contactContainer.getGroupDetail(this?.id as string);
    this.name = group?.qunName + "群";
    this.avatarUrl = format(AVATAR_URL, group?.qunId);
  }

  private generateId(sender: ChatUser, receiver: ChatUser): string {
    if (sender == null || receiver == null) {
      return "";
    }
    let bigUser = sender;
    let smallUser = receiver;
    if (sender.id <= receiver.id) {
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
