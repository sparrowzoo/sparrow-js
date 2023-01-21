define([
  "base64",
  "sparrow",
  "sparrowChat",
  "chat-msg",
  "store",
  "api",
  "indexedDB",
  "websocket",
], function (
  base64,
  sparrow,
  sparrowChat,
  chatMsg,
  store,
  api,
  indexedDB,
  websocket
) {
  console.log("页面加载");
  console.log($.request("username"));
  console.log(location.search);
  document.querySelector(".addUrl").onclick = function () {
    location.search =
      "?id=10&targetId=11&username=王五&avatar=https://img1.imgtp.com/2022/11/20/ZLWvFwJZ.jpg";
  };
  const info = {
    userId: 10,
    targetId: 11,
    sessionKey: "10_11",
    username: "王五",
    avatar: "https://img1.imgtp.com/2022/11/20/ZLWvFwJZ.jpg",
  };
  chatMsg.initChatPage();
  chatMsg.getWsInstance();
});
