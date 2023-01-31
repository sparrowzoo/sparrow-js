define(function (require, exports, module) {
  // 导入的api 方法
  // const { getSession, getFrinedList } = require("./api.js");
  const ajaxObj = require("./utils/api.js");
  const { WSinstance } = require("./utils/websocket.js"); // WSinstance
  const {
    getScrollBottom,
    currentSendTime,
    historyMsgTime,
  } = require("./utils/utils.js");
  const TEXT_MESSAGE = 0;
  const IMAGE_MESSAGE = 1;
  const CHAT_TYPE_1_2_1 = 0;
  const CHAT_TYPE_1_2_N = 1;
  const SEFLID = 100;
  const TargetId = 101;

  const currentWSInstance = new WSinstance(SEFLID);

  let localMessageTemplate;

  window.onload = function () {
    // 对好友列表做初始化
    getItemList();
    // 消息列表
    showMsgList();
    // 我的消息 根据模板渲染 聊天框dom
    showChatPart();
    // 联系客服
    showServicePart();
  };

  // 发送网络请求 获取好友列表
  async function getItemList(list) {
    const res = await ajaxObj.getFrinedList("contacts", SEFLID);
    if (res.users.length === 0) {
      // 没有好友，显示文字 / 图片
      contentItemDiv.style.display = "none";
      // console.log(contentItemDiv.nextElementSibling); 获取下一个元素
      contentItemDiv.nextElementSibling.style.display = "block";
    } else {
      createItemDom(res.users);
    }
  }

  // 好友列表 创建DOM 并渲染列表
  function createItemDom(list) {
    const contentDiv = document.querySelector(".content");
    const userListTemplate = document.querySelector("#user-list");
    const contentItemDiv = userListTemplate.content.cloneNode(true);
    // 文档片段 避免直接操作文档
    const itemFragment = new DocumentFragment();
    // 生成好友列表
    list.forEach((item) => {
      // 复制一份 准备根据list 渲染数据
      const copyConItemDiv = contentItemDiv.cloneNode(true);
      const imgDiv = copyConItemDiv.querySelector("img");
      imgDiv.src = "http://r.sparrowzoo.net/images/user.png";
      const userDiv = copyConItemDiv.querySelectorAll("span");
      userDiv[0].innerText = item.userName;
      userDiv[1].innerText = "粉丝 " + item.userId;
      itemFragment.appendChild(copyConItemDiv);
    });
    contentDiv.appendChild(itemFragment);

    // 为按钮添加点击事件 注册删除好友 & 聊一下的事件  事件委托
    const btnContainers = document
      .querySelector(".content")
      .querySelectorAll(".operate");

    btnContainers.forEach((ele) => {
      ele.addEventListener("click", (e) => {
        if (e.target.getAttribute("data-type") === "remove") {
          removeUser();
        }
        if (e.target.getAttribute("data-type") === "chat") {
          chatBy({ id: 10 });
        }
      });
    });

    // 注册 三个select 点击事件
    registerSelectItemClick();
  }

  function chatBy(query) {
    console.log("chat", query);
    // 聊一聊 跳转到 消息页面 需要把左侧菜单设置为第二项活跃
    activeMenu = "1";
    showContentByMenu("1");
    // 渲染聊天列表
    getMsgList(TargetId);
    // 默认展示聊天区域的底部
    getScrollBottom(".msg-detail");
  }

  function removeUser(user) {
    console.log("remove");
  }

  // 我的好友页面下 三个按钮的点击
  function registerSelectItemClick() {
    const selItems = document.querySelectorAll(".select-item");
    for (let i = 0; i < selItems.length; i++) {
      selItems[i].addEventListener("click", function (e) {
        if (e.currentTarget.getAttribute("data-type") === "add-friend") {
          // 切换dialog的显示状态
          const dialog = document.querySelector(".add-friend");
          dialog.style.display =
            dialog.style.display === "none" ? "block" : "none";
        }
      });
    }
  }

  /** 左侧菜单部分 */
  // 获取菜单，准备添加点击事件
  const menu = document.querySelector(".menu");
  const menuList = menu.querySelectorAll(".menu-item");
  let activeMenu = "0"; // 当前激活的菜单项
  // 给菜单的父元素注册点击事件 事件委托
  menu.addEventListener("click", (e) => {
    activeMenu = e.target.getAttribute("data-menu");
    showContentByMenu(activeMenu);
    if (activeMenu == 1) {
    }
    if (activeMenu == 3) {
    }
  });

  // 展示默认的content
  showContentByMenu(activeMenu);

  // 根据 menu 显示对应的主体内容
  function showContentByMenu(activeIndex) {
    // 先将所有的 content 隐藏 然后将 对应的index 的content 显示
    const conts = document.querySelector(".main").children;
    for (let i = 0; i < conts.length; i++) {
      if (i == activeIndex) {
        conts[i].style.display = "block";
      } else {
        conts[i].style.display = "none";
      }
    }

    // 激活菜单的样式
    menuList.forEach((ele, index) => {
      if (index == activeMenu) {
        ele.style.color = "#FFF";
        ele.style.backgroundColor = "#282d3b";
      } else {
        ele.style.color = "#000";
        ele.style.backgroundColor = "#f7f7f7";
      }
    });
  }

  /* 聊天消息框区域 */
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
      const msgTime = historyMsgTime(msg.serverTime);
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
      sendMessage(textDom.value, true, TEXT_MESSAGE, currentSendTime());
      // websocket 发送数据
      currentWSInstance.sendMsg(
        CHAT_TYPE_1_2_1,
        TEXT_MESSAGE,
        SEFLID,
        TargetId,
        textDom.value,
        TargetId
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
    const copyMessageTemplate = localMessageTemplate.cloneNode(true);
    if (isSelf) {
      copyMessageTemplate.classList.add("right");
    } else {
      copyMessageTemplate.classList.add("left");
    }
    // 设置聊天时间
    if (!sendTime) {
      copyMessageTemplate.querySelector(".time").innerText = currentSendTime();
    } else {
      copyMessageTemplate.querySelector(".time").innerText = sendTime;
    }

    // 设置头像
    const avatarImg = copyMessageTemplate.querySelector(".avatar-user");
    avatarImg.src = "https://img1.imgtp.com/2023/01/29/odnUWlDQ.jpg";
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

  /** 联系客服区域 */
  function showServicePart() {
    const chatContainerDiv = document.querySelector(".service");
    const chatTemplate = document.querySelector("#chat-part");
    const chatDiv = chatTemplate.content.cloneNode(true);
    // 联系客服 没有 右侧的头像
    const parNode = chatDiv.querySelector(".title");
    const iconDom = parNode.querySelector(".iconfont");
    const titleName = parNode.querySelector(".user");
    titleName.innerText = "联系客服";
    console.log(iconDom);
    parNode.removeChild(iconDom);
    chatContainerDiv.appendChild(chatDiv);
  }
});
