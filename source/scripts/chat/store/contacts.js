define(function (require, exports, module) {
  const { targetId } = require("./store");
  //  维护 session 列表，收发消息后主动回调相关函数 实现 sessionDOM列表自动更新
  class ContactStore {
    constructor() {
      this.contactList = [];
    }
    // 首次加载，自动初始化 session 列表
    initContack(arr) {
      this.contactList = arr
        .filter((item) => item)
        .sort((a, b) => b.lastMessage.sendTime - a.lastMessage.sendTime);
    }

    registerCallback(fn, key) {
      this[key] = fn;
    }
    // 修改未读数量
    setUnread(index, fnName) {
      this.contactList[index].unReadCount = 0;
      this.notify(fnName, [
        index,
        this.contactList[index].lastMessage.content,
        this.contactList[index].lastMessage.session,
      ]);
    }
    // 收发信息后，需要修改
    update(lastMsg, msgType, session, fnName, fromUserId) {
      const index = this.contactList.findIndex(
        (item) => item.lastMessage.session === session
      );

      if (fnName === "changeUnreadCount") {
        this.setUnread(index, fnName);
        return;
      }
      const msgTime = +new Date();
      const params = [index, lastMsg, msgTime, msgType];
      if (fnName === "receiveMsg" && fromUserId != targetId.value) {
        // 接收到 不是当前聊天对象的信息 未读数量 +1
        const count = this.contactList[index].unReadCount;
        this.contactList[index].unReadCount++;
        params.push([count + 1]);
      }

      this.notify(fnName, params);
      //  dom 排序
      this.reSort(index);
      // contactList 排序
      const sessionItem = this.contactList.splice(index, 1);
      this.contactList.unshift(...sessionItem);
    }
    notify(fnName, params) {
      console.log(fnName);
      this[fnName](...params);
    }
  }

  const contactStore = new ContactStore();

  module.exports = {
    contactStore,
  };
});
