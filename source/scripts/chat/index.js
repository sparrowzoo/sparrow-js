define([
  'base64',
  'sparrow',
  'sparrowChat',
  'my-friend',
  'chat-msg',
  'system-inform',
  'contact-service',
  'store',
  'api',
  'indexedDB',
  'websocket',
  'axios',
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
  websocket,
  axios
) {
  const {
    selfId,
    DB_STORE_NAME_SESSION,
    DB_STORE_NAME_USER,
    DB_STORE_NAME_QUN,
    changeSelfId,
  } = store;
  const { createWS } = websocket;
  const { getSession, getFrinedList, login } = api;
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
    const sessionArr = await getSession('sessions', selfId.value);
    console.log(sessionArr);
    if (sessionArr) {
      sessionArr.forEach((item) => {
        item.session = item.chatSession.sessionKey;
        DBObject.dbInstance.putStoreItem(item, DB_STORE_NAME_SESSION);
      });
    }
  }

  // 获取好友 / 群列表
  async function getContacts(userId) {
    controlLoading('flex');
    const contacts = await getFrinedList('contacts', selfId.value);
    // 拿到列表后 渲染dom
    myFriend.getRelationList(contacts);
    contacts.users.forEach((user) => {
      DBObject.dbInstance.putStoreItem(user, DB_STORE_NAME_USER);
    });

    contacts.quns.forEach((qun) => {
      DBObject.dbInstance.putStoreItem(qun, DB_STORE_NAME_QUN);
    });
    // 解除loading...'
    controlLoading('none');
  }

  // 控制loading 的显示
  function controlLoading(isShow) {
    document.querySelector('.loading').style.display = isShow;
  }
  // 登录
  document.querySelector('.login').addEventListener('click', async () => {
    const mobile = document.querySelector('.ws-input').value;
    const params = {
      code: '8888',
      mobile,
      password: '1234',
    };
    const { data } = await login(params);
    console.log(data, '登录');
    // 设置token 以及用户名
    localStorage.setItem('token', data.token); // memberInfo
    changeSelfId(
      data.memberInfo.id,
      data.memberInfo.portrait ||
        'https://img1.imgtp.com/2023/01/29/odnUWlDQ.jpg'
    );
    // 建立数据库
    await DBObject.createIndexedDB(data.memberInfo.id, '1');
    if (ws) {
      // 如果 ws 已经存在  需要先主动断开上一个连接 再触发新的连接
      ws.close();
    }
    // 建立ws 连接
    ws = createWS(data.memberInfo.id);

    // 获取好友列表和聊天记录
    getContacts(data.memberInfo.id);
    getSessionHistory();
    chatMsg.getWsInstance(ws);

    const res = await api.myFriend();
    console.log(res, '我的好友');
    // const r = await api.myGroup();
    // console.log(r, '我的群');
    const r2 = await api.newFriend();
    console.log(r2, '新朋友');
    // const r3 = await api.systemNotice();
    // console.log(r3, '系统');
  });
});
