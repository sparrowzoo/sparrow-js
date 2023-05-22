import { ChatApi } from "./Chat";
import { ImProtocol } from "../../source/scripts/ImProtocol";

var Initialization = {
  initPlatformService: async function (Vue) {
    var res = await ChatApi.platformServices();
    if (res.code === 200) {
      Vue.prototype.$platformServers = res.rows;
      res.rows.forEach((user) => {
        user.platform = true;
        Vue.prototype.$userMap[user.userId] = user;
      });
    }
    console.log("res", res);
  },
  initContact: async function (Vue, vue) {
    var res = await ChatApi.getContacts();
    Vue.prototype.$contact = res.data;
    console.log("res", res);
    var userMap = {};
    res.data.users.forEach((user) => {
      userMap[user.userId] = user;
    });
    Vue.prototype.$userMap = userMap;
    var qunMap = {};
    res.data.quns.forEach((qun) => {
      qunMap[qun.qunId] = qun;
    });
    Vue.prototype.$qunMap = qunMap;
    console.log("userMap", userMap);
  },
  _oppositeUser: function (session, vue) {
    return ImProtocol.getOppositeUser(
      session.chatSession.sessionKey,
      vue.$getUserId()
    );
  },
  fetchUserIds: function (sessions) {
    var userIds = [];
    sessions.forEach((session) => {
      //考虑接收方和发送方的 消息拉取逻辑
      if (userIds.indexOf(session.chatSession.sender) < 0) {
        userIds.push(session.chatSession.sender);
      }
      if (
        session.chatSession.receiver > 0 &&
        userIds.indexOf(session.chatSession.receiver) < 0
      ) {
        userIds.push(session.chatSession.receiver);
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
      const sessionKey = chatSession.sessionKey; //唯一id，1 2 N群ID
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
          //session 头象
          icon: oppositeUser.avatar,
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
  initActiveSession: function (vue) {
    var currentUsrId = vue.$getUserId();
    var key = vue.$route.query.key;
    var targetUserId = vue.$route.query.targetUserId;
    if (key == null && targetUserId == null) {
      //如果没有指定session key 则默认取第一个,即最近的聊天
      vue.activeSession = vue.sessionList[0];
      return;
    }
    var oppositeUser = null;
    if (targetUserId != null) {
      oppositeUser = vue.$userMap[targetUserId];
      key = this.get121Session(oppositeUser, vue);
      vue.activeSession = vue.$sessionMap[key];
      return;
    }
    //如果指定了session key 则取指定的session
    //说明是一对一单聊
    if (key.indexOf("_") > -1) {
      var oppositeId = vue.$protocol.getOppositeUser(key, currentUsrId);
      oppositeUser = vue.$userMap[oppositeId];
      this.get121Session(oppositeUser, vue);
    } else {
      var qun = vue.$qunMap[key];
      this.getQunSession(qun, vue);
    }
    vue.activeSession = vue.$sessionMap[key];
  },

  rebuild: function (protocol, vue) {
    var sender = vue.$userMap[protocol.sender];
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
      messageType: protocol.msgType,
      content: protocol.msg,
      imgUrl: imgUrl,
      isMe: protocol.sender === vue.$getUserId(),
      userName: sender.userName,
      avatar: sender.avatar,
      time: new Date(protocol.clientSendTime).format("MM/dd hh:mm:ss"),
      isText: protocol.msgType === vue.$protocol.TEXT_MESSAGE,
      session:
        protocol.chatType === vue.$protocol.CHAT_TYPE_1_2_N
          ? protocol.sessionKey
          : ImProtocol.generate121SessionKey(
              protocol.sender,
              protocol.receiver
            ),
    };

    var session = vue.$sessionMap[message.session];
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
      type: ImProtocol.CHAT_TYPE_1_2_1, //session 头象
      icon: friend.avatar,
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
      type: ImProtocol.CHAT_TYPE_1_2_N,
      //session 头象
      icon: qun.unitIcon,
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
    lastMessageTime = lastMessage.clientSendTime; //最后一条消息的发送时间
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
    var sessions = await ChatApi.getSession().then(
      (res) => {
        return res.data;
      },
      (err) => {
        console.log(err);
      }
    );
    //根据会话获取用户Id 列表(包括消息的发送者)
    var userIds = this.fetchUserIds(sessions);

    //获取用户实例信息
    const userMap = await ChatApi.getUserMapByIds(userIds, vue.$userMap);
    //组装会话列表
    var sessionList = this.assembleSessions(sessions, userMap, vue);
    sessionList.forEach((session) => {
      session.messages.forEach((message) => {
        message.isMe = message.sender === vue.$getUserId();
        var user = userMap[message.sender];
        message.userName = user.userName;
        message.avatar = user.avatar;
        message.time = new Date(message.serverTime).format("MM/dd hh:mm:ss");
        message.isText = message.messageType === vue.$protocol.TEXT_MESSAGE;
        if (!message.isText) {
          message.imgUrl = message.content;
        }
      });
    });
    var sessionMap = {};
    sessionList.forEach((item) => {
      sessionMap[item.key] = item;
    });
    Vue.prototype.$sessions = sessionList;
    this.resortSessions(vue);
    Vue.prototype.$sessionMap = sessionMap; // 全局会话
  },
  initWebSocket: async function (Vue, vue) {
    return await new Promise((resolve, reject) => {
      var webSocket = new vue.$sparrow.webSocket(
        "ws://chat.sparrowzoo.com/websocket",
        vue.$token
      );
      webSocket.reconnectionAlarmCallback = function () {
        console.log("reconnection AlarmCallback");
      };

      webSocket.onMsgCallback = function (data) {
        if (data.offline) {
          console.log("消息已发送，对方不在线，稍后会收到消息");
          return;
        }
        ImProtocol.parse(data, function (protocol) {
          Initialization.rebuild(protocol, vue);
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
