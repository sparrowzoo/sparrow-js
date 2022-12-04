define(function (require, exports, module) {
  /** 联系客服区域 */
  const { getFocus } = require("../utils/utils");
  function initContactPage() {
    const chatContainerDiv = document.querySelector(".service");
    const chatTemplate = document.querySelector("#chat-part");
    const chatDiv = chatTemplate.content.cloneNode(true);
    // 联系客服 没有 右侧的头像
    const parNode = chatDiv.querySelector(".title");
    const iconDom = parNode.querySelector(".iconfont");
    const titleName = parNode.querySelector(".user");
    titleName.innerText = "联系客服";
    parNode.removeChild(iconDom);
    chatContainerDiv.appendChild(chatDiv);

    setTimeout(() => {
      // 获取焦点
      document.querySelector(".input-content").focus();
    });
  }

  // 进入联系客服 获取焦点
  // function getFocus() {
  //   document.querySelector(".service").querySelector(".input-content").focus();
  // }

  module.exports = {
    initContactPage,
  };
});
