const WEBSOCKET_BASE_URL = process.env.VUE_APP_SPARROW_WEBSOCKET;
console.log("VUE_APP_SPARROW_WEBSOCKET" + WEBSOCKET_BASE_URL);

var Initialization = {
  initPlatformService: async function (Vue, vue) {
    var res = await vue.$chatApi.platformServices();
    if (res.code === 200) {
      Vue.prototype.$platformServers = res.rows;
      res.rows.forEach((user) => {
        user.platform = true;
        Vue.prototype.$userMap[user.userId] = user;
      });
    }
  },
  initContact: async function (Vue, vue) {
    var res = await vue.$chatApi.getContacts();
    Vue.prototype.$contact = res.data;
    console.log("res", res);
    var userMap = {};
    if (res.data.users) {
      res.data.users.forEach((user) => {
        userMap[user.userId] = user;
      });
    }
    Vue.prototype.$userMap = userMap;
    var qunMap = {};
    if (res.data.quns) {
      res.data.quns.forEach((qun) => {
        qunMap[qun.qunId] = qun;
      });
    }
    Vue.prototype.$qunMap = qunMap;
    // console.log("userMap", userMap);
  },
  _oppositeUser: function (session, vue) {
    return vue.$protocol.getOppositeUser(vue, session);
  },
  fetchUserIds: function (sessions, vue) {
    var userIds = [];
    sessions.forEach((session) => {
      //考虑接收方和发送方的 消息拉取逻辑
      var oppositeUser = this._oppositeUser(session, vue);
      if (userIds.indexOf(oppositeUser) < 0) {
        userIds.push(oppositeUser);
        userIds.push(vue.$getUserId());
      }
      session.messages.forEach((message) => {
        if (userIds.indexOf(message.sender) < 0) {
          userIds.push(message.sender);
        }
      });
    });
    return userIds;
  },
  assembleSessions: function (sessions, userMap, vue) {
    var sessionList = [];
    //组装会话列表
    sessions.forEach((session) => {
      var chatSession = session.chatSession;
      const chatType = chatSession.chatType; //1群 0单聊
      const sessionKey = chatSession.id; //唯一id，1 2 N群ID
      var newSession = null;
      if (chatType === vue.$protocol.CHAT_TYPE_1_2_1) {
        //获取对方用户信息
        var oppositeUserId = this._oppositeUser(session, vue);
        var oppositeUser = userMap[oppositeUserId];
        // 普通用户
        if (!oppositeUser) {
          return null;
        }
        newSession = {
          key: sessionKey,
          //session 类型
          type: chatType,
          //session 头象 兼容老版本
          icon: oppositeUser.avatar,
          avatar: oppositeUser.avatar,
          lastReadTime: session.lastReadTime,
          flag: oppositeUser.flagUrl, //session 名称 对方的昵称
          title: oppositeUser.userName, //对方ID
          oppositeUserId: oppositeUser.userId, //消息列表
          messages: session.messages,
        };
      }
      if (chatType === vue.$protocol.CHAT_TYPE_1_2_N) {
        var qun = vue.$qunMap[sessionKey];
        newSession = {
          key: sessionKey,
          type: chatType,
          title: qun.qunName,
          messages: session.messages,
          icon: qun.unitIcon,
          avatar: qun.avatar,
          lastReadTime: session.lastReadTime,
        };
      }
      this.assembleLastMessage(newSession, vue);
      sessionList.push(newSession);
    });
    return sessionList;
  },
  resortSessions: function (vue) {
    vue.$sessions = vue.$sessions.sort(function (a, b) {
      if (b.lastReadTime === a.lastReadTime) {
        return 0;
      }
      return b.lastReadTime > a.lastReadTime ? 1 : -1;
    });
  },
  initActiveSession: async function (vue) {
    var key = vue.$route.query.key;
    var targetUserId = vue.$route.query.targetUserId;
    if (key == null && targetUserId == null) {
      //如果没有指定session key 则默认取第一个,即最近的聊天
      vue.activeSession = vue.sessionList[0];
      return;
    }
    var oppositeUser = null;
    //临时会话
    if (targetUserId != null) {
      await vue.$chatApi.getUserById(targetUserId, vue);
      oppositeUser = vue.$userMap[targetUserId];
      key = this.get121Session(oppositeUser, vue);
      vue.activeSession = vue.$sessionMap[key];
      return;
    }
    //如果指定了session key 则取指定的session
    //说明是一对一单聊
    if (typeof key == "string" && key.indexOf("_") > -1) {
      var oppositeId = vue.$protocol.getOppositeUser(vue);
      oppositeUser = vue.$userMap[oppositeId];
      this.get121Session(oppositeUser, vue);
    } else {
      var qun = vue.$qunMap[key];
      this.getQunSession(qun, vue);
    }
    vue.activeSession = vue.$sessionMap[key];
  },
  setSessionLastReadTime: function (session) {
    session.lastReadTime = new Date().getTime() + 2;
  },
  rebuild: async function (protocol, vue) {
    var sender = await vue.$chatApi.getUserById(protocol.sender, vue);
    var imgUrl = null;
    if (protocol.msgType === vue.$protocol.IMAGE_MESSAGE) {
      var fileBlob = new Blob([protocol.msg]);
      imgUrl = window.URL.createObjectURL(fileBlob);
    }

    var message = {
      id: protocol.clientSendTime,
      chatType: protocol.chatType,
      sender: protocol.sender,
      clientSendTime: protocol.clientSendTime,
      serverTime: protocol.clientSendTime, //新消息默认与本地时间一致
      messageType: protocol.msgType,
      content: protocol.msg,
      imgUrl: imgUrl,
      isMe: protocol.sender === vue.$getUserId(),
      userName: sender.userName,
      avatar: sender.avatar,
      isText: protocol.msgType === vue.$protocol.TEXT_MESSAGE,
      session:
        protocol.chatType === vue.$protocol.CHAT_TYPE_1_2_N
          ? protocol.sessionKey
          : vue.$protocol.generate121SessionKey(
              protocol.sender,
              protocol.receiver
            ),
    };
    var session = vue.$sessionMap[message.session];
    var lastMessageTime = session.lastMessageTime;
    if (message.serverTime - lastMessageTime > 1000 * 5) {
      message.time = new Date(protocol.clientSendTime).format("MM/dd hh:mm:ss");
    }
    session.messages.push(message);
    this.assembleLastMessage(session, vue);
  }, //组装1对1会话 和具体业务相关
  get121Session: function (friend, vue) {
    var currentUserId = vue.$getUserId();
    //通讯录好友聊天，一定存在对方用户
    var sessionKey = vue.$protocol.generate121SessionKey(
      friend.userId,
      currentUserId
    );
    var session = vue.$sessionMap[sessionKey];
    if (session != null) {
      return sessionKey;
    }

    session = {
      platform: !!friend.platform, //1对1的key
      key: sessionKey, //发送方ID
      type: vue.$protocol.CHAT_TYPE_1_2_1, //session 头象
      icon: friend.avatar,
      avatar: friend.avatar,

      flag: friend.flagUrl, //session 名称 对方的昵称
      title: friend.userName,
      //消息列表
      messages: [],
      oppositeUserId: friend.userId,
      lastReadTime: 0,
    };
    vue.$sessions.push(session);
    vue.$sessionMap[session.key] = session;
    return session.key;
  },
  getQunSession: function (qun, vue) {
    //通讯录好友聊天，一定存在对方用户
    var sessionKey = qun.qunId;
    var session = vue.$sessionMap[sessionKey];
    if (session != null) {
      return sessionKey;
    }
    session = {
      key: sessionKey, //发送方ID
      type: vue.$protocol.CHAT_TYPE_1_2_N,
      //session 头象
      icon: qun.avatar,
      title: qun.qunName,
      //消息列表
      messages: [],
      lastReadTime: 0,
    };
    vue.$sessions.push(session);
    vue.$sessionMap[session.key] = session;
    return session.key;
  },
  assembleLastMessage(session, vue) {
    if (session.messages == null || session.messages.length === 0) {
      return;
    }
    var lastMessage = null;
    var lastMessageTime = null;
    var lastMessageContent = null;

    lastMessage = session.messages[session.messages.length - 1]; //最后收到的一条消息
    lastMessageTime = lastMessage.serverTime; //最后一条消息的发送时间
    lastMessageContent =
      lastMessage.messageType === 1 ? "/图片/" : lastMessage.content;
    const unReadCount = session.messages.filter(
      (message) => message.serverTime >= session.lastReadTime
    ).length;

    //最后一条消息的发送时间
    session.lastMessageTime = lastMessageTime;
    session.time = new Date(lastMessageTime).format("MM/dd hh:mm:ss");
    session.lastMessageContent = lastMessageContent;
    session.unReadCount = unReadCount;
  },
  initSessions: async function (Vue, vue) {
    //获取当前用户的所有会话
    var sessions = await vue.$chatApi.getSession().then(
      (res) => {
        return res.data;
      },
      (err) => {
        console.log(err);
      }
    );
    //根据会话获取用户Id 列表(包括消息的发送者)
    var userIds = this.fetchUserIds(sessions, vue);

    //获取用户实例信息
    const userMap = await vue.$chatApi.getUserMapByIds(userIds, vue.$userMap);
    //组装会话列表
    var sessionList = this.assembleSessions(sessions, userMap, vue);
    sessionList.forEach((session) => {
      var lastTime = 0;
      for (var i = 0; i < session.messages.length; i++) {
        var message = session.messages[i];
        message.isMe = message.sender === vue.$getUserId();
        var user = userMap[message.sender];
        if (!user) {
          console.log("user is not found!");
          continue;
        }
        message.userName = user.userName;
        message.avatar = user.avatar;
        if (message.serverTime - lastTime > 1000 * 5) {
          message.time = new Date(message.serverTime).format("MM/dd hh:mm:ss");
        } else {
          message.time = "";
        }
        message.isText = message.messageType === vue.$protocol.TEXT_MESSAGE;
        if (!message.isText) {
          message.imgUrl = message.content;
        }
        lastTime = message.serverTime;
      }
    });
    var sessionMap = {};
    sessionList.forEach((item) => {
      sessionMap[item.key] = item;
    });
    Vue.prototype.$sessions = sessionList;
    this.resortSessions(vue);
    Vue.prototype.$sessionMap = sessionMap; // 全局会话
  },
  toBottom: function () {}, //滚动到底部钩子
  initWebSocket: async function (Vue, vue) {
    vue.$sparrow.browser.monitorFocus();
    return await new Promise((resolve, reject) => {
      var webSocket = new vue.$sparrow.webSocket(
        WEBSOCKET_BASE_URL + "/websocket",
        vue.$token
      );
      webSocket.statusBarId = "pingStatus";
      webSocket.reconnectionCallback = function () {
        if (vue.$sparrow.browser.active) {
          webSocket.clearReconnectionTimer();
          //刷一下当前窗口
          //因为用户断开后，聊天数据未更新，重连后，相关联系人，群和消息需要重新加载
          //vue.$init();
          //导致页面绑定的对象引用不一致，比如this.$sessions对象会被重新赋值，session对象引用地址发生变化,VUE无法探测数据变化
          //综上刷新即可
          vue.$router.go(0);
        } else {
          webSocket.showPingStatus(
            "连接已断开，<span style='color:red'>点击(一次不行就点N次...)</span>屏幕任意位置继续聊!"
          );
        }
      };

      webSocket.onMsgCallback = function (data) {
        if (data.offline) {
          console.log("消息已发送，对方不在线，稍后会收到消息");
          return;
        }
        vue.$protocol.parse(data, async function (protocol) {
          var session = vue.$sessionMap[protocol.sessionKey];
          if (session == null) {
            var senderId = protocol.sender;
            var key = null;
            //临时会话
            await vue.$chatApi.getUserById(senderId, vue);
            var oppositeUser = vue.$userMap[senderId];
            key = vue.$initialization.get121Session(oppositeUser, vue);
            vue.activeSession = vue.$sessionMap[key];
          }
          if (protocol.chatType === vue.$protocol.CHAT_TYPE_CANCEL) {
            session.messages = session.messages.filter(
              (message) => message.clientSendTime !== protocol.clientSendTime
            );
          } else {
            //Initialization.setSessionLastReadTime(session);
            Initialization.rebuild(protocol, vue);
          }
          Initialization.toBottom();
          console.log("parse protocol:" + protocol);
        });
      };

      webSocket.connect(resolve, reject);
      Vue.prototype.$webSocket = webSocket;
    }).then((userInfo) => {
      var userInfoArray = userInfo.split(",");
      if (userInfoArray.length !== 2) {
        throw new Error("用户信息错误");
      }
      vue.$webSocket.userId = parseInt(userInfoArray[0], 10);
      vue.$webSocket.platform = userInfoArray[1] === "true";
    });
  },
};

export { Initialization };
