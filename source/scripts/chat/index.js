define([
  'my-friend',
  'chat-msg',
  'system-inform',
  'contact-service',
  'store',
  'api',
  'indexedDB',
  'websocket',
  'base64',
  'sparrow',
  'sparrowChat',
], function (
  myFriend,
  chatMsg,
  systemInform,
  contactService,
  store,
  api,
  indexedDB,
  websocket,
  base64,
  sparrow,
  sparrowChat
) {
  const {
    selfId,
    DB_STORE_NAME_SESSION,
    DB_STORE_NAME_USER,
    DB_STORE_NAME_QUN,
    changeSelfId,
    serviceStore,
  } = store;
  const { createWS } = websocket;
  const { getSession, getFrinedList, login, serviceList } = api;
  const DBObject = indexedDB;
  let ws;

  // 初始化聊天信息页面
  chatMsg.initChatPage();
  // 初始化联系客服页面
  contactService.initContactPage();

  // 获取当前用户的历史记录
  async function getSessionHistory(isServicer) {
    const sessionArr = await getSession('sessions', selfId.value);
    if (sessionArr.length > 0) {
      myFriend.diffSessionList(sessionArr);
      sessionArr.forEach((item) => {
        item.session = item.chatSession.sessionKey;
        DBObject.dbInstance.putStoreItem(item, DB_STORE_NAME_SESSION);
      });
    }

    // 历史记录请求后 初始化客服列表
    if (!isServicer) {
      contactService.createSessionList();
    }
  }

  // 获取好友 / 群 / 客服 列表
  async function getContacts(isServicer) {
    // 保存客服列表  -- 判断当前登录是否为客服
    if (!isServicer) {
      const res = await serviceList();
      serviceStore.init(res.rows);
    } else {
      serviceStore.init([]);
    }
    const contacts = await getFrinedList('contacts', selfId.value);

    // 拿到列表后 渲染我的好友页面
    myFriend.getRelationList(contacts);
    // 保存群 / 好友  保证在保存之后 请求session 历史记录
    const resPromise = [];
    contacts.users.forEach((user) => {
      const sliceParams = DBObject.dbInstance.putStoreItem(
        user,
        DB_STORE_NAME_USER
      );
      resPromise.push(sliceParams);
    });
    contacts.quns.forEach((qun) => {
      const sliceParams = DBObject.dbInstance.putStoreItem(
        qun,
        DB_STORE_NAME_QUN
      );
      resPromise.push(sliceParams);
    });
    await Promise.all([...resPromise]);
  }

  // 加载资源 历史记录 / 好友列表(包括群) / 客服列表
  async function loadResource(isServicer) {
    controlLoading('flex');
    await getContacts(isServicer);
    getSessionHistory(isServicer);
    controlLoading('none');
  }

  // 控制loading 的显示
  function controlLoading(isShow) {
    document.querySelector('.loading').style.display = isShow;
  }
  // 登录
  document.querySelector('.login').addEventListener('click', async () => {
    // 构造请求参数
    const mobile = document.querySelector('.ws-input').value;
    const pwa = document.querySelector('.t-selfId').value;
    const params = {
      code: '8888',
      mobile,
      password: pwa,
    };
    const { data } = await login(params);
    console.log(data, '登录');

    // 设置token 以及保存当前用户信息
    localStorage.setItem('token', data.token); // memberInfo
    changeSelfId(
      data.memberInfo.id,
      data.memberInfo.portrait ||
        'https://img1.imgtp.com/2023/01/29/odnUWlDQ.jpg'
    );

    // 建立数据库
    await DBObject.createIndexedDB(data.memberInfo.id, '1');

    // 建立 ws 连接
    if (ws) {
      // 如果 ws 已经存在  需要先主动断开上一个连接 再触发新的连接
      ws.close();
    }
    ws = createWS(data.memberInfo.id);

    const isServicer = data.memberInfo.isCustomer === 1;
    loadResource(isServicer);
    if (isServicer) {
      // 当前登录的是客服人员
      myFriend.hideService();
    } else {
      contactService.getWsInstance(ws);
    }
    chatMsg.getWsInstance(ws);

    const res = await api.myFriend();
    console.log(res, '我的好友');
    const r = await api.myGroup();
    console.log(r, '我的群');
    // const r2 = await api.newFriend();
    // console.log(r2, '新朋友');
    // const r3 = await api.systemNotice();
    // console.log(r3, '系统');
  });

  // 临时按钮
  document.querySelector('.temporary').onclick = function () {
    console.log('temporary');
    const selfId = document.querySelector('.t-selfId').value;
    const targetId = document.querySelector('.t-targetId').value;
    const token = document.querySelector('.t-token').value;
    // window.open(
    //   `http://r.sparrowzoo.net/chat/t.index.html?token=${token}&selfId=${selfId}&targetId=${targetId}`
    // );
  };
});
