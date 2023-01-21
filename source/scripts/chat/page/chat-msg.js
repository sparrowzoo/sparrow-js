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
    showChatPart();
    initAddDialog();
  }
  // 根据模板 渲染聊天框
  function showChatPart() {
    const chatContainerDiv = document.querySelector(".chat-content");
    const chatTemplate = document.querySelector("#chat-part");
    const chatDive = chatTemplate.content.cloneNode(true);
    chatContainerDiv.appendChild(chatDive);
    // 聊天框渲染完毕 注册相关事件
    // 发送按钮事件
    onBtnClick();
    // 回车发送信息事件
    enterSend();
    // 发送图片事件
    sendPicture();
    // 更多图标的点击事件
    registerIconMore();
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
  // 根据模板 渲染 消息列表, 这个列表在 拿到好友就已经确定了
  function showSessionList() {
    // 初始化 消息列表
    const list = contactStore.contactList;
    // 注册操作列表的回调，数据变动后,自动更新列表
    contactStore.registerCallback(changeUnreadCount, "changeUnreadCount");
    contactStore.registerCallback(sendLastMsg, "sendLastMsg");
    contactStore.registerCallback(receiveMsg, "receiveMsg");
    contactStore.registerCallback(addSessionItem, "addSessionItem");
    contactStore.registerCallback(reSort, "reSort");
    // 填充消息列表
    const msgListContainerDiv = document.querySelector(".msg-list");
    const msgListTemplate = document.querySelector("#msg-list-part");
    const fragmentListContainer = new DocumentFragment();

    // 先填充,获取到真实的DOM元素
    const divSessionItem = msgListTemplate.content.cloneNode(true);
    msgListContainerDiv.appendChild(divSessionItem);
    const templateSessionItem = msgListContainerDiv.querySelector(".msg-item");
    // 填充之前先清空列表 防止重复添加
    msgListContainerDiv.innerHTML = "";

    for (let i = 0; i < list.length; i++) {
      const divList = templateSessionItem.cloneNode(true);
      divList.info = list[i];
      // 未读数量
      const spanUnReadCount = divList.querySelector(".unread");
      if (list[i].unReadCount == 0) {
        spanUnReadCount.style.display = "none";
      } else {
        spanUnReadCount.innerText = list[i].unReadCount;
      }
      // 用户名
      const spanUsername = divList.querySelector(".username");
      spanUsername.innerText = list[i].userName || list[i].qunName;
      // 用户头像
      const imgUser = divList.querySelector(".avatar-img");
      // 用户国籍
      const imgNation = divList.querySelector(".nation");
      if (list[i].qunId) {
        // 当前是群
        imgUser.src = list[i].unitIcon;
        imgNation.style.display = "none";
      } else {
        // 当前是 用户
        imgUser.src = list[i].avatar;
        imgNation.src = list[i].flagUrl;
      }

      // 最新消息的发送时间
      const spanMsgTime = divList.querySelector(".msg-time");
      spanMsgTime.innerText = sessionTime(list[i].lastMessage.serverTime);
      // 最新消息
      const spanLastMsg = divList.querySelector(".msg-last");
      if (list[i].lastMessage.messageType === TEXT_MESSAGE) {
        // 最新信息是文本
        const msgValue = BASE64.bytesToString(
          BASE64.decodeBase64(list[i].lastMessage.content)
        );
        spanLastMsg.textContent = msgValue;
      } else {
        spanLastMsg.innerText = "[图片]";
      }

      fragmentListContainer.appendChild(divList);
    }
    msgListContainerDiv.appendChild(fragmentListContainer);
    // 列表渲染完毕，注册sessionItem 的点击事件
    clickSessions();
  }

  // sessionList 的点击事件
  function clickSessions() {
    const divMsgs = document
      .querySelector(".msg-list")
      .querySelectorAll(".msg-item");
    divMsgs.forEach((el) => {
      el.onclick = function () {
        // const { user_id, username, chatType } = this.info;
        let targetId, username, chatType, avatar;

        if (el.info.userName) {
          // 当前是用户
          // 每次点击 动态切换右侧的聊天框区域
          // 修改当前聊天 id
          targetId = el.info.userId;
          username = el.info.userName;
          avatar = el.info.avatar;
          chatType = CHAT_TYPE_1_2_1;
        } else {
          targetId = el.info.qunId;
          username = el.info.qunName;
          chatType = CHAT_TYPE_1_2_N;
        }
        getMsgList(targetId, username, chatType);
        setTargetId(targetId, username, chatType, avatar);
      };
    });
  }

  // 点击查看未读信息
  function changeUnreadCount(index, item) {
    // sessionItem
    const divMsgArr = document
      .querySelector(".msg-list")
      .querySelectorAll(".msg-item");
    const spanUnReadCount = divMsgArr[index].querySelector(".unread");
    // 设置样式
    spanUnReadCount.style.display = "none";
    // 将最新的消息 保存到本地
    const params = {
      chatType: item.lastMessage.chatType,
      sessionKey: item.lastMessage.session,
      userId: selfId.value,
    };
    // 每次发送信息都要 更新已读
    api.setRead(params);
  }

  // 发送最新信息 列表变化的逻辑
  function sendLastMsg(sessionItem) {
    updateSessionCom(sessionItem);
    // const divMsgArr = document
    //   .querySelector(".msg-list")
    //   .querySelectorAll(".msg-item");
    // const spanLastMsg = divMsgArr[index].querySelector(".msg-last");
    // if (msgType === TEXT_MESSAGE) {
    //   // 最新信息是文本
    //   spanLastMsg.innerHTML = msgValue;
    // } else {
    //   spanLastMsg.innerText = "[图片]";
    // }
    // const spanMsgTime = divMsgArr[index].querySelector(".msg-time");
    // spanMsgTime.innerText = historyMsgTime(msgTime);
  }
  // 接收最新信息 列表变化的逻辑
  function receiveMsg(item) {
    const divMsgArr = document
      .querySelector(".msg-list")
      .querySelectorAll(".msg-item");
    // 首先 更新未读数量
    if (item.count) {
      // 只有在 count 存在 才更新  当前会话 发送来的信息 不增加未读数
      const spanUnReadCount = divMsgArr[item.index].querySelector(".unread");
      spanUnReadCount.style.display = "block";
      spanUnReadCount.textContent = item.count;
    }
    updateSessionCom(item);
    // 更新 文本 和时间
    // const spanLastMsg = divMsgArr[index].querySelector(".msg-last");
    // if (msgType === TEXT_MESSAGE) {
    //   // 最新信息是文本
    //   spanLastMsg.innerHTML = msgValue;
    // } else {
    //   spanLastMsg.innerText = "[图片]";
    // }
    // const spanMsgTime = divMsgArr[index].querySelector(".msg-time");
    // spanMsgTime.innerText = historyMsgTime(msgTime);
  }
  function updateSessionCom(sessionItem) {
    const { index, msgValue, msgTime, msgType } = sessionItem;
    const divMsgArr = document
      .querySelector(".msg-list")
      .querySelectorAll(".msg-item");
    const spanLastMsg = divMsgArr[index].querySelector(".msg-last");
    if (msgType === TEXT_MESSAGE) {
      // 最新信息是文本
      spanLastMsg.textContent = msgValue;
    } else {
      spanLastMsg.innerText = "[图片]";
    }
    const spanMsgTime = divMsgArr[index].querySelector(".msg-time");
    spanMsgTime.innerText = historyMsgTime(msgTime);
  }

  // 增加 session item
  function addSessionItem(item) {
    const msgListContainerDiv = document.querySelector(".msg-list");
    const divList = msgListContainerDiv.querySelector(".msg-item");

    const msgListTemplate = document.querySelector("#msg-list-part");
    // 先填充,获取到真实的DOM元素
    const divSessionItem = msgListTemplate.content.cloneNode(true);
    // 未读数量
    const spanUnReadCount = divSessionItem.querySelector(".unread");
    spanUnReadCount.style.display = "none";

    // 用户名
    const spanUsername = divSessionItem.querySelector(".username");
    spanUsername.innerText = item.userName || item.qunName;

    // 用户头像 / 国籍
    // 用户头像
    const imgUser = divSessionItem.querySelector(".avatar-img");
    // imgUser.src =
    imgUser.src = item.avatar;
    // 用户国籍
    const imgNation = divSessionItem.querySelector(".nation");
    if (item.userName) {
      imgNation.src = item.flagUrl;
    }

    // 向 session list 中添加item
    if (divList) {
      // 之前有session ,所以要使用 insertBefore 插入到最前面
      msgListContainerDiv.insertBefore(divSessionItem, divList);
    } else {
      // 添加之前没有session 直接添加就行
      msgListContainerDiv.appendChild(divSessionItem);
    }

    // 插入到文档后 再添加info属性 新插入的info 属性 是用户 / 群的信息 里面没有sessin
    msgListContainerDiv.querySelector(".msg-item").info = item;
    // 列表渲染完毕，注册sessionItem 的点击事件
    clickSessions();
  }

  // 发送/接收后的列表重新排序
  function reSort(index) {
    // 将 index 位置的session 放到最前面
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

  // 注册点击更多图标事件
  function registerIconMore() {
    const moreIcon = document.querySelector(".show-more-icon");
    const divMoreMsg = document.querySelector(".more-message");
    // 对弹出的区域做click 监听 防止冒泡 不会执行window 全局的click事件
    divMoreMsg.addEventListener("click", function (e) {
      // 阻止冒泡 不会执行window 的click事件
      e.stopPropagation();
    });
    moreIcon.addEventListener("click", (e) => {
      // 阻止冒泡，不会触发window 注册的点击事件
      e.stopPropagation();
      // 控制侧边栏的显示
      divMoreMsg.style.display =
        divMoreMsg.style.display === "none" ? "block" : "none";
      document.querySelector(".group-more-part").style.display = "block";
      // 点击更多icon 后 注册window 点击事件，用于隐藏侧边栏
      window.addEventListener("click", backMoreIcon);
    });
  }

  // 右侧弹框的回弹事件
  function backMoreIcon() {
    // 用于再次显示icon 图标
    document.querySelector(".more-message").style.display = "none";
    // 隐藏后 取消window 事件
    window.removeEventListener("click", backMoreIcon);
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

  // 聊天页面部分 渲染聊天信息
  // 将要插在这个节点之前,这里使用倒叙插入
  let referenceNode = null;
  let lastTime = null;
  async function getMsgList(user_id, username, chatType) {
    // 根据聊天框 动态修改sessionItem 样式
    await switchStyle(user_id, chatType);
    // 显示传来的username

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
  // 根据聊天框 对消息列表的样式做切换
  async function switchStyle(targetId, chatType) {
    // 有明确的聊天对象 根据user_id设置
    const itemArr = document
      .querySelector(".msg-list")
      .querySelectorAll(".msg-item");
    if (itemArr.length) {
      // 当前有session list
      const idType = chatType === CHAT_TYPE_1_2_1 ? "userId" : "qunId";
      itemArr.forEach((item, index) => {
        if (item.info[idType] == targetId) {
          item.style.background = "#f3f0f0";
          // 每次点击 都需要重置未读数
          const keyPath = item.info.lastMessage.session;
          // 仅仅同步最新未读数量
          contactStore.setUnread(keyPath, "changeUnreadCount");
        } else {
          item.style.background = "none";
        }
      });
    } else {
      // 没有session list 就需要添加 一个session item 先根据chatType 确定查什么表
      // console.log(user_id);
      // const storeName =
      //   chatType == CHAT_TYPE_1_2_1 ? DB_STORE_NAME_USER : DB_STORE_NAME_USER;
      // const sessionItem = await dbInstance.getData(user_id * 1, storeName);
      // addSessionItem(sessionItem);
      // // 同步到contacts 中
      // const newsessionItem = {
      //   lastMessage: {
      //     session: getSessionKey(chatType, selfId.value, user_id),
      //   },
      // };
      // contactStore.addContactItem(newsessionItem);
    }
  }
  // 渲染群的详细信息
  function showGroupDetail(groupObj) {
    let isFold = true;
    const divGroup = document.querySelector(".group-more-part");
    if (groupObj.members.length > 11) {
      getmemberList(groupObj.members.slice(0, 11), divGroup);
    } else {
      getmemberList(groupObj.members, divGroup);
    }
    divGroup.querySelector(".qun-name").innerText = groupObj.qunName;
    divGroup.querySelector(".qun-announcement").innerText =
      groupObj.announcement;

    // 查看更多的点击事件
    divGroup.querySelector(".look-more-user").onclick = function (e) {
      console.log("click");
      isFold = !isFold;
      if (isFold) {
        if (groupObj.members.length > 11) {
          getmemberList(groupObj.members.slice(0, 11), divGroup);
        } else {
          getmemberList(groupObj.members, divGroup);
        }
      } else {
        getmemberList(groupObj.members, divGroup);
      }
      switchMore(isFold);
    };
  }
  // 渲染群成员
  function getmemberList(userList, divGroup) {
    const templateContainer = new DocumentFragment();
    const divUserList = divGroup.querySelector(".user-list");
    const moreIconTemplate = divGroup.querySelector(".more-icon");
    const userTemplate = divGroup.querySelector(".more-user");
    userList.forEach((item) => {
      const divMember = userTemplate.cloneNode(true);
      divMember.querySelector("img").src = item.avatar;
      divMember.querySelector("span").innerText = item.userName;
      templateContainer.appendChild(divMember);
    });
    templateContainer.appendChild(moreIconTemplate);
    divUserList.innerHTML = "";
    divUserList.appendChild(templateContainer);
  }
  // 渲切换更多 / 收起
  function switchMore(isFold) {
    const divLookMore = document.querySelector(".look-more-user");
    if (isFold) {
      divLookMore.querySelector("span").innerText = "查看更多";
      divLookMore
        .querySelector("i")
        .classList.replace("icon-shangla", "icon-xiala");
    } else {
      divLookMore.querySelector("span").innerText = "收起";
      divLookMore
        .querySelector("i")
        .classList.replace("icon-xiala", "icon-shangla");
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
      copyMessageTemplate.querySelector(".message-text").textContent = value;
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
    getMsgList,
    showSessionList,
    getDefaultChat,
    getWsInstance,
  };
});
