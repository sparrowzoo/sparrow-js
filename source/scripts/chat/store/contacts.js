define(function (require, exports, module) {
  // 监听已读事件
  class ContackStore {
    constructor() {
      this.contactList = [];
    }
    initContack(arr) {
      this.contactList = arr
        .filter((item) => item)
        .sort((a, b) => b.lastMessage.sendTime - a.lastMessage.sendTime);
    }

    registerCallback(fn, key) {
      this[key] = fn;
    }
    update(lastMsg, msgType, session, fnName) {
      const index = this.contactList.findIndex(
        (item) => item.lastMessage.session === session
      );
      const msgTime = +new Date();
      const params = [index, lastMsg, msgTime, msgType];
      if (fnName === "receiveMsg") {
        console.log(this.contactList[index]);
        const count = this.contactList[index].unReadCount;
        this.contactList[index].unReadCount++;
        params.push([count + 1]);
      }

      this.notify(fnName, params);
      // dom 排序
      this.reSort(index);
      // contactList 排序
      const sessionItem = this.contactList.splice(index, 1);
      this.contactList.unshift(...sessionItem);
      console.log(this.contactList);
    }
    notify(fnName, params) {
      this[fnName](...params);
    }
    0;
  }

  const contackstore = new ContackStore();

  module.exports = {
    contackstore,
  };
});
