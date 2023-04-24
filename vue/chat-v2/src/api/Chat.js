import {Sparrow} from '../../../../source/scripts/sparrow_es.js'

console.log(process.env)
const SPARROW_BASE_URL = process.env.VUE_APP_SPARROW_BASE_URL;
const CONSUMER_BASE_URL = process.env.VUE_APP_CONSUMER_BASE_URL;
console.log(CONSUMER_BASE_URL);
console.log(SPARROW_BASE_URL);

var tokenConfig = {};
tokenConfig[SPARROW_BASE_URL] = {
    'Token': function () {
        return localStorage.getItem('token')
    }
};
tokenConfig[CONSUMER_BASE_URL] = {
    'X-Sugar-Token': function () {
        return localStorage.getItem('token')
    }
};

Sparrow.ajax.tokenConfig = tokenConfig;


const ChatApi = {
    getSession: function getSession(token) {
        const data = 'token=' + token;
        return Sparrow.http.post(SPARROW_BASE_URL + "/sessions", data);
    },
    getUserId: async function getSession(token) {
        const data = 'token=' + token;
        return await Sparrow.http.post(SPARROW_BASE_URL + "/get-user-id", data).then(res => {
            return res.data;
        }, err => {
            console.log(err);
        });
    },
    getContacts: async function getFrinedList(token) {
        const data = 'token=' + token;
        return await Sparrow.http.post(SPARROW_BASE_URL + "/contacts", data);
    },
    setRead: function setRead(chatType, sessionKey, token) {
        const params = {
            chatType: chatType,
            sessionKey: sessionKey,
            token: token
        };
        return Sparrow.http.post(SPARROW_BASE_URL + "/session/read", params);
    },
    cancelMsg: function cancelMsg(chatType, sessionKey, token, clientSendTime) {
        const params = {
            chatType: chatType,
            sessionKey: sessionKey,
            token: token,
            clientSendTime: clientSendTime,
        };
        return Sparrow.http.post(SPARROW_BASE_URL + "/cancel", params);
    },

    login: function (code, mobile, password) {
        const params = {
            code: code,
            mobile: mobile,
            password: password,
        };
        return Sparrow.http.post(CONSUMER_BASE_URL + "/app/authMember/loginByCode", params);
    },
    getUserByPhone: function (mobile) {
        const params = "mobile=" + mobile;
        return Sparrow.http.get(CONSUMER_BASE_URL + "/app/message/userDetail?" + params);
    },
    getUserById: async function (id, userMap) {
        if (userMap != null && userMap[id] != null) {
            return userMap[id];
        }
        const params = "id=" + id;
        return await Sparrow.http.get(CONSUMER_BASE_URL + "/app/message/findById?" + params).then(function (res) {
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
            //如果本地缓存中已经包含了所有的id，则直接返回
            if (needRemoteFetchIdArr.length === 0) {
                return userResultMap;
            }
            //如果本地缓存中没有，则从远程获取
            const params = {
                idArr: needRemoteFetchIdArr,
            };

            const remoteUsers = await Sparrow.http.post(CONSUMER_BASE_URL + "/app/message/userDetailList", params)
                .then(function (res) {
                    return res.data;
                }, function (error) {
                    return {error};
                });
            if (remoteUsers == null || remoteUsers.length === 0) {
                return userResultMap;
            }
            for (i = 0; i < remoteUsers.length; i++) {
                userId = remoteUsers[i].id;
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
        return Sparrow.http.post(CONSUMER_BASE_URL + "/app/message/addFriend", params);
    },
    removeFriend: function (id) {
        const params = "id=" + id;
        return Sparrow.http.post(CONSUMER_BASE_URL + "/app/message/removeFriend", params);
    },
    newFriendList: function (id) {
        const params = "id=" + id;
        return Sparrow.http.get(CONSUMER_BASE_URL + "/app/message/newFriend?" + params);
    },
    auditFriend: function (id, status) {
        const params = "id=" + id + "&status=" + status;
        return Sparrow.http.post(CONSUMER_BASE_URL + "/app/message/userFriendAudit", params);
    },
    existGroup: function (id) {
        const params = "groupId=" + id;
        return Sparrow.http.post(CONSUMER_BASE_URL + "/app/message/removeGroup", params);
    },
    modifyGroup: function (id, name, avatar) {
        const params = "groupId=" + id + "&name=" + name + "&avatar=" + avatar;
        return Sparrow.http.post(CONSUMER_BASE_URL + "/app/message/changeGroup", params);
    },
    systemNotice: function () {
        return Sparrow.http.get(CONSUMER_BASE_URL + "/app/message/systemInform");
    },
    customList: function () {
        return Sparrow.http.get(CONSUMER_BASE_URL + "/app/message/customList");
    }
}
export {ChatApi};
