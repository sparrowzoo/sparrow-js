const SPARROW_BASE_URL = process.env.VUE_APP_SPARROW_BASE_URL;
const CONSUMER_BASE_URL = process.env.VUE_APP_CONSUMER_BASE_URL;
console.log(CONSUMER_BASE_URL);
console.log(SPARROW_BASE_URL);
const ChatApi = {
  getSession: async function getSession() {
    return await Sparrow.http.syncPost(SPARROW_BASE_URL + "/chat/v2/sessions");
  },
  getUserId: async function () {
    return await Sparrow.http.syncPost(SPARROW_BASE_URL + "/get-user-id").then(
      (res) => {
        return res.data;
      },
      (err) => {
        console.log(err);
      }
    );
  },
  getContacts: async function () {
    return await Sparrow.http.syncPost(SPARROW_BASE_URL + "/contact/contacts");
  },
  setRead: function (session, vue) {
    const params = {
      sessionKey: session.key,
    };
    return Sparrow.http
      .syncPost(SPARROW_BASE_URL + "/chat/v2/session/read", params)
      .then(
        (res) => {
          session.lastReadTime = new Date();
          vue.$initialization.assembleLastMessage(session);
          vue.$initialization.resortSessions(vue);
          return res.data;
        },
        (err) => {
          console.log(err);
        }
      );
  },
  cancelMsg: async function (params) {
    return await Sparrow.http
      .syncPost(SPARROW_BASE_URL + "/chat/v2/cancel", params)
      .then(
        (res) => {
          return res.data;
        },
        (err) => {
          console.log(err);
        }
      );
  },
  login: function (captcha, userName, password) {
    const params = {
      captcha: captcha,
      userName: userName,
      password: password,
      areaCode: "",
    };
    return Sparrow.http.syncPost(SPARROW_BASE_URL + "/shortcut-login", params);
  },
  getUserByIdentify: function (identify) {
    const params = { userIdentify: identify };
    return Sparrow.http
      .syncPost(SPARROW_BASE_URL + "/contact/find-friend", params)
      .then(
        (result) => {
          return result;
        },
        (err) => {
          console.log(err);
        }
      );
  },
  getUserById: async function (id, userMap) {
    if (userMap != null && userMap[id] != null) {
      return userMap[id];
    }
    const params = "id=" + id;
    return await Sparrow.http
      .syncPost(CONSUMER_BASE_URL + "/app/message/findById?" + params)
      .then(function (res) {
        return res.data;
      });
  },
  getUserMapByIds: async function (idArr, localUserCache) {
    //如果idArr为空，直接返回空对象
    if (!Array.isArray(idArr) || idArr.length === 0) {
      return {};
    }

    var userId = -1;
    var i = 0;
    try {
      var userResultMap = {};
      var needRemoteFetchIdArr = [];
      //先从本地缓存中获取,并且将本地缓存中没有的id放入needRemoteFetchIdArr
      for (i = 0; i < idArr.length; i++) {
        userId = idArr[i];
        if (localUserCache[userId] != null) {
          userResultMap[userId] = localUserCache[userId];
        } else {
          needRemoteFetchIdArr.push(userId);
        }
      }
      //needRemoteFetchIdArr = [7, 69];
      //如果本地缓存中已经包含了所有的id，则直接返回
      if (needRemoteFetchIdArr.length === 0) {
        return userResultMap;
      }
      //如果本地缓存中没有，则从远程获取
      const remoteUsers = await Sparrow.http
        .syncPost(
          SPARROW_BASE_URL + "/contact/get-users-by-ids",
          needRemoteFetchIdArr
        )
        .then(
          function (res) {
            return res.data;
          },
          function (error) {
            console.log(error.message);
            return userResultMap;
          }
        );
      if (remoteUsers == null || remoteUsers.length === 0) {
        return userResultMap;
      }
      for (i = 0; i < remoteUsers.length; i++) {
        userId = remoteUsers[i].userId;
        var user = remoteUsers[i];
        user.platform = !!user.isCustomer;
        //将远程获取的用户信息放入本地缓存
        localUserCache[userId] = remoteUsers[i];
        //将远程获取的用户信息放入返回结果
        userResultMap[userId] = remoteUsers[i];
      }
      return userResultMap;
    } catch (e) {
      console.error(e);
      return {};
    }
  },
  addFriendById: function (friendSecretIdentify) {
    const params = { friendSecretIdentify: friendSecretIdentify, reason: "" };
    return Sparrow.http.syncPost(
      SPARROW_BASE_URL + "/contact/apply-friend",
      params
    );
  },
  removeFriend: function (id) {
    const params = "id=" + id;
    return Sparrow.http.syncPost(
      CONSUMER_BASE_URL + "/app/message/removeFriend",
      params
    );
  },
  newFriendList: function () {
    return Sparrow.http.syncGet(
      SPARROW_BASE_URL + "/contact/friend-apply-list"
    );
  },
  qunMemberApplyList: function (qunId) {
    return Sparrow.http.syncPost(
      SPARROW_BASE_URL + "/contact/qun-member-apply-list",
      "qunId=" + qunId
    );
  },
  auditFriend: function (auditId, agree) {
    const params = {
      agree: agree,
      auditId: auditId,
      reason: "",
    };
    return Sparrow.http.syncPost(
      SPARROW_BASE_URL + "/contact/audit-friend-apply",
      params
    );
  },
  auditQunMember: function (auditId, agree) {
    const params = {
      agree: agree,
      auditId: auditId,
      reason: "",
    };
    return Sparrow.http.syncPost(
      SPARROW_BASE_URL + "/contact/audit-qun-apply",
      params
    );
  },

  existGroup: function (id) {
    const params = "groupId=" + id;
    return Sparrow.http.syncPost(
      CONSUMER_BASE_URL + "/app/message/quitGroup",
      params
    );
  },
  modifyGroup: function (id, name, avatar) {
    const params = "groupId=" + id + "&name=" + name + "&avatar=" + avatar;
    return Sparrow.http.syncPost(
      CONSUMER_BASE_URL + "/app/message/changeGroup",
      params
    );
  },
  platformServices: function () {
    return { code: 0 };
  },
};
export { ChatApi };
