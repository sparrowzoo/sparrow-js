Sparrow.webSocket = function (url, token) {
  this.url = url;
  // websocket 连接的 token
  this.token = token;
  // 接收到信息后需要执行的事件
  this.onMsgCallback = null;
  // 心跳间隔时间
  this.heartTime = 1000;
  // 心跳超时时间
  this.heartTimeout = 3000;
  // 重连时间 0.5s
  this.reconnectTime = 1000;

  this.heartTimer = null;

  this.ws = null;

  this.lastHeartTime = 0;

  this.reconnectionTimer = null;

  this.reconnectionCallback = null;

  this.userId = null;

  this.statusBarId;
};

Sparrow.webSocket.prototype.connect = function (resolve, reject) {
  try {
    if ("WebSocket" in window) {
      this.ws = new WebSocket(this.url, [this.token]);
      //resolve 或者reject 必须，如果未执行，会导致后续代码不执行
      this._onOpen();
      this._onMsg(resolve, reject);
      this._onClose(reject);
      this._onError(reject);
    }
  } catch (e) {
    console.log("链接失败，直接重连", e);
    this.reconnectWebSocket();
  }
};

Sparrow.webSocket.prototype.close = function () {
  // 关闭连接
  this.ws.close();
};

Sparrow.webSocket.prototype.showPingStatus = function (status) {
  var statusBar = $("#" + this.statusBarId);
  if (statusBar.s != null) {
    $("#" + this.statusBarId).html(status);
  }
};
Sparrow.webSocket.prototype.reconnectWebSocket = function () {
  //停止心跳
  this.closeHeartBeat();
  this.clearReconnectionTimer();
  //关闭现有链接
  this.close();
  //清空活跃状态
  Sparrow.browser.active = false;
  //发起重连
  this.reconnectionTimer = setInterval(() => {
    if (this.reconnectionCallback) {
      this.reconnectionCallback();
    }
    console.log("心跳超时，retry ????" + this.reconnectionTimer);
  }, 1000);
};

Sparrow.webSocket.prototype._onOpen = function () {
  this.ws.onopen = (e) => {
    console.log("连接成功" + e);
    this.showPingStatus("连接成功...");
    this.closeHeartBeat();
    // 启动心跳
    this.startHeartBeat();
  };
};

Sparrow.webSocket.prototype._onMsg = function (resolve) {
  this.ws.onmessage = (e) => {
    // 加个判断,如果是PONG，说明当前是后端返回的心跳包 停止下面的代码执行
    if (typeof e.data === "string") {
      if (e.data === "PONG") {
        this.lastHeartTime = new Date().getTime();
        this.showPingStatus(
          "健康<span style='color:red'>" +
            new Date().format("hh:mm:ss") +
            "</span>"
        );
        return;
      }

      if (e.data === "offline") {
        this.lastHeartTime = new Date().getTime();
        if (this.onMsgCallback) {
          this.onMsgCallback({ offline: true });
        }
        return;
      }

      var userIndex = e.data.indexOf("USER.");
      if (userIndex > -1) {
        this.userInfo = e.data.substring(5);
        resolve(this.userInfo);
        return;
      }
    }
    this.onMsgCallback(e.data);
  };
};

Sparrow.webSocket.prototype._onClose = function (reject) {
  this.ws.onclose = (e) => {
    if (e.wasClean) {
      console.log("干净的关闭 重连");
      this.reconnectWebSocket();
    } else {
      // 异常关闭 需要发起重连
      console.log("异常关闭 重连");
      this.reconnectWebSocket();
    }
    reject(e);
  };
};

Sparrow.webSocket.prototype._onError = function (reject) {
  this.onerror = (e) => {
    // 如果出现连接、处理、接收、发送数据失败的时候触发onerror事件
    console.log("连接出错" + e);
    this.showPingStatus("on error 重连");
    this.reconnectWebSocket();
    reject(e);
  };
};

// 心跳机制 --启动心跳
Sparrow.webSocket.prototype.startHeartBeat = function () {
  this.lastHeartTime = new Date().getTime();
  this.heartTimer = setInterval(() => {
    var heartDiff = new Date().getTime() - this.lastHeartTime;
    // 如果超过两个周期未拿到心跳，说明超时
    if (heartDiff > this.heartTimeout) {
      console.log("超时重连 heart diff {}", heartDiff);
      this.reconnectWebSocket();
    }
    // 开启一个心跳
    try {
      this.ws.send("PING");
    } catch (e) {
      console.log("heart beat error:" + e);
    }
  }, this.heartTime);
};

// 关闭心跳
Sparrow.webSocket.prototype.closeHeartBeat = function () {
  clearTimeout(this.heartTimer);
};

Sparrow.webSocket.prototype.clearReconnectionTimer = function () {
  clearTimeout(this.reconnectionTimer);
};
//发送消息
Sparrow.webSocket.prototype.sendMessage = function (data) {
  // 发送到服务器
  this.ws.send(data.toBytes());
};
