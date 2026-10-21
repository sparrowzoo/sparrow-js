import ChatUser from "@/lib/protocol/ChatUser";
import ChatSession from "@/lib/protocol/session/ChatSession";
import ArrayBufferUtils from "@/common/lib/protocol/ArrayBufferUtils";
import {ChatType, EventType, MessageType} from "@/lib/protocol/Chat";

class Protocol {
    public version: number;
    public eventType: EventType;
    public messageType: MessageType;
    public chatType: ChatType;
    public sender: ChatUser;
    public receiver: ChatUser;
    public chatSession: ChatSession;
    public payload: Uint8Array;
    public clientSendTime: number;
    public serverTime: number;

    public static fromBytes(bytes: ArrayBuffer): Protocol {
        const protocol: Protocol = new Protocol();
        const dataView = new DataView(bytes);
        let offset = 0;
        protocol.version = dataView.getUint8(offset);
        const chatType = dataView.getUint8(offset + 1);
        protocol.chatType = chatType as ChatType;
        const eventType = dataView.getUint8(offset + 2);
        protocol.eventType = eventType as EventType;
        const messageType = dataView.getUint8(offset + 3);
        protocol.messageType = messageType as MessageType;
        const senderWithOffset = ChatUser.fromBytes(dataView, offset + 4);
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
            offset += sessionLength;
            const session = new TextDecoder().decode(sessionBytes);
            protocol.chatSession = ChatSession.parse(session) as ChatSession;
        }
        const payloadLength = dataView.getUint32(offset);
        offset += 4;
        protocol.payload = new Uint8Array(
            bytes.slice(offset, offset + payloadLength)
        );
        offset += payloadLength;

        const clientSendTime = new TextDecoder().decode(
            new Uint8Array(bytes.slice(offset, bytes.byteLength))
        ); // 默认 UTF-8 编码

        protocol.clientSendTime = parseInt(clientSendTime, 10);
        return protocol;
    }

    public static create121Chat(
        sender: ChatUser,
        messageType: MessageType,
        receiver: ChatUser,
        payload: string,
        clientSendTime: number
    ): Protocol {
        const protocol: Protocol = new Protocol();
        protocol.version = 1;
        protocol.eventType = EventType.MESSAGE;
        protocol.chatType = ChatType.CHAT_1_TO_1;
        protocol.messageType = messageType;
        protocol.sender = sender;
        protocol.receiver = receiver;
        protocol.chatSession = ChatSession.create121Session(
            protocol.sender,
            receiver
        );
        protocol.payload = ArrayBufferUtils.str2Buffer(payload);
        protocol.clientSendTime = clientSendTime;
        return protocol;
    }

    public static createGroupChat(
        sender: ChatUser,
        sessionKey: string,
        messageType: MessageType,
        payload: string,
        clientSendTime: number
    ): Protocol {
        const protocol: Protocol = new Protocol();
        protocol.version = 1;
        protocol.eventType = EventType.MESSAGE;
        protocol.chatType = ChatType.GROUP;
        protocol.sender = sender;
        protocol.messageType = messageType;
        protocol.chatSession = ChatSession.parse(sessionKey) as ChatSession;
        protocol.payload = ArrayBufferUtils.str2Buffer(payload);
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
        const headerLength = 4;
        const senderBytes: Uint8Array = this.sender.toBytes();
        const receiverBytes: Uint8Array = this.receiver.toBytes();
        const payloadLength = 4;
        const clientSendTimeBytes = ArrayBufferUtils.str2Buffer(
            this.clientSendTime + ""
        );
        const capacity: number =
            headerLength +
            senderBytes.byteLength +
            receiverBytes.byteLength +
            payloadLength +
            this.payload.byteLength +
            clientSendTimeBytes.byteLength;
        let offset: number = 0;
        let protocol: Uint8Array = new Uint8Array(capacity);
        offset = ArrayBufferUtils.appendBytes(
            protocol,
            new Uint8Array([
                this.version,
                this.chatType,
                this.eventType,
                this.messageType,
            ]),
            offset
        );
        offset = ArrayBufferUtils.appendBytes(protocol, senderBytes, offset);
        offset = ArrayBufferUtils.appendBytes(protocol, receiverBytes, offset);
        offset = ArrayBufferUtils.appendBytes(
            protocol,
            ArrayBufferUtils.number2Buffer(this.payload.byteLength),
            offset
        );
        offset = ArrayBufferUtils.appendBytes(protocol, this.payload, offset);
        ArrayBufferUtils.appendBytes(protocol, clientSendTimeBytes, offset);
        return protocol;
    }

    public toGroupBytes(): Uint8Array {
        let offset: number = 0;
        const headerLength = 4;
        const senderBytes: Uint8Array = this.sender.toBytes();
        const sessionLength = 1;
        const sessionBytes: Uint8Array = this.chatSession.toBytes();
        const payloadLength = 4;
        const clientSendTimeBytes = ArrayBufferUtils.str2Buffer(
            this.clientSendTime + ""
        );
        let capacity: number =
            headerLength +
            senderBytes.byteLength +
            sessionLength +
            sessionBytes.byteLength +
            payloadLength +
            this.payload.byteLength +
            clientSendTimeBytes.byteLength;

        let protocol: Uint8Array = new Uint8Array(capacity);
        offset = ArrayBufferUtils.appendBytes(
            protocol,
            new Uint8Array([
                this.version,
                this.chatType,
                this.eventType,
                this.messageType,
            ]),
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
            ArrayBufferUtils.number2Buffer(this.payload.byteLength),
            offset
        );
        offset = ArrayBufferUtils.appendBytes(protocol, this.payload, offset);
        ArrayBufferUtils.appendBytes(protocol, clientSendTimeBytes, offset);
        return protocol;
    }

    public getStringPayload(): string {
        return new TextDecoder().decode(this.payload); // 默认 UTF-8 编码
    }
}

export default Protocol;
