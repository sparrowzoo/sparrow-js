import {encodeUtf8} from "../../Utf8";
import {ChatType} from "./Chat";
import ChatUser from "./ChatUser";

/** Session identity shared by the binary protocol and local chat models. */
export default class SessionIdentity {
    private static readonly BASE62_CHARS = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";
    public id: string;
    public chatType: ChatType;

    get sessionKey(): string {
        return this.encodeSessionKey();
    }

    set sessionKey(value: string) {
        const session = SessionIdentity.parse(value);
        if (session == null) throw new Error("Session key must not be empty");
        this.chatType = session.chatType;
        this.id = session.id;
    }

    // Construct through `this` so inherited factories retain local model defaults.
    public static create121Session<T extends SessionIdentity>(this: new () => T, sender: ChatUser, receiver: ChatUser): T {
        const session = new this();
        session.chatType = ChatType.CHAT_1_TO_1;
        session.id = session.generateId(sender, receiver);
        return session;
    }

    public static createSession<T extends SessionIdentity>(this: new () => T, chatType: ChatType, id: string): T {
        const session = new this();
        session.chatType = chatType;
        session.id = id;
        return session;
    }

    public static parse<T extends SessionIdentity>(this: new () => T, sessionKey: string): T | null {
        if (sessionKey == null || sessionKey.length === 0) return null;
        const chatType = SessionIdentity.BASE62_CHARS.indexOf(sessionKey[0]) as ChatType;
        if (chatType < 0) throw new Error("Session chat type must be a Base62 character");
        if (sessionKey.length < 2) throw new Error("Session ID must not be empty");
        const session = new this();
        session.chatType = chatType;
        session.id = sessionKey.substring(1);
        return session;
    }

    public static createGroupSession<T extends SessionIdentity>(this: new () => T, groupId: string): T {
        const session = new this();
        session.chatType = ChatType.GROUP;
        session.id = groupId;
        return session;
    }

    public isGroup(): boolean {
        return this.chatType === ChatType.GROUP;
    }

    public isOne2One(): boolean {
        return this.chatType === ChatType.CHAT_1_TO_1;
    }

    public getOppositeUser(currentUser: ChatUser): ChatUser | null {
        if (!this.isOne2One() || currentUser == null) return null;
        const [firstUser, secondUser] = this.get1To1Members();
        if (firstUser.equals(currentUser)) return secondUser;
        if (secondUser.equals(currentUser)) return firstUser;
        return null;
    }

    public get1To1Members(): [ChatUser, ChatUser] {
        if (!this.id || this.id.length < 5 || !/^[0-9A-Za-z]{3}/.test(this.id)) {
            throw new Error("Invalid single-chat session key");
        }
        const userLength = SessionIdentity.BASE62_CHARS.indexOf(this.id[2]);
        if (userLength <= 0 || 3 + userLength >= this.id.length) {
            throw new Error("Invalid single-chat user ID length");
        }
        const firstUser = new ChatUser(this.id.substring(3, 3 + userLength), SessionIdentity.BASE62_CHARS.indexOf(this.id[0]));
        const secondUser = new ChatUser(this.id.substring(3 + userLength), SessionIdentity.BASE62_CHARS.indexOf(this.id[1]));
        SessionIdentity.validateOneToOneUser(firstUser);
        SessionIdentity.validateOneToOneUser(secondUser);
        return [firstUser, secondUser];
    }

    public static validateOneToOneUser(user: ChatUser | null): asserts user is ChatUser {
        if (user == null || typeof user.id !== "string" || user.id.length === 0 || user.id.length >= 62) {
            throw new Error("Single-chat user ID must contain 1–61 characters");
        }
        if (!Number.isInteger(user.category) || user.category < 0 || user.category >= 62) {
            throw new Error("Single-chat user category must be between 0 and 61");
        }
    }

    public toBytes(): Uint8Array {
        return encodeUtf8(this.encodeSessionKey());
    }

    private encodeSessionKey(): string {
        if (!Number.isInteger(this.chatType) || this.chatType < 0 || this.chatType >= 62) {
            throw new Error("Session chat type must be between 0 and 61");
        }
        if (typeof this.id !== "string" || this.id.length === 0) {
            throw new Error("Session ID must not be empty");
        }
        return SessionIdentity.BASE62_CHARS[this.chatType] + this.id;
    }

    private generateId(sender: ChatUser, receiver: ChatUser): string {
        SessionIdentity.validateOneToOneUser(sender);
        SessionIdentity.validateOneToOneUser(receiver);
        let firstUser = sender;
        let secondUser = receiver;
        if (sender.id < receiver.id || (sender.id === receiver.id && sender.getSessionCategory() <= receiver.getSessionCategory())) {
            firstUser = receiver;
            secondUser = sender;
        }
        return `${SessionIdentity.BASE62_CHARS[firstUser.getSessionCategory()]}${SessionIdentity.BASE62_CHARS[secondUser.getSessionCategory()]}${SessionIdentity.BASE62_CHARS[firstUser.id.length]}${firstUser.id}${secondUser.id}`;
    }
}
