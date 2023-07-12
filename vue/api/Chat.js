const SPARROW_BASE_URL = process.env.VUE_APP_SPARROW_BASE_URL;
const CONSUMER_BASE_URL = process.env.VUE_APP_CONSUMER_BASE_URL;
console.log(CONSUMER_BASE_URL);
console.log(SPARROW_BASE_URL);

var tokenConfig = {};
tokenConfig[SPARROW_BASE_URL] = {
  "login-token": function () {
    return localStorage.getItem("token");
  },
};
tokenConfig[CONSUMER_BASE_URL] = {
  "X-Sugar-Token": function () {
    return localStorage.getItem("token");
  },
};

Sparrow.ajax.tokenConfig = tokenConfig;

const ChatApi = {
  getSession: function () {
    return Sparrow.http.syncPost(SPARROW_BASE_URL + "/sessions");
  },
  getUserId: async function () {
    return await Sparrow.http.syncPost(SPARROW_BASE_URL + "/get-user-id");
  },
  getContacts: async function () {
    return await Sparrow.http.syncPost(SPARROW_BASE_URL + "/contacts");
  },
  setRead: function (session, vue) {
    const params = {
      sessionKey: session.key,
    };
    return Sparrow.http
      .syncPost(SPARROW_BASE_URL + "/session/read", params)
      .then(
        (res) => {
          session.lastReadTime = new Date();
          vue.$initialization.assembleLastMessage(session);
          vue.$initialization.resortSessions(vue);
          return res.data;
        },
        (err) => {
          console.log(err.message);
        }
      );
  },
  cancelMsg: async function (params) {
    $.ajax.SUCCESS = 0;
    return await Sparrow.http
      .syncPost(SPARROW_BASE_URL + "/cancel", params)
      .then(
        (res) => {
          return res.data;
        },
        (err) => {
          console.log(err.message);
        }
      );
  },

  login: function (code, mobile, password) {
    const params = {
      code: code,
      mobile: mobile,
      password: password,
      areaCode: "",
    };
    return Sparrow.http.syncPost(
      CONSUMER_BASE_URL + "/app/authMember/loginByCode",
      params,
      200
    );
  },
  getUserByPhone: function (mobile) {
    const params = "mobile=" + mobile;
    return Sparrow.http.syncGet(
      CONSUMER_BASE_URL + "/app/message/userDetail?" + params,
      200
    );
  },
  getUserById: async function (id, vue) {
    if (vue.$userMap != null && vue.$userMap[id] != null) {
      return vue.$userMap[id];
    }
    const params = "id=" + id;
    return await Sparrow.http
      .syncGet(CONSUMER_BASE_URL + "/app/message/findById?" + params, 200)
      .then(function (res) {
        vue.$userMap[res.data.userId] = res.data;
        vue.$contact.users.push(res.data);
        return res.data;
      });
  },
  //初始化session时调用
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
          CONSUMER_BASE_URL + "/app/message/userDetailList",
          needRemoteFetchIdArr,
          200
        )
        .then(
          function (res) {
            return res.data;
          },
          function (error) {
            return { error };
          }
        );
      if (remoteUsers == null || remoteUsers.length === 0) {
        return userResultMap;
      }
      for (i = 0; i < remoteUsers.length; i++) {
        userId = remoteUsers[i].id;
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
  addFriendById: function (id) {
    const params = "id=" + id;
    return Sparrow.http.syncPost(
      CONSUMER_BASE_URL + "/app/message/addFriend",
      params,
      200
    );
  },
  removeFriend: function (id) {
    const params = "id=" + id;
    return Sparrow.http.syncPost(
      CONSUMER_BASE_URL + "/app/message/removeFriend",
      params,
      200
    );
  },
  newFriendList: function (id) {
    const params = "id=" + id;
    return Sparrow.http.syncGet(
      CONSUMER_BASE_URL + "/app/message/newFriend?" + params,
      200
    );
  },
  auditFriend: function (id, status) {
    const params = "id=" + id + "&status=" + status;
    return Sparrow.http.syncPost(
      CONSUMER_BASE_URL + "/app/message/userFriendAudit",
      params,
      200
    );
  },
  existGroup: function (id) {
    const params = "groupId=" + id;
    return Sparrow.http.syncPost(
      CONSUMER_BASE_URL + "/app/message/quitGroup",
      params,
      200
    );
  },
  modifyGroup: function (id, name, avatar) {
    const params = "groupId=" + id + "&name=" + name + "&avatar=" + avatar;
    return Sparrow.http.syncPost(
      CONSUMER_BASE_URL + "/app/message/changeGroup",
      params,
      200
    );
  },
  systemNotice: function () {
    return Sparrow.http.syncGet(
      CONSUMER_BASE_URL + "/app/message/systemInform",
      200
    );
  },
  platformServices: function () {
    return Sparrow.http.syncGet(
      CONSUMER_BASE_URL + "/app/message/customList",
      200
    );
  },
};
export { ChatApi };
