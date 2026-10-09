"use client";
import {CommandType, StorageRequest, StorageResponse, StorageSaveOptions, StorageType} from "@/common/lib/protocol/CrosProtocol";
import {CROS_DEBUG, STORAGE_PROXY, TOKEN_KEY, USER_INFO_KEY} from "@/common/lib/Env";
import {Utils} from "@/common/lib/Utils";
import LoginUser from "@/common/lib/protocol/LoginUser";
import StorageManager from "@/common/lib/storage/StorageManager";
import PostMessageRpc from "@/common/lib/rpc/PostMessageRpc";
import StorageMonitor, {CrosStorageMonitor} from "@/common/lib/monitor/StorageMonitor";
export type {CrosStorageEvent, CrosStorageEventType, CrosStorageMonitor} from "@/common/lib/monitor/StorageMonitor";

/** Storage facade: chooses the authority; strategies and transport own their mechanics. */
export default class CrosStorage {
    private readonly stores = new StorageManager();
    private readonly events: StorageMonitor;
    private rpc?: PostMessageRpc;
    private destroyed = false;

    private constructor(private readonly monitor?: CrosStorageMonitor) {
        let origin = "";
        try { origin = new URL(STORAGE_PROXY || "").origin; } catch { /* Local reads do not need a proxy. */ }
        this.events = new StorageMonitor({monitor, debug: CROS_DEBUG, iframeOrigin: origin,
            crossOrigin: typeof window !== "undefined" && !!origin && origin !== window.location.origin});
    }

    public static getCrosStorage(monitor?: CrosStorageMonitor) { return new CrosStorage(monitor); }

    public async get(key: string = TOKEN_KEY, storage: StorageType = StorageType.AUTOMATIC): Promise<string | null> {
        return this.operate(CommandType.GET, key, storage);
    }

    public async set(value: string, key: string = TOKEN_KEY, storage: StorageType = StorageType.AUTOMATIC,
                     saveOptions?: StorageSaveOptions): Promise<string | null> {
        return this.operate(CommandType.SET, key, storage, value, saveOptions);
    }

    public async remove(key: string = TOKEN_KEY, storage: StorageType = StorageType.AUTOMATIC): Promise<string | null> {
        return this.operate(CommandType.REMOVE, key, storage);
    }

    public async getToken(storage: StorageType = StorageType.AUTOMATIC,
                          generateVisitorToken: (() => Promise<string>) | null = null): Promise<string | null> {
        this.assertActive();
        const mode = this.stores.resolve(storage);
        const local = this.local(CommandType.GET, TOKEN_KEY, mode);
        if (local) return local;
        // At A, the local lookup above is authoritative; do not issue a self RPC.
        const token = this.isRemote() ? await this.get(TOKEN_KEY, mode) : null;
        if (token || !generateVisitorToken) return token || null;
        const visitor = await generateVisitorToken();
        await this.setToken(visitor, mode);
        return visitor;
    }

    public async setToken(token: string, storage: StorageType = StorageType.AUTOMATIC,
                          saveOptions?: StorageSaveOptions): Promise<string | null> {
        const mode = this.stores.resolve(storage);
        const remote = this.isRemote();
        const result = await this.set(token, TOKEN_KEY, mode, saveOptions);
        if (remote) {
            // Saving A must succeed before removing an independent stale B credential.
            if (mode !== StorageType.COOKIE) this.local(CommandType.REMOVE, TOKEN_KEY, mode);
            else if (!this.stores.sharesCookieScopeWith(this.authority().origin)) {
                this.stores.removeHostOnlyCookie(TOKEN_KEY);
            } else if (this.local(CommandType.GET, TOKEN_KEY, mode) !== token) {
                throw new Error("COOKIE_WRITE_FAILED: Shared Cookie could not be confirmed");
            }
        }
        return result;
    }

    public async removeToken(storage: StorageType = StorageType.AUTOMATIC): Promise<string | null> {
        this.assertActive();
        const mode = this.stores.resolve(storage);
        const remote = this.isRemote();
        const local = mode === StorageType.COOKIE && remote && !this.stores.sharesCookieScopeWith(this.authority().origin)
            ? this.stores.removeHostOnlyCookie(TOKEN_KEY)
            : this.local(CommandType.REMOVE, TOKEN_KEY, mode);
        const source = remote ? await this.remove(TOKEN_KEY, mode) : null;
        return local ?? source;
    }

    public async locateToken(token: string | null = null) {
        const current = token || await this.getToken();
        if (current) return LoginUser.localize(current);
        sessionStorage.removeItem(USER_INFO_KEY);
        return LoginUser.visitor();
    }

    public destroy(): void {
        if (this.destroyed) return;
        this.destroyed = true;
        this.rpc?.destroy();
        if (!this.rpc) this.events.emit({type: "destroy"});
    }

    private assertActive(): void {
        if (this.destroyed) throw new Error("Storage client destroyed");
    }

    private authority(): URL {
        if (!STORAGE_PROXY) throw new Error("NEXT_PUBLIC_STORAGE_PROXY is required");
        const url = new URL(STORAGE_PROXY);
        if (!["https:", "http:"].includes(url.protocol) || url.username || url.password) {
            throw new Error("Invalid storage proxy URL");
        }
        return url;
    }

    private isRemote(): boolean {
        if (typeof window === "undefined") throw new Error("STORAGE_UNAVAILABLE: Browser storage is required");
        return this.authority().origin !== window.location.origin;
    }

    private local(command: CommandType, key: string, storage: StorageType, value?: string,
                  saveOptions?: StorageSaveOptions): string | null {
        try {
            const result = command === CommandType.GET ? this.stores.get(key, storage)
                : command === CommandType.SET ? this.stores.set(key, value!, storage, saveOptions)
                : this.stores.remove(key, storage);
            this.events.emit({type: "storage-operation", command, storage, key, valueLength: result?.length ?? 0});
            return result;
        } catch (error) {
            this.events.emit({type: "storage-error", command, storage, key, error: "Storage operation failed"});
            throw error;
        }
    }

    private async operate(command: CommandType, key: string, storage: StorageType, value?: string,
                          saveOptions?: StorageSaveOptions): Promise<string | null> {
        this.assertActive();
        const mode = this.stores.resolve(storage);
        if (!this.isRemote()) return this.local(command, key, mode, value, saveOptions);
        if (!this.rpc) {
            const url = this.authority();
            const debug = !!this.monitor || CROS_DEBUG;
            if (debug) url.pathname = `${url.pathname.replace(/\/$/, "")}-debug/`;
            url.search = encodeURIComponent(window.location.origin);
            this.rpc = new PostMessageRpc({url: url.href,
                frameId: debug ? "cros-storage-iframe-debug" : "cros-storage-iframe",
                visible: debug,
                isReady: data => !!data && typeof data === "object" && (data as {command?: unknown}).command === CommandType.INIT,
                onEvent: event => this.events.emit({type: event.type, requestId: event.requestId, loaded: event.loaded})});
        }
        const request: StorageRequest = {requestId: Utils.randomUUID(), command, key, storage: mode};
        if (command === CommandType.SET) { request.value = value; request.saveOptions = saveOptions; }
        try {
            const response = await this.rpc.request<StorageResponse>(request);
            if (response.error) throw new Error(response.error);
            if (response.value !== null && typeof response.value !== "string") throw new Error("Invalid storage response");
            this.events.emit({type: "storage-operation", requestId: request.requestId, command, key,
                storage: mode, valueLength: response.value?.length ?? 0});
            return response.value;
        } catch (error) {
            this.events.emit({type: "storage-error", requestId: request.requestId, command, key,
                storage: mode, error: "Storage request failed"});
            throw error;
        }
    }
}
