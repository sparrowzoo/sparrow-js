define(function (require, exports, module) {
  // 导入页面组件
  const myFriend = require("./page/my-friend.js");
  const chatMsg = require("./page/chat-msg.js");
  const systemInform = require("./page/system-inform.js");
  const contactService = require("./page/contact-service.js");

  window.onload = function () {
    console.log("onload");
    // 请求 当前用户好友
    myFriend.getItemList();

    // 初始化聊天信息页面
    chatMsg.initChatPage();

    // 初始化联系客服页面
    contactService.initContactPage();
  };
});
