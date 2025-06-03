define(function () {
  // indexedDB 仓库
  const DB_NAME = 'chat-history';
  const DB_VERSION = 1;
  const DB_STORE_NAME_SESSION = 'session';
  const DB_STORE_NAME_USER = 'contact-users';
  const DB_STORE_NAME_QUN = 'contact-quns';

  const TEXT_MESSAGE = 0;
  const IMAGE_MESSAGE = 1;
  const CHAT_TYPE_1_2_1 = 0;
  const CHAT_TYPE_1_2_N = 1;
  const selfId = { value: 0, avatar: '' };
  const ACCORD_RECALL = 'ACCORD_RECALL';
  const ACCEPT_RECALL = 'ACCEPT_RECALL';
  const SEND_TYPE = 'SEND_TYPE';
  const RECEIVE_TYPE = 'RECEIVE_TYPE';
  // 我的消息页面
  const MSGCHART = 'MSGCHART';
  // 联系客服页面
  const SERVICECHART = 'SERVICECHART';
  // 保存当前页面模块 用于区分 聊天框
  const currentPage = {
    page: MSGCHART,
    changePage(params) {
      this.page = params;
    },
  };
  // 默认国旗
  const DEFAULTFLAG = 'http://r.sparrowzoo.net/images/flag.jpg';
  // 默认头像
  const DEFAULTAVATAR = 'http://r.sparrowzoo.net/images/user.png';
  // 客服列表
  const serviceStore = {
    list: null,
    init(arr) {
      this.list = arr;
      console.log(this.list, '客服列表');
    },
  };
  // 群成员
  const qunNumberMap = {
    map: {},
    initQunMap(arr) {
      this.map = {};
      for (const item of arr) {
        this.map[item.userId] = item;
      }
    },
  };
  // 当前的聊天对象  -- 我的消息模块
  let targetId = {
    value: '-1',
    type: CHAT_TYPE_1_2_1,
    username: '',
    avatar: null,
    sessionKey: '',
  };
  // 当前聊天对象  --联系客服模块
  let serviceId = {
    value: '-1',
    type: CHAT_TYPE_1_2_1,
    username: '',
    avatar: null,
    sessionKey: '',
  };
  function setTargetId(id, username, chatType, avatar, sessionKey) {
    targetId.value = id;
    targetId.type = chatType;
    targetId.username = username;
    targetId.avatar = avatar || DEFAULTAVATAR;
    targetId.sessionKey = sessionKey;
  }
  function setServiceId(id, username, chatType, avatar, sessionKey) {
    serviceId.value = id;
    serviceId.type = chatType;
    serviceId.username = username;
    serviceId.avatar = avatar || DEFAULTAVATAR;
    serviceId.sessionKey = sessionKey;
  }
  // 设置当前用户信息
  function changeSelfId(id, avatar) {
    selfId.value = id;
    selfId.avatar = avatar;
  }
  return {
    DB_NAME,
    DB_VERSION,
    DB_STORE_NAME_SESSION,
    DB_STORE_NAME_USER,
    DB_STORE_NAME_QUN,
    TEXT_MESSAGE,
    IMAGE_MESSAGE,
    CHAT_TYPE_1_2_1,
    CHAT_TYPE_1_2_N,
    selfId,
    targetId,
    setTargetId,
    changeSelfId,
    qunNumberMap,
    ACCORD_RECALL,
    ACCEPT_RECALL,
    SEND_TYPE,
    RECEIVE_TYPE,
    DEFAULTFLAG,
    DEFAULTAVATAR,
    serviceStore,
    setServiceId,
    serviceId,
    MSGCHART,
    SERVICECHART,
    currentPage,
  };
});
