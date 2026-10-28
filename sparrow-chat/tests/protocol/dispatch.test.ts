import {afterEach, describe, expect, it, vi} from "vitest";
import Protocol from "@/lib/protocol/Protocol";
import Message from "@/lib/protocol/Message";
import MessageBroker from "@/lib/im/MessageBroker";
import SparrowWebSocket from "@/common/lib/SparrowWebSocket";
import {ChatType, DeviceType, ProtocolType} from "@/lib/protocol/Chat";

vi.mock("@/common/lib/CrosStorage", () => ({default: {getCrosStorage: () => ({})}}));

afterEach(() => vi.restoreAllMocks());

function broker() {
    // Exercise the actual receive method without opening a live connection.
    const result = Object.create(MessageBroker.prototype) as MessageBroker;
    result.webSocket = {
        receiveHeartbeat: vi.fn(), sendMessage: vi.fn(), offlineCallback: vi.fn(),
    } as unknown as SparrowWebSocket;
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

    it("refreshes heartbeat, exposes unexpected uplink PING and reports OFFLINE", async () => {
        const b = broker();
        await b.websocketMsgCallback(Uint8Array.of(40).buffer);
        expect(b.webSocket.receiveHeartbeat).toHaveBeenCalledOnce();
        await b.websocketMsgCallback(Uint8Array.of(30).buffer);
        // PING is uplink in the Java protocol; clients originate it and consume PONG.
        expect(b.onControlEvent).toHaveBeenCalledWith(expect.objectContaining({protocolType: ProtocolType.PING}));
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
        expect(() => Message.fromProtocol(Protocol.pong())).toThrow(/chat message/);
    });
});

describe("current gateway status query", () => {
    it("sends status queries as the single byte 45", () => {
        vi.spyOn(SparrowWebSocket.prototype, "connect").mockImplementation(() => {});
        const b = new MessageBroker(null, vi.fn(), {userId: "28", category: 1} as any);
        try {
            expect(b.webSocket.statusMonitorMessage([])).toEqual(Uint8Array.of(45));
        } finally {
            b.closeWebSocket();
        }
    });
});

describe("WebSocket binary heartbeat integration", () => {
    it.each(["AUTH_BIND", "AUTH"])("starts authentication callbacks and heartbeat for %s", async instruction => {
        vi.useFakeTimers();
        try {
            const socket = new SparrowWebSocket("ws://example.test", null as any);
            const ws: any = {send: vi.fn(), close: vi.fn()};
            (socket as any).ws = ws;
            socket.handshakeSuccess = vi.fn();
            socket.heartbeatMessage = () => Protocol.ping().toBytes();
            socket.monitorStatus = () => [];
            (socket as any)._onMsg();
            await ws.onmessage({data: JSON.stringify({code: "0", instruction})});
            expect(socket.handshakeSuccess).toHaveBeenCalledOnce();
            vi.advanceTimersByTime(socket.heartTime);
            expect(ws.send).toHaveBeenCalledWith(Uint8Array.of(30));
            socket.close();
        } finally {
            vi.useRealTimers();
        }
    });

    it("keeps the chat connection alive with binary PONGs and sends PING before ten seconds", async () => {
        vi.useFakeTimers();
        try {
            vi.spyOn(SparrowWebSocket.prototype, "connect").mockImplementation(() => {});
            const b = new MessageBroker(null, vi.fn(), {userId: "28", category: 1} as any);
            const socket = b.webSocket;
            const ws: any = {send: vi.fn(), close: vi.fn()};
            (socket as any).ws = ws;
            socket.handshakeSuccess = vi.fn();
            const reconnect = vi.spyOn(socket, "reconnectWebSocket");
            (socket as any)._onMsg();
            await ws.onmessage({data: JSON.stringify({code: "0", instruction: "AUTH_BIND"})});
            expect(socket.heartTime).toBe(5000);
            for (let cycle = 0; cycle < 6; cycle++) {
                vi.advanceTimersByTime(5000);
                expect(ws.send).toHaveBeenCalledWith(Uint8Array.of(30));
                await ws.onmessage({data: new Blob([Uint8Array.of(40)])});
                expect(socket.getHeartStatus()).toBe(SparrowWebSocket.ACTIVE_STATUS);
            }
            expect(reconnect).not.toHaveBeenCalled();
            socket.close();
            const sent = ws.send.mock.calls.length;
            vi.advanceTimersByTime(60000);
            expect(ws.send).toHaveBeenCalledTimes(sent);
            expect(reconnect).not.toHaveBeenCalled();
            expect(socket.getHeartStatus()).toBe(SparrowWebSocket.INACTIVE_STATUS);
        } finally {
            vi.useRealTimers();
        }
    });

    it("uses the configured interval for missing-PONG timeout", () => {
        vi.useFakeTimers();
        try {
            const socket = new SparrowWebSocket("ws://example.test", null as any);
            (socket as any).ws = {send: vi.fn(), close: vi.fn()};
            socket.heartTime = 5000;
            socket.monitorStatus = () => [];
            const reconnect = vi.spyOn(socket, "reconnectWebSocket").mockImplementation(() => {});
            socket.startHeartBeat();
            vi.advanceTimersByTime(20000);
            expect(reconnect).toHaveBeenCalledOnce();
            socket.close();
        } finally {
            vi.useRealTimers();
        }
    });

    it("stops heartbeat and retry timers when explicitly closed", () => {
        vi.useFakeTimers();
        try {
            const socket = new SparrowWebSocket("ws://example.test", null as any);
            const ws = {send: vi.fn(), close: vi.fn()};
            (socket as any).ws = ws;
            socket.monitorStatus = () => [];
            const reconnect = vi.spyOn(socket, "reconnectWebSocket").mockImplementation(() => {});
            const retry = vi.fn();
            (socket as any).reconnectionTimer = setInterval(retry, 15000);
            socket.startHeartBeat();
            (socket as any).reconnectionTimer = setInterval(retry, 15000);
            socket.close();
            vi.advanceTimersByTime(60000);
            expect(ws.close).toHaveBeenCalledOnce();
            expect(ws.send).not.toHaveBeenCalled();
            expect(retry).not.toHaveBeenCalled();
            expect(reconnect).not.toHaveBeenCalled();
        } finally {
            vi.useRealTimers();
        }
    });

    it("sends configured binary heartbeat and status messages", () => {
        vi.useFakeTimers();
        try {
            const socket = new SparrowWebSocket("ws://example.test", null as any);
            const send = vi.fn();
            (socket as any).ws = {send};
            socket.heartbeatMessage = () => Protocol.ping().toBytes();
            socket.statusMonitorMessage = () => Protocol.fetchUserStatus().toBytes();
            socket.monitorStatus = () => [];
            socket.startHeartBeat();
            vi.advanceTimersByTime(socket.heartTime * 2);
            expect(send).toHaveBeenCalledWith(Uint8Array.of(30));
            expect(send).toHaveBeenCalledWith(Uint8Array.of(45));
            socket.receiveHeartbeat();
            expect(socket.getHeartStatus()).toBe(SparrowWebSocket.ACTIVE_STATUS);
            socket.stopHeartBeat();
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
        await ws.onmessage({data: Uint8Array.of(40).buffer});
        await ws.onmessage({data: new Blob([Uint8Array.of(40)])});
        expect(socket.onMsgCallback).toHaveBeenCalledTimes(2);
        expect(socket.onMsgCallback).toHaveBeenNthCalledWith(1, Uint8Array.of(40).buffer);
    });
});
