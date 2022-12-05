define(function (require, exports, module) {
  const {
    TEXT_MESSAGE,
    IMAGE_MESSAGE,
    CHAT_TYPE_1_2_1,
    CHAT_TYPE_1_2_N,
    DB_STORE_NAME_MSG,
    SELFID,
    targetId,
    setTargetId,
  } = require("../store/store.js");
  // const { contactStore } = require("../store/contacts");
  const { contackstore } = require("../store/contacts");
  const {
    getScrollBottom,
    currentSendTime,
    historyMsgTime,
    getSessionKey,
  } = require("../utils/utils.js");
  const { initIndexedDB } = require("../utils/indexedDB.js");
  const ajaxObj = require("../utils/api.js");
  const { WSinstance } = require("../utils/websocket.js"); // WSinstance
  const currentWSInstance = new WSinstance(SELFID);
  const dbInstance = initIndexedDB();

  let localMessageTemplate;

  /* 聊天消息框区域 */
  // 初始化 聊天页面 主要是 填充模板
  function initChatPage() {
    // showMsgList();
    showChatPart();
    initAddDialog();
    // showSessionList();
  }
  // 根据模板 渲染添加朋友的弹层
  function initAddDialog() {
    // 填充 弹层
    const addFriendTemplate = document.querySelector("#add-friend-dialog");
    const addFriendContainer = document.querySelector(".search-part");
    const addFriend = addFriendTemplate.content.cloneNode(true);
    addFriendContainer.appendChild(addFriend);
    registerSearch();
  }
  // 根据模板 渲染 消息列表
  function showSessionList() {
    // 初始化 消息列表
    const list = contackstore.contactList;
    contackstore.registerCallback(changeUnreadCount, "changeUnreadCount");
    contackstore.registerCallback(sendLastMsg, "sendLastMsg");
    contackstore.registerCallback(receiveMsg, "receiveMsg");
    contackstore.registerCallback(reSort, "reSort");
    // 填充消息列表
    const msgListContainerDiv = document.querySelector(".msg-list");
    const msgListTemplate = document.querySelector("#msg-list-part");
    const fragmentListContainer = new DocumentFragment();

    // 先填充
    const divSessionItem = msgListTemplate.content.cloneNode(true);
    msgListContainerDiv.appendChild(divSessionItem);
    const templateSessionItem = msgListContainerDiv.querySelector(".msg-item");

    // 填充之前先清空列表 防止重复添加
    msgListContainerDiv.innerHTML = "";

    for (let i = 0; i < list.length; i++) {
      if (!list[i]) {
        continue;
      }
      const divList = templateSessionItem.cloneNode(true);
      // 将当前session 的标识 保存起来
      const sessionObj = {};
      if (list[i].qunId) {
        sessionObj.user_id = list[i].qunId;
        sessionObj.username = list[i].qunName;
        sessionObj.chatType = CHAT_TYPE_1_2_N;
      } else {
        sessionObj.user_id = list[i].userId;
        sessionObj.username = list[i].userName;
        sessionObj.chatType = CHAT_TYPE_1_2_1;
      }
      sessionObj.session = list[i].lastMessage.session;
      divList.info = sessionObj;
      const spanUnReadCount = divList.querySelector(".unread");
      if (list[i].unReadCount == 0) {
        spanUnReadCount.style.display = "none";
      } else {
        spanUnReadCount.innerText = list[i].unReadCount;
      }

      const spanUsername = divList.querySelector(".username");
      spanUsername.innerText = list[i].userName || list[i].qunName;

      const spanMsgTime = divList.querySelector(".msg-time");
      spanMsgTime.innerText = historyMsgTime(list[i].lastMessage.sendTime);

      const spanLastMsg = divList.querySelector(".msg-last");
      if (list[i].lastMessage.messageType === TEXT_MESSAGE) {
        // 最新信息是文本
        const msgValue = BASE64.bytesToString(
          BASE64.decodeBase64(list[i].lastMessage.content)
        );
        spanLastMsg.innerHTML = msgValue;
      } else {
        spanLastMsg.innerText = "[图片]";
      }

      fragmentListContainer.appendChild(divList);
    }
    msgListContainerDiv.appendChild(fragmentListContainer);
    clickSessions();
  }

  // sessionList 的点击事件
  function clickSessions() {
    const divMsgs = document
      .querySelector(".msg-list")
      .querySelectorAll(".msg-item");
    divMsgs.forEach((el) => {
      el.addEventListener("click", function (e) {
        const { user_id, username, chatType } = this.info;
        getMsgList(user_id, username, chatType);
        // 修改当前聊天 id
        setTargetId(user_id, username, chatType);
      });
    });
  }

  // 修改未读数量,并同步缓存
  function changeUnreadCount(count, index, lastText, keyPath) {
    const divMsgArr = document
      .querySelector(".msg-list")
      .querySelectorAll(".msg-item");
    const spanUnReadCount = divMsgArr[index].querySelector(".unread");

    // 设置样式
    if (count) {
      spanUnReadCount.style.display = "block";
      spanUnReadCount.textContent = count;
    } else {
      spanUnReadCount.style.display = "none";
      // 将最新的消息 保存到本地
      window.localStorage.setItem(keyPath, lastText);
    }
  }

  // 发送 / 接收最新信息
  function sendLastMsg(index, msgValue, msgTime, msgType) {
    const divMsgArr = document
      .querySelector(".msg-list")
      .querySelectorAll(".msg-item");
    const spanLastMsg = divMsgArr[index].querySelector(".msg-last");
    if (msgType === TEXT_MESSAGE) {
      // 最新信息是文本
      // const lastValue = BASE64.bytesToString(BASE64.decodeBase64(msgValue));
      spanLastMsg.innerHTML = msgValue;
    } else {
      spanLastMsg.innerText = "[图片]";
    }
    const spanMsgTime = divMsgArr[index].querySelector(".msg-time");
    spanMsgTime.innerText = historyMsgTime(msgTime);
  }

  function receiveMsg(index, msgValue, msgTime, msgType, count) {
    const divMsgArr = document
      .querySelector(".msg-list")
      .querySelectorAll(".msg-item");
    // 首先 更新未读数量
    const spanUnReadCount = divMsgArr[index].querySelector(".unread");
    spanUnReadCount.style.display = "block";
    spanUnReadCount.textContent = count;
    // 更新 文本 和时间
    const spanLastMsg = divMsgArr[index].querySelector(".msg-last");
    if (msgType === TEXT_MESSAGE) {
      // 最新信息是文本
      // const lastValue = BASE64.bytesToString(BASE64.decodeBase64(msgValue));
      spanLastMsg.innerHTML = msgValue;
    } else {
      spanLastMsg.innerText = "[图片]";
    }
    const spanMsgTime = divMsgArr[index].querySelector(".msg-time");
    spanMsgTime.innerText = historyMsgTime(msgTime);
  }

  // 修改当前session 列表的排列顺序
  function reSort(index) {
    const divSessionParent = document.querySelector(".msg-list");
    const divMsgArr = divSessionParent.querySelectorAll(".msg-item");
    divSessionParent.insertBefore(divMsgArr[index], divMsgArr[0]);
  }

  // 注册搜索框 搜索&点击事件
  function registerSearch() {
    const addFriend = document
      .querySelector(".search-part")
      .querySelector(".search-add");
    addFriend.addEventListener("click", function (e) {
      const addFriendDialog = document.querySelector(".dialog-add-friend-wrap");
      addFriendDialog.style.display =
        addFriendDialog.style.display === "none" ? "block" : "none";
    });
  }
  //  根据渲染聊天框
  function showChatPart() {
    const chatContainerDiv = document.querySelector(".chat-content");
    const chatTemplate = document.querySelector("#chat-part");
    const chatDive = chatTemplate.content.cloneNode(true);
    chatContainerDiv.appendChild(chatDive);
    onBtnClick();
    sendPicture();
    registerIconMore();
  }

  // 注册点击图标事件
  function registerIconMore() {
    const moreIcon = document.querySelector(".show-more-icon");
    moreIcon.addEventListener("click", (e) => {
      // 阻止冒泡
      e.stopPropagation();
      // console.log("click");
      // 动态切换侧边栏
      const moreMsg = document.querySelector(".more-message");
      moreMsg.style.display =
        moreMsg.style.display === "none" ? "block" : "none";
      document.querySelector(".group-more-part").style.display = "block";
      // 点击更多icon 后 注册window 点击事件
      window.addEventListener("click", backMoreIcon);
    });

    // 对弹出的区域做click 监听 防止冒泡 不会执行window 全局的click事件
    document
      .querySelector(".more-message")
      .addEventListener("click", function (e) {
        // 阻止冒泡 不会执行window 的click事件
        e.stopPropagation();
      });
  }

  // 控制图标的显示与隐藏 个人聊天框没有icon
  function controlIcon(chatType) {
    const divIcon = document
      .querySelector(".msg-content")
      .querySelector(".show-more-icon");
    if (chatType === CHAT_TYPE_1_2_1) {
      divIcon.style.display = "none";
    } else {
      divIcon.style.display = "block";
    }
  }
  // 右侧弹框的回弹事件
  function backMoreIcon() {
    // 用于再次显示icon 图标
    document.querySelector(".more-message").style.display = "none";
    // 隐藏后 取消window 事件
    window.removeEventListener("click", backMoreIcon);
  }
  /** 聊天页面部分 渲染聊天信息 */
  // 将要插在这个节点之前
  let referenceNode = null;
  let lastTime = null;
  async function getMsgList(user_id, username, chatType) {
    // 根据聊天框 动态修改sessionItem 样式
    switchStyle(user_id);
    // 显示传来的username
    document.querySelector(".msg-content").querySelector(".user").innerText =
      username;

    // 控制icon 显示 只有群显示icon
    controlIcon(chatType);

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

    // indexedDB 数据库中 得到与当前用户/群的聊天列表 1v1 100_101  1vN qunId
    const key = getSessionKey(chatType, SELFID, user_id);
    // console.log(key);
    const res = await dbInstance.getData(key);
    lastTime = +new Date();
    referenceNode = null;
    // 将要插在这个节点之前  倒叙插入
    res?.messages.reverse().forEach((msg) => {
      // const msgValue = BASE64.bytesToString(BASE64.decodeBase64(msg.content));
      const isSelf = msg.fromUserId === SELFID ? true : false;
      // 稀释时间
      const msgTime = relaxTime(lastTime, msg.sendTime);
      let msgValue;
      if (msg.messageType === TEXT_MESSAGE) {
        msgValue = BASE64.bytesToString(BASE64.decodeBase64(msg.content));
      } else {
        const reg = /^data:image/;
        if (reg.test(msg.content)) {
          msgValue = msg.content;
        } else {
          msgValue = "data:image/jpeg;base64," + msg.content;
        }
      }

      // 渲染聊天记录
      initMsgRecord(
        msgValue,
        isSelf,
        msg.messageType,
        msgTime,
        msgListFragment,
        referenceNode
      );
    });

    // 将构造好的列表 插入到父元素中  然后整个替换之前的消息
    currentMsgContainer.replaceChild(msgListFragment, templateMsgDom);
    parentNode.replaceChild(currentMsgContainer, oldtMsgContainer);

    // 滚动到底部
    getScrollBottom(".msg-detail");
    // 渲染完毕注册websocket onmessage 事件
    currentWSInstance.registerCallback(receiveMessage);
  }

  // 没有明确user_id 获取默认的聊天框
  function getDefaultChat() {
    if (targetId.value == "-1") {
      const { user_id, username, chatType } = getFirst();
      getMsgList(user_id, username, chatType);
    } else {
      const { value: user_id, username, type: chatType } = targetId;
      getMsgList(user_id, username, chatType);
    }
  }

  // 获取第一个聊天用户 / 群
  function getFirst() {
    const session = contackstore.contactList[0];
    const sessionObj = {};
    if (session.qunId) {
      sessionObj.user_id = session.qunId;
      sessionObj.username = session.qunName;
      sessionObj.chatType = CHAT_TYPE_1_2_N;
      targetId;
    } else {
      sessionObj.user_id = session.userId;
      sessionObj.username = session.userName;
      sessionObj.chatType = CHAT_TYPE_1_2_1;
    }

    // 修改当前聊天id
    setTargetId(sessionObj.user_id, sessionObj.username, sessionObj.chatType);

    // 设置样式
    const divItems = document
      .querySelector(".msg-list")
      .querySelectorAll(".msg-item");
    divItems.forEach((item, index) => {
      if (index === 0) {
        item.style.background = "#f3f0f0";
        item.querySelector(".unread").style.display = "none";
      } else {
        item.style.background = "none";
      }
    });
    return sessionObj;
  }

  // 根据聊天框 对消息列表的样式做切换
  function switchStyle(user_id) {
    // 有明确的聊天对象 根据user_id设置
    const itemArr = document
      .querySelector(".msg-list")
      .querySelectorAll(".msg-item");
    itemArr.forEach((item, index) => {
      if (item.info.user_id == user_id) {
        item.style.background = "#f3f0f0";
        // 每次点击 都需要重置未读数
        const lastText = item.querySelector(".msg-last").innerText;
        const content = BASE64.bytesToString(BASE64.encodeBase64(lastText));
        const keyPath = item.info.session;
        // 仅仅同步最新的消息 和未读数量
        contackstore.notify("changeUnreadCount", [0, index, content, keyPath]);
      } else {
        item.style.background = "none";
      }
    });
  }

  // 监听点击发送按钮事件
  function onBtnClick() {
    const textDom = document.querySelector(".input-content");
    // 监听发送按钮 获取聊天框信息
    const sendBtn = document.querySelector(".send-btn");
    sendBtn.addEventListener("click", () => {
      // 本地聊天框新增数据
      sendMessage(textDom.value, TEXT_MESSAGE);
      // websocket 发送数据
      currentWSInstance.sendMsg(
        targetId.type,
        TEXT_MESSAGE,
        targetId.value,
        textDom.value
      ); // userid
      textDom.value = "";
      textDom.autofocus = true;
    });
  }

  // 监听上传图片的事件
  function sendPicture() {
    const uploadFile = document.querySelector(".upload-img");
    uploadFile.addEventListener("change", function (e) {
      const file = this.files[0];
      const url = window.URL.createObjectURL(file);
      sendMessage(url, IMAGE_MESSAGE);
      currentWSInstance.sendMsg(
        targetId.type,
        IMAGE_MESSAGE,
        targetId.value,
        file
      );
    });
  }

  // 倒叙插入node节点
  function initMsgRecord(value, isSelf, type, msgTime, parentNode, oldnode) {
    const copyMessageTemplate = localMessageTemplate.cloneNode(true);
    if (isSelf) {
      copyMessageTemplate.classList.add("right");
    } else {
      copyMessageTemplate.classList.add("left");
    }
    // 设置聊天时间
    if (msgTime) {
      copyMessageTemplate.querySelector(".time").innerText = msgTime;
    } else {
      copyMessageTemplate.querySelector(".time").style.display = "none";
    }
    // 设置头像
    const avatarImg = copyMessageTemplate.querySelector(".avatar-user");
    // 将信息 渲染到页面上
    avatarImg.src = "https://img1.imgtp.com/2022/11/06/cFyHps3H.jpg";
    showMessageDetail(type, copyMessageTemplate, value);
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
  function receiveMessage(value, type) {
    const copyMessageTemplate = localMessageTemplate.cloneNode(true);
    copyMessageTemplate.classList.add("left");
    // 在互相聊天时，聊天时间不设置
    copyMessageTemplate.querySelector(".time").style.display = "none";
    commonMessage(copyMessageTemplate, value, type);
  }

  // 往聊天区域新增信息的方法
  function sendMessage(value, type) {
    const copyMessageTemplate = localMessageTemplate.cloneNode(true);
    copyMessageTemplate.classList.add("right");
    // 设置聊天时间
    copyMessageTemplate.querySelector(".time").style.display = "none";
    commonMessage(copyMessageTemplate, value, type);
  }

  function commonMessage(copyMessageTemplate, value, type) {
    // 设置头像
    const avatarImg = copyMessageTemplate.querySelector(".avatar-user");
    avatarImg.src = "https://img1.imgtp.com/2022/11/06/cFyHps3H.jpg";
    // 将信息展示到页面上
    showMessageDetail(type, copyMessageTemplate, value);
    const msgParentDiv = document.querySelector(".msg-detail");
    msgParentDiv.appendChild(copyMessageTemplate);
    getScrollBottom(".msg-detail");
  }

  // 显示聊天信息
  function showMessageDetail(type, copyMessageTemplate, value) {
    // 设置聊天信息
    if (type === TEXT_MESSAGE) {
      copyMessageTemplate.querySelector(".message-text").innerHTML = value;
      const textDom = copyMessageTemplate.querySelector(".message-detail");
      textDom.style.display = "block";
    } else {
      const img = copyMessageTemplate.querySelector(".msg-picture");
      img.style.display = "block";
      img.src = value;
      img.onload = function () {
        // 释放一个之前通过调用 URL.createObjectURL创建的 URL 对象
        window.URL.revokeObjectURL(value);
        getScrollBottom(".msg-detail");
      };
    }
  }

  module.exports = {
    initChatPage,
    getMsgList,
    showSessionList,
    getDefaultChat,
  };
});
