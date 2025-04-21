import ArrayBufferUtils from "@/common/lib/protocol/ArrayBufferUtils";
import LoginUser from "@/common/lib/protocol/LoginUser";
import { UserCategory } from "@/common/lib/UserCategory";

interface ChatUserWithOffset {
  chatUser: NullableChatUser;
  offset: number;
}

export default class ChatUser {
  public id: string;
  public category: number;
  public key: string;

  constructor(id: string, category: number) {
    this.id = id;
    this.category = category;
    this.key = this.id + "_" + this.category;
  }

  static fromBytes(dateView: DataView, offset: number): ChatUserWithOffset {
    const bytes: ArrayBufferLike = dateView.buffer;
    const idLength: number = dateView.getUint8(offset);
    offset += 1;
    const idBytes: Uint8Array = new Uint8Array(
      bytes.slice(offset, offset + idLength)
    );
    offset += idLength;
    const id = new TextDecoder().decode(idBytes); // 默认 UTF-8 编码
    const category: number = dateView.getUint8(offset);
    const chatUser: ChatUser = new ChatUser(id, category);
    return {
      chatUser: chatUser,
      offset: offset + 1,
    };
  }

  static parse(key: string): NullableChatUser {
    const parts: string[] = key.split("_");
    if (parts.length != 2) {
      return null;
    }
    const id: string = parts[0];
    const role: number = Number(parts[1]);
    return new ChatUser(id, role);
  }

  public static getCurrentUser() {
    const loginUser = LoginUser.getCurrentUser();
    return new ChatUser(
      loginUser?.userId as string,
      loginUser?.category as number
    );
  }

  public equals(chatUser: NullableChatUser): boolean {
    if (chatUser == null) {
      return false;
    }
    return this.id == chatUser.id && this.category == chatUser.category;
  }

  /**
   * 用户ID长度(1字节) + 用户ID([用户ID长度个字节]) + 用户类型(1字节)
   */
  public toBytes(): Uint8Array {
    const idBytes: Uint8Array = ArrayBufferUtils.str2Buffer(this.id + "");
    const categoryBytes: Uint8Array = new Uint8Array([this.category]);
    const bytesLength: number = 1 + idBytes.byteLength + 1;
    let userBytes: Uint8Array = new Uint8Array(bytesLength);
    const idBytesLength: number = idBytes.byteLength;
    let offset: number = 0;
    offset = ArrayBufferUtils.appendBytes(
      userBytes,
      new Uint8Array([idBytesLength]),
      offset
    );
    offset = ArrayBufferUtils.appendBytes(userBytes, idBytes, offset);
    ArrayBufferUtils.appendBytes(userBytes, categoryBytes, offset);
    return userBytes;
  }

  public isVisitor(): boolean {
    return this.category == UserCategory.VISITOR;
  }

  public isClient(): boolean {
    return this.category == UserCategory.CLIENT;
  }

  public isAgent(): boolean {
    return this.category == UserCategory.AGENT;
  }
}

export type NullableChatUser = ChatUser | null;
