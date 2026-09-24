"use client";
import {CommandType, StorageRequest, StorageResponse, StorageType,} from "@/common/lib/protocol/CrosProtocol";
import {STORAGE_PROXY, TOKEN_KEY, TOKEN_STORAGE} from "@/common/lib/Env";
import {Utils} from "@/common/lib/Utils";
import UrlUtils from "@/common/lib/UrlUtils";
import LoginUser from "@/common/lib/protocol/LoginUser";

export default class CrosStorage {
    private iframe: HTMLIFrameElement;
    private iframeOrigin: string = "";
    private pending = new Set<() => void>();
    private cros: boolean = false;

    private constructor() {
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

    public static getCrosStorage() {
        const crosStorage = new CrosStorage();
        return crosStorage;
    }

    public set(
        value: string,
        key: string = TOKEN_KEY,
        storage: StorageType = StorageType.AUTOMATIC
    ) {
        storage = this.getStorageType(storage);
        if (!this.cros) {
            const store =
                storage === StorageType.LOCAL ? localStorage : sessionStorage;
            store.setItem(key, value);
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
            const store = storage === "local" ? localStorage : sessionStorage;
            return Promise.resolve(store.getItem(key));
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
            const store =
                storage === StorageType.LOCAL ? localStorage : sessionStorage;
            const value = store.getItem(key);
            store.removeItem(key);
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

    private initFrame() {
        let iframe = document.querySelector<HTMLIFrameElement>("#cros-storage-iframe");
        if (!iframe) {
            iframe = document.createElement("iframe");
            iframe.src = `${STORAGE_PROXY}?${encodeURIComponent(window.location.origin)}`;
            iframe.style.display = "none";
            iframe.id = "cros-storage-iframe";
            iframe.title = "Account storage";
            const frame = iframe;
            const handleMessage = (event: MessageEvent) => {
                if (event.origin !== this.iframeOrigin || event.source !== frame.contentWindow ||
                    event.data?.command !== CommandType.INIT) return;
                frame.setAttribute("loaded", "true");
                window.removeEventListener("message", handleMessage);
            };
            window.addEventListener("message", handleMessage);
            document.body.appendChild(frame);
        }
        this.iframe = iframe;
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
        return new Promise((resolve, reject) => {
            let poll: ReturnType<typeof setTimeout>;
            const cleanup = () => {
                clearTimeout(poll);
                clearTimeout(timeout);
                window.removeEventListener("message", handleMessage);
                this.pending.delete(cancel);
            };
            const cancel = () => {
                cleanup();
                reject(new Error("Storage client destroyed"));
            };
            const handleMessage = (event: MessageEvent<StorageResponse>) => {
                if (event.origin !== this.iframeOrigin || event.source !== this.iframe.contentWindow ||
                    !event.data || event.data.requestId !== req.requestId) return;
                cleanup();
                if (event.data.error) reject(new Error(event.data.error));
                else resolve(event.data.value);
            };
            this.pending.add(cancel);
            window.addEventListener("message", handleMessage);
            const timeout = setTimeout(() => {
                cleanup();
                reject(new Error("Account storage request timed out"));
            }, 10000);
            const send = () => {
                if (this.iframe.getAttribute("loaded") !== "true") {
                    poll = setTimeout(send, 100);
                    return;
                }
                try {
                    this.iframe.contentWindow?.postMessage(req, this.iframeOrigin);
                } catch (error) {
                    cleanup();
                    reject(error);
                }
            };
            send();
        });
    }
}
