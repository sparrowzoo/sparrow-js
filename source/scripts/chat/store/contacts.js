define(["store"], function (store) {
  const { targetId, setTargetId, CHAT_TYPE_1_2_1 } = store;
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

      // 初始化后默认将第一个会话列表的targetid保存
      if (this.contactList[0]) {
        const chatType = this.contactList[0].lastMessage.chatType;
        let id, username;
        if (chatType === CHAT_TYPE_1_2_1) {
          id = this.contactList[0].userId;
          username = this.contactList[0].userName;
        } else {
          id = this.contactList[0].qunId;
          username = this.contactList[0].qunName;
        }
        setTargetId(id, username, chatType);
      }
    }

    // 增加session item
    addContactItem(sessionItem) {
      this.contactList.unshift(sessionItem);
      // 添加完毕后，需要更新DOM
      this.notify("addSessionItem", [sessionItem]);
    }

    // 判断当前接收的消息 是否为第一次发送来
    firstReceiverMsg(session) {
      console.log(session);
      console.log(this.contactList);
    }

    registerCallback(fn, key) {
      this[key] = fn;
    }
    // 修改未读数量
    setUnread(session, fnName) {
      const index = this.contactList.findIndex(
        (item) => item.lastMessage.session === session
      );
      if (index !== -1) {
        this.contactList[index].unReadCount = 0;
        this.notify(fnName, [index, this.contactList[index]]);
      }
    }
    // 收发信息后，需要修改
    update(lastMsg, msgType, session, fnName, fromUserId) {
      const index = this.contactList.findIndex(
        (item) => item.lastMessage.session === session
      );

      const msgTime = +new Date();
      const params = [index, lastMsg, msgTime, msgType];
      if (fnName === "receiveMsg" && fromUserId != targetId.value) {
        // 接收到 不是当前聊天对象的信息 未读数量 +1
        const count = this.contactList[index].unReadCount;
        this.contactList[index].unReadCount++;
        params.push([count + 1]);
        firstReceiverMsg(session);
      }

      this.notify(fnName, params);
      //  dom 排序
      this.reSort(index);
      // contactList 排序
      const sessionItem = this.contactList.splice(index, 1);
      this.contactList.unshift(...sessionItem);
    }
    notify(fnName, params) {
      this[fnName](...params);
    }
  }

  const contactStore = new ContactStore();

  return {
    contactStore,
  };
});
