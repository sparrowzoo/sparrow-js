"use client";
import {CommandType, StorageRequest, StorageResponse, StorageType,} from "@/common/lib/protocol/CrosProtocol";
import {STORAGE_PROXY, TOKEN_KEY, TOKEN_STORAGE} from "@/common/lib/Env";
import {Utils} from "@/common/lib/Utils";
import UrlUtils from "@/common/lib/UrlUtils";
import LoginUser from "@/common/lib/protocol/LoginUser";

/** 只记录生命周期节点；request-waiting 每个请求只触发一次。 */
export type CrosStorageEventType =
    | "iframe-created"
    | "iframe-reused"
    | "iframe-load" // 原生 load 事件
    | "iframe-ready" // 收到通过原有校验的 INIT 消息
    | "request-created"
    | "request-waiting"
    | "request-sent"
    | "response-received" // 匹配到响应，代理返回的失败信息见 error
    | "request-error" // postMessage 发送异常
    | "request-timeout"
    | "request-cancelled"
    | "storage-operation"
    | "storage-error"
    | "destroy";

/** 调试事件包含相关存储值，不暴露可修改的请求/响应对象。 */
export interface CrosStorageEvent {
    readonly type: CrosStorageEventType;
    readonly timestamp: number;
    readonly crossOrigin: boolean;
    readonly iframeOrigin: string;
    readonly requestId?: string;
    readonly command?: CommandType;
    readonly storage?: StorageType;
    readonly key?: string;
    /** 请求的提交值或操作返回值；删除操作返回删除前的值。 */
    readonly value?: string | null;
    /** 创建/复用 iframe 时的 INIT 状态；原生 load 不代表代理已就绪。 */
    readonly loaded?: boolean;
    readonly error?: string;
}

/** 由上游实现输出；不等待回调，回调失败不影响存储操作。 */
export interface CrosStorageMonitor {
    onEvent(event: CrosStorageEvent): void | Promise<void>;
}

export default class CrosStorage {
    private iframe: HTMLIFrameElement;
    private iframeOrigin: string = "";
    private pending = new Set<() => void>();
    private cros: boolean = false;
    private stopMonitoringFrame?: () => void;

    private constructor(private readonly monitor?: CrosStorageMonitor) {
        if (typeof window === "undefined") {
            return;
        }
        if (!STORAGE_PROXY) throw new Error("NEXT_PUBLIC_STORAGE_PROXY is required");
        this.iframeOrigin = new URL(STORAGE_PROXY).origin;
        this.cros = UrlUtils.isCros(window.location.href, STORAGE_PROXY as string);
        if (!this.cros) {
            return;
        }
        this.initFrame();
    }

    public static getCrosStorage(monitor?: CrosStorageMonitor) {
        const crosStorage = new CrosStorage(monitor);
        return crosStorage;
    }

    public set(
        value: string,
        key: string = TOKEN_KEY,
        storage: StorageType = StorageType.AUTOMATIC
    ) {
        storage = this.getStorageType(storage);
        if (!this.cros) {
            try {
                const store =
                    storage === StorageType.LOCAL ? localStorage : sessionStorage;
                store.setItem(key, value);
            } catch (error) {
                this.emit({
                    type: "storage-error", command: CommandType.SET, storage, key, value,
                    error: error instanceof Error ? error.message : "Storage set failed"
                });
                throw error;
            }
            this.emit({type: "storage-operation", command: CommandType.SET, storage, key, value});
            return Promise.resolve(value);
        }

        return this.request({
            requestId: Utils.randomUUID(),
            command: CommandType.SET,
            storage: storage,
            key: key,
            value: value,
        });
    }

    public get(
        key: string = TOKEN_KEY,
        storage: StorageType = StorageType.AUTOMATIC
    ) {
        storage = this.getStorageType(storage);
        if (!this.cros) {
            let value: string | null;
            try {
                const store = storage === "local" ? localStorage : sessionStorage;
                value = store.getItem(key);
            } catch (error) {
                this.emit({
                    type: "storage-error", command: CommandType.GET, storage, key,
                    error: error instanceof Error ? error.message : "Storage get failed"
                });
                throw error;
            }
            this.emit({type: "storage-operation", command: CommandType.GET, storage, key, value});
            return Promise.resolve(value);
        }
        return this.request({
            requestId: Utils.randomUUID(),
            command: CommandType.GET,
            storage: storage,
            key,
        });
    }

    public remove(
        key: string = TOKEN_KEY,
        storage: StorageType = StorageType.AUTOMATIC
    ) {
        storage = this.getStorageType(storage);
        if (!this.cros) {
            let value: string | null;
            try {
                const store =
                    storage === StorageType.LOCAL ? localStorage : sessionStorage;
                value = store.getItem(key);
                store.removeItem(key);
            } catch (error) {
                this.emit({
                    type: "storage-error", command: CommandType.REMOVE, storage, key,
                    error: error instanceof Error ? error.message : "Storage remove failed"
                });
                throw error;
            }
            this.emit({type: "storage-operation", command: CommandType.REMOVE, storage, key, value});
            return Promise.resolve(value);
        }
        return this.request({
            requestId: Utils.randomUUID(),
            command: CommandType.REMOVE,
            storage: storage,
            key,
        });
    }

    destroy() {
        // The iframe is shared by all storage clients on this page.
        for (const cancel of this.pending) cancel();
        this.pending.clear();
        this.stopMonitoringFrame?.();
        this.emit({type: "destroy"});
    }

    public async getToken(
        storage: StorageType = StorageType.AUTOMATIC,
        generateVisitorToken: (() => Promise<string>) | null = null
    ) {
        const token = await this.get(TOKEN_KEY, storage);
        if (token || !generateVisitorToken) return token;
        const visitorToken = await generateVisitorToken();
        await this.setToken(visitorToken);
        return visitorToken;
    }

    public setToken(token: string, storage: StorageType = StorageType.AUTOMATIC) {
        return this.set(token, TOKEN_KEY, storage);
    }

    public removeToken(storage: StorageType = StorageType.AUTOMATIC) {
        return this.remove(TOKEN_KEY, storage);
    }

    //用户基本信息本地化
    public async locateToken(token: string | null = null) {
        if (token) {
            return LoginUser.localize(token);
        }
        //如果不是cros环境，则不进行本地化
        // Same-origin Passport must also display the current user or visitor.
        //这里可能存在之前本地化的token
        // const locationUser = sessionStorage.getItem(USER_INFO_KEY);
        // if (locationUser) {
        //   console.log("location user exist ", locationUser);
        //   return LoginUser.parseLoginJSON(locationUser);
        // }
        return await this.getToken().then((token) => {
            if (token) {
                return LoginUser.localize(token);
            }
            return LoginUser.visitor();
        });
    }

    private emit(event: Omit<CrosStorageEvent, "timestamp" | "crossOrigin" | "iframeOrigin">) {
        if (!this.monitor) return;
        try {
            const result = this.monitor.onEvent({
                ...event,
                timestamp: Date.now(),
                crossOrigin: this.cros,
                iframeOrigin: this.iframeOrigin,
            });
            if (result) result.catch(() => {
                // 监控输出失败不能产生未处理的异步异常。
            });
        } catch {
            // 监控输出失败不能打断原有流程。
        }
    }

    private initFrame() {
        let iframe = document.querySelector<HTMLIFrameElement>("#cros-storage-iframe");
        const reused = !!iframe;
        if (!iframe) {
            iframe = document.createElement("iframe");
            const storageProxy = this.monitor
                ? `${STORAGE_PROXY?.replace(/\/$/, "")}-debug/`
                : STORAGE_PROXY;
            iframe.src = `${storageProxy}?${encodeURIComponent(window.location.origin)}`;
            iframe.style.display = "none";
            iframe.id = "cros-storage-iframe";
            iframe.title = "Account storage";
            const frame = iframe;
            const handleMessage = (event: MessageEvent) => {
                if (event.origin !== this.iframeOrigin ||
                    event.data?.command !== CommandType.INIT) return;
                frame.setAttribute("loaded", "true");
                window.removeEventListener("message", handleMessage);
            };
            window.addEventListener("message", handleMessage);
            this.monitorFrame(frame);
            document.body.appendChild(frame);
        } else {
            this.monitorFrame(iframe);
        }
        this.iframe = iframe;
        if (this.monitor) {
            // 复用时也显示调试页面，不移动或重新加载共享 iframe。
            Object.assign(iframe.style, {
                display: "block",
                width: "calc(100% - 2rem)",
                maxWidth: "80rem",
                height: "320px",
                margin: "0 auto 2rem",
                border: "1px solid var(--border, #d4d4d4)",
                borderRadius: "0.75rem",
            });
        }
        this.emit({
            type: reused ? "iframe-reused" : "iframe-created",
            loaded: iframe.getAttribute("loaded") === "true"
        });
    }

    /** 独立观察共享 iframe，不改变原有 INIT 判定与 loaded 状态。 */
    private monitorFrame(iframe: HTMLIFrameElement) {
        if (!this.monitor) return;
        const handleLoad = () => this.emit({type: "iframe-load"});
        const handleReady = (event: MessageEvent) => {
            if (event.origin !== this.iframeOrigin ||
                event.data?.command !== CommandType.INIT) return;
            window.removeEventListener("message", handleReady);
            this.emit({type: "iframe-ready"});
        };
        iframe.addEventListener("load", handleLoad);
        // 已就绪的共享 iframe 通过 iframe-reused.loaded 报告状态，不重放历史事件。
        if (iframe.getAttribute("loaded") !== "true") {
            window.addEventListener("message", handleReady);
        }
        this.stopMonitoringFrame = () => {
            iframe.removeEventListener("load", handleLoad);
            window.removeEventListener("message", handleReady);
        };
    }

    private getStorageType(storageType: StorageType) {
        if (storageType === StorageType.AUTOMATIC) {
            storageType =
                TOKEN_STORAGE === "SESSION" ? StorageType.SESSION : StorageType.LOCAL;
        }
        return storageType;
    }

    // Match both origin and iframe window; bound every request to a timeout.
    private request(req: StorageRequest): Promise<string | null> {
        const context = {
            requestId: req.requestId,
            command: req.command,
            storage: req.storage,
            key: req.key,
            value: req.value
        };
        return new Promise((resolve, reject) => {
            let poll: ReturnType<typeof setTimeout>;
            let waiting = false;
            const cleanup = () => {
                clearTimeout(poll);
                clearTimeout(timeout);
                window.removeEventListener("message", handleMessage);
                this.pending.delete(cancel);
            };
            const cancel = () => {
                cleanup();
                reject(new Error("Storage client destroyed"));
                this.emit({type: "request-cancelled", ...context});
            };
            const handleMessage = (event: MessageEvent<StorageResponse>) => {
                if (event.origin !== this.iframeOrigin ||
                    !event.data || event.data.requestId !== req.requestId) return;
                cleanup();
                if (event.data.error) reject(new Error(event.data.error));
                else resolve(event.data.value);
                this.emit({type: "response-received", ...context, value: event.data.value, error: event.data.error});
            };
            this.pending.add(cancel);
            window.addEventListener("message", handleMessage);
            const timeout = setTimeout(() => {
                cleanup();
                reject(new Error("Account storage request timed out"));
                this.emit({type: "request-timeout", ...context});
            }, 10000);
            this.emit({type: "request-created", ...context});
            const send = () => {
                // 上游监控回调可能同步销毁实例，此时不能再发送或启动轮询。
                if (!this.pending.has(cancel)) return;
                if (this.iframe.getAttribute("loaded") !== "true") {
                    poll = setTimeout(send, 100);
                    if (!waiting) {
                        waiting = true;
                        this.emit({type: "request-waiting", ...context});
                    }
                    return;
                }
                try {
                    this.iframe.contentWindow?.postMessage(req, this.iframeOrigin);
                    if (this.iframe.contentWindow) this.emit({type: "request-sent", ...context});
                } catch (error) {
                    cleanup();
                    reject(error);
                    this.emit({
                        type: "request-error", ...context,
                        error: error instanceof Error ? error.message : "Storage request failed"
                    });
                }
            };
            send();
        });
    }
}
