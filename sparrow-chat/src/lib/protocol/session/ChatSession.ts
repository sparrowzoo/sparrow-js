import {encodeUtf8} from "@/lib/protocol/Utf8";
import {ChatType} from "@/lib/protocol/Chat";
import ChatUser from "@/lib/protocol/ChatUser";
import Message from "@/lib/protocol/Message";
import {Position} from "@/lib/protocol/ItemProps";

export default class ChatSession {
    // Fields
    public id: string;
    public name: string;
    public chatType: ChatType;
    public avatarUrl: string;
    //发消息和每次拉取时更新已读
    public lastReadTime: number = 0;
    public unreadPosition: Position = Position.TAIL;
    //接受消息时更新未读和最后一条消息
    public unreadCount: number;
    //收发时更要更新最后一条消息
    public lastMessage: Message;
    public isPulled: boolean = false;
    //是否弹出状态
    public pop = false;
    private _sessionUrl: string;

    get sessionUrl(): any {
        if (this._sessionUrl == null) {
            this._sessionUrl = `/chat/sessions/session?sessionKey=${this.sessionKey}`;
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
        if (sessionKey == null || sessionKey.length === 0) {
            return null;
        }
        const chatSession = new ChatSession();
        if (!/^[0-9]/.test(sessionKey)) throw new Error("Session chat type must be a decimal digit");
        const chatType = Number(sessionKey[0]) as ChatType;
        const id = sessionKey.substring(1);
        chatSession.chatType = chatType;
        chatSession.id = id;
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

    public getOppositeUser(currentUser: ChatUser) {
        if (!this.isOne2One() || currentUser == null) return null;
        const [bigUser, smallUser] = this.get1To1Members();
        if (bigUser.equals(currentUser)) return smallUser;
        if (smallUser.equals(currentUser)) return bigUser;
        return null;
    }

    public get1To1Members(): [ChatUser, ChatUser] {
        if (!this.id || this.id.length < 6 || !/^[0-9]{4}/.test(this.id)) {
            throw new Error("Invalid single-chat session key");
        }
        const bigLength = Number(this.id.substring(2, 4));
        if (bigLength === 0 || 4 + bigLength >= this.id.length) throw new Error("Invalid single-chat user ID length");
        const bigUser = new ChatUser(this.id.substring(4, 4 + bigLength), Number(this.id[0]));
        const smallUser = new ChatUser(this.id.substring(4 + bigLength), Number(this.id[1]));
        ChatSession.validateOneToOneUser(bigUser);
        ChatSession.validateOneToOneUser(smallUser);
        return [bigUser, smallUser];
    }

    public static validateOneToOneUser(user: ChatUser | null): asserts user is ChatUser {
        if (user == null || typeof user.id !== "string" || user.id.length === 0 || user.id.length > 99) {
            throw new Error("Single-chat user ID must contain 1–99 characters");
        }
        if (!Number.isInteger(user.category) || user.category < 0 || user.category > 9) {
            throw new Error("Single-chat user category must be between 0 and 9");
        }
    }

    public toBytes(): Uint8Array {
        return encodeUtf8(this.chatType + this.id);
    }

    private generateId(sender: ChatUser, receiver: ChatUser): string {
        ChatSession.validateOneToOneUser(sender);
        ChatSession.validateOneToOneUser(receiver);
        let bigUser = sender;
        let smallUser = receiver;
        if (sender.id < receiver.id || (sender.id === receiver.id && sender.getSessionCategory() <= receiver.getSessionCategory())) {
            bigUser = receiver;
            smallUser = sender;
        }

        let length = (bigUser.id + "").length;
        let len = length + "";
        if (length < 10) {
            len = "0" + length;
        }
        return (
            bigUser.getSessionCategory() +
            "" +
            smallUser.getSessionCategory() +
            "" +
            len +
            "" +
            bigUser.id +
            smallUser.id
        );
    }
}
