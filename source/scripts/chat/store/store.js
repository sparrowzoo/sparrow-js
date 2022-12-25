define(function () {
  // indexedDB 仓库
  const DB_NAME = "chat-history";
  const DB_VERSION = 1;
  const DB_STORE_NAME_SESSION = "session";
  const DB_STORE_NAME_USER = "contact-users";
  const DB_STORE_NAME_QUN = "contact-quns";

  const TEXT_MESSAGE = 0;
  const IMAGE_MESSAGE = 1;
  const CHAT_TYPE_1_2_1 = 0;
  const CHAT_TYPE_1_2_N = 1;
  const selfId = { value: 0 };

  const qunNumberMap = {
    map: {},
    initQunMap(arr) {
      this.map = {};
      for (const item of arr) {
        this.map[item.userId] = item.userName;
      }
    },
  };
  let targetId = { value: "-1", type: CHAT_TYPE_1_2_1, username: "" };
  function setTargetId(id, username, chatType) {
    targetId.value = id;
    targetId.type = chatType;
    targetId.username = username;
  }
  function changeSelfId(id) {
    selfId.value = id;
  }
  return {
    DB_NAME,
    DB_VERSION,
    DB_STORE_NAME_SESSION,
    DB_STORE_NAME_USER,
    DB_STORE_NAME_QUN,
    TEXT_MESSAGE,
    IMAGE_MESSAGE,
    CHAT_TYPE_1_2_1,
    CHAT_TYPE_1_2_N,
    selfId,
    targetId,
    setTargetId,
    changeSelfId,
    qunNumberMap,
  };
});
