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

Sparrow.ajax.tokenConfig= tokenConfig;
const ChatApi = {
    getSession: function getSession(token) {
        const data = 'token=' + token;
        return Sparrow.http.post(SPARROW_BASE_URL + "/sessions", data);
    },
    getContacts: function getFrinedList(token) {
        const data = 'token=' + token;
        return Sparrow.http.post(SPARROW_BASE_URL + "/contacts", data);
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
    getUserById: function (id) {
        const params = "id=" + id;
        return Sparrow.http.get(CONSUMER_BASE_URL + "/app/message/findById?" + params);
    },
    getUserListByIds: function (idArr) {
        const params = {
            idArr: idArr,
        };
        return Sparrow.http.post(CONSUMER_BASE_URL + "/app/message/userDetailList", params);
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
        return Sparrow.http.post(CONSUMER_BASE_URL + "/app/message/newFriend", params);
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
