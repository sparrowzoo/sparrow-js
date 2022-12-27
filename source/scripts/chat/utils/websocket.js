define([
  "store",
  "contacts",
  "indexedDB",
  "utils",
  "imageCompression",
  "api",
], function (store, contacts, indexedDB, utils, imageCompression, api) {
  const {
    TEXT_MESSAGE,
    IMAGE_MESSAGE,
    CHAT_TYPE_1_2_1,
    CHAT_TYPE_1_2_N,
    selfId,
    targetId,
    DB_STORE_NAME_SESSION,
  } = store;
  const { contactStore } = contacts;
  const { initIndexedDB } = indexedDB;
  const { getSessionKey } = utils;
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
      this.onError();
    }

    onOpen() {
      this.ws.onopen = (e) => {
        console.log("连接事件");
        this.isConnected = true;
        this.reConnectTime = 1;
      };
    }

    onMsg() {
      this.ws.onmessage = (e) => {
        new SparrowProtocol(e.data, (protocol) => {
          // 接收来信息 先将信息保存到数据库
          console.log(protocol, "接收信息");

          if (protocol.msgType === TEXT_MESSAGE) {
            if (protocol.sessionKey) {
              // 当前是群聊信息
              saveTextQun(
                protocol.msg,
                protocol.sessionKey,
                protocol.fromUserId
              );
            } else {
              // 当前是用户消息
              saveText(
                protocol.msg,
                protocol.chatType,
                protocol.currentUserId,
                protocol.fromUserId
              );
            }
          } else {
            if (protocol.sessionKey) {
              saveImgQun(
                protocol.url,
                protocol.sessionKey,
                protocol.fromUserId
              );
            } else {
              saveImg(
                protocol.url,
                protocol.chatType,
                protocol.currentUserId,
                protocol.fromUserId
              );
            }
          }

          // 根据fromUserId 和聊天类型 判断是否需要在聊天框中渲染聊天信息
          if (protocol.sessionKey) {
            // 群来的信息 判断是否需要渲染信息
            if (protocol.sessionKey == targetId.value) {
              this.onMsgCallback.message &&
                this.onMsgCallback.message(
                  protocol.msg || protocol.url,
                  protocol.msgType,
                  protocol.fromUserId
                );
            }
          } else {
            // 不是群来的信息，判断是否需要渲染信息
            if (protocol.fromUserId == targetId.value) {
              this.onMsgCallback.message &&
                this.onMsgCallback.message(
                  protocol.msg || protocol.url,
                  protocol.msgType
                );
            }
          }
        });
      };
    }

    onClose() {
      this.ws.onclose = (e) => {
        console.log("close 事件");
        // this.isConnected = false;
        // // 当监听到关闭事件后 需要发起重连
        // setTimeout(() => {
        //   this.reConnectTime++;
        //   this.connected(this.userId);
        // }, this.reConnectTime * 200); // 重连时间 200  400 ...
      };
    }

    onError() {
      this.ws.onerror = function (e) {
        //如果出现连接、处理、接收、发送数据失败的时候触发onerror事件
        console.log("连接出错");
      };
    }

    async sendMsg(chatType, msgType, targetId, msg) {
      // 首先判断当前是否为连接状态 不是连接状态 延迟发送
      if (this.isConnected) {
        if (msgType === TEXT_MESSAGE) {
          saveText(msg, chatType, targetId, selfId.value);
          msg = msg.toArray().toUint8Array();
          this.sendContent(chatType, msgType, selfId.value, targetId, msg);
        } else {
          // 保存一个副本 把数据保存到数据库中
          let compressImg = await handleImageUpload(msg);
          const msgCopy = compressImg;
          const reader = new FileReader();
          reader.readAsDataURL(msgCopy);
          reader.onload = function (e) {
            saveImg(e.target.result, chatType, targetId, selfId.value);
          };

          // 向服务器发送数据
          const fileReader = new FileReader();
          fileReader.onload = () => {
            const result = fileReader.result;
            compressImg = new Uint8Array(result);
            this.sendContent(
              chatType,
              msgType,
              selfId.value,
              targetId,
              compressImg
            );
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
    async sendContent(...rest) {
      const res = new SparrowProtocol(...rest);
      this.ws.send(res.toBytes());
      const params = {
        chatType: res.chatType,
        sessionKey: getSessionKey(res.chatType, selfId.value, res.targetUserId),
        userId: selfId.value,
      };
      // 每次发送信息都要 更新已读
      api.setRead(params);
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

  // 压缩图片
  async function handleImageUpload(file) {
    const imageFile = file;
    console.log("originalFile instanceof Blob", imageFile instanceof Blob); // true
    console.log(`originalFile size ${imageFile.size / 1024 / 1024} MB`);

    const options = {
      maxSizeMB: 0.1,
      maxWidthOrHeight: 1920,
      useWebWorker: true,
    };
    try {
      const compressedFile = await imageCompression(imageFile, options);
      console.log(
        "compressedFile instanceof Blob",
        compressedFile instanceof Blob
      ); // true
      console.log(
        `compressedFile size ${compressedFile.size / 1024 / 1024} MB`
      ); // smaller than maxSizeMB
      // img.src = window.URL.createObjectURL(compressedFile);
      // await uploadToServer(compressedFile); // write your own logic
      return compressedFile;
    } catch (error) {
      console.log(error);
    }
  }

  // 将用户文本信息 保存到数据库
  function saveText(value, chatType, targetUserId, fromUserId) {
    const content = BASE64.bytesToString(BASE64.encodeBase64(value));
    let key = getSessionKey(chatType, fromUserId, targetUserId);

    // 通知session 列表更新
    if (targetUserId == selfId.value) {
      // 当前是接收信息
      contactStore.receive(value, TEXT_MESSAGE, key, fromUserId);
    } else {
      contactStore.send(value, TEXT_MESSAGE, key);
    }

    addMsg(content, TEXT_MESSAGE, chatType, key, targetUserId, fromUserId);
  }
  // 将群文本信息 保存数据库  --针对接收信息
  function saveTextQun(value, session, fromUserId) {
    const content = BASE64.bytesToString(BASE64.encodeBase64(value));
    if (fromUserId != selfId.value) {
      contactStore.receive(value, TEXT_MESSAGE, session, session);
    }
    addMsg(
      content,
      TEXT_MESSAGE,
      CHAT_TYPE_1_2_N,
      session,
      session,
      fromUserId
    );
  }
  // 用户图片信息保存数据库
  function saveImg(value, chatType, targetUserId, fromUserId) {
    let key = getSessionKey(chatType, fromUserId, targetUserId);
    // 通知session 列表更新
    if (targetUserId == selfId.value) {
      // 当前是接收信息
      contactStore.receive(value, IMAGE_MESSAGE, key, fromUserId);
    } else {
      contactStore.send(value, IMAGE_MESSAGE, key);
    }
    addMsg(value, IMAGE_MESSAGE, chatType, key, targetUserId, fromUserId);
  }

  // 群 图片保存数据库  -- 针对接收信息
  function saveImgQun(value, session, fromUserId) {
    if (fromUserId != selfId.value) {
      contactStore.receive(value, IMAGE_MESSAGE, session, session);
    }
    addMsg(value, IMAGE_MESSAGE, CHAT_TYPE_1_2_N, session, session, fromUserId);
  }

  // 向本地数据中添加消息
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

    instanceDB.updateStoreItem(key, sessionItem, DB_STORE_NAME_SESSION);
  }

  // const ws = new WSinstance(selfId.value);
  // let wsInstance = {};
  function createWS(id) {
    //  wsInstance = new WSinstance(id);
    return new WSinstance(id);
  }
  return {
    createWS,
    // wsInstance,
  };
});
