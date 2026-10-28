import CrosStorage from "@/common/lib/CrosStorage";
import {StorageType} from "@/common/lib/protocol/CrosProtocol";
import Result from "@/common/lib/protocol/Result";
import toast from "react-hot-toast";
import {Translator} from "@/common/lib/TranslatorType";

class SparrowWebSocket {
    public static ACTIVE_STATUS = "active";
    public static INACTIVE_STATUS = "inactive";
    public static CONNECTING_STATUS = "connecting";
    //窗口的焦点状态，active 状态则可以执行重连，否则继续重试，直到获取窗口焦点
    private static activeStatus: string = SparrowWebSocket.INACTIVE_STATUS;
    //心跳状态 inactive 未探测到心跳，active 心跳正常
    private static heartStatus: string = SparrowWebSocket.INACTIVE_STATUS;
    //连接状态 inactive 未连接，connecting 正在连接，active 连接正常
    private static connectionStatus: string = SparrowWebSocket.INACTIVE_STATUS;
    public translate: Translator;
    // 接收到信息后需要执行的事件
    public onMsgCallback: (data: ArrayBuffer) => void;
    public handshakeSuccess: () => void;
    public handshakeFail: (data: Result) => void;
    public redirectLogin: () => void;
    public offlineCallback: (data: { offline: boolean }) => void;
    public monitorStatus: () => [];
    public monitorStatusCallback: (data: []) => void;
    public txid = 0;
    // 心跳间隔时间 ms
    public heartTime = 10000;
    private ws: WebSocket;
    // websocket 连接的 url
    private url: string;
    // websocket 连接的 token
    private crosStorage: CrosStorage;
    // 重连重试时间 ms
    private reconnectTime = 15000;
    private heartTimer: NodeJS.Timeout;
    private lastHeartTime: number = 0;
    private monitorTime: number = 10000;
    private lastStatusMonitoredTime: number = 0;
    private reconnectionTimer: NodeJS.Timeout;
    private connectionTimestamp: number;

    constructor(url: string, translate: Translator) {
        this.url = url;
        this.translate = translate;
        this.crosStorage = CrosStorage.getCrosStorage();
    }

    public heartbeatMessage: () => string | Uint8Array<ArrayBuffer> = () => "PING";

    public statusMonitorMessage: (contacts: []) => string | Uint8Array<ArrayBuffer> = contacts =>
        contacts.length > 0 ? "STATUS|" + JSON.stringify(contacts) : "STATUS";

    public userAuthCallback(data: Result) {
        if (data.code == "0") {
            if (!this.handshakeSuccess) {
                console.warn("please defined handshakeSuccess callback method  ");
            } else {
                this.handshakeSuccess();
            }
            //鉴权成功后，启动心跳
            this.connectionTimestamp = new Date().getTime();
            SparrowWebSocket.connectionStatus = SparrowWebSocket.ACTIVE_STATUS;
            // 启动心跳
            this.startHeartBeat();
            return;
        }
        this.crosStorage.removeToken().then(() => {
            if (this.handshakeFail) {
                this.handshakeFail(data);
                return;
            }
            toast.error(this.translate ? this.translate(data.key ?? "") : data.message ?? "");
            this.redirectLogin();
        });
    }

    public receiveHeartbeat() {
        this.lastHeartTime = Date.now();
        SparrowWebSocket.heartStatus = SparrowWebSocket.ACTIVE_STATUS;
    }

    public getHeartStatus() {
        return SparrowWebSocket.heartStatus;
    }

    public reconnectWebSocket() {
        //关闭现有链接
        this.close();
        //立即尝试重连
        this.connect();
        //发起重连
        this.reconnectionTimer = setInterval(() => {
            if (SparrowWebSocket.activeStatus === SparrowWebSocket.INACTIVE_STATUS) {
                console.log("窗口失去焦点，不进行重连");
                return;
            }

            if (SparrowWebSocket.heartStatus === SparrowWebSocket.ACTIVE_STATUS) {
                console.log("心跳正常，不进行重连");
                return;
            }

            if (
                SparrowWebSocket.connectionStatus === SparrowWebSocket.CONNECTING_STATUS
            ) {
                console.log("正在连接中，不进行重连");
                return;
            }
            if (
                SparrowWebSocket.connectionStatus === SparrowWebSocket.ACTIVE_STATUS
            ) {
                console.log("连接正常，不进行重连");
                return;
            }

            this.connect();
        }, this.reconnectTime);
    }

    public connect() {
        try {
            SparrowWebSocket.connectionStatus = SparrowWebSocket.CONNECTING_STATUS;
            console.log("开始链接");
            if ("WebSocket" in window) {
                this.initWindowsFocusEvent();
                this.crosStorage.getToken(StorageType.AUTOMATIC).then((token) => {
                    if (!token) {
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
                });
            }
        } catch (e) {
            SparrowWebSocket.connectionStatus = SparrowWebSocket.INACTIVE_STATUS;
            console.log("链接失败，直接重连", e);
            this.reconnectWebSocket();
        }
    }

    public onOpen() {
        this.ws.onopen = (e) => {
            console.log("连接成功" + e);
        };
    }

    public onClose() {
        this.ws.onclose = (e) => {
            if (e.wasClean) {
                SparrowWebSocket.connectionStatus = SparrowWebSocket.INACTIVE_STATUS;
            } else {
                SparrowWebSocket.connectionStatus = SparrowWebSocket.INACTIVE_STATUS;
            }
            console.log("连接关闭,e.wasClean=" + e.wasClean);
        };
    }

    public onError() {
        this.ws.onerror = (e) => {
            // 如果出现连接、处理、接收、发送数据失败的时候触发onerror事件
            console.log("连接出错", e);
            SparrowWebSocket.connectionStatus = SparrowWebSocket.INACTIVE_STATUS;
            this.reconnectWebSocket();
        };
    }

    // 心跳机制 --启动心跳
    public startHeartBeat() {
        this.stopRetryConnect();
        this.stopHeartBeat();
        this.lastHeartTime = new Date().getTime();
        this.heartTimer = setInterval(() => {
            const heartDiff = new Date().getTime() - this.lastHeartTime;
            // 按当前配置计算超时，避免调整发送周期后仍使用旧的等待时长。
            if (heartDiff > this.heartTime * 3) {
                console.log("超时重连 heart diff {}", heartDiff);
                this.stopHeartBeat();
                this.reconnectWebSocket();
                return;
            }
            // 开启一个心跳
            try {
                this.ws.send(this.heartbeatMessage());
                if (
                    new Date().getTime() - this.lastStatusMonitoredTime >
                    this.monitorTime
                ) {
                    const contactsStatus = this.monitorStatus();
                    this.ws.send(this.statusMonitorMessage(contactsStatus));
                }
            } catch (e) {
                console.log("heart beat error:" + e);
            }
        }, this.heartTime);
    }

    // 关闭心跳
    public stopHeartBeat() {
        clearInterval(this.heartTimer);
        SparrowWebSocket.heartStatus = SparrowWebSocket.INACTIVE_STATUS;
    }

    public stopRetryConnect() {
        clearInterval(this.reconnectionTimer);
    }

    public increaseTxid(): number {
        this.txid = this.txid + 1;
        return this.txid;
    }

    //发送消息
    public sendMessage(data: string | ArrayBufferLike | ArrayBufferView) {
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
        this.stopHeartBeat();
        this.stopRetryConnect();
        if (this.ws == null) {
            console.log("websocket is null");
            return;
        }
        this.ws.close();
    }

    private initWindowsFocusEvent() {
        window.onfocus = function () {
            console.log("window.onfocus");
            SparrowWebSocket.activeStatus = SparrowWebSocket.ACTIVE_STATUS;
        };
        window.onclick = function () {
            console.log("window.onclick");
            SparrowWebSocket.activeStatus = SparrowWebSocket.ACTIVE_STATUS;
        };
        window.onblur = function () {
            console.log("window.onblur");
            SparrowWebSocket.activeStatus = SparrowWebSocket.INACTIVE_STATUS;
        };
    }

    private _onMsg() {
        this.ws.onmessage = async (e) => {
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
            this.increaseTxid();
            if (this.onMsgCallback) {
                this.onMsgCallback(buf);
            }
        };
    }
}

export default SparrowWebSocket;
