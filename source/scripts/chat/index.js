define(function (require, exports, module) {
  // 导入页面组件
  const myFriend = require("./page/my-friend.js");
  const chatMsg = require("./page/chat-msg.js");
  const systemInform = require("./page/system-inform.js");
  const contactService = require("./page/contact-service.js");

  // 导入工具
  const {
    SELFID,
    DB_STORE_NAME,
    DB_STORE_NAME_MSG,
    DB_STORE_NAME_USER,
    DB_STORE_NAME_QUN,
  } = require("./store/store.js");
  const { getSession, getFrinedList } = require("./utils/api.js");
  const { initIndexedDB } = require("./utils/indexedDB.js");
  const dbInstance = initIndexedDB();

  window.onload = function () {
    // 请求 当前用户好友
    // myFriend.getItemList();

    // 初始化聊天信息页面
    chatMsg.initChatPage();

    // 初始化联系客服页面
    contactService.initContactPage();
  };
  // 请求历史记录
  getSessionHistory();
  // 请求好友
  getContacts();

  // 获取当前用户的历史记录
  async function getSessionHistory() {
    const sessionArr = await getSession("sessions", SELFID);
    sessionArr.forEach((item) => {
      item.session = item.chatSession.sessionKey;
      dbInstance.initSession(item);
    });
  }

  // 获取好友 / 群列表
  async function getContacts() {
    const contacts = await getFrinedList("contacts", SELFID);
    // 拿到列表后 渲染dom
    myFriend.getItemList(contacts);
    contacts.users.forEach((user) => {
      dbInstance.initSession(user, DB_STORE_NAME_USER);
    });
    contacts.quns.forEach((qun) => {
      dbInstance.initSession(qun, DB_STORE_NAME_QUN);
    });
  }
});
