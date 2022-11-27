define(function (require, exports, module) {
  const ajaxObj = require("../utils/api.js");
  const {
    TEXT_MESSAGE,
    IMAGE_MESSAGE,
    CHAT_TYPE_1_2_1,
    CHAT_TYPE_1_2_N,
    SEFLID,
    TargetId,
  } = require("../store/store.js");
  const { getScrollBottom } = require("../utils/utils.js");

  const { getMsgList } = require("./chat-msg");

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
      getMsgList(TargetId);
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

  // 发送网络请求 获取好友列表
  async function getItemList() {
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

  module.exports = {
    getItemList,
  };
});
