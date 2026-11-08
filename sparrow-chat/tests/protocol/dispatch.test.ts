import {afterEach, describe, expect, it, vi} from "vitest";
import Protocol from "@/common/lib/protocol/messaging/Protocol";
import Message from "@/common/lib/protocol/messaging/Message";
import MessageBroker from "@/lib/im/MessageBroker";
import SparrowWebSocket from "@/common/lib/SparrowWebSocket";
import {ChatType, DeviceType, ProtocolType} from "@/common/lib/protocol/messaging/Chat";

vi.mock("react-hot-toast", () => ({default: {error: vi.fn()}}));

vi.mock("@/common/lib/CrosStorage", () => ({default: {getCrosStorage: () => ({})}}));

afterEach(() => vi.restoreAllMocks());

function broker() {
    // Exercise the actual receive method without opening a live connection.
    const result = Object.create(MessageBroker.prototype) as MessageBroker;
    result.webSocket = {
        sendMessage: vi.fn(), offlineCallback: vi.fn(),
    } as unknown as SparrowWebSocket;
    Object.assign(result, {pendingSessions: new Set(), activeQuestions: new Map(),
        submittedQuestions: new Set(), pendingQuestionIds: new Map()});
    result.onControlEvent = vi.fn();
    result.putMessage = vi.fn().mockResolvedValue(undefined);
    result.sessionContainer = {plusUnreadCount: vi.fn()} as any;
    result.newMessageSignal = vi.fn();
    return result;
}

describe("control event dispatch", () => {
    it("does not convert ACK or other short events into chat messages", async () => {
        const b = broker();
        const fromProtocol = vi.spyOn(Message, "fromProtocol");
        for (const type of [10, 25, 27, 28, 20, 50, 80, -99]) {
            const p = new Protocol();
            p.protocolType = type;
            p.device = DeviceType.PC;
            p.chatType = ChatType.CHAT_1_TO_1;
            p.clientSendTime = 1;
            await b.websocketMsgCallback(p.toBytes().buffer as ArrayBuffer);
        }
        expect(fromProtocol).not.toHaveBeenCalled();
        expect(b.putMessage).not.toHaveBeenCalled();
        expect(b.onControlEvent).toHaveBeenCalledTimes(8);
    });

    it("rejects removed heartbeat business codes and still reports OFFLINE", async () => {
        const b = broker();
        for (const type of [30, 40]) {
            await expect(b.websocketMsgCallback(Uint8Array.of(type).buffer)).rejects.toThrow();
        }
        expect(b.webSocket.sendMessage).not.toHaveBeenCalled();
        await b.websocketMsgCallback(Uint8Array.of(70).buffer);
        expect(b.webSocket.offlineCallback).toHaveBeenCalledWith({offline: true});
        expect(b.putMessage).not.toHaveBeenCalled();
    });

    it("only appends a complete IM frame once", async () => {
        const b = broker();
        const bytes = Uint8Array.from([8, 1, 0, 0, 0, 0, 0, 0, 0, 1, 49, 1, 49, 1, 1, 50, 1]);
        await b.websocketMsgCallback(bytes.buffer);
        expect(b.putMessage).toHaveBeenCalledOnce();
        expect(b.sessionContainer.plusUnreadCount).toHaveBeenCalledOnce();
        expect(b.newMessageSignal).toHaveBeenCalledOnce();
        expect((b.putMessage as any).mock.calls[0][0].content).toBe("");
    });

    it("rejects converting a short event to a display message", () => {
        expect(() => Message.fromProtocol(Protocol.fetchUserStatus())).toThrow(/chat message/);
    });
});

describe("native WebSocket heartbeat integration", () => {
    it.each(["AUTH_BIND", "AUTH"])("authenticates %s without starting a heartbeat timer", async instruction => {
        vi.useFakeTimers();
        try {
            const socket = new SparrowWebSocket("ws://example.test", null as any);
            const ws: any = {send: vi.fn(), close: vi.fn()};
            (socket as any).ws = ws;
            socket.handshakeSuccess = vi.fn();
            (socket as any)._onMsg();
            await ws.onmessage({data: JSON.stringify({code: "0", instruction})});
            expect(socket.handshakeSuccess).toHaveBeenCalledOnce();
            expect(socket.getConnectionStatus()).toBe(SparrowWebSocket.ACTIVE_STATUS);
            vi.advanceTimersByTime(60000);
            expect(ws.send).not.toHaveBeenCalled();
            expect(vi.getTimerCount()).toBe(0);
            socket.close();
        } finally {
            vi.useRealTimers();
        }
    });

    it("refreshes connection UI and requests contact status once after authentication", () => {
        vi.useFakeTimers();
        vi.spyOn(SparrowWebSocket.prototype, "connect").mockImplementation(() => {});
        const b = new MessageBroker(null, vi.fn(), {userId: "28", category: 1} as any);
        const ws = {send: vi.fn(), close: vi.fn(), readyState: 1};
        (b.webSocket as any).ws = ws;
        b.newMessageSignal = vi.fn();
        b.webSocket.handshakeSuccess = vi.fn();
        try {
            b.webSocket.userAuthCallback({code: "0", data: null});
            expect(b.newMessageSignal).toHaveBeenCalledOnce();
            expect(ws.send).toHaveBeenCalledWith(Uint8Array.of(45).buffer);
            vi.advanceTimersByTime(60000);
            expect(ws.send).toHaveBeenCalledOnce();
            expect(vi.getTimerCount()).toBe(0);
            b.closeWebSocket();
            expect(b.newMessageSignal).toHaveBeenCalledTimes(2);
            expect(b.webSocket.getConnectionStatus()).toBe(SparrowWebSocket.INACTIVE_STATUS);
        } finally {
            b.closeWebSocket();
            vi.useRealTimers();
        }
    });

    it("stops retry timers when explicitly closed", () => {
        vi.useFakeTimers();
        try {
            const socket = new SparrowWebSocket("ws://example.test", null as any);
            const ws = {send: vi.fn(), close: vi.fn()};
            (socket as any).ws = ws;
            const retry = vi.fn();
            (socket as any).reconnectionTimer = setInterval(retry, 15000);
            socket.close();
            vi.advanceTimersByTime(60000);
            expect(ws.close).toHaveBeenCalledOnce();
            expect(ws.send).not.toHaveBeenCalled();
            expect(retry).not.toHaveBeenCalled();
        } finally {
            vi.useRealTimers();
        }
    });

    it("accepts both Blob and ArrayBuffer binary deliveries", async () => {
        const socket = new SparrowWebSocket("ws://example.test", null as any);
        const ws: any = {};
        (socket as any).ws = ws;
        socket.onMsgCallback = vi.fn();
        (socket as any)._onMsg();
        await ws.onmessage({data: Uint8Array.of(70).buffer});
        await ws.onmessage({data: new Blob([Uint8Array.of(70)])});
        expect(socket.onMsgCallback).toHaveBeenCalledTimes(2);
        expect(socket.onMsgCallback).toHaveBeenNthCalledWith(1, Uint8Array.of(70).buffer);
    });
});
