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
  "websocket",
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
  indexedDB,
  websocket
) {
  const {
    selfId,
    DB_STORE_NAME_SESSION,
    DB_STORE_NAME_USER,
    DB_STORE_NAME_QUN,
    changeSelfId,
  } = store;
  const { createWS } = websocket;
  const { getSession, getFrinedList } = api;
  const DBObject = indexedDB;
  let ws;

  // window.onload = function () {
  // 请求 当前用户好友
  // myFriend.getRelationList();
  // 初始化聊天信息页面
  chatMsg.initChatPage();

  // 初始化联系客服页面
  contactService.initContactPage();
  // };
  // 请求历史记录
  // getSessionHistory();
  // 请求好友
  // getContacts();

  // 获取当前用户的历史记录
  async function getSessionHistory() {
    const sessionArr = await getSession("sessions", selfId.value);
    if (sessionArr) {
      sessionArr.forEach((item) => {
        item.session = item.chatSession.sessionKey;
        DBObject.dbInstance.putStoreItem(item, DB_STORE_NAME_SESSION);
      });
    }
  }

  // 获取好友 / 群列表
  async function getContacts() {
    controlLoading("flex");
    const contacts = await getFrinedList("contacts", selfId.value);
    console.log(contacts);
    // 拿到列表后 渲染dom
    myFriend.getRelationList(contacts);
    contacts.users.forEach((user) => {
      DBObject.dbInstance.putStoreItem(user, DB_STORE_NAME_USER);
    });

    contacts.quns.forEach((qun) => {
      DBObject.dbInstance.putStoreItem(qun, DB_STORE_NAME_QUN);
    });

    // 解除loading...'
    controlLoading("none");
  }

  // 控制loading 的显示
  function controlLoading(isShow) {
    document.querySelector(".loading").style.display = isShow;
  }

  // const ws = createWS(0);
  // changeSelfId(0);
  // getContacts();
  // getSessionHistory();
  // chatMsg.getWsInstance(ws);

  // 临时功能
  const inputTargetId = document.querySelector(".ws-input");
  // 切换当前用户
  const btnTargetId = document.querySelector(".connect-btn");
  btnTargetId.addEventListener("click", async function () {
    // console.log(inputTargetId.value);
    const res = await DBObject.createIndexedDB(inputTargetId.value, "1");
    console.log(res);
    // console.log(db);
    // console.log(dbInstance);
    console.log(ws);
    if (ws) {
      // 如果 ws 已经存在  需要先主动断开上一个连接 再触发新的连接
      ws.close();
    }
    ws = createWS(inputTargetId.value);
    // 设置当前用户信息
    changeSelfId(
      inputTargetId.value * 1,
      "https://img1.imgtp.com/2022/11/06/cFyHps3H.jpg"
    );
    getContacts();
    getSessionHistory();
    chatMsg.getWsInstance(ws);
  });

  // 关闭websocket
  const btnCloseWs = document.querySelector(".close-ws");
  btnCloseWs.addEventListener("click", () => {
    ws.close();
  });
});
