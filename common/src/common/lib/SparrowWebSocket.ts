import CrosStorage from "@/common/lib/CrosStorage";
import {StorageType} from "@/common/lib/protocol/CrosProtocol";
import Result from "@/common/lib/protocol/Result";
import toast from "react-hot-toast";
import {Translator} from "@/common/lib/TranslatorType";

class SparrowWebSocket {
    public static ACTIVE_STATUS = "active";
    public static INACTIVE_STATUS = "inactive";
    public static CONNECTING_STATUS = "connecting";
    public translate: Translator;
    // 接收到信息后需要执行的事件
    public onMsgCallback: (data: ArrayBuffer) => void;
    public handshakeSuccess: () => void;
    public handshakeFail: (data: Result) => void;
    public connectingCallback?: () => void;
    public closeCallback?: () => void;
    public errorCallback?: (error: unknown) => void;
    public invalidMessageCallback?: (error: unknown) => void;
    public redirectLogin: () => void;
    public offlineCallback: (data: { offline: boolean }) => void;
    public connectionStatusCallback?: (status: string) => void;
    public txid = 0;
    //窗口的焦点状态，active 状态则可以执行重连，否则继续重试，直到获取窗口焦点
    private activeStatus: string = SparrowWebSocket.INACTIVE_STATUS;
    private windowEventsBound = false;
    private readonly activateWindow = () => {
        this.activeStatus = SparrowWebSocket.ACTIVE_STATUS;
    };
    private readonly deactivateWindow = () => {
        this.activeStatus = SparrowWebSocket.INACTIVE_STATUS;
    };
    //连接状态 inactive 未连接，connecting 正在连接，active 连接正常
    private connectionStatus: string = SparrowWebSocket.INACTIVE_STATUS;
    private ws: WebSocket | null = null;
    // websocket 连接的 url
    private url: string;
    // websocket 连接的 token
    private crosStorage: CrosStorage;
    // 重连重试时间 ms
    private reconnectTime = 15000;
    private reconnectionTimer: NodeJS.Timeout | null = null;
    private generation = 0;

    constructor(url: string, translate: Translator) {
        this.url = url;
        this.translate = translate;
        this.crosStorage = CrosStorage.getCrosStorage();
    }

    public userAuthCallback(data: Result) {
        if (data.code == "0") {
            // Native PING/PONG is handled by the browser and Netty, outside JavaScript.
            this.stopRetryConnect();
            this.setConnectionStatus(SparrowWebSocket.ACTIVE_STATUS);
            if (!this.handshakeSuccess) {
                console.warn("please defined handshakeSuccess callback method  ");
            } else {
                this.handshakeSuccess();
            }
            return;
        }
        const generation = this.generation;
        this.crosStorage.removeToken().then(() => {
            if (generation !== this.generation) return;
            if (this.handshakeFail) {
                this.handshakeFail(data);
                return;
            }
            toast.error(this.translate ? this.translate(data.key ?? "") : data.message ?? "");
            this.redirectLogin();
        }).catch(error => {
            if (generation === this.generation) this.errorCallback?.(error);
        });
    }

    public getConnectionStatus(): string {
        return this.connectionStatus;
    }

    public reconnectWebSocket() {
        const retrying = this.reconnectionTimer !== null;
        // Detach the failed socket before its subsequent close event arrives.
        this.close();
        // Keep tracking focus while waiting for the next retry.
        this.initWindowsFocusEvent();
        // Each failed retry starts a fresh fifteen-second wait.
        this.reconnectionTimer = setInterval(() => {
            if (this.activeStatus === SparrowWebSocket.INACTIVE_STATUS) {
                console.log("窗口失去焦点，不进行重连");
                return;
            }

            if (
                this.connectionStatus === SparrowWebSocket.CONNECTING_STATUS
            ) {
                console.log("正在连接中，不进行重连");
                return;
            }
            if (
                this.connectionStatus === SparrowWebSocket.ACTIVE_STATUS
            ) {
                console.log("连接正常，不进行重连");
                return;
            }

            this.connect();
        }, this.reconnectTime);
        // Try once immediately; later failures must wait for the retry timer.
        if (!retrying) this.connect();
    }

    public connect() {
        if (this.connectionStatus !== SparrowWebSocket.INACTIVE_STATUS) return;
        const generation = ++this.generation;
        try {
            this.setConnectionStatus(SparrowWebSocket.CONNECTING_STATUS);
            this.connectingCallback?.();
            console.log("开始链接");
            if ("WebSocket" in window) {
                this.initWindowsFocusEvent();
                this.crosStorage.getToken(StorageType.AUTOMATIC).then((token) => {
                    if (generation !== this.generation) return;
                    if (!token) {
                        this.setConnectionStatus(SparrowWebSocket.INACTIVE_STATUS);
                        if (this.translate) {
                            toast.error(this.translate("shake-hands-no-login"));
                        }
                        this.redirectLogin();
                        return;
                    }
                    this.ws = new WebSocket(this.url, [token as string]);
                    //resolve 或者reject 必须，如果未执行，会导致后续代码不执行
                    this.onOpen();
                    this._onMsg();
                    this.onClose();
                    this.onError();
                }).catch(error => {
                    if (generation !== this.generation) return;
                    this.setConnectionStatus(SparrowWebSocket.INACTIVE_STATUS);
                    this.errorCallback?.(error);
                });
            }
        } catch (e) {
            this.setConnectionStatus(SparrowWebSocket.INACTIVE_STATUS);
            console.log("链接失败", e);
            this.errorCallback?.(e);
        }
    }

    public onOpen() {
        if (!this.ws) return;
        this.ws.onopen = (e) => {
            console.log("连接成功" + e);
        };
    }

    public onClose() {
        const socket = this.ws;
        if (!socket) return;
        socket.onclose = (e) => {
            if (this.ws !== socket) return;
            this.setConnectionStatus(SparrowWebSocket.INACTIVE_STATUS);
            console.log("连接关闭,e.wasClean=" + e.wasClean);
            this.closeCallback?.();
            if (this.ws === socket) this.reconnectWebSocket();
        };
    }

    public onError() {
        const socket = this.ws;
        if (!socket) return;
        socket.onerror = (e) => {
            if (this.ws !== socket) return;
            // 如果出现连接、处理、接收、发送数据失败的时候触发onerror事件
            console.log("连接出错", e);
            this.setConnectionStatus(SparrowWebSocket.INACTIVE_STATUS);
            this.errorCallback?.(e);
            if (this.ws === socket) this.reconnectWebSocket();
        };
    }

    public stopRetryConnect() {
        if (this.reconnectionTimer === null) return;
        clearInterval(this.reconnectionTimer);
        this.reconnectionTimer = null;
    }

    public increaseTxid(): number {
        this.txid = this.txid + 1;
        return this.txid;
    }

    //发送消息
    public sendMessage(data: string | ArrayBufferLike | ArrayBufferView) {
        if (!this.ws || this.ws.readyState !== 1) throw new Error("WebSocket is not connected");
        this.increaseTxid();
        if (typeof data === "string") {
            this.ws.send(data);
            return;
        }
        // Copy the effective view, including typed arrays with an offset.
        const bytes = ArrayBuffer.isView(data)
            ? new Uint8Array(data.buffer, data.byteOffset, data.byteLength) : new Uint8Array(data);
        this.ws.send(new Uint8Array(bytes).buffer);
    }

    public reconnectionCallback() {
        console.log("重连回调");
    }

    // 关闭连接
    public close() {
        ++this.generation;
        this.stopRetryConnect();
        this.removeWindowsFocusEvent();
        this.setConnectionStatus(SparrowWebSocket.INACTIVE_STATUS);
        if (this.ws == null) {
            console.log("websocket is null");
            return;
        }
        const socket = this.ws;
        this.ws = null;
        socket.onmessage = null;
        socket.onclose = null;
        socket.onerror = null;
        socket.onopen = null;
        socket.close();
    }

    private setConnectionStatus(status: string): void {
        if (this.connectionStatus === status) return;
        this.connectionStatus = status;
        this.connectionStatusCallback?.(status);
    }

    private initWindowsFocusEvent() {
        if (this.windowEventsBound) return;
        if (typeof document !== "undefined") {
            this.activeStatus = document.hasFocus()
                ? SparrowWebSocket.ACTIVE_STATUS : SparrowWebSocket.INACTIVE_STATUS;
        }
        window.addEventListener("focus", this.activateWindow);
        window.addEventListener("click", this.activateWindow);
        window.addEventListener("blur", this.deactivateWindow);
        this.windowEventsBound = true;
    }

    private removeWindowsFocusEvent() {
        if (!this.windowEventsBound) return;
        window.removeEventListener("focus", this.activateWindow);
        window.removeEventListener("click", this.activateWindow);
        window.removeEventListener("blur", this.deactivateWindow);
        this.windowEventsBound = false;
        this.activeStatus = SparrowWebSocket.INACTIVE_STATUS;
    }

    private _onMsg() {
        const socket = this.ws;
        if (!socket) return;
        socket.onmessage = async (e) => {
            if (this.ws !== socket) return;
            try {
                if (typeof e.data === "string") {
                    const result = JSON.parse(e.data);
                    if (result.instruction === "AUTH_BIND" || result.instruction === "AUTH") {
                        if (this.userAuthCallback) {
                            this.userAuthCallback(result);
                        }
                    }
                    return;
                }
                const buf: ArrayBuffer = e.data instanceof ArrayBuffer ? e.data : await e.data.arrayBuffer();
                if (this.ws !== socket) return;
                this.increaseTxid();
                if (this.onMsgCallback) {
                    this.onMsgCallback(buf);
                }
            } catch (error) {
                if (this.ws === socket) this.invalidMessageCallback?.(error);
            }
        };
    }
}

export default SparrowWebSocket;
