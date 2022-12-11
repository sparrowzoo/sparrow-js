define([
  "base64",
  "sparrow",
  "sparrowChat",
  "my-friend",
  "chat-msg",
  "system-inform",
  "contact-service",
  "store",
  "api",
  "indexedDB",
], function (
  base64,
  sparrow,
  sparrowChat,
  myFriend,
  chatMsg,
  systemInform,
  contactService,
  store,
  api,
  indexedDB
) {
  const {
    selfId,
    DB_STORE_NAME,
    DB_STORE_NAME_USER,
    DB_STORE_NAME_QUN,
    changeSelfId,
  } = store;

  const { getSession, getFrinedList } = api;
  const { initIndexedDB } = indexedDB;
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
    const sessionArr = await getSession("sessions", selfId.value);
    if (sessionArr) {
      sessionArr.forEach((item) => {
        item.session = item.chatSession.sessionKey;
        dbInstance.initSession(item);
      });
    }
  }

  // 获取好友 / 群列表
  async function getContacts() {
    const contacts = await getFrinedList("contacts", selfId.value);
    // 拿到列表后 渲染dom
    myFriend.getItemList(contacts);
    contacts.users.forEach((user) => {
      dbInstance.initSession(user, DB_STORE_NAME_USER);
    });

    contacts.quns.forEach((qun) => {
      dbInstance.initSession(qun, DB_STORE_NAME_QUN);
    });
  }

  // 临时功能
  const inputTargetId = document.querySelector(".ws-input");
  // 切换当前用户
  const btnTargetId = document.querySelector(".connect-btn");
  btnTargetId.addEventListener("click", function () {
    // console.log(inputTargetId.value);
    changeSelfId(inputTargetId.value);
    getContacts();
  });
});
