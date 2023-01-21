define([
  "store",
  "contacts",
  "utils",
  "indexedDB",
  "websocket",
  "api",
], function (store, contacts, utils, indexedDB, websocket, api) {
  const {
    TEXT_MESSAGE,
    IMAGE_MESSAGE,
    CHAT_TYPE_1_2_1,
    CHAT_TYPE_1_2_N,
    DB_STORE_NAME_SESSION,
    DB_STORE_NAME_USER,
    DB_STORE_NAME_QUN,
    selfId,
    targetId,
    setTargetId,
    qunNumberMap,
  } = store;
  const { contactStore } = contacts;

  const {
    getScrollBottom,
    historyMsgTime,
    getSessionKey,
    sessionTime,
    currentSendTime,
  } = utils;
  const DBObject = indexedDB;
  // const ajaxObj = require("../utils/api.js");
  // const { wsInstance } = websocket; // wsInstance
  // console.log(wsInstance);
  let wsInstance;
  function getWsInstance(ws) {
    wsInstance = ws;
  }
  // const wsInstance = createWS(selfId.value);
  // const dbInstance = initIndexedDB();

  let localMessageTemplate;

  /* 聊天消息框区域 */
  // 初始化 聊天页面 主要是 填充模板
  function initChatPage() {
    console.log("注册");
    // 发送按钮事件
    onBtnClick();
    // 回车发送信息事件
    enterSend();
    // 发送图片事件
    sendPicture();
  }

  // 聊天页面部分 渲染聊天信息
  // 将要插在这个节点之前,这里使用倒叙插入
  let referenceNode = null;
  let lastTime = null;
  async function getMsgList(user_id, username, chatType) {
    // 根据聊天框 动态修改sessionItem 样式

    if (username) {
      document.querySelector(".msg-content").querySelector(".user").innerText =
        username;
    }

    // 如果是群 需要保存当前的群成员,同时设置群的信息
    if (chatType === CHAT_TYPE_1_2_N) {
      const membersArr = await DBObject.dbInstance.getData(
        user_id,
        DB_STORE_NAME_QUN
      );
      qunNumberMap.initQunMap(membersArr.members);
      showGroupDetail(membersArr);
    }

    // 控制icon 显示 只有群显示icon
    // 每次在渲染列表之前 先删除上一次的节点 再渲染新的节点
    const parentNode = document.querySelector(".msg-content");
    const oldtMsgContainer = document.querySelector(".msg-detail");
    const currentMsgContainer = oldtMsgContainer.cloneNode();

    // 先把模板插入到文档中
    const templateMsg = document.querySelector("#message-detail-part");
    const msgDiv = templateMsg.content.cloneNode(true);
    currentMsgContainer.appendChild(msgDiv);

    // 再获取空模板 根据列表渲染
    const templateMsgDom = currentMsgContainer.querySelector(".message");

    // 对消息模板做保存
    if (!localMessageTemplate) {
      localMessageTemplate = templateMsgDom;
    }

    // 先将DOM渲染到文档碎片中 再一次性添加到文档中
    const msgListFragment = new DocumentFragment();

    // indexedDB 数据库中 得到与当前用户/群的历史记录 先得到keyPath => 1v1 100_101  1vN qunId
    const key = getSessionKey(chatType, selfId.value, user_id);
    const res = await DBObject.dbInstance.getData(key, DB_STORE_NAME_SESSION);
    lastTime = +new Date();
    referenceNode = null;
    // 将要插在这个节点之前  倒叙插入
    res?.messages.reverse().forEach((msg) => {
      const isSelf = msg.fromUserId === selfId.value ? true : false;
      // 稀释时间 每个十分钟显示一次聊天时间
      const msgTime = relaxTime(lastTime, msg.serverTime);
      let msgValue;
      if (msg.messageType === TEXT_MESSAGE) {
        msgValue = BASE64.bytesToString(BASE64.decodeBase64(msg.content));
      } else {
        msgValue = msg.content;
      }
      // 渲染聊天记录
      initMsgRecord(
        msgValue,
        isSelf,
        msg.messageType,
        msgTime,
        msgListFragment,
        referenceNode,
        msg.fromUserId
      );
    });

    // 将构造好的列表 插入到父元素中  然后整个替换之前的消息
    currentMsgContainer.replaceChild(msgListFragment, templateMsgDom);
    parentNode.replaceChild(currentMsgContainer, oldtMsgContainer);

    // 滚动到底部
    getScrollBottom(".msg-detail");
    // 渲染完毕注册websocket onmessage 事件
    wsInstance.registerCallback(receiveMessage);
  }

  // 没有明确user_id 获取默认的聊天框，就是session列表的第一个用户 / 群
  function getDefaultChat() {
    if (targetId.value == "-1") {
      // 没有任何聊天记录,就不需要渲染任何元素
      // getMsgList();
    } else {
      const { value: user_id, username, type: chatType } = targetId;
      getMsgList(user_id, username, chatType);
      // 在跳到第一个session 用户后，发送请求设置已读
      // 将最新的消息 保存到本地
      const params = {
        chatType,
        sessionKey: getSessionKey(chatType, selfId.value, user_id),
        userId: selfId.value,
      };
      // 每次发送信息都要 更新已读

      api.setRead(params);
    }
  }
  // 点击按钮 / 回车发送消息
  function sendMsgByBtn() {
    const textDom = document.querySelector(".input-content");
    if (textDom.value.length === 0) return;
    sendMessage(textDom.value, TEXT_MESSAGE);
    // websocket 发送数据
    wsInstance.sendMsg(
      targetId.type,
      TEXT_MESSAGE,
      targetId.value,
      textDom.value
    ); // userid
    textDom.value = "";
    textDom.autofocus = true;
  }
  // textarea 阻止默认的回车换行事件
  function enterSend() {
    const textarea = document
      .querySelector(".chat-msg")
      .querySelector(".input-content");
    textarea.onkeydown = function (event) {
      // ctrl + 回车 换行
      if (event.ctrlKey && event.keyCode == 13) {
        this.value = this.value + "\n";
        return;
      }
      // 回车 发送信息
      if (event.keyCode == 13) {
        // 调用发送按钮的事件 并阻止默认的回车换行事件
        sendMsgByBtn();
        return false;
      }
    };
  }

  // 监听点击发送按钮事件
  function onBtnClick() {
    const sendBtn = document.querySelector(".send-btn");
    sendBtn.addEventListener("click", sendMsgByBtn);
  }

  // 监听上传图片的事件
  function sendPicture() {
    const uploadFile = document.querySelector(".upload-img");
    uploadFile.addEventListener("change", function (e) {
      const file = this.files[0];
      // 获取到文件后 清空值 防止重复上传图片的bug
      uploadFile.value = "";
      const url = window.URL.createObjectURL(file);
      sendMessage(url, IMAGE_MESSAGE);
      wsInstance.sendMsg(targetId.type, IMAGE_MESSAGE, targetId.value, file);
    });
  }

  // 倒叙插入node节点
  function initMsgRecord(
    value,
    isSelf,
    type,
    msgTime,
    parentNode,
    oldnode,
    memberId
  ) {
    const copyMessageTemplate = localMessageTemplate.cloneNode(true);

    // 设置聊天时间
    if (msgTime) {
      copyMessageTemplate.querySelector(".time").innerText = msgTime;
    } else {
      copyMessageTemplate.querySelector(".time").style.display = "none";
    }
    // 设置头像
    const avatarImg = copyMessageTemplate.querySelector(".avatar-user");
    if (isSelf) {
      // 自己
      copyMessageTemplate.classList.add("right");
      avatarImg.src = selfId.avatar;
    } else {
      copyMessageTemplate.classList.add("left");
      if (targetId.avatar) {
        // 目标聊天对象的avatar 存在  说明是  用户
        avatarImg.src = targetId.avatar;
      } else {
        // 当前是群聊 需要通过id 查询 用户头像
        avatarImg.src = qunNumberMap.map[memberId].avatar;
      }
    }
    // 将信息 渲染到页面上
    showMessageDetail(type, copyMessageTemplate, value, memberId);
    referenceNode = parentNode.insertBefore(copyMessageTemplate, oldnode);
  }

  /**
   * @description: 稀释时间 每隔10分钟 展示一次时间
   * @param lastTemp  最新的间隔时间戳
   * @param msgTime  聊天信息的时间戳
   */
  function relaxTime(lastTemp, msgTime) {
    if (lastTemp - msgTime > 1000 * 60 * 10) {
      lastTime = msgTime;
      return historyMsgTime(msgTime);
    } else {
      false;
    }
  }

  // 接收消息
  function receiveMessage(value, type, memberId) {
    const copyMessageTemplate = localMessageTemplate.cloneNode(true);
    copyMessageTemplate.classList.add("left");
    commonMessage(copyMessageTemplate, value, type, memberId);
  }

  // 往聊天区域新增信息的方法
  function sendMessage(value, type) {
    const copyMessageTemplate = localMessageTemplate.cloneNode(true);
    copyMessageTemplate.classList.add("right");
    // 发送方 在任何情况下都不需要显示 用户名，所以不需要传入 memberId
    commonMessage(copyMessageTemplate, value, type);
  }

  // 收发消息共有的操作
  function commonMessage(copyMessageTemplate, value, type, memberId) {
    // 设置时间
    const currentTemp = Date.now();
    if (currentTemp - lastTime > 1000 * 60 * 10) {
      copyMessageTemplate.querySelector(".time").textContent =
        currentSendTime();
      lastTime = currentTemp;
    } else {
      copyMessageTemplate.querySelector(".time").style.display = "none";
    }

    // 设置头像
    const avatarImg = copyMessageTemplate.querySelector(".avatar-user");
    console.log(copyMessageTemplate.className);
    if (copyMessageTemplate.className.includes("right")) {
      // 当前是自己发送的信息
      avatarImg.src = selfId.avatar;
    } else {
      // 当前是 其他人发送来的信息
      if (memberId || memberId === 0) {
        // 这里代表的是 群 需要通过memberId 获取avatar
        avatarImg.src = qunNumberMap.map[memberId].avatar;
      } else {
        // 当前聊天对象是用户
        avatarImg.src = targetId.avatar;
      }
    }
    // 将信息展示到页面上
    showMessageDetail(type, copyMessageTemplate, value, memberId);
    const msgParentDiv = document.querySelector(".msg-detail");
    msgParentDiv.appendChild(copyMessageTemplate);
    getScrollBottom(".msg-detail");
  }

  // 显示聊天信息
  function showMessageDetail(type, copyMessageTemplate, value, memberId) {
    // 根据聊天类型 设置用户名
    if (targetId.type === CHAT_TYPE_1_2_N) {
      const divsUsername = copyMessageTemplate.querySelectorAll(".username");
      for (let i = 0; i < divsUsername.length; i++) {
        divsUsername[i].style.display = "block";
        if (memberId || memberId === 0) {
          divsUsername[i].textContent = qunNumberMap.map[memberId].userName;
        }
      }
    }
    // 设置聊天信息
    if (type === TEXT_MESSAGE) {
      copyMessageTemplate.querySelector(".message-text").innerHTML = value;
      const textDom = copyMessageTemplate.querySelector(".message-detail");
      textDom.style.display = "block";
    } else {
      const divImgContainer = copyMessageTemplate.querySelector(
        ".msg-picture-detail"
      );
      const img = copyMessageTemplate.querySelector(".msg-picture");
      divImgContainer.style.display = "block";
      img.src = value;
      img.onload = function () {
        // 释放一个之前通过调用 URL.createObjectURL创建的 URL 对象
        window.URL.revokeObjectURL(value);
        getScrollBottom(".msg-detail");
      };
    }
  }

  return {
    initChatPage,
    getDefaultChat,
    getWsInstance,
  };
});
