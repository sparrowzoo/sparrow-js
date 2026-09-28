import {afterEach, beforeEach, describe, expect, it, vi} from "vitest";
import PostMessageRpc, {type PostMessageRpcOptions, type RpcEvent, type RpcResponse} from "../../src/common/lib/rpc/PostMessageRpc";

const origin = "https://passport.example.test";
const url = origin + "/cros-storage/?https%3A%2F%2Fwww.example.test";
const clients: PostMessageRpc[] = [];
function client(options: Partial<PostMessageRpcOptions> = {}) {
    const instance = new PostMessageRpc({url, ...options});
    clients.push(instance);
    return instance;
}
function frame() {
    return document.getElementById("cros-storage-iframe") as HTMLIFrameElement;
}
function message(data: unknown, source: MessageEventSource | null = frame().contentWindow, senderOrigin = origin) {
    window.dispatchEvent(new MessageEvent("message", {data, source, origin: senderOrigin}));
}
function captureSend() {
    // jsdom has no remote document; only transport is intercepted.
    return vi.spyOn(frame().contentWindow!, "postMessage").mockImplementation(() => {});
}
function listenerCounts() {
    const messages = new Set<unknown>();
    const loads = new Set<unknown>();
    const addWindow = window.addEventListener;
    const removeWindow = window.removeEventListener;
    const addFrame = HTMLIFrameElement.prototype.addEventListener;
    const removeFrame = HTMLIFrameElement.prototype.removeEventListener;
    vi.spyOn(window, "addEventListener").mockImplementation((...args) => {
        if (args[0] === "message") messages.add(args[1]);
        addWindow.apply(window, args);
    });
    vi.spyOn(window, "removeEventListener").mockImplementation((...args) => {
        if (args[0] === "message") messages.delete(args[1]);
        removeWindow.apply(window, args);
    });
    vi.spyOn(HTMLIFrameElement.prototype, "addEventListener").mockImplementation(function (...args) {
        if (args[0] === "load") loads.add(args[1]);
        addFrame.apply(this, args);
    });
    vi.spyOn(HTMLIFrameElement.prototype, "removeEventListener").mockImplementation(function (...args) {
        if (args[0] === "load") loads.delete(args[1]);
        removeFrame.apply(this, args);
    });
    return () => ({messages: messages.size, loads: loads.size});
}
beforeEach(() => { vi.useFakeTimers(); });
afterEach(() => {
    clients.forEach((instance) => instance.destroy());
    clients.length = 0;
    document.body.replaceChildren();
    vi.useRealTimers();
    vi.restoreAllMocks();
});

describe("@S05 @S06 PostMessageRpc", () => {
    it.each(["different instances", "the same instance"])("releases listeners after consecutive calls from %s without destroy", async (mode) => {
        const counts = listenerCounts();
        const events: RpcEvent[] = [];
        const options = {onEvent: (event: RpcEvent) => { events.push(event); }};
        const reusable = mode === "the same instance" ? client(options) : undefined;
        for (let index = 0; index < 5; index++) {
            const rpc = reusable ?? client(options);
            const requestId = "sequential-" + index;
            const result = rpc.request({requestId});
            if (index === 0) {
                captureSend();
                message({command: "init"});
            }
            expect(counts()).toEqual({messages: 1, loads: 1});
            message({requestId, value: index});
            await expect(result).resolves.toEqual({requestId, value: index});
            expect(counts()).toEqual({messages: 0, loads: 0});
            const eventCount = events.length;
            frame().dispatchEvent(new Event("load"));
            message({command: "init"});
            expect(events).toHaveLength(eventCount);
        }
        expect(document.querySelectorAll("iframe")).toHaveLength(1);
        expect(vi.getTimerCount()).toBe(0);
    });

    it("keeps its listeners until the last concurrent request completes", async () => {
        const counts = listenerCounts();
        const rpc = client();
        const first = rpc.request({requestId: "concurrent-1"});
        const second = rpc.request({requestId: "concurrent-2"});
        captureSend();
        message({command: "init"});
        message({requestId: "concurrent-1"});
        await first;
        expect(counts()).toEqual({messages: 1, loads: 1});
        message({requestId: "concurrent-2"});
        await second;
        expect(counts()).toEqual({messages: 0, loads: 0});
    });

    it("releases a timed-out owner's listeners and restarts the same instance's unready frame", async () => {
        const counts = listenerCounts();
        const rpc = client({timeoutMs: 50});
        const first = rpc.request({requestId: "timeout-owner"});
        const rejection = expect(first).rejects.toThrow(/timed out/i);
        await vi.advanceTimersByTimeAsync(50);
        await rejection;
        expect(counts()).toEqual({messages: 0, loads: 0});
        message({command: "init"}); // A detached owner must not capture a late handshake.
        const reload = vi.spyOn(frame(), "src", "set");
        const second = rpc.request({requestId: "retry-owner"});
        void second.catch(() => {});
        expect(reload).toHaveBeenCalledTimes(1);
        const send = captureSend();
        message({command: "init"});
        expect(send).toHaveBeenCalledTimes(1);
        message({requestId: "retry-owner"});
        await second;
        expect(counts()).toEqual({messages: 0, loads: 0});
    });

    it("preserves a new request started synchronously by a completion observer", async () => {
        const counts = listenerCounts();
        let next: Promise<RpcResponse> | undefined;
        const rpc = client({onEvent: (event) => {
            if (event.type === "response-received" && event.requestId === "reentrant-first") {
                next = rpc.request({requestId: "reentrant-second"});
            }
        }});
        const first = rpc.request({requestId: "reentrant-first"});
        const send = captureSend();
        message({command: "init"});
        message({requestId: "reentrant-first"});
        await first;
        expect(next).toBeDefined();
        expect(send).toHaveBeenCalledTimes(2);
        expect(counts()).toEqual({messages: 1, loads: 1});
        message({requestId: "reentrant-second"});
        await expect(next).resolves.toEqual({requestId: "reentrant-second"});
        expect(counts()).toEqual({messages: 0, loads: 0});
    });

    it.each(["iframe-created", "request-created", "iframe-ready"])("handles synchronous destroy from a %s observer", async (type) => {
        const counts = listenerCounts();
        const rpc = client({onEvent: (event) => { if (event.type === type) rpc.destroy(); }});
        const result = rpc.request({requestId: "observer-destroy"});
        const rejection = expect(result).rejects.toThrow(/destroy/i);
        const send = captureSend();
        message({command: "init"});
        await rejection;
        expect(counts()).toEqual({messages: 0, loads: 0});
        expect(send).not.toHaveBeenCalled();
        expect(vi.getTimerCount()).toBe(0);
    });

    it("creates its iframe only when an RPC is requested", async () => {
        const rpc = client();
        expect(document.querySelector("iframe")).toBeNull();
        const result = rpc.request({requestId: "lazy"});
        const rejection = expect(result).rejects.toThrow(/destroy/i);
        expect(frame().src).toBe(url);
        expect(frame().style.display).toBe("none");
        rpc.destroy();
        await rejection;
    });

    it("requires origin and iframe source for INIT and a sent request ID for responses", async () => {
        const rpc = client();
        const request = {requestId: "read-1", operation: "read"};
        const result = rpc.request<RpcResponse & {payload: string}>(request);
        const send = captureSend();
        const settled = vi.fn();
        void result.then(settled, () => {});
        message({command: "init"}, window);
        message({command: "init"}, frame().contentWindow, "https://other.example.test");
        message({requestId: "read-1", payload: "premature"});
        await Promise.resolve();
        expect(send).not.toHaveBeenCalled();
        expect(settled).not.toHaveBeenCalled();
        message({command: "init"});
        expect(send).toHaveBeenCalledTimes(1);
        expect(send).toHaveBeenCalledWith(request, origin);
        message({requestId: "read-1", payload: "forged"}, window);
        message({requestId: "read-1", payload: "forged"}, frame().contentWindow, "https://other.example.test");
        message({requestId: "other", payload: "wrong-id"});
        message(null);
        await Promise.resolve();
        expect(settled).not.toHaveBeenCalled();
        message({requestId: "read-1", payload: "actual"});
        await expect(result).resolves.toEqual({requestId: "read-1", payload: "actual"});
        expect(vi.getTimerCount()).toBe(0);
    });

    it("returns complete application error responses without logging payloads", async () => {
        const events: RpcEvent[] = [];
        const rpc = client({onEvent: (event) => { events.push(event); }, isReady: (data) => (data as {ready?:boolean})?.ready === true});
        const request = {requestId: "custom", secret: "request-secret"};
        const result = rpc.request(request);
        const send = captureSend();
        message({command: "init"});
        expect(send).not.toHaveBeenCalled();
        message({ready: true});
        message({requestId: "custom", error: "response-secret", details: {arbitrary: true}});
        await expect(result).resolves.toEqual({requestId: "custom", error: "response-secret", details: {arbitrary: true}});
        expect(JSON.stringify(events)).not.toMatch(/request-secret|response-secret/);
    });

    it("times out at 10 seconds while waiting for INIT and ignores late ready messages", async () => {
        const result = client().request({requestId: "never-ready"});
        const rejection = expect(result).rejects.toThrow(/timed out/i);
        const send = captureSend();
        await vi.advanceTimersByTimeAsync(9999);
        expect(send).not.toHaveBeenCalled();
        await vi.advanceTimersByTimeAsync(1);
        await rejection;
        message({command: "init"});
        expect(send).not.toHaveBeenCalled();
        expect(vi.getTimerCount()).toBe(0);
    });

    it("does not reset the deadline when INIT arrives near the timeout", async () => {
        const result = client().request({requestId: "slow-ready"});
        const rejection = expect(result).rejects.toThrow(/timed out/i);
        const send = captureSend();
        await vi.advanceTimersByTimeAsync(9000);
        message({command: "init"});
        expect(send).toHaveBeenCalledTimes(1);
        await vi.advanceTimersByTimeAsync(1000);
        await rejection;
        expect(vi.getTimerCount()).toBe(0);
    });

    it("retains verified INIT when the iframe load event arrives later", async () => {
        const rpc = client();
        const first = rpc.request({requestId: "before-load"});
        const send = captureSend();
        message({command: "init"});
        message({requestId: "before-load"});
        await first;
        frame().dispatchEvent(new Event("load"));
        const second = rpc.request({requestId: "after-load"});
        void second.catch(() => {});
        expect(send).toHaveBeenCalledTimes(2);
        message({requestId: "after-load"});
        await expect(second).resolves.toEqual({requestId: "after-load"});
    });

    it("shares the target iframe but destroy only cancels its own requests", async () => {
        const first = client();
        const firstResult = first.request({requestId: "first"});
        const firstRejection = expect(firstResult).rejects.toThrow(/destroy/i);
        const sharedFrame = frame();
        const send = captureSend();
        const second = client();
        const secondResult = second.request({requestId: "second"});
        expect(frame()).toBe(sharedFrame);
        message({command: "init"});
        expect(send).toHaveBeenCalledTimes(2);
        first.destroy();
        await firstRejection;
        expect(frame()).toBe(sharedFrame);
        message({requestId: "second", value: "survivor"});
        await expect(secondResult).resolves.toEqual({requestId: "second", value: "survivor"});
        second.destroy();
        const thirdResult = client().request({requestId: "third"});
        expect(send).toHaveBeenCalledTimes(3);
        message({requestId: "third"});
        await expect(thirdResult).resolves.toEqual({requestId: "third"});
    });

    it("reloads an unready orphan so reconnect can receive INIT again", async () => {
        const first = client();
        const abandoned = first.request({requestId: "abandoned"});
        const rejection = expect(abandoned).rejects.toThrow(/destroy/i);
        const sharedFrame = frame();
        const oldWindow = sharedFrame.contentWindow;
        first.destroy();
        await rejection;
        message({command: "init"}); // No owner remains to observe this late handshake.
        const reload = vi.spyOn(sharedFrame, "src", "set");
        const next = client().request({requestId: "reconnected"});
        void next.catch(() => {});
        expect(frame()).toBe(sharedFrame);
        expect(reload).toHaveBeenCalledTimes(1);
        expect(reload).toHaveBeenCalledWith(url);
        const send = captureSend();
        message({requestId: "abandoned", value: "late"}, oldWindow);
        message({command: "init"});
        expect(send).toHaveBeenCalledTimes(1);
        message({requestId: "reconnected", value: "current"});
        await expect(next).resolves.toEqual({requestId: "reconnected", value: "current"});
    });

    it("rejects a conflicting target without rewriting another client's iframe", async () => {
        const normal = client();
        const active = normal.request({requestId: "normal"});
        const rejection = expect(active).rejects.toThrow(/destroy/i);
        const sharedFrame = frame();
        await expect(client({url: origin + "/cros-storage-debug/", visible: true}).request({requestId: "debug"})).rejects.toThrow(/target|URL/i);
        expect(frame()).toBe(sharedFrame);
        expect(frame().src).toBe(url);
        expect(frame().style.display).toBe("none");
        normal.destroy();
        await rejection;
    });

    it("rejects a non-iframe ID conflict without replacing the element", async () => {
        const element = document.createElement("div");
        element.id = "cros-storage-iframe";
        document.body.appendChild(element);
        await expect(client().request({requestId: "conflict"})).rejects.toThrow(/iframe/i);
        expect(document.getElementById(element.id)).toBe(element);
    });

    it("does not trust an existing iframe's unverified loaded attribute", async () => {
        const existing = document.createElement("iframe");
        existing.id = "cros-storage-iframe";
        existing.src = url;
        existing.setAttribute("loaded", "true");
        document.body.appendChild(existing);
        const result = client().request({requestId: "verify-existing"});
        const send = captureSend();
        expect(send).not.toHaveBeenCalled();
        message({command: "init"});
        expect(send).toHaveBeenCalledTimes(1);
        message({requestId: "verify-existing"});
        await expect(result).resolves.toEqual({requestId: "verify-existing"});
    });

    it("removes listeners on destroy and refuses later requests without creating a frame", async () => {
        const rpc = client();
        rpc.destroy();
        await expect(rpc.request({requestId: "after-destroy"})).rejects.toThrow(/destroy/i);
        expect(document.querySelector("iframe")).toBeNull();
        const events: RpcEvent[] = [];
        const active = client({onEvent: (event) => { events.push(event); }});
        const pending = active.request({requestId: "cancel"});
        const rejection = expect(pending).rejects.toThrow(/destroy/i);
        const send = captureSend();
        active.destroy();
        await rejection;
        const count = events.length;
        message({command: "init"});
        frame().dispatchEvent(new Event("load"));
        expect(events).toHaveLength(count);
        expect(send).not.toHaveBeenCalled();
        expect(vi.getTimerCount()).toBe(0);
    });

    it.each(["throw", "reject"])("isolates observer %s failures", async (mode) => {
        const rpc = client({onEvent: () => {
            if (mode === "throw") throw new Error("observer failure");
            return Promise.reject(new Error("observer failure"));
        }});
        const result = rpc.request({requestId: mode});
        captureSend();
        message({command: "init"});
        message({requestId: mode});
        await expect(result).resolves.toEqual({requestId: mode});
    });

    it("cleans up a failed postMessage and protects an existing duplicate request", async () => {
        const counts = listenerCounts();
        const rpc = client();
        const result = rpc.request({requestId: "duplicate"});
        const rejection = expect(result).rejects.toThrow("Cannot clone payload");
        const send = captureSend().mockImplementation(() => { throw new Error("Cannot clone payload"); });
        await expect(rpc.request({requestId: "duplicate"})).rejects.toThrow(/duplicate/i);
        message({command: "init"});
        await rejection;
        expect(send).toHaveBeenCalledTimes(1);
        expect(vi.getTimerCount()).toBe(0);
        expect(counts()).toEqual({messages: 0, loads: 0});
    });
});
