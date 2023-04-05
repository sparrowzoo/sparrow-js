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
    CHAT_TYPE_1_2_1,
    DEFAULTAVATAR,
  } = store;
  const { createWS } = websocket;
  const { getSession, getFrinedList, login, serviceList } = api;
  const DBObject = indexedDB;
  let ws;

  // 判断当前是否为临时会话
  let isTemporary = false;
  let targetId;

  // 根据 url 解析 userId token targetId
  function parseURL() {
    const query = location.search.substring(1); // 获取 ? 后的参数
    if (query) {
      // 如果 query 存在 说明当前使用 iframe 嵌套
      // console.log('有参数');
      const queryArr = query.split('&');
      const token = queryArr[0].split('=')[1];
      const selfId = queryArr[1].split('=')[1];
      localStorage.setItem('token', token);
      getSelfInfoById(selfId);
      if (queryArr.length === 3) {
        // 当前是临时会话
        isTemporary = true;
        targetId = queryArr[2].split('=')[1];
      }
    } else {
      // 没有 query 参数 需要手动登录
      console.log('没有参数');
    }
  }
  parseURL();

  // 根据 传入的id 获取当前用户详细信息
  async function getSelfInfoById(id) {
    const { data } = await api.getDetailById({ id });
    console.log(data, '当前用户');
    changeSelfId(
      data.userId,
      data.avatar || 'https://img1.imgtp.com/2023/01/29/odnUWlDQ.jpg'
    );
    const isServicer = data.isCustomer === 1;
    // url 登录操作
    initIM(isServicer);
  }

  // 根据 传入的id 获取目标用户详细信息
  async function getTargetInfoById() {
    const { data } = await api.getDetailById({ id: targetId });
    console.log(data, '目标用户');
    temporaryChat(data.userId, data.userName, data.avatar, data);
  }

  // 初始化聊天信息页面
  chatMsg.initChatPage();
  // 初始化联系客服页面
  contactService.initContactPage();

  // 获取当前用户的历史记录
  async function getSessionHistory(isServicer) {
    const sessionArr = await getSession('sessions', selfId.value);
    sessionArr.forEach((item) => {
      item.session = item.chatSession.sessionKey;
      DBObject.dbInstance.putStoreItem(item, DB_STORE_NAME_SESSION);
    });
    console.log('临时会话1');

    await myFriend.diffSessionList(sessionArr);

    // 历史记录请求后 初始化客服列表
    if (!isServicer) {
      contactService.createSessionList();
    }

    // 如果是临时会话
    if (isTemporary) {
      console.log('临时会话2');
      getTargetInfoById();
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
    await getSessionHistory(isServicer);
    controlLoading('none');
  }

  // 控制loading 的显示
  function controlLoading(isShow) {
    document.querySelector('.loading').style.display = isShow;
  }
  // 手动登录
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
    changeSelfId(data.memberInfo.id, data.memberInfo.portrait || DEFAULTAVATAR);
    const isServicer = data.memberInfo.isCustomer === 1;
    initIM(isServicer);
  });

  // 初始化 IM
  async function initIM(isServicer) {
    // 建立数据库
    await DBObject.createIndexedDB(selfId.value, '1');

    // 建立 ws 连接
    if (ws) {
      // 如果 ws 已经存在  需要先主动断开上一个连接 再触发新的连接
      ws.close();
    }

    // 获取真实的token
    const token = localStorage.getItem('token');
    ws = createWS(token);

    //  const isServicer = data.memberInfo.isCustomer === 1;
    loadResource(isServicer);
    if (isServicer) {
      // 当前登录的是客服人员
      myFriend.hideService();
    } else {
      contactService.getWsInstance(ws);
    }
    chatMsg.getWsInstance(ws);
  }

  // 临时会话的操作
  function temporaryChat(userId, username, avatar, targetInfo) {
    myFriend.chatTemporary(
      userId,
      username,
      CHAT_TYPE_1_2_1,
      avatar || DEFAULTAVATAR,
      targetInfo
    );
  }

  // 监听页面的显示 隐藏   有 bug 多个浏览器打开 没法监听
  // document.addEventListener('visibilitychange', function () {
  //   // console.log(document.visibilityState, 'page A');
  //   if (document.visibilityState === 'hidden') {
  //     // console.log('页面隐藏'); 关闭 ws 连接
  //     if (ws) {
  //       // 如果 ws 已经存在  需要先主动断开上一个连接 再触发新的连接
  //       ws.close();
  //     }
  //   } else {
  //     // console.log('页面显示');  建立 ws 连接
  //     if (ws) {
  //       ws.reconnectWebSocket();
  //     }
  //   }
  // });
});
