import {describe, expect, it, vi} from "vitest";
import Protocol from "@/lib/protocol/Protocol";
import ChatUser from "@/lib/protocol/ChatUser";
import ChatSession from "@/lib/protocol/session/ChatSession";
import {ChatType, DeviceType, ProtocolType, MessageType} from "@/lib/protocol/Chat";
import javaFrames from "./fixtures/java-frames.json";

// Fixed bytes derived from Java's documented wire format, not the JS encoder.
const singleFrame = Uint8Array.from([
    8, 1, 0, 255, 255, 0, 0, 0, 3, 228, 189, 160,
    5, 49, 50, 95, 51, 52, 1, 49, 1, 1, 50, 2,
]);
function single() {
    return Protocol.create121Chat(new ChatUser("1", 1), 65535,
        new ChatUser("2", 2), "你", 12);
}
function event(type: ProtocolType) {
    const p = new Protocol();
    p.protocolType = type;
    p.device = DeviceType.PC;
    p.chatType = ChatType.CHAT_1_TO_1;
    p.messageType = MessageType.TEXT;
    return p;
}

describe("Java protocol compatibility", () => {
    it.each(Object.entries(javaFrames))("round-trips the actual Java %s frame byte for byte", (_, bytes) => {
        const frame = Uint8Array.from(bytes);
        expect(Protocol.fromBytes(frame).toBytes()).toEqual(frame);
    });

    it("preserves a leading UTF-8 BOM in payload and user IDs like Java", () => {
        const p = Protocol.create121Chat(new ChatUser("\uFEFF1", 1), 0, new ChatUser("2", 1), "\uFEFFtext", 1);
        const decoded = Protocol.fromBytes(p.toBytes());
        expect(decoded.payload).toBe("\uFEFFtext");
        expect(decoded.sender?.id).toBe("\uFEFF1");
        expect(decoded.toBytes()).toEqual(p.toBytes());
    });

    it("encodes unpaired UTF-16 surrogates as '?' like Java, preserving emoji", () => {
        const p = Protocol.createGroupChat(new ChatUser("x\uD800", 255), "1g\uDC00", 0, "\uD800😀\uDC00", 1);
        const decoded = Protocol.fromBytes(p.toBytes());
        expect(decoded.payload).toBe("?😀?");
        expect(decoded.sender?.id).toBe("x?");
        expect(decoded.chatSession?.id).toBe("g?");
        expect([...new ChatUser("\uD800", 1).toBytes()]).toEqual([1, 63, 1]);
    });

    it.each([[237, 160], [237, 160, 128], [237, 191, 191]])(
        "replaces a malformed surrogate byte sequence like Java: %j", (...bytes) => {
            const frame = Uint8Array.from([50, 1, 0, 0, 0, 0, 0, 0, bytes.length, ...bytes]);
            expect(Protocol.fromBytes(frame).payload).toBe("\uFFFD");
            const user = ChatUser.fromBytes(new DataView(Uint8Array.from([bytes.length, ...bytes, 1]).buffer), 0);
            expect(user.chatUser?.id).toBe("\uFFFD");
        });
    it("encodes and decodes an independent full IM sample", () => {
        const p = single();
        p.serverTime = 34;
        expect(p.toBytes()).toEqual(singleFrame);
        expect(p).not.toHaveProperty("version");
        const decoded = Protocol.fromBytes(singleFrame.buffer);
        expect(decoded.protocolType).toBe(8);
        expect(decoded.device).toBe(1);
        expect(decoded.messageType).toBe(65535);
        expect(decoded.payload).toBe("你");
        expect(decoded.clientSendTime).toBe(12);
        expect(decoded.serverTime).toBe(34);
        expect(decoded.chatSession!.sessionKey).toBe("0210121");
        expect(decoded.toBytes()).toEqual(singleFrame);
    });

    it.each([30, 40, 70, -99])("handles event-only %i including signed ERROR", type => {
        const p = new Protocol();
        p.protocolType = type;
        expect([...p.toBytes()]).toEqual([type & 255]);
        expect(Protocol.fromBytes(p.toBytes()).protocolType).toBe(type);
        expect(Protocol.fromBytes(p.toBytes()).payload).toBeNull();
    });

    it.each([50, 80])("handles content-only %i without time or users", type => {
        const p = event(type);
        expect([...p.toBytes()]).toEqual([type, 1, 0, 0, 0, 0, 0, 0, 0]);
        expect(Protocol.fromBytes(p.toBytes()).payload).toBeNull();
    });

    it.each([10, 25, 27, 28, 20])("handles time-only %i without users", type => {
        const p = event(type);
        p.clientSendTime = 0;
        expect([...p.toBytes()]).toEqual([type, 1, 0, 0, 0, 0, 0, 0, 0, 1, 48]);
        const decoded = Protocol.fromBytes(p.toBytes());
        expect(decoded.clientSendTime).toBe(0);
        expect(decoded.serverTime).toBeNull();
        expect(decoded.sender).toBeNull();
    });

    it("supports AI and a group key measured in UTF-8 bytes", () => {
        const p = Protocol.createGroupChat(new ChatUser("中", 255), "1群", 256, "", 1);
        p.protocolType = ProtocolType.AI;
        const decoded = Protocol.fromBytes(p.toBytes());
        expect(decoded.protocolType).toBe(0);
        expect(decoded.sessionLength).toBe(4);
        expect(decoded.chatSession!.sessionKey).toBe("1群");
        expect(decoded.payload).toBeNull();
        expect(decoded.sender!.category).toBe(255);
    });

    it("respects Uint8Array and DataView ranges without retaining input", () => {
        const padded = new Uint8Array(singleFrame.length + 6);
        padded.set(singleFrame, 3);
        const view = new DataView(padded.buffer, 3, singleFrame.length);
        const decoded = Protocol.fromBytes(view);
        expect(decoded.payload).toBe("你");
        expect(view.byteOffset).toBe(3);
        expect(view.byteLength).toBe(singleFrame.length);
        expect(Protocol.fromBytes(padded.subarray(3, -3)).toBytes()).toEqual(singleFrame);
        padded.fill(0);
        expect(decoded.toBytes()).toEqual(singleFrame);
    });

    it("rejects every truncated prefix of a full frame", () => {
        for (let length = 0; length < singleFrame.length; length++) {
            expect(() => Protocol.fromBytes(singleFrame.slice(0, length))).toThrow();
        }
    });

    it("rejects invalid event, header and signed payload lengths", () => {
        for (const [offset, value] of [[0, 99], [1, 0], [2, 2], [5, 255]]) {
            const bytes = singleFrame.slice();
            bytes[offset] = value;
            expect(() => Protocol.fromBytes(bytes)).toThrow();
        }
    });

    it.each(["", "-1", "1_", "_1", "1_2_3", "1.1", "1\n", "\uFEFF1", "9007199254740992", "9223372036854775808"])(
        "rejects invalid or inexact timestamps %s", time => {
            const bytes = Uint8Array.from([10, 1, 0, 0, 0, 0, 0, 0, 0, time.length,
                ...new TextEncoder().encode(time)]);
            expect(() => Protocol.fromBytes(bytes)).toThrow();
        });

    it("checks only fields required by the event's ending segment", () => {
        expect(() => new Protocol().toBytes()).toThrow();
        const ack = event(ProtocolType.ACK);
        expect(() => ack.toBytes()).toThrow(/clientSendTime/);
        for (const value of [-1, 1.5, NaN, Infinity, Number.MAX_SAFE_INTEGER + 1]) {
            ack.clientSendTime = value;
            expect(() => ack.toBytes()).toThrow();
        }
        ack.clientSendTime = 1;
        ack.serverTime = -1;
        expect(() => ack.toBytes()).toThrow();
        for (const value of [-1, 65536, 1.5]) {
            const p = single();
            p.messageType = value;
            expect(() => p.toBytes()).toThrow();
        }
    });

    it("checks group session type and 255-byte UTF-8 boundaries", () => {
        const p = Protocol.createGroupChat(new ChatUser("中".repeat(85), 255), "1" + "中".repeat(84) + "ab", 0, null, 1);
        expect(() => p.toBytes()).not.toThrow();
        p.sender!.id += "a";
        expect(() => p.toBytes()).toThrow();
        p.sender!.id = "1";
        p.chatSession!.id += "a";
        expect(() => p.toBytes()).toThrow();
        p.chatSession = ChatSession.createSession(ChatType.CHAT_1_TO_1, "wrong");
        expect(() => p.toBytes()).toThrow();
        for (const category of [-1, 256, 1.5]) {
            expect(() => new ChatUser("1", category).toBytes()).toThrow();
        }
    });

    it("refreshes single-chat session regardless of setter order", () => {
        const p = new Protocol();
        p.receiver = new ChatUser("2", 1);
        p.sender = new ChatUser("1", 1);
        p.chatType = ChatType.CHAT_1_TO_1;
        expect(p.chatSession!.sessionKey).toBe("0110121");
        p.receiver = null;
        expect(p.chatSession).toBeNull();
    });

    it("keeps encoding stable; clone/ack share users and pong is event-only", () => {
        const p = single();
        expect(p.toBytes()).toEqual(p.toBytes());
        expect(p.serverTime).toBeNull();
        const copy = p.clone();
        expect(copy.sender).toBe(p.sender);
        expect(copy.chatSession).toBe(p.chatSession);
        vi.spyOn(Date, "now").mockReturnValue(1234);
        const ack = p.ack();
        expect(ack.protocolType).toBe(ProtocolType.ACK);
        expect(ack.serverTime).toBe(1234);
        expect(p.serverTime).toBeNull();
        expect(Protocol.fromBytes(ack.toBytes()).sender).toBeNull();
        expect([...Protocol.pong().toBytes()]).toEqual([40]);
        vi.restoreAllMocks();
    });
});

describe("current gateway protocol alignment", () => {
    it("reads the one-byte status query used by the current Java gateway", () => {
        const query = Protocol.fromBytes(Uint8Array.of(45));
        expect(query.protocolType).toBe(45);
        expect(query.payload).toBeNull();
        expect([...query.toBytes()]).toEqual([45]);
    });

    it("creates a header-only status query without device or chat fields", () => {
        expect([...Protocol.fetchUserStatus().toBytes()]).toEqual([45]);
    });

    it.each(Object.entries(javaFrames))("rejects bytes after a complete Java %s frame", (_, bytes) => {
        expect(() => Protocol.fromBytes(Uint8Array.from([...bytes, 99]))).toThrow();
    });
});

describe("Java user and session identity", () => {
    it("sorts equal IDs by actual category in either direction", () => {
        const a = new ChatUser("same", 1);
        const b = new ChatUser("same", 2);
        const forward = ChatSession.create121Session(a, b);
        expect(forward.sessionKey).toBe("02104samesame");
        expect(ChatSession.create121Session(b, a).sessionKey).toBe(forward.sessionKey);
        expect(a.equals(b)).toBe(false);
        expect(forward.getOppositeUser(a)?.category).toBe(2);
        expect(forward.getOppositeUser(new ChatUser("outsider", 1))).toBeNull();
    });

    it("checks single-chat ID and category limits", () => {
        for (const user of [new ChatUser("", 1), new ChatUser("x".repeat(100), 1), new ChatUser("1", 10)]) {
            expect(() => ChatSession.create121Session(user, new ChatUser("2", 1))).toThrow();
        }
        expect(() => ChatSession.parse("0119912")?.getOppositeUser(new ChatUser("1", 1))).toThrow();
    });

    it("parses user keys at the last underscore and respects DataView offsets", () => {
        expect(ChatUser.parse("a_b_2")?.id).toBe("a_b");
        const bytes = Uint8Array.from([99, 99, 1, 49, 2, 99]);
        const result = ChatUser.fromBytes(new DataView(bytes.buffer, 2, 3), 0);
        expect(result.chatUser?.id).toBe("1");
        expect(result.offset).toBe(3);
        expect(() => ChatUser.fromBytes(new DataView(bytes.buffer, 2, 2), 0)).toThrow();
    });
});
