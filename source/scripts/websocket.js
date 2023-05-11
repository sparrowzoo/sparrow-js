Sparrow.webSocket = function (url, token) {
  this.url = url;
  // websocket 连接的 token
  this.token = token;
  // 接收到信息后需要执行的事件
  this.onMsgCallback = null;
  // 心跳间隔时间 10s
  this.heartTime = 10000;
  // 心跳超时时间 12s
  this.heartTimeout = 20000;
  // 重连时间 0.5s
  this.reconnectTime = 500;

  this.timeoutTimer = null;

  this.serverTimeoutTimer = null;

  this.ws = null;

  this.lastHeartTime = 0;

  this.reconnectionAlarmTimer = null;

  this.reconnectionAlarmCallback = null;

  this.userId = null;
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
    console.log(e);
    this.reconnectWebSocket();
  }
};

Sparrow.webSocket.prototype.close = function () {
  // 关闭连接
  this.ws.close();
};

Sparrow.webSocket.prototype.reconnectWebSocket = function () {
  //如果是服务器关闭的连接，不需要重连
  if (new Date() - this.lastHeartTime > this.heartTimeout * 2) {
    console.log("发起重连");
    this.reconnectionAlarmTimer = setInterval(() => {
      if (this.reconnectionAlarmCallback) {
        this.reconnectionAlarmCallback();
      }
      console.log("连接断开，请刷新浏览器！");
    }, 10000);
    this.closeHeartBeat();
  } else {
    console.log("服务器顶替逻辑，不重连!");
  }
};

Sparrow.webSocket.prototype._onOpen = function () {
  this.ws.onopen = (e) => {
    console.log(e.currentTarget.protocol);
    console.log("连接成功" + e);
    this.closeHeartBeat();
    // 启动心跳
    this.startHeartBeat();
  };
};

Sparrow.webSocket.prototype._onMsg = function (resolve) {
  this.ws.onmessage = (e) => {
    console.log("收到消息" + e.data);
    // 加个判断,如果是PONG，说明当前是后端返回的心跳包 停止下面的代码执行
    if (typeof e.data === "string") {
      if (e.data === "PONG") {
        this.lastHeartTime = new Date().getTime();
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
    console.log("close 事件");
    if (e.wasClean) {
      // 干净的关闭，客户端主动关闭 不需要发起重连,关闭上一个心跳
      console.log("不重连");
    } else {
      // 异常关闭 需要发起重连
      this.reconnectWebSocket();
    }
    reject(e);
  };
};

Sparrow.webSocket.prototype._onError = function (reject) {
  this.onerror = (e) => {
    // 如果出现连接、处理、接收、发送数据失败的时候触发onerror事件
    console.log("连接出错" + e);
    this.reconnectWebSocket();
    reject(e);
  };
};

// 心跳机制 --启动心跳
Sparrow.webSocket.prototype.startHeartBeat = function () {
  this.timeoutTimer = setInterval(() => {
    // 开启一个心跳
    try {
      this.ws.send("PING");
    } catch (e) {
      console.log("heart beat error:" + e);
    }
    console.log(
      "heart beat: " +
        new Date().getSeconds() +
        " timer id:" +
        this.timeoutTimer
    );
  }, this.heartTime);

  // 检测当前开启的这个心跳是否超时
  this.serverTimeoutTimer = setInterval(() => {
    // 如果超过两个周期未拿到心跳，说明超时
    if (new Date().getTime() - this.lastHeartTime > this.heartTime * 2) {
      this.reconnectWebSocket();
    }
  }, this.heartTimeout);
};

// 关闭心跳
Sparrow.webSocket.prototype.closeHeartBeat = function () {
  clearTimeout(this.timeoutTimer);
  clearTimeout(this.serverTimeoutTimer);
};
//发送消息
Sparrow.webSocket.prototype.sendMessage = function (data) {
  // 发送到服务器
  this.ws.send(data.toBytes());
};
