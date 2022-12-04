define(function (require, exports, module) {
  // indexedDB 仓库名
  const DB_NAME = "chat-history";
  const DB_VERSION = 1;
  const DB_STORE_NAME = "session";
  const DB_STORE_NAME_MSG = "last-msg";
  const DB_STORE_NAME_USER = "contact-users";
  const DB_STORE_NAME_QUN = "contact-quns";

  const TEXT_MESSAGE = 0;
  const IMAGE_MESSAGE = 1;
  const CHAT_TYPE_1_2_1 = 0;
  const CHAT_TYPE_1_2_N = 1;
  const SELFID = 100;
  let targetId = { value: "-1", type: CHAT_TYPE_1_2_1, username: "" };
  function setTargetId(id, username, chatType) {
    targetId.value = id;
    targetId.type = chatType;
    targetId.username = username;
  }
  module.exports = {
    DB_NAME,
    DB_VERSION,
    DB_STORE_NAME,
    DB_STORE_NAME_MSG,
    DB_STORE_NAME_USER,
    DB_STORE_NAME_QUN,
    TEXT_MESSAGE,
    IMAGE_MESSAGE,
    CHAT_TYPE_1_2_1,
    CHAT_TYPE_1_2_N,
    SELFID,
    targetId,
    setTargetId,
  };
});