import {ChatApi} from "@/api/Chat";

var Initialization = {
    initContact: async function (Vue, vue) {
        var userId = vue.$getUserId();
        var res = await ChatApi.getContacts(userId);
        Vue.prototype.$contact = res.data;
        console.log('res', res);
        var userMap = {};
        res.data.users.forEach(user => {
            userMap[user.userId] = user;
        });
        Vue.prototype.$userMap = userMap;
        var qunMap = {};
        res.data.quns.forEach(qun => {
            qunMap[qun.qunId] = qun;
        });
        Vue.prototype.$qunMap = qunMap;
        console.log('userMap', userMap);
    },
    fetchUserIds: function (sessions) {
        var userIds = [];
        sessions.forEach(session => {
            //考虑接收方和发送方的 消息拉取逻辑
            if (userIds.indexOf(session.chatSession.me) < 0) {
                userIds.push(session.chatSession.me);
            }
            if (userIds.indexOf(session.chatSession.target < 0)) {
                userIds.push(session.chatSession.target);
            }
            session.messages.forEach(message => {
                if (userIds.indexOf(message.fromUserId) < 0) {
                    userIds.push(message.fromUserId);
                }
            });
        });
        return userIds;
    },
    assembleSessions: function (sessions, userMap, vue) {
        var sessionList = [];
        //组装会话列表
        sessions.forEach(session => {
            var sessionItem = this._assembleSession(session, vue);
            if (sessionItem.chatType === vue.$protocol.CHAT_TYPE_1_2_1) {
                //获取对方用户信息
                var oppositeUserId = this._oppositeUser(session, vue);
                var oppositeUser = userMap[oppositeUserId];
                // 普通用户
                if (!oppositeUser) {
                    return null;
                }
                sessionList.push({
                    //session key 作为唯一id
                    key: sessionItem.sessionKey,
                    //发送方ID
                    sender: sessionItem.sender,
                    //session 类型
                    type: sessionItem.chatType,
                    //最后一条消息的发送时间
                    lastMessageTime: sessionItem.lastMessageTime,

                    time: sessionItem.time,
                    //最后一条消息的内容
                    lastMessageContent: sessionItem.lastMessageContent,
                    //未读消息数
                    count: sessionItem.unReadCount,
                    //session 头象
                    icon: oppositeUser.avatar,
                    //session 名称 对方的昵称
                    title: oppositeUser.userName,
                    //消息列表
                    messages: session.messages
                    // icon: qunIcon
                });
            }
            if (sessionItem.chatType === vue.$protocol.CHAT_TYPE_1_2_N) {
                sessionList.push({
                    key: sessionItem.sessionKey,
                    type: sessionItem.chatType,
                    lastMessageTime: sessionItem.lastMessageTime,
                    time: sessionItem.time,
                    content: sessionItem.lastMessageContent,
                    count: sessionItem.unReadCount,
                    messages: session.messages
                    // icon: qunIcon
                });
            }
        });
        return sessionList;
    },
    _oppositeUser(session, vue) {
        if (session.chatSession.me === vue.$getUserId()) {
            return session.chatSession.target;
        }
        return session.chatSession.me;
    },
    _assembleSession(session, vue) {
        const chatType = session.chatSession.chatType; //1群 0单聊
        const sessionKey = session.chatSession.sessionKey;//唯一id，可以作为群名
        const receiver = session.chatSession.target;//接收方
        const sender = session.chatSession.me;//发送方 拉取时 发送方自己发的会话，自己也会拉取到
        var lastMessage = null;
        var lastMessageTime = null;
        var lastMessageContent = null;
        if (session.messages != null && session.messages.length > 0) {
            lastMessage = session.messages[session.messages.length - 1];//最后收到的一条消息
            lastMessageTime = lastMessage.clientSendTime;//最后一条消息的发送时间
            lastMessageContent = lastMessage.messageType === 1 ? '/图片/' : vue.$Base64.decode(lastMessage.content);
        }
        const unReadCount = session.messages.filter(message => message.serverTime >= session.lastReadTime).length;

        return {
            sessionKey: sessionKey,
            receiver: receiver,
            sender: sender,
            chatType: chatType,
            lastMessageTime: lastMessageTime,
            time: new Date(lastMessageTime).format("MM/dd hh:mm:ss"),
            lastMessageContent: lastMessageContent,
            count: unReadCount
        }
    },
    initSessions: async function (Vue, vue) {
        var userId = vue.$getUserId();
        //获取当前用户的所有会话
        var sessions = await ChatApi.getSession(userId);
        //根据会话获取用户Id 列表(包括消息的发送者)
        var userIds = this.fetchUserIds(sessions);

        //获取用户实例信息
        const userMap = await ChatApi.getUserMapByIds(userIds, vue.$userMap);
        //组装会话列表
        var sessionList = this.assembleSessions(sessions, userMap, vue);
        sessionList.forEach(session => {
            session.messages.forEach(message => {
                message.isMe = message.fromUserId === vue.$getUserId();
                var user = userMap[message.fromUserId];
                message.userName = user.userName;
                message.avatar = user.avatar;
                message.time = new Date(message.serverTime).format("MM/dd hh:mm:ss");
                message.isText = message.messageType === vue.$protocol.TEXT_MESSAGE;
                if (message.isText) {
                    message.content = vue.$Base64.decode(message.content);
                } else {
                    message.content = '/图片/';
                }
            });
        });
        var sessionMap = {};
        sessionList.forEach(item => {
            sessionMap[item.key] = item;
        });
        Vue.prototype.$sessions = sessionMap;// 全局会话
    }
    ,
    initWebSocket: function (Vue, vue) {
        var webSocket = new vue.$sparrow.webSocket('ws://chat.sparrowzoo.com/websocket', vue.$token);
        webSocket.reconnectionAlarmCallback = function () {
            console.log("reconnection AlarmCallback");
        };
        webSocket.connect()
        Vue.prototype.$webSocket = webSocket;
    }
}

export {Initialization}
