// 封装 ajax 请求
define(function (require, exports, module) {
  const BASE_URL = "http://chat.sparrowzoo.com/chat/";

  // 请求历史聊天信息
  function getSession(url, userId) {
    const data = "token=" + userId;
    new Promise((resolve, reject) => {
      $.ajax.json(BASE_URL + url, data, function (result) {
        resolve(result.data);
      });
    });
  }
  // 好友列表
  function getFrinedList(url, userId) {
    return new Promise((resolve, reject) => {
      const data = "token=" + userId;
      $.ajax.json(BASE_URL + url, data, function (result) {
        resolve(result.data);
      });
    });
  }
  return {
    getSession,
    getFrinedList,
  };
});
