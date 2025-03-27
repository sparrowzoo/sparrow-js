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

  // 接收到信息后需要执行的事件
  public onMsgCallback: (data: ArrayBufferLike) => void;
  public offlineCallback: (data: { offline: boolean }) => void;
  public userValidCallback: (data: any) => void;
  public txid = 0;
  private ws: WebSocket;
  // websocket 连接的 url
  private url: string;
  // websocket 连接的 token
  private token: string;
  // 心跳间隔时间 ms
  private heartTime = 1000;
  // 心跳超时时间 ms
  private heartTimeout = 5000;
  // 重连重试时间 ms
  private reconnectTime = 1000;
  private heartTimer: NodeJS.Timeout;
  private lastHeartTime: number = 0;
  private reconnectionTimer: NodeJS.Timeout;
  private connectionTimestamp: number;

  constructor(url: string, token: string) {
    this.url = url;
    this.token = token;
  }

  public reconnectWebSocket() {
    //关闭现有链接
    this.close();
    //停止心跳
    this.stopHeartBeat();
    //停止上一次重连
    this.stopRetryConnect();
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
      if ("WebSocket" in window) {
        this.initWindowsFocusEvent();
        this.ws = new WebSocket(this.url, [this.token]);
        //resolve 或者reject 必须，如果未执行，会导致后续代码不执行
        this.onOpen();
        this._onMsg();
        this.onClose();
        this.onError();
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
      this.connectionTimestamp = new Date().getTime();
      SparrowWebSocket.connectionStatus = SparrowWebSocket.ACTIVE_STATUS;
      // 启动心跳
      this.startHeartBeat();
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
      console.log("连接出错");
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
      var heartDiff = new Date().getTime() - this.lastHeartTime;
      // 如果超过两个周期未拿到心跳，说明超时
      if (heartDiff > this.heartTimeout) {
        console.log("超时重连 heart diff {}", heartDiff);
        this.stopHeartBeat();
        this.reconnectWebSocket();
        return;
      }
      // 开启一个心跳
      try {
        //console.log("发送心跳" + new Date().getTime());
        this.ws.send("PING");
      } catch (e) {
        console.log("heart beat error:" + e);
      }
    }, this.heartTime);
  }

  // 关闭心跳
  public stopHeartBeat() {
    clearTimeout(this.heartTimer);
    SparrowWebSocket.heartStatus = SparrowWebSocket.INACTIVE_STATUS;
  }

  public stopRetryConnect() {
    clearTimeout(this.reconnectionTimer);
  }

  public increaseTxid(): number {
    this.txid = this.txid + 1;
    return this.txid;
  }

  //发送消息
  public sendMessage(data: ArrayBufferLike) {
    this.increaseTxid();
    this.ws.send(data);
  }

  public reconnectionCallback() {
    console.log("重连回调");
  }

  // 关闭连接
  public close() {
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
        // 加个判断,如果是PONG，说明当前是后端返回的心跳包 停止下面的代码执行
        if (e.data === "PONG") {
          this.lastHeartTime = new Date().getTime();
          SparrowWebSocket.heartStatus = SparrowWebSocket.ACTIVE_STATUS;
          return;
        }
        //1 对1 聊天时，对方不在线
        if (e.data === "OFFLINE") {
          this.offlineCallback({ offline: true });
          return;
        }
        var result = JSON.parse(e.data);
        this.userValidCallback(result);
        return;
      }
      const buf = await e.data.arrayBuffer();
      this.increaseTxid();
      this.onMsgCallback(buf);
    };
  }
}

export default SparrowWebSocket;
