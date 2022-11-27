define(function (require, exports, module) {
  /** 联系客服区域 */
  function initContactPage() {
    const chatContainerDiv = document.querySelector(".service");
    const chatTemplate = document.querySelector("#chat-part");
    const chatDiv = chatTemplate.content.cloneNode(true);
    // 联系客服 没有 右侧的头像
    const parNode = chatDiv.querySelector(".title");
    const iconDom = parNode.querySelector(".iconfont");
    const titleName = parNode.querySelector(".user");
    titleName.innerText = "联系客服";
    console.log(iconDom);
    parNode.removeChild(iconDom);
    chatContainerDiv.appendChild(chatDiv);
  }

  module.exports = {
    initContactPage,
  };
});
