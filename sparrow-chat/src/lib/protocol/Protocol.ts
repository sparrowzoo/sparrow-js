import {decodeUtf8, encodeUtf8} from "@/lib/protocol/Utf8";
import ChatUser from "@/lib/protocol/ChatUser";
import ChatSession from "@/lib/protocol/session/ChatSession";
import {
    ChatType,
    DeviceType,
    MessageType,
    PROTOCOL_DEFINITIONS,
    ProtocolSegmentIndex,
    ProtocolType
} from "@/lib/protocol/Chat";

/** Java Protocol wire format. All multibyte integers use big endian. */
export default class Protocol {
    public device: DeviceType | null = null;
    public protocolType: ProtocolType | null = null;
    public messageType: number = MessageType.TEXT;
    public sessionLength = 0;
    public chatSession: ChatSession | null = null;
    public payload: string | null = null;
    public clientSendTime: number | null = null;
    public serverTime: number | null = null;
    private _chatType: ChatType | null = null;

    get chatType(): ChatType | null {
        return this._chatType;
    }

    set chatType(value: ChatType | null) {
        this._chatType = value;
        this.refreshOneToOneSession();
    }

    private _sender: ChatUser | null = null;

    get sender(): ChatUser | null {
        return this._sender;
    }

    set sender(value: ChatUser | null) {
        this._sender = value;
        this.refreshOneToOneSession();
    }

    private _receiver: ChatUser | null = null;

    get receiver(): ChatUser | null {
        return this._receiver;
    }

    set receiver(value: ChatUser | null) {
        this._receiver = value;
        this.refreshOneToOneSession();
    }

    /** Parses exactly the input view's byte range without modifying or retaining it. */
    public static fromBytes(frame: ArrayBuffer | ArrayBufferView): Protocol {
        if (frame == null) throw new Error("frame is required");
        const reader = new FrameReader(frame);
        const protocol = new Protocol();
        protocol.protocolType = reader.signedByte("protocolType") as ProtocolType;
        const end = protocol.endOfSegmentIndex();
        if (end === ProtocolSegmentIndex.PROTOCOL_SEGMENT) {
            reader.requireComplete();
            return protocol;
        }

        protocol.device = reader.byte("device") as DeviceType;
        protocol.chatType = reader.byte("chatType") as ChatType;
        protocol.validateControl();
        protocol.messageType = reader.unsignedShort("messageType");
        const payloadLength = reader.int("payloadLength");
        if (payloadLength < 0) throw new Error("payloadLength must not be negative");
        if (payloadLength > 0) protocol.payload = reader.text(payloadLength, "payload");
        if (end === ProtocolSegmentIndex.CONTENT_SEGMENT) {
            reader.requireComplete();
            return protocol;
        }

        const timestamps = reader.text(reader.byte("timeLength"), "timestamps");
        if (!/^[0-9]+(?:_[0-9]+)?$/.test(timestamps)) {
            throw new Error("timestamps must contain one non-negative decimal integer or two separated by '_'");
        }
        const parts = timestamps.split("_");
        protocol.clientSendTime = Protocol.timestamp(Number(parts[0]), "clientSendTime");
        if (parts.length === 2) protocol.serverTime = Protocol.timestamp(Number(parts[1]), "serverTime");
        if (end === ProtocolSegmentIndex.TIME_SEGMENT) {
            reader.requireComplete();
            return protocol;
        }

        protocol.sender = reader.user();
        if (protocol.isOne2One()) {
            protocol.receiver = reader.user();
            reader.requireComplete();
            return protocol;
        }
        protocol.sessionLength = reader.byte("sessionLength");
        const sessionKey = reader.text(protocol.sessionLength, "sessionKey");
        if (sessionKey.length < 2 || sessionKey[0] !== String(protocol.chatType)) {
            throw new Error("sessionKey must contain the chat type prefix and a non-empty ID");
        }
        protocol.chatSession = ChatSession.parse(sessionKey);
        reader.requireComplete();
        return protocol;
    }

    public static create121Chat(protocolType: ProtocolType = ProtocolType.IM, sender: ChatUser, messageType: number, receiver: ChatUser,
                                payload: string | null, clientSendTime: number): Protocol {
        const protocol = new Protocol();
        protocol.device = DeviceType.PC;
        protocol.protocolType = protocolType;
        protocol.chatType = ChatType.CHAT_1_TO_1;
        protocol.messageType = messageType;
        protocol.sender = sender;
        protocol.receiver = receiver;
        protocol.payload = payload;
        protocol.clientSendTime = clientSendTime;
        return protocol;
    }

    public static createGroupChat(sender: ChatUser, sessionKey: string, messageType: number,
                                  payload: string | null, clientSendTime: number): Protocol {
        const protocol = new Protocol();
        protocol.device = DeviceType.PC;
        protocol.protocolType = ProtocolType.IM;
        protocol.chatType = ChatType.GROUP;
        protocol.sender = sender;
        protocol.messageType = messageType;
        protocol.chatSession = ChatSession.parse(sessionKey);
        protocol.payload = payload;
        protocol.clientSendTime = clientSendTime;
        return protocol;
    }

    public static ping(): Protocol {
        const protocol = new Protocol();
        protocol.protocolType = ProtocolType.PING;
        return protocol;
    }

    public static fetchUserStatus(): Protocol {
        const protocol = new Protocol();
        protocol.protocolType = ProtocolType.FETCH_USER_STATUS;
        return protocol;
    }

    public static pong(): Protocol {
        const protocol = new Protocol();
        protocol.protocolType = ProtocolType.PONG;
        return protocol;
    }

    private static timestamp(value: number | null, field: string): number {
        if (value == null) throw new Error(field + " is required for the time segment");
        if (!Number.isSafeInteger(value) || value < 0) throw new Error(field + " must be a non-negative safe integer");
        return value;
    }

    public isOne2One(): boolean {
        return this.chatType === ChatType.CHAT_1_TO_1;
    }

    /** Validates and writes only the segments required by the protocol type. Does not refresh timestamps. */
    public toBytes(): Uint8Array<ArrayBuffer> {
        const end = this.endOfSegmentIndex();
        if (end === ProtocolSegmentIndex.PROTOCOL_SEGMENT) return Uint8Array.of(this.protocolType! & 255);
        this.validateControl();
        if (!Number.isInteger(this.messageType) || this.messageType < 0 || this.messageType > 65535) {
            throw new Error("messageType must be between 0 and 65535");
        }
        const payload = encodeUtf8(this.payload ?? "");
        if (payload.length > 2147483647) throw new Error("payloadLength must fit a non-negative int32");
        const header = new Uint8Array(9);
        const view = new DataView(header.buffer);
        view.setInt8(0, this.protocolType!);
        view.setUint8(1, this.device!);
        view.setUint8(2, this.chatType!);
        view.setUint16(3, this.messageType, false);
        view.setInt32(5, payload.length, false);
        const chunks: Uint8Array[] = [header, payload];
        if (end !== ProtocolSegmentIndex.CONTENT_SEGMENT) {
            let timestamps = String(Protocol.timestamp(this.clientSendTime, "clientSendTime"));
            if (this.serverTime != null) timestamps += "_" + Protocol.timestamp(this.serverTime, "serverTime");
            const timeBytes = encodeUtf8(timestamps);
            chunks.push(Uint8Array.of(timeBytes.length), timeBytes);
        }
        if (end === ProtocolSegmentIndex.USER_SEGMENT) {
            if (this.sender == null) throw new Error("sender is required");
            const senderBytes = this.sender.toBytes();
            if (this.isOne2One()) {
                ChatSession.validateOneToOneUser(this.sender);
                ChatSession.validateOneToOneUser(this.receiver);
                this.sessionLength = 0;
                chunks.push(senderBytes, this.receiver!.toBytes());
            } else {
                if (this.chatSession == null || this.chatSession.chatType !== this.chatType || !this.chatSession.id) {
                    throw new Error("Group chat requires a matching session with a non-empty ID");
                }
                // Compute from the fields, not the UI's potentially cached sessionKey.
                const sessionBytes = this.chatSession.toBytes();
                if (sessionBytes.length > 255) throw new Error("sessionKey UTF-8 byte length must not exceed 255");
                this.sessionLength = sessionBytes.length;
                chunks.push(senderBytes, Uint8Array.of(sessionBytes.length), sessionBytes);
            }
        }
        const result = new Uint8Array(chunks.reduce((length, bytes) => length + bytes.length, 0));
        let offset = 0;
        for (const bytes of chunks) {
            result.set(bytes, offset);
            offset += bytes.length;
        }
        return result;
    }

    public getStringPayload(): string | null {
        return this.payload;
    }

    public ack(): Protocol {
        const ack = this.clone();
        ack.serverTime = Date.now();
        ack.protocolType = ProtocolType.ACK;
        return ack;
    }

    /** Shallow copy: user and session objects remain shared, as in Java. */
    public clone(): Protocol {
        return Object.assign(new Protocol(), this);
    }

    private refreshOneToOneSession() {
        if (this.isOne2One()) {
            this.chatSession = this.sender == null || this.receiver == null ? null
                : ChatSession.create121Session(this.sender, this.receiver);
        }
    }

    private endOfSegmentIndex(): ProtocolSegmentIndex {
        if (this.protocolType == null || !Object.prototype.hasOwnProperty.call(PROTOCOL_DEFINITIONS, this.protocolType)) {
            throw new Error("protocolType is required and must be a known Java protocol type");
        }
        return PROTOCOL_DEFINITIONS[this.protocolType].endOfSegmentIndex;
    }

    private validateControl() {
        if (![DeviceType.PC, DeviceType.MOBILE, DeviceType.APP].includes(this.device!) ||
            ![ChatType.CHAT_1_TO_1, ChatType.GROUP].includes(this.chatType!)) {
            throw new Error("device and chatType must be valid for the control segment");
        }
    }
}

/** Bounds checks precede every read, including variable-length UTF-8 fields. */
class FrameReader {
    private view: DataView;
    private offset = 0;

    constructor(frame: ArrayBuffer | ArrayBufferView) {
        this.view = ArrayBuffer.isView(frame)
            ? new DataView(frame.buffer, frame.byteOffset, frame.byteLength) : new DataView(frame);
    }

    requireComplete(): void {
        if (this.offset !== this.view.byteLength) {
            throw new Error("Unexpected bytes after the complete protocol frame: " + (this.view.byteLength - this.offset));
        }
    }

    byte(field: string): number {
        this.require(1, field);
        return this.view.getUint8(this.offset++);
    }

    signedByte(field: string): number {
        this.require(1, field);
        return this.view.getInt8(this.offset++);
    }

    unsignedShort(field: string): number {
        this.require(2, field);
        const value = this.view.getUint16(this.offset, false);
        this.offset += 2;
        return value;
    }

    int(field: string): number {
        this.require(4, field);
        const value = this.view.getInt32(this.offset, false);
        this.offset += 4;
        return value;
    }

    text(length: number, field: string): string {
        this.require(length, field);
        const value = decodeUtf8(new Uint8Array(this.view.buffer, this.view.byteOffset + this.offset, length));
        this.offset += length;
        return value;
    }

    user(): ChatUser {
        const result = ChatUser.fromBytes(this.view, this.offset);
        this.offset = result.offset;
        return result.chatUser!;
    }

    private require(length: number, field: string) {
        if (length < 0 || length > this.view.byteLength - this.offset) {
            throw new Error("Invalid " + field + " length: " + length + ", remaining bytes: " + (this.view.byteLength - this.offset));
        }
    }
}
