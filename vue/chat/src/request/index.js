import mainAxios from './requestMain'

import slaveAxios from './requestSlave'

function login({ code, mobile, password }) {
    return mainAxios.post(`/app/authMember/loginByCode`, {
        code, mobile, password
    })
}


function getContacts(userId) {
    return slaveAxios.post(`/chat/contacts?token=${userId}`)
}


function getSession(userId) {
    return slaveAxios.post(`/chat/sessions?token=${userId}`)
}

function read({ chatType, sessionKey, userId }) {
    return slaveAxios.post(`chat/session/read`, {
        chatType,
        sessionKey,
        userId
    })
}

function cancel({ fromUserId, clientSendTime, sessionKey, chatType }) {
    return slaveAxios.post(`chat/cancel`, {
        fromUserId,
        clientSendTime,
        sessionKey,
        chatType,
    })
}
function searchUser(mobile) {
    return mainAxios.get(`/app/message/userDetail?mobile=${mobile}`)
}
function addFriend(id) {
    return mainAxios.post(`/app/message/addFriend?id=${id}`)
}
function newFriend() {
    return mainAxios.get(`/app/message/newFriend`)
}
// status =1 通过  =2 拒绝
function auditFriend(id, status) {
    return mainAxios.post(`/app/message/userFriendAudit?id=${id}&status=${status}`)
}

function getSystemInfos() {
    return mainAxios.get(`/app/message/systemInform`)
}

export { login, getContacts, getSession, read, cancel, searchUser, addFriend, newFriend, auditFriend, getSystemInfos };