define(function (require, exports, module) {
  const {
    TEXT_MESSAGE,
    IMAGE_MESSAGE,
    CHAT_TYPE_1_2_1,
    CHAT_TYPE_1_2_N,
    SELFID,
    targetId,
  } = require("../store/store.js");
  const { contackstore } = require("../store/contacts.js");
  const { initIndexedDB } = require("../utils/indexedDB.js");
  const { getSessionKey } = require("../utils/utils");
  const instanceDB = initIndexedDB();
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
          // 接收来信息 先将信息保存到数据库
          if (protocol.msgType === TEXT_MESSAGE) {
            saveText(
              protocol.msg,
              protocol.chatType,
              protocol.currentUserId,
              protocol.fromUserId
            );
          } else {
            convertImgToBase64(protocol.url, function (res) {
              saveImg(
                res,
                protocol.chatType,
                protocol.currentUserId,
                protocol.fromUserId
              );
            });
          }

          // 渲染到页面中  只渲染当前激活的聊天框
          if (protocol.fromUserId === targetId.value) {
            this.onMsgCallback.message &&
              this.onMsgCallback.message(
                protocol.msg || protocol.url,
                protocol.msgType
              );
          }
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
      };
    }

    sendMsg(chatType, msgType, targetId, msg) {
      // 首先判断当前是否为连接状态 不是连接状态 延迟发送
      if (this.isConnected) {
        if (msgType === TEXT_MESSAGE) {
          saveText(msg, chatType, targetId, SELFID);
          msg = msg.toArray().toUint8Array();
          this.sendContent(chatType, msgType, SELFID, targetId, msg);
        } else {
          // 保存一个副本 把数据保存到数据库中
          const msgCopy = msg;
          const reader = new FileReader();
          reader.readAsDataURL(msgCopy);
          reader.onload = function (e) {
            saveImg(e.target.result, chatType, targetId, SELFID);
          };

          // 向服务器发送数据
          const fileReader = new FileReader();
          fileReader.onload = () => {
            const result = fileReader.result;
            msg = new Uint8Array(result);
            this.sendContent(chatType, msgType, SELFID, targetId, msg);
          };
          fileReader.readAsArrayBuffer(msg);
        }
      } else {
        setTimeout(() => {
          this.sendWaitTime++;
          this.sendMsg(chatType, msgType, targetId, msg);
        }, this.sendWaitTime * 300);
      }
    }

    // 向服务器发送消息
    sendContent(...rest) {
      const res = new SparrowProtocol(...rest);
      this.ws.send(res.toBytes());
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

  // 将文本信息 保存到数据库
  function saveText(value, chatType, targetUserId, fromUserId) {
    const content = BASE64.bytesToString(BASE64.encodeBase64(value));
    let key = getSessionKey(chatType, fromUserId, targetUserId);

    // 同步最新的msg到localStorage
    localStorage.setItem(key, content);
    // 通知session 列表更新
    if (targetUserId == SELFID) {
      // 当前是接收信息
      contackstore.update(value, TEXT_MESSAGE, key, "receiveMsg");
    } else {
      contackstore.update(value, TEXT_MESSAGE, key, "sendLastMsg");
    }

    addMsg(content, TEXT_MESSAGE, chatType, key, targetUserId, fromUserId);
  }
  // 图片信息保存数据库
  function saveImg(value, chatType, targetUserId, fromUserId) {
    let key = getSessionKey(chatType, fromUserId, targetUserId);
    // 同步最新的msg到localStorage
    localStorage.setItem(key, "img");
    // 通知session 列表更新
    if (targetUserId == SELFID) {
      // 当前是接收信息
      contackstore.update(value, IMAGE_MESSAGE, key, "receiveMsg");
    } else {
      contackstore.update(value, IMAGE_MESSAGE, key, "sendLastMsg");
    }
    addMsg(value, IMAGE_MESSAGE, chatType, key, targetUserId, fromUserId);
  }

  // 保存文本到数据库
  function addMsg(value, messageType, chatType, key, targetUserId, fromUserId) {
    const sendTime = +new Date();
    const sessionItem = {
      chatType,
      content: value,
      fromUserId,
      messageType,
      sendTime,
      session: key,
      targetUserId,
    };

    instanceDB.addSession(key, sessionItem);
  }

  // 将图片转 base64
  function convertImgToBase64(url, callback, outputFormat) {
    var canvas = document.createElement("CANVAS"),
      ctx = canvas.getContext("2d"),
      img = new Image();
    img.crossOrigin = "Anonymous";
    img.onload = function () {
      canvas.height = img.height;
      canvas.width = img.width;
      ctx.drawImage(img, 0, 0);
      var dataURL = canvas.toDataURL(outputFormat || "image/png");
      callback.call(this, dataURL);
      canvas = null;
    };
    img.src = url;
  }

  module.exports = {
    WSinstance,
  };
});