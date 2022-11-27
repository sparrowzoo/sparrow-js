define(function (require, exports, module) {
  const {
    TEXT_MESSAGE,
    IMAGE_MESSAGE,
    CHAT_TYPE_1_2_1,
    CHAT_TYPE_1_2_N,
    SEFLID,
    TargetId,
  } = require("../store/store.js");
  const {
    getScrollBottom,
    currentSendTime,
    historyMsgTime,
  } = require("../utils/utils.js");
  const ajaxObj = require("../utils/api.js");
  const { WSinstance } = require("../utils/websocket.js"); // WSinstance
  const currentWSInstance = new WSinstance(SEFLID);

  let localMessageTemplate;

  /* 聊天消息框区域 */
  // 初始化 聊天页面 主要是 填充模板
  function initChatPage() {
    showMsgList();
    showChatPart();
  }
  // 根据模板 渲染 消息列表
  function showMsgList() {
    // 填充 弹层
    const addFriendTemplate = document.querySelector("#add-friend-dialog");
    const addFriendContainer = document.querySelector(".search-part");
    const addFriend = addFriendTemplate.content.cloneNode(true);
    addFriendContainer.appendChild(addFriend);

    // 填充消息列表
    const msgListContainerDiv = document.querySelector(".msg-list");
    const msgListTemplate = document.querySelector("#msg-list-part");
    const msgList = msgListTemplate.content.cloneNode(true);
    msgListContainerDiv.appendChild(msgList);

    registerSearch();
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
    sendPicture();
    registerIconMore();
  }

  // 注册点击图标事件
  function registerIconMore() {
    const moreIcon = document.querySelector(".show-more-icon");
    moreIcon.addEventListener("click", (e) => {
      // console.log("click");
      // 动态切换侧边栏
      const moreMsg = document.querySelector(".more-message");
      moreMsg.style.display =
        moreMsg.style.display === "none" ? "block" : "none";

      // 根据当前是群 还是个人 展示不同的dom
      if (false) {
        // 当前是个人
        document.querySelector(".user-more-part").style.display = "block";
      } else {
        document.querySelector(".group-more-part").style.display = "block";
      }
    });
  }

  /** 聊天页面部分 渲染聊天信息 */
  async function getMsgList() {
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

    // 得到当前聊天列表
    const sessionArr = await ajaxObj.getSession("sessions", SEFLID);
    // 遍历后端返回的数据 再渲染
    sessionArr[0].messages.forEach((msg) => {
      // const msgValue = BASE64.bytesToString(BASE64.decodeBase64(msg.content));
      const isSelf = msg.fromUserId === SEFLID ? true : false;
      const msgTime = historyMsgTime(msg.sendTime);
      let msgValue;
      if (msg.messageType === TEXT_MESSAGE) {
        msgValue = BASE64.bytesToString(BASE64.decodeBase64(msg.content));
      } else {
        msgValue = "data:image/jpeg;base64," + msg.content;
      }

      sendMessage(msgValue, isSelf, msg.messageType, msgTime, msgListFragment);
    });

    // 将构造好的列表 插入到父元素中  然后整个替换之前的消息
    currentMsgContainer.replaceChild(msgListFragment, templateMsgDom);
    parentNode.replaceChild(currentMsgContainer, oldtMsgContainer);

    // 滚动到底部
    getScrollBottom(".msg-detail");
    // 渲染完毕监听按钮点击
    onBtnClick(currentMsgContainer);
    // 渲染完毕注册websocket onmessage 事件
    currentWSInstance.registerCallback(sendMessage);
  }

  // 监听点击发送按钮事件
  function onBtnClick() {
    const textDom = document.querySelector(".input-content");
    // 监听发送按钮 获取聊天框信息
    const sendBtn = document.querySelector(".send-btn");
    sendBtn.addEventListener("click", () => {
      console.log("发送");
      sendMessage(textDom.value, true, TEXT_MESSAGE, currentSendTime());
      // websocket 发送数据
      currentWSInstance.sendMsg(
        CHAT_TYPE_1_2_1,
        TEXT_MESSAGE,
        SEFLID,
        TargetId,
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
      sendMessage(url, true, IMAGE_MESSAGE, currentSendTime());
      currentWSInstance.sendMsg(
        CHAT_TYPE_1_2_1,
        IMAGE_MESSAGE,
        SEFLID,
        TargetId,
        file
      );
    });
  }

  // 往聊天区域新增信息的方法
  function sendMessage(value, isSelf, type, sendTime, parentNode) {
    console.log(value, value.length, "接收的数据");
    const copyMessageTemplate = localMessageTemplate.cloneNode(true);

    if (isSelf) {
      copyMessageTemplate.classList.add("right");
    } else {
      copyMessageTemplate.classList.add("left");
    }
    // 设置聊天时间
    if (sendTime) {
      copyMessageTemplate.querySelector(".time").innerText = sendTime;
    } else {
      copyMessageTemplate.querySelector(".time").innerText = currentSendTime();
    }
    // 设置头像
    const avatarImg = copyMessageTemplate.querySelector(".avatar-user");
    avatarImg.src = "https://img1.imgtp.com/2022/11/06/cFyHps3H.jpg";
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

    if (!parentNode) {
      const msgParentDiv = document.querySelector(".msg-detail");
      msgParentDiv.appendChild(copyMessageTemplate);
    } else {
      // 当前传入了父容器 直接添加到父容器
      parentNode.appendChild(copyMessageTemplate);
    }
    getScrollBottom(".msg-detail");
  }

  module.exports = {
    initChatPage,
    getMsgList,
  };
});
