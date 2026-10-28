import {decodeUtf8, encodeUtf8} from "@/lib/protocol/Utf8";
import LoginUser from "@/common/lib/protocol/LoginUser";
import UserCategory from "@/common/lib/UserCategory";

interface ChatUserWithOffset {
    chatUser: NullableChatUser;
    offset: number;
}


export default class ChatUser {
    public id: string;
    public category: number;
    public key: string;

    constructor(id: string, category: number) {
        // 确保 id 是字符串
        this.id = id == null ? id : String(id);
        this.category = category;
        this.key = this.id + "_" + this.getSessionCategory();
    }

    static fromBytes(dataView: DataView, offset: number): ChatUserWithOffset {
        if (!Number.isInteger(offset) || offset < 0 || offset >= dataView.byteLength) {
            throw new Error("Invalid user offset");
        }
        const idLength = dataView.getUint8(offset++);
        if (idLength === 0) throw new Error("User ID must not be empty");
        if (idLength + 1 > dataView.byteLength - offset) throw new Error("Invalid user length");
        const id = decodeUtf8(new Uint8Array(dataView.buffer, dataView.byteOffset + offset, idLength));
        offset += idLength;
        return {chatUser: new ChatUser(id, dataView.getUint8(offset)), offset: offset + 1};
    }

    static parse(key: string): NullableChatUser {
        if (key == null) return null;
        const separator = key.lastIndexOf("_");
        if (separator <= 0 || separator === key.length - 1) return null;
        const category = key.substring(separator + 1);
        if (!/^[+-]?[0-9]+$/.test(category) || !Number.isSafeInteger(Number(category))) {
            throw new Error("User category must be a decimal integer");
        }
        return new ChatUser(key.substring(0, separator), Number(category));
    }

    public static fromLoginUser(loginUser: LoginUser): ChatUser {
        return new ChatUser(loginUser.userId, loginUser.category);
    }

    public getSessionCategory(): number {
        return this.category;
    }

    public equals(chatUser: NullableChatUser): boolean {
        return chatUser != null && this.id === chatUser.id && this.category === chatUser.category;
    }

    /** User ID UTF-8 byte length (1), ID bytes, category (1). */
    public toBytes(): Uint8Array {
        if (typeof this.id !== "string" || this.id.length === 0) throw new Error("User ID must not be empty");
        const idBytes = encodeUtf8(this.id);
        if (idBytes.length > 255) throw new Error("User ID UTF-8 byte length must not exceed 255");
        if (!Number.isInteger(this.category) || this.category < 0 || this.category > 255) {
            throw new Error("User category must be between 0 and 255");
        }
        const bytes = new Uint8Array(idBytes.length + 2);
        bytes[0] = idBytes.length;
        bytes.set(idBytes, 1);
        bytes[bytes.length - 1] = this.category;
        return bytes;
    }

    public isVisitor(): boolean {
        return this.category == UserCategory.VISITOR;
    }

    public isAdmin(): boolean {
        return this.category == UserCategory.ADMIN;
    }
}

export type NullableChatUser = ChatUser | null;
