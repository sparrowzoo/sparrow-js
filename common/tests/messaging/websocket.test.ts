import {afterEach, beforeEach, describe, expect, it, vi} from "vitest";
import SparrowWebSocket from "@/common/lib/SparrowWebSocket";

const storage = vi.hoisted(() => ({getToken: vi.fn(), removeToken: vi.fn()}));
vi.mock("@/common/lib/CrosStorage", () => ({default: {getCrosStorage: () => storage}}));
vi.mock("react-hot-toast", () => ({default: {error: vi.fn()}}));

class Socket {
    static instances: Socket[] = [];
    onopen: ((event: unknown) => void) | null = null;
    onclose: ((event: {wasClean: boolean}) => void) | null = null;
    onerror: ((event: unknown) => void) | null = null;
    onmessage: ((event: {data: unknown}) => Promise<void>) | null = null;
    sent: unknown[] = [];
    readyState = 1;
    constructor(public url: string, public protocols: string[]) { Socket.instances.push(this); }
    send(data: unknown) { this.sent.push(data); }
    close() { this.readyState = 3; this.onclose?.({wasClean: true}); }
    async receive(data: unknown) { await this.onmessage?.({data}); }
}

describe("shared socket lifecycle", () => {
    let client: SparrowWebSocket;
    beforeEach(() => {
        vi.useFakeTimers();
        Socket.instances = [];
        storage.getToken.mockReset().mockResolvedValue("token");
        storage.removeToken.mockReset().mockResolvedValue(null);
        vi.stubGlobal("WebSocket", Socket);
        vi.spyOn(document, "hasFocus").mockReturnValue(true);
        client = new SparrowWebSocket("ws://example.test/ws", null);
        client.handshakeSuccess = vi.fn();
        client.redirectLogin = vi.fn();
    });
    afterEach(() => { client.close(); vi.useRealTimers(); vi.unstubAllGlobals(); });
    async function connect() {
        client.connect();
        await Promise.resolve();
        return Socket.instances.at(-1)!;
    }

    it("does not open a connection when token loading completes after close", async () => {
        let resolve!: (token: string) => void;
        storage.getToken.mockReturnValue(new Promise<string>(done => { resolve = done; }));
        client.connect();
        client.close();
        resolve("late-token");
        await Promise.resolve();
        expect(Socket.instances).toHaveLength(0);
    });

    it("notifies connection transitions and reconnects after a remote close", async () => {
        client.connectingCallback = vi.fn();
        client.closeCallback = vi.fn();
        const socket = await connect();
        socket.close();
        await Promise.resolve();
        expect(client.closeCallback).toHaveBeenCalledTimes(1);
        expect(client.connectingCallback).toHaveBeenCalledTimes(2);
        expect(Socket.instances).toHaveLength(2);
    });

    it("uses the current document focus when a connection starts without a new focus event", async () => {
        await connect();
        window.dispatchEvent(new FocusEvent("blur"));
        client.close();
        const current = await connect();
        current.onerror?.(new Event("error"));
        await Promise.resolve();
        Socket.instances.at(-1)!.onerror?.(new Event("error"));
        await Promise.resolve();
        expect(Socket.instances).toHaveLength(3);
        await vi.advanceTimersByTimeAsync(15000);
        expect(Socket.instances).toHaveLength(4);
    });

    it("pauses timed retries while unfocused and resumes them after focus returns", async () => {
        vi.mocked(document.hasFocus).mockReturnValue(false);
        const first = await connect();
        first.onerror?.(new Event("error"));
        await Promise.resolve();
        Socket.instances.at(-1)!.onerror?.(new Event("error"));
        await Promise.resolve();
        await vi.advanceTimersByTimeAsync(30000);
        expect(Socket.instances).toHaveLength(2);
        vi.mocked(document.hasFocus).mockReturnValue(true);
        window.dispatchEvent(new FocusEvent("focus"));
        await vi.advanceTimersByTimeAsync(15000);
        expect(Socket.instances).toHaveLength(3);
    });

    it("waits fifteen seconds between failures when the server remains unavailable", async () => {
        const first = await connect();
        window.dispatchEvent(new FocusEvent("focus"));
        first.onerror?.(new Event("error"));
        await Promise.resolve();
        expect(Socket.instances).toHaveLength(2);
        expect(vi.getTimerCount()).toBe(1);
        for (let attempt = 2; attempt <= 4; attempt++) {
            // A failed retry can happen well after the previous timer fired.
            await vi.advanceTimersByTimeAsync(2000);
            Socket.instances.at(-1)!.onerror?.(new Event("error"));
            await Promise.resolve();
            expect(Socket.instances).toHaveLength(attempt);
            expect(vi.getTimerCount()).toBe(1);
            await vi.advanceTimersByTimeAsync(14999);
            expect(Socket.instances).toHaveLength(attempt);
            await vi.advanceTimersByTimeAsync(1);
            expect(Socket.instances).toHaveLength(attempt + 1);
        }
    });

    it("does not create a second retry for the close event following an error", async () => {
        client.errorCallback = vi.fn();
        client.closeCallback = vi.fn();
        const first = await connect();
        window.dispatchEvent(new FocusEvent("focus"));
        const queuedClose = first.onclose!;
        first.onerror?.(new Event("error"));
        queuedClose({wasClean: false});
        await Promise.resolve();
        expect(Socket.instances).toHaveLength(2);
        expect(client.errorCallback).toHaveBeenCalledOnce();
        expect(client.closeCallback).not.toHaveBeenCalled();
        expect(vi.getTimerCount()).toBe(1);
        const failedRetry = Socket.instances.at(-1)!;
        const retryClose = failedRetry.onclose!;
        failedRetry.onerror?.(new Event("error"));
        retryClose({wasClean: false});
        await Promise.resolve();
        expect(Socket.instances).toHaveLength(2);
        expect(vi.getTimerCount()).toBe(1);
        await vi.advanceTimersByTimeAsync(15000);
        expect(Socket.instances).toHaveLength(3);
    });

    it("stops a scheduled retry when the consumer explicitly closes", async () => {
        const first = await connect();
        window.dispatchEvent(new FocusEvent("focus"));
        first.close();
        await Promise.resolve();
        const retry = Socket.instances.at(-1)!;
        retry.onerror?.(new Event("error"));
        await Promise.resolve();
        const count = Socket.instances.length;
        client.close();
        expect(vi.getTimerCount()).toBe(0);
        await vi.advanceTimersByTimeAsync(60000);
        expect(Socket.instances).toHaveLength(count);
    });

    it("does not open overlapping connections while a retry is connecting", async () => {
        const first = await connect();
        window.dispatchEvent(new FocusEvent("focus"));
        first.close();
        await Promise.resolve();
        await vi.advanceTimersByTimeAsync(45000);
        expect(Socket.instances).toHaveLength(2);
        expect(client.getConnectionStatus()).toBe(SparrowWebSocket.CONNECTING_STATUS);
    });

    it("preserves the host page's window handlers", async () => {
        const previous = {focus: window.onfocus, blur: window.onblur, click: window.onclick};
        const focus = vi.fn(), blur = vi.fn(), click = vi.fn();
        window.onfocus = focus;
        window.onblur = blur;
        window.onclick = click;
        try {
            await connect();
            window.dispatchEvent(new FocusEvent("blur"));
            window.dispatchEvent(new FocusEvent("focus"));
            window.dispatchEvent(new MouseEvent("click"));
            expect(window.onfocus).toBe(focus);
            expect(window.onblur).toBe(blur);
            expect(window.onclick).toBe(click);
        } finally {
            window.onfocus = previous.focus;
            window.onblur = previous.blur;
            window.onclick = previous.click;
        }
    });

    it("keeps focus state per instance and retains listeners throughout retry waits", async () => {
        vi.mocked(document.hasFocus).mockReturnValue(false);
        const first = await connect();
        first.onerror?.(new Event("error"));
        await Promise.resolve();
        Socket.instances.at(-1)!.onerror?.(new Event("error"));
        await Promise.resolve();
        // Initializing another instance must not change this instance's focus state.
        vi.mocked(document.hasFocus).mockReturnValue(true);
        const other = new SparrowWebSocket("ws://other.test/ws", null);
        try {
            other.connect();
            await Promise.resolve();
            expect(Socket.instances).toHaveLength(3);
            await vi.advanceTimersByTimeAsync(15000);
            expect(Socket.instances).toHaveLength(3);
            other.close();
            window.dispatchEvent(new FocusEvent("focus"));
            await vi.advanceTimersByTimeAsync(15000);
            expect(Socket.instances).toHaveLength(4);
            expect(Socket.instances.at(-1)!.url).toBe("ws://example.test/ws");
        } finally {
            other.close();
        }
    });

    it("removes its own window listeners when closed, even before token loading finishes", async () => {
        storage.getToken.mockReturnValue(new Promise(() => {}));
        const add = vi.spyOn(window, "addEventListener");
        const remove = vi.spyOn(window, "removeEventListener");
        client.connect();
        client.connect();
        const registrations = add.mock.calls.filter(([type]) => ["focus", "blur", "click"].includes(type));
        expect(registrations.map(([type]) => type).sort()).toEqual(["blur", "click", "focus"]);
        client.close();
        for (const [type, listener] of registrations) {
            expect(remove).toHaveBeenCalledWith(type, listener);
        }
        const removals = remove.mock.calls.length;
        client.close();
        expect(remove.mock.calls).toHaveLength(removals);
    });

    it("reports malformed text frames without an unhandled async rejection", async () => {
        client.invalidMessageCallback = vi.fn();
        const socket = await connect();
        await socket.receive("not json");
        expect(client.invalidMessageCallback).toHaveBeenCalledTimes(1);
    });

    it("keeps an authenticated connection idle without application heartbeat timers", async () => {
        const socket = await connect();
        await socket.receive(JSON.stringify({instruction: "AUTH_BIND", code: "0"}));
        expect(client.handshakeSuccess).toHaveBeenCalledTimes(1);
        await vi.advanceTimersByTimeAsync(60000);
        expect(socket.sent).toHaveLength(0);
        expect(Socket.instances).toHaveLength(1);
        expect(vi.getTimerCount()).toBe(0);
    });

    it("stops retrying after reauthentication without starting a heartbeat timer", async () => {
        const first = await connect();
        first.close();
        await Promise.resolve();
        const current = Socket.instances.at(-1)!;
        await current.receive(JSON.stringify({instruction: "AUTH_BIND", code: "0"}));
        expect(vi.getTimerCount()).toBe(0);
        await vi.advanceTimersByTimeAsync(60000);
        expect(Socket.instances).toHaveLength(2);
        expect(current.sent).toHaveLength(0);
    });

    it("discards an old socket's binary frame after its asynchronous conversion", async () => {
        client.onMsgCallback = vi.fn();
        const old = await connect();
        let resolve!: (value: ArrayBuffer) => void;
        const pending = old.receive({arrayBuffer: () => new Promise<ArrayBuffer>(done => { resolve = done; })});
        client.close();
        await connect();
        resolve(new Uint8Array([70]).buffer);
        await pending;
        expect(client.onMsgCallback).not.toHaveBeenCalled();
    });
});
