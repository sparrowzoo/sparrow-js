define(['store', 'utils', 'imageCompression'], function (
  store,
  utils,
  imageCompression
) {
  const { TEXT_MESSAGE, selfId, ACCEPT_RECALL } = store;
  const { delLocalMsg } = utils;
  // const dbInstance = initIndexedDB();
  class WSinstance {
    // 重连标志
    lockReconnect = false;
    // 发送等待时间
    sendWaitTime = 1;
    // websocket 连接的id
    userId = null;
    // 接收到信息后需要执行的事件
    onMsgCallback = {};
    // 心跳间隔时间 10s
    heartTimt = 10000;
    // 心跳超时时间 12s
    heartTimeout = 12000;
    // 重连时间 0.5s
    reconnectTime = 500;
    timeoutTimer = null;
    serverTimeoutTimer = null;
    constructor(userId) {
      this.connected(userId);
    }

    connected(userId) {
      this.userId = userId;
      try {
        if ('WebSocket' in window) {
          this.ws = new WebSocket('ws://chat.sparrowzoo.com/websocket', [
            userId,
          ]);
          this.onOpen();
          this.onMsg();
          this.onClose();
          this.onError();
        }
      } catch (e) {
        this.reconnectWebSocket();
      }
    }

    onOpen() {
      this.ws.onopen = (e) => {
        console.log('连接事件');
        // 启动心跳
        this.closeHeartBeat();
        this.startHeartBeat();
      };
    }

    onMsg() {
      this.ws.onmessage = (e) => {
        // 有任何信息传入 当前的ws 没有断，重启心跳
        this.closeHeartBeat();
        this.startHeartBeat();
        // 加个判断,如果是PONG，说明当前是后端返回的心跳包 停止下面的代码执行
        if (e.data === 'PONG') return;
        new SparrowProtocol(e.data, (protocol) => {
          // 判断是否为 撤回的信息
          if (protocol.chatType === 2) {
            delLocalMsg(
              protocol.clientSendTime,
              protocol.sessionKey,
              ACCEPT_RECALL
            );
            return;
          }
          // 接收到信息 渲染到页面上上
          this.onMsgCallback.message &&
            this.onMsgCallback.message(
              protocol.msg || protocol.url,
              protocol.msgType,
              protocol.clientSendTime
            );
        });
      };
    }

    onClose() {
      this.ws.onclose = (e) => {
        console.log(e);
        console.log('close 事件');
        this.closeHeartBeat();
        if (e.wasClean) {
          // 干净的关闭，客户端主动关闭 不需要发起重连,关闭上一个心跳
          console.log('不重连');
        } else {
          // 异常关闭 需要发起重连
          this.reconnectWebSocket();
        }
      };
    }

    onError() {
      this.ws.onerror = (e) => {
        // 如果出现连接、处理、接收、发送数据失败的时候触发onerror事件
        console.log('连接出错');
        this.closeHeartBeat();
        this.reconnectWebSocket();
      };
    }

    // 关闭连接
    close() {
      this.ws.close();
    }

    async sendMsg(chatType, msgType, targetId, msg, clientSendTime) {
      // 首先判断当前是否为重连状态
      if (!this.lockReconnect) {
        if (msgType === TEXT_MESSAGE) {
          const newMsg = msg.toArray().toUint8Array();
          this.sendContent(
            chatType,
            msgType,
            selfId.value,
            targetId,
            newMsg,
            clientSendTime
          );
        } else {
          let compressImg = await handleImageUpload(msg);
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
              compressImg,
              clientSendTime
            );
          };
          fileReader.readAsArrayBuffer(msg);
        }
      } else {
        setTimeout(() => {
          this.sendMsg(chatType, msgType, targetId, msg, clientSendTime);
        }, 2000);
      }
    }

    // 向服务器发送消息
    async sendContent(...rest) {
      const res = new SparrowProtocol(...rest);
      // 发送到服务器
      this.ws.send(res.toBytes());
    }

    // 重连操作
    reconnectWebSocket() {
      // 当前正在重连  直接返回 不再开启延时
      if (this.lockReconnect) return;
      this.lockReconnect = true;
      // 发起重连后，取消之前的心跳
      this.closeHeartBeat();
      setTimeout(() => {
        this.connected(this.userId);
        this.lockReconnect = false;
      }, this.reconnectTime);
    }

    // 心跳机制 --启动心跳
    startHeartBeat() {
      this.timeoutTimer = setTimeout(() => {
        // 开启一个心跳
        this.ws.send('PING');
        // console.log('心跳开启', new Date().getSeconds());
        // 检测当前开启的这个心跳是否超时
        this.serverTimeoutTimer = setTimeout(() => {
          // 这里表示 已经超时，服务器没有响应需要重连
          // this.ws.close();
          this.reconnectWebSocket();
        }, this.heartTimeout); // 12s
      }, this.heartTimt); // 10s
    }

    // 关闭心跳
    closeHeartBeat() {
      clearTimeout(this.timeoutTimer);
      clearTimeout(this.serverTimeoutTimer);
    }

    // 注册事件 接收到消息后 要执行的事件
    registerCallback(fn) {
      // 消息列表的websocket 事件
      this.onMsgCallback['message'] = fn;
    }

    // 销毁事件
    unRegisterCallback(type) {
      this.onMsgCallback[type] = null;
    }
  }

  // 压缩图片
  async function handleImageUpload(file) {
    const imageFile = file;
    console.log('originalFile instanceof Blob', imageFile instanceof Blob); // true
    console.log(`originalFile size ${imageFile.size / 1024 / 1024} MB`);

    const options = {
      maxSizeMB: 0.1,
      maxWidthOrHeight: 1920,
      useWebWorker: true,
    };
    try {
      const compressedFile = await imageCompression(imageFile, options);
      console.log(
        'compressedFile instanceof Blob',
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

  // const ws = new WSinstance(selfId.value);
  // let wsInstance = {};  初始化 ws
  function createWS(id) {
    //  wsInstance = new WSinstance(id);
    return new WSinstance(id);
  }
  return {
    createWS,
    // wsInstance,
  };
});