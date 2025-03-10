import ArrayBufferUtils from "@/lib/protocol/ArrayBufferUtils";
import { USER_INFO_KEY } from "@/lib/EnvUtils";

interface ChatUserWithOffset {
  chatUser: NullableChatUser;
  offset: number;
}

export default class ChatUser {
  static readonly CATEGORY_VISITOR = 0;
  static readonly CATEGORY_REGISTER = 1;
  private id: string;
  private category: number;

  constructor(id: string, category: number) {
    this.id = id;
    this.category = category;
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
    const loginUser = JSON.parse(sessionStorage.getItem(USER_INFO_KEY) ?? "");
    const userId = loginUser.userId;
    const category = loginUser.category;
    return new ChatUser(userId, category);
  }

  getId(): string {
    return this.id;
  }

  getCategory(): number {
    return this.category;
  }

  getCategoryName(): string {
    if (this.category == ChatUser.CATEGORY_VISITOR) {
      return "访客";
    } else if (this.category == ChatUser.CATEGORY_REGISTER) {
      return "注册用户";
    }
    return "未知";
  }

  public key(): string {
    return this.id + "_" + this.category;
  }

  public equals(chatUser: NullableChatUser): boolean {
    if (chatUser == null) {
      return false;
    }
    return (
      this.id == chatUser.getId() && this.category == chatUser.getCategory()
    );
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
}

export type NullableChatUser = ChatUser | null;
