"use client";

export interface RpcResponse {
    requestId: string;
    error?: string;
}

export type RpcEventType =
    | "iframe-created" | "iframe-reused" | "iframe-load" | "iframe-ready"
    | "request-created" | "request-waiting" | "request-sent" | "response-received"
    | "request-error" | "request-timeout" | "request-cancelled" | "destroy";

/** Transport metadata only: no request, response, or remote error payload. */
export interface RpcEvent {
    readonly type: RpcEventType;
    readonly timestamp: number;
    readonly origin: string;
    readonly requestId?: string;
    readonly loaded?: boolean;
}

export interface PostMessageRpcOptions {
    url: string;
    frameId?: string;
    timeoutMs?: number;
    isReady?: (data: unknown) => boolean;
    onEvent?: (event: RpcEvent) => void | Promise<void>;
    visible?: boolean;
}

interface FrameState {
    url: string;
    ready: boolean;
    owners: number;
}

interface PendingRequest {
    request: {requestId: string};
    sent: boolean;
    timer: ReturnType<typeof setTimeout>;
    resolve: (response: RpcResponse) => void;
    reject: (error: Error) => void;
}

// Only verified readiness is shared. A DOM loaded attribute is not evidence of INIT.
const frameStates = new WeakMap<HTMLIFrameElement, FrameState>();
const isObject = (value: unknown): value is Record<string, unknown> => value !== null && typeof value === "object";

export class PostMessageRpc {
    private frame?: HTMLIFrameElement;
    private frameState?: FrameState;
    private origin = "";
    private destroyed = false;
    private readonly pending = new Map<string, PendingRequest>();
    private readonly timeoutMs: number;

    constructor(private readonly options: PostMessageRpcOptions) {
        this.timeoutMs = options.timeoutMs ?? 10000;
        if (!Number.isFinite(this.timeoutMs) || this.timeoutMs <= 0) {
            throw new Error("RPC timeout must be positive");
        }
    }

    /** Application error responses are returned intact for the caller to interpret. */
    request<T extends RpcResponse>(request: {requestId: string}): Promise<T> {
        if (this.destroyed) return Promise.reject(new Error("RPC client destroyed"));
        if (!request || typeof request.requestId !== "string" || !request.requestId.trim()) {
            return Promise.reject(new Error("RPC requestId is required"));
        }
        if (this.pending.has(request.requestId)) return Promise.reject(new Error("Duplicate RPC requestId"));
        return new Promise<T>((resolve, reject) => {
            const entry: PendingRequest = {
                request, sent: false,
                resolve: (response) => resolve(response as T), reject,
                timer: setTimeout(() => {
                    this.fail(request.requestId, new Error("RPC request timed out"), "request-timeout");
                }, this.timeoutMs),
            };
            this.pending.set(request.requestId, entry);
            try {
                this.ensureFrame();
                if (this.pending.get(request.requestId) !== entry) return;
                this.emit("request-created", {requestId: request.requestId});
                if (this.pending.get(request.requestId) !== entry) return;
                if (this.frameState?.ready) this.send(entry);
                else this.emit("request-waiting", {requestId: request.requestId});
            } catch (error) {
                this.fail(request.requestId, error instanceof Error ? error : new Error("RPC request failed"), "request-error");
            }
        });
    }

    destroy(): void {
        if (this.destroyed) return;
        this.destroyed = true;
        for (const requestId of this.pending.keys()) {
            this.fail(requestId, new Error("RPC client destroyed"), "request-cancelled");
        }
        this.detachWhenIdle();
        // Other instances may still use this iframe and its verified readiness.
        this.emit("destroy");
    }

    private detachWhenIdle(): void {
        if (this.pending.size || !this.frame) return;
        window.removeEventListener("message", this.handleMessage);
        this.frame.removeEventListener("load", this.handleLoad);
        this.frameState!.owners--;
        // The shared iframe and verified readiness outlive an idle client.
        // Clear this attachment so the next request can acquire its own owner.
        this.frame = undefined;
        this.frameState = undefined;
    }

    private ensureFrame(): void {
        if (typeof window === "undefined" || typeof document === "undefined") {
            throw new Error("RPC requires a browser document");
        }
        const target = new URL(this.options.url, window.location.href);
        if (!["http:", "https:"].includes(target.protocol) || target.username || target.password) {
            throw new Error("RPC URL must be an HTTP(S) target without credentials");
        }
        if (this.frame) {
            if (this.frame.src !== target.href) throw new Error("RPC iframe target URL changed");
            return;
        }
        const id = this.options.frameId ?? "cros-storage-iframe";
        const existing = document.getElementById(id);
        if (existing && !(existing instanceof HTMLIFrameElement)) {
            throw new Error("RPC frame ID belongs to a non-iframe element");
        }
        const frame = (existing as HTMLIFrameElement | null) ?? document.createElement("iframe");
        const previous = frameStates.get(frame);
        if (existing && (frame.src !== target.href || (previous && previous.url !== target.href))) {
            throw new Error("RPC iframe target URL conflicts with an existing client");
        }
        if (!existing) {
            frame.id = id;
            frame.src = target.href;
            frame.title = "RPC transport";
            frame.style.display = this.options.visible ? "block" : "none";
            if (this.options.visible) {
                Object.assign(frame.style, {width: "100%", height: "320px", border: "0"});
            }
        }
        this.origin = target.origin;
        this.frame = frame;
        const restart = !!previous && previous.owners === 0 && !previous.ready;
        this.frameState = previous ?? {url: target.href, ready: false, owners: 0};
        this.frameState.owners++;
        frameStates.set(frame, this.frameState);
        window.addEventListener("message", this.handleMessage);
        frame.addEventListener("load", this.handleLoad);
        if (!existing) document.body.appendChild(frame);
        else if (restart) {
            // Last owner may have detached before INIT. Restart only our unowned,
            // unready target, never a live client's frame or an external frame.
            frame.removeAttribute("loaded");
            frame.src = target.href;
        }
        this.emit(existing ? "iframe-reused" : "iframe-created", {loaded: this.frameState.ready});
    }

    private readonly handleLoad = (): void => {
        // A child can announce INIT before its images finish loading.
        // The native load event cannot invalidate that verified handshake.
        this.emit("iframe-load");
    };

    private readonly handleMessage = (event: MessageEvent<unknown>): void => {
        if (this.destroyed || !this.frame || event.origin !== this.origin || event.source !== this.frame.contentWindow) return;
        let ready = false;
        try {
            ready = this.options.isReady
                ? this.options.isReady(event.data)
                : isObject(event.data) && event.data.command === "init";
        } catch {
            // An unrecognized readiness payload must not disrupt other requests.
        }
        if (ready) {
            this.frameState!.ready = true;
            this.frame!.setAttribute("loaded", "true");
            this.emit("iframe-ready", {loaded: true});
            for (const entry of this.pending.values()) this.send(entry);
            return;
        }
        if (!isObject(event.data) || typeof event.data.requestId !== "string") return;
        const entry = this.pending.get(event.data.requestId);
        if (!entry?.sent) return;
        this.pending.delete(event.data.requestId);
        clearTimeout(entry.timer);
        this.detachWhenIdle();
        entry.resolve(event.data as unknown as RpcResponse);
        this.emit("response-received", {requestId: event.data.requestId});
    };

    private send(entry: PendingRequest): void {
        if (this.destroyed || entry.sent || this.pending.get(entry.request.requestId) !== entry) return;
        try {
            const target = this.frame?.contentWindow;
            if (!target) throw new Error("RPC iframe window is unavailable");
            entry.sent = true;
            target.postMessage(entry.request, this.origin);
            this.emit("request-sent", {requestId: entry.request.requestId});
        } catch (error) {
            this.fail(entry.request.requestId, error instanceof Error ? error : new Error("RPC send failed"), "request-error");
        }
    }

    private fail(requestId: string, error: Error, type: RpcEventType): void {
        const entry = this.pending.get(requestId);
        if (!entry) return;
        this.pending.delete(requestId);
        clearTimeout(entry.timer);
        this.detachWhenIdle();
        entry.reject(error);
        this.emit(type, {requestId});
    }

    private emit(type: RpcEventType, detail: Pick<RpcEvent, "requestId" | "loaded"> = {}): void {
        try {
            const result = this.options.onEvent?.({type, timestamp: Date.now(), origin: this.origin, ...detail});
            if (result) Promise.resolve(result).catch(() => {});
        } catch {
            // Diagnostics cannot change RPC success, failure, or cleanup.
        }
    }
}

export default PostMessageRpc;
