define(function (require, exports, module) {
  const {
    TEXT_MESSAGE,
    IMAGE_MESSAGE,
    CHAT_TYPE_1_2_1,
    CHAT_TYPE_1_2_N,
    SEFLID,
    TargetId,
  } = require("../store/store.js");
  class WSinstance {
    // 当前是否为连接状态
    isConnected = false;
    // 重连时间
    reConnectTime = 1;
    // 发送等待时间
    sendWaitTime = 1;
    // websocket 连接的id
    userId = null;
    // 接收到信息后需要执行的事件
    onMsgCallback = {};
    constructor(userId) {
      this.connected(userId);
    }

    connected(userId) {
      if (!window.WebSocket) {
        console.log("您的浏览器不支持 webSocket");
        return;
      }
      this.userId = userId;
      this.ws = new WebSocket("ws://chat.sparrowzoo.com/websocket", [userId]);
      this.onOpen();
      this.onMsg();
      this.onClose();
      this.onErroe();
    }

    onOpen() {
      this.ws.onopen = (e) => {
        console.log("建立连接 onopen");
        this.isConnected = true;
        this.reConnectTime = 1;
      };
    }

    onMsg() {
      this.ws.onmessage = (e) => {
        console.log("监听了onmessage");
        new SparrowProtocol(e.data, (protocol) => {
          // 如果 protocol.msg 存在 表示是文本信息  否则传入url 路径
          // 只有注册了方法 才会执行
          this.onMsgCallback.message &&
            this.onMsgCallback.message(
              protocol.msg || protocol.url,
              false,
              protocol.msgType
            );
        });
      };
    }

    onClose() {
      this.ws.onclose = (e) => {
        console.log("close 事件");
        this.isConnected = false;
        // 当监听到关闭事件后 需要发起重连
        setTimeout(() => {
          this.reConnectTime++;
          this.connected(this.userId);
        }, this.reConnectTime * 200); // 重连时间 200  400 ...
      };
    }

    onErroe() {
      this.ws.onerror = function (e) {
        //如果出现连接、处理、接收、发送数据失败的时候触发onerror事件
        console.log("连接出错");
        console.log(e);
      };
    }

    sendMsg(chatType, msgType, selfId, targetId, msg) {
      // 首先判断当前是否为连接状态 不是连接状态 延迟发送
      if (this.isConnected) {
        if (msgType === TEXT_MESSAGE) {
          msg = msg.toArray().toUint8Array();
          this.sendContent(chatType, msgType, selfId, targetId, msg);
        } else {
          const fileReader = new FileReader();
          fileReader.onload = () => {
            const result = fileReader.result;
            msg = new Uint8Array(result);
            this.sendContent(chatType, msgType, selfId, targetId, msg);
          };
          fileReader.readAsArrayBuffer(msg);
        }
      } else {
        setTimeout(() => {
          this.sendWaitTime++;
          this.sendMsg(chatType, msgType, selfId, targetId, msg);
        }, this.sendWaitTime * 300);
      }
    }

    // 向服务器发送消息
    sendContent(...rest) {
      this.ws.send(new SparrowProtocol(...rest).toBytes());
    }

    // 注册事件 接收到消息后 要执行的事件
    registerCallback(fn) {
      // 消息列表的websocket 事件
      this.onMsgCallback["message"] = fn;
    }

    // 销毁事件
    unRegisterCallback(type) {
      this.onMsgCallback[type] = null;
    }
  }

  module.exports = {
    WSinstance,
  };
});
