define(function (require, exports, module) {
  const { getMsgList, showSessionList, getDefaultChat } = require("./chat-msg");

  const ajaxObj = require("../utils/api.js");
  const {
    getScrollBottom,
    getFocus,
    getSessionKey,
  } = require("../utils/utils.js");
  const { initIndexedDB } = require("../utils/indexedDB");
  const dbInstance = initIndexedDB();

  const {
    TEXT_MESSAGE,
    IMAGE_MESSAGE,
    CHAT_TYPE_1_2_1,
    CHAT_TYPE_1_2_N,
    SELFID,
    targetId,
    DB_STORE_NAME_MSG,
    DB_STORE_NAME,
    DB_STORE_NAME_USER,
    DB_STORE_NAME_QUN,
    setTargetId,
  } = require("../store/store.js");
  // const { initContack } = require("../store/contacts.js");
  const { contackstore } = require("../store/contacts.js");

  // 获取左侧菜单，准备添加点击事件
  const menu = document.querySelector(".menu");
  const menuList = menu.querySelectorAll(".menu-item");
  // 当前激活的菜单项
  let activeMenu = "0";

  // 给菜单的父元素注册点击事件 事件委托
  menu.addEventListener("click", (e) => {
    activeMenu = e.target.getAttribute("data-menu");
    showContentByMenu(activeMenu);
    if (activeMenu == 0) {
      // 点击我的好友 会发送请求好友和群聊的请求
      showFriendsList();
    }
    if (activeMenu == 1) {
      // 点击聊天消息 默认跳转到群聊列表的第一个联系人
      getDefaultChat();

      // 获取焦点
      const dom = getFocus([".chat-msg", ".input-content"]);
      dom.focus();
    }
    // 客服
    if (activeMenu == 3) {
      const dom = getFocus([".service", ".input-content"]);
      dom.focus();
    }
  });

  // 展示默认的content
  showContentByMenu(activeMenu);
  // 给三个select 注册点击事件
  registerSelectItemClick();

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

  // 展示首页的好友列表
  function showFriendsList() {
    // 发送请求后 默认展示的 就是好友列表
    showCardByIndex(0);
    getItemList();
  }

  // 好友列表
  async function getItemList(originContact) {
    let contacterObj = originContact || {};
    if (originContact) {
      // 参数存在 是第一次加载的过程,生成消息列表
      initSessionData(contacterObj.users, contacterObj.quns);
    } else {
      // 没有传入参数 从数据库中获取
      contacterObj = await getUses_Quns();
    }
    if (contacterObj.users.length === 0) {
      // 没有好友，显示文字 / 图片...
    } else {
      createListDom(CHAT_TYPE_1_2_1, contacterObj.users, ".my-friend");
    }
    if (contacterObj.quns.length !== 0) {
      createListDom(CHAT_TYPE_1_2_N, contacterObj.quns, ".my-group");
    }
  }

  // 向数据库中拿用户 / 群
  async function getUses_Quns() {
    const userArr = await dbInstance.getAll(DB_STORE_NAME_USER);
    const qunArr = await dbInstance.getAll(DB_STORE_NAME_QUN);
    const obj = {
      users: userArr,
      quns: qunArr,
    };
    return obj;
  }

  // 拿到好友 / 群列表 生成会话列表
  async function initSessionData(users, quns) {
    const u = await Promise.all(
      users.map(async (item) => {
        const sessinKey = getSessionKey(CHAT_TYPE_1_2_1, SELFID, item.userId);
        return compareMsg(sessinKey, item);
      })
    );
    const q = await Promise.all(
      quns.map((item) => {
        const sessinKey = getSessionKey(CHAT_TYPE_1_2_N, SELFID, item.qunId);
        return compareMsg(sessinKey, item);
      })
    );
    // 先对会话列表做保存
    contackstore.initContack([...u, ...q]);
    // 渲染dom
    getSessionList([...u, ...q]);
  }
  // 和localStorage中的保存的最后一条数据做比对
  async function compareMsg(keyPath, contacter) {
    const lastMsg = window.localStorage.getItem(keyPath);
    const sessionItem = await dbInstance.getData(keyPath, DB_STORE_NAME);
    // 未读数量 / 最新信息
    let unReadCount = -1;
    let lastMessage = "";

    if (sessionItem) {
      // 与当前用户有聊天记录  才会有未读和 最新信息
      if (lastMsg) {
        // 比较最后一条数据
        const count = sessionItem.messages.length - 1;
        for (let i = count; i > 0; i--) {
          if (sessionItem.messages[i] === lastMsg) {
            unReadCount = count - i;
            break;
          }
        }
        if (unReadCount === -1) {
          unReadCount = count + 1;
        }
      } else {
        // 直接返回
        unReadCount = sessionItem.messages?.length;
      }
      lastMessage = sessionItem.messages[sessionItem.messages.length - 1];
      contacter.unReadCount = unReadCount;
      contacter.lastMessage = lastMessage;
      return contacter;
    } else {
    }
  }

  // 生成会话列表
  function getSessionList(list) {
    showSessionList(list);
  }

  // 好友列表 / 群 创建DOM 并渲染列表
  function createListDom(type, list, template) {
    const itemId = type === CHAT_TYPE_1_2_1 ? "userId" : "qunId";
    const itemName = type === CHAT_TYPE_1_2_1 ? "userName" : "qunName";

    const contentDiv = document.querySelector(template);
    const userListTemplate = document.querySelector("#user-list");
    const contentItemDiv = userListTemplate.content.cloneNode(true);
    const itemFragment = new DocumentFragment();
    // 生成好友列表
    list.forEach((item) => {
      // 复制一份 准备根据list 渲染数据
      const copyConItemDiv = contentItemDiv.cloneNode(true);
      const imgDiv = copyConItemDiv.querySelector("img");
      imgDiv.src = "http://r.sparrowzoo.net/images/user.png";
      const userDiv = copyConItemDiv.querySelectorAll("span");
      userDiv[0].innerText = item[itemName];
      const divOperate = copyConItemDiv.querySelector(".operate");
      divOperate.setAttribute("data-user_id", item[itemId]);
      divOperate.setAttribute("data-user_name", item[itemName]);
      // 群聊需要改变模板
      if (type === CHAT_TYPE_1_2_N) {
        userDiv[1].innerText = "群公告" + item.announcement;
        const buttonRemove = divOperate.querySelector("button");
        buttonRemove.innerText = "删除群聊";
      }
      // 新的朋友 修改模板
      if (template === ".new-friend") {
        const buttons = divOperate.querySelectorAll("button");
        buttons[0].innerText = "拒绝";
        buttons[1].innerText = "通过";
      }
      itemFragment.appendChild(copyConItemDiv);
    });
    // 先清空父容器，再添加子元素  防止重复添加
    contentDiv.innerHTML = "";
    contentDiv.appendChild(itemFragment);

    // 为按钮添加点击事件 注册删除好友 & 聊一下的事件  事件委托
    const btnContainers = document
      .querySelector(template)
      .querySelectorAll(".operate");

    btnContainers.forEach((ele) => {
      ele.addEventListener("click", function (e) {
        if (e.target.getAttribute("data-type") === "remove") {
          removeUser(e.currentTarget.getAttribute("data-user_id"));
        }
        if (e.target.getAttribute("data-type") === "chat") {
          chatBy(
            e.currentTarget.getAttribute("data-user_id"),
            e.currentTarget.getAttribute("data-user_name"),
            type
          );
        }
      });
    });
  }

  // 新的朋友 渲染DOM
  async function createNewFriend() {
    const res = await ajaxObj.getFrinedList("contacts", SELFID);
    createListDom(CHAT_TYPE_1_2_1, res.users, ".new-friend");
  }

  function chatBy(user_id, username, chatType) {
    // 聊天之前 把id 传出去
    setTargetId(user_id, username, chatType);
    // 聊一聊 跳转到 消息页面 需要把左侧菜单设置为第二项活跃
    activeMenu = "1";
    showContentByMenu("1");
    // 渲染聊天列表
    getMsgList(user_id, username, chatType);
    // 默认展示聊天区域的底部
    getScrollBottom(".msg-detail");

    // 获取焦点
    const dom = getFocus([".chat-msg", ".input-content"]);
    dom.focus();
  }

  function removeUser(id) {
    console.log("remove");
    document.querySelector(".del-friend").style.display = "block";
    document.querySelector(".global-mask").style.display = "block";
  }
  // 我的好友页面下 三个按钮的点击
  function registerSelectItemClick() {
    const selItems = document.querySelectorAll(".select-item");
    // 切换主体显示内容
    for (let i = 0; i < selItems.length; i++) {
      selItems[i].addEventListener("click", function (e) {
        if (e.currentTarget.getAttribute("data-type") === "0") {
          // 切换dialog的显示状态
          const dialog = document.querySelector(".add-friend");
          dialog.style.display =
            dialog.style.display === "none" ? "block" : "none";
          // 控制遮罩层显示
          document.querySelector(".global-mask").style.display =
            dialog.style.display;
        } else {
          showCardByIndex(e.currentTarget.getAttribute("data-type"));
        }

        if (i !== 0) {
          // 取消左侧菜单我的好友的样式
          const divMyFriend = document.querySelector(".menu-item");
          divMyFriend.style.color = "#000";
          divMyFriend.style.backgroundColor = "#f7f7f7";
        }
      });
    }
  }
  addFriendDialog();
  // 添加朋友弹层的申请 取消事件
  function addFriendDialog() {
    const divOperateParent = document
      .querySelector(".add-friend")
      .querySelector(".operate");
    divOperateParent.addEventListener("click", function (e) {
      if (e.target.getAttribute("data-type") === "remove") {
        // 点击取消
        console.log("cancel");
        document.querySelector(".add-friend").style.display = "none";
        document.querySelector(".global-mask").style.display = "none";
      }
      if (e.target.getAttribute("data-type") === "chat") {
        // 点击申请
        console.log("chat");
      }
    });
  }

  // 弹层的取消 / 确认事件
  const btnContainer = document
    .querySelector(".del-friend")
    .querySelector(".operate");
  btnContainer.addEventListener("click", (e) => {
    if (e.target.getAttribute("data-type") === "remove") {
      console.log("点击取消");
    } else {
      console.log("点击确认");
    }
    document.querySelector(".del-friend").style.display = "none";
    document.querySelector(".global-mask").style.display = "none";
  });
  function showCardByIndex(index) {
    const divCards = document.querySelector(".content").children;
    for (let i = 0; i < divCards.length; i++) {
      if (i == index) {
        divCards[i].style.display = "block";
      } else {
        divCards[i].style.display = "none";
      }
    }
  }

  module.exports = {
    getItemList,
  };
});