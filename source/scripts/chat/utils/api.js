// qs 将对象转为 键值对
function converObj(obj) {
  let query = '';
  Object.keys(obj).forEach((item) => {
    const str = item + '=' + obj[item];
    query += str + '&';
  });
  query = query.substring(0, query.length - 1);
  return query;
}
// 封装 ajax 请求
define(['request', 'axios'], function (request, axios) {
  // const { converObj } = utils;
  const { service } = request;
  const BASE_URL = 'http://chat.sparrowzoo.com/chat/';
  /** ws 有关的接口 */
  // 请求历史聊天信息
  function getSession(url, userId) {
    const data = 'token=' + userId;
    return new Promise((resolve, reject) => {
      $.ajax.json(BASE_URL + url, data, function (result) {
        resolve(result.data);
      });
    });
  }

  // 好友列表
  function getFrinedList(url, userId) {
    return new Promise((resolve, reject) => {
      const data = 'token=' + userId;
      $.ajax.json(BASE_URL + url, data, function (result) {
        resolve(result.data);
      });
    });
  }

  // 已读消息
  function setRead(data) {
    return new Promise((resolve, reject) => {
      const url = 'session/read';
      $.ajax.json(BASE_URL + url, data, function (result) {
        resolve(result.data);
      });
    });
  }

  // 撤回信息
  function cancelMsg(data) {
    return new Promise((resolve, reject) => {
      const url = BASE_URL + 'cancel';
      $.ajax.json(url, data, function (result) {
        resolve(result.data);
      });
    });
  }

  /** 普通接口 */
  const URL = 'http://studyapi.zhilongsoft.com';
  // 登录接口
  function login(data) {
    return service({
      method: 'post',
      url: '/app/authMember/loginByCode',
      data,
    });
  }

  // 我的好友
  function myFriend() {
    return service({
      method: 'get',
      url: '/app/message/myFriend',
    });
  }

  // 根据手机号查询用户详情
  function getDetailByPhone(params) {
    console.log('查询user');
    return service({
      method: 'get',
      url: '/app/message/userDetail',
      params,
    });
  }

  // 根据id 查询用户详情
  function getDetailById(params) {
    return service({
      method: 'get',
      url: '/app/message/findById',
      params,
    });
  }

  // 根据id数组列表 查询用户详情
  function getDetailByIdArr(data) {
    // /app/message/userDetailList
    return service({
      method: 'post',
      url: '/app/message/userDetailList',
      data,
    });
  }

  // 根据 用户id 添加好友
  function addFriendById(data) {
    return service({
      method: 'post',
      url: '/app/message/addFriend',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8',
      },
      data,
    });
  }

  // 删除好友
  function removeFriend(data) {
    return service({
      method: 'post',
      url: '/app/message/removeFriend',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8',
      },
      data: converObj(data),
    });
  }
  // 新朋友列表
  function newFriend() {
    return service({
      method: 'get',
      url: '/app/message/newFriend',
    });
  }

  // 好友审核
  function auditFriend(data) {
    return service({
      method: 'post',
      url: '/app/message/userFriendAudit',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8',
      },
      data,
    });
  }

  // 我的群聊
  function myGroup() {
    return service({
      method: 'get',
      url: '/app/message/myGroup',
    });
  }

  // 删除群聊  退出
  function removeGroup(data) {
    // /app/message/quitGroup
    return service({
      method: 'post',
      url: '/app/message/quitGroup',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8',
      },
      data: converObj(data),
    });
  }

  // 修改群信息
  function changeGroup(data) {
    // /app/message/updateGroup
    return service({
      method: 'post',
      url: '/app/message/updateGroup',
      data,
    });
  }

  // 系统通知 /app/message/systemInform
  function systemNotice() {
    return service({
      method: 'get',
      url: '/app/message/systemInform',
    });
  }

  // 获取客服列表
  function serviceList() {
    return service({
      method: 'get',
      url: '/app/message/customList',
    });
  }

  return {
    getSession,
    getFrinedList,
    setRead,
    cancelMsg,
    login,
    myFriend,
    myGroup,
    newFriend,
    systemNotice,
    removeFriend,
    removeGroup,
    getDetailByPhone,
    getDetailById,
    addFriendById,
    auditFriend,
    changeGroup,
    serviceList,
    getDetailByIdArr,
  };
});
