define(["store", "indexedDB"], function (store, indexedDB, utils) {
  const {
    targetId,
    selfId,
    setTargetId,
    CHAT_TYPE_1_2_1,
    DB_STORE_NAME_USER,
    DB_STORE_NAME_QUN,
  } = store;
  const DBObject = indexedDB;
  // const dbInstance = initIndexedDB();
  //  维护 session 列表，收发消息后主动回调相关函数 实现 sessionDOM列表自动更新
  class ContactStore {
    constructor() {
      this.contactList = [];
    }
    // 首次加载，自动初始化 session 列表
    initContact(arr) {
      this.contactList = arr
        .filter((item) => item && item.lastMessage)
        .sort((a, b) => b.lastMessage.serverTime - a.lastMessage.serverTime);

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
        const currentSession = this.contactList[0].lastMessage.session;

        setTargetId(
          id,
          username,
          chatType,
          this.contactList[0].avatar,
          currentSession
        );
      }
    }

    // 增加session item
    addContactItem(sessionItem) {
      this.contactList.unshift(sessionItem);
      // 添加完毕后，需要更新DOM
      this.notify("addSessionItem", [sessionItem]);
    }

    // 判断当前接收的消息 是否为第一次发送来
    async firstReceiverMsg(session, fromUserId, chatType) {
      const flag = this.contactList.some(
        (item) => item.lastMessage.session === session
      );
      if (!flag) {
        // 没有聊天记录，需要先新增一个 session
        // 查询 当前session 的实体 是用户还是群
        const storeName =
          chatType === CHAT_TYPE_1_2_1 ? DB_STORE_NAME_USER : DB_STORE_NAME_QUN;
        const keyPath = chatType === CHAT_TYPE_1_2_1 ? fromUserId : session;
        const sessionItem = await DBObject.dbInstance.getData(
          keyPath,
          storeName
        );
        if (sessionItem) {
          // 当前用户 / 群 是好友的情况
          sessionItem.lastMessage = {
            session,
          };
          // 添加到contactList
          this.addContactItem(sessionItem);
        } else {
          // 不是好友 临时会话情况
        }
      }
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

    send(lastMsg, msgType, session) {
      let index = this.contactList.findIndex(
        (item) => item.lastMessage.session === session
      );
      const msgTime = +new Date();
      const params = { index, msgValue: lastMsg, msgTime, msgType };
      this.notify("sendLastMsg", params);
      this.sort(index);
    }
    async receive(lastMsg, msgType, session, fromUserId, chatType) {
      let index = this.contactList.findIndex(
        (item) => item.lastMessage.session === session
      );
      const msgTime = +new Date();
      const params = { index, msgValue: lastMsg, msgTime, msgType };
      if (targetId.sessionKey !== session) {
        // 接收到 不是当前聊天对象的信息,需要设置未读数量
        await this.firstReceiverMsg(session, fromUserId, chatType);
        if (index !== -1) {
          // 当前不是新的session，未读数量直接 +1
          const count = this.contactList[index].unReadCount;
          this.contactList[index].unReadCount++;
          params.count = count + 1;
        } else {
          // 这里是没有session 记录 已经将新的session 添加到contactList中的首位
          index = 0; // -1  => 0
          this.contactList[index].unReadCount = 1;
          params.index = 0;
          params.count = 1;
        }
      }
      // if (fromUserId != targetId.value) {
      //   // 接收到 不是当前聊天对象的信息,需要设置未读数量
      //   await this.firstReceiverMsg(session, fromUserId, chatType);
      //   if (index !== -1) {
      //     // 当前不是新的session，未读数量直接 +1
      //     const count = this.contactList[index].unReadCount;
      //     this.contactList[index].unReadCount++;
      //     params.count = count + 1;
      //   } else {
      //     // 这里是没有session 记录 已经将新的session 添加到contactList中的首位
      //     index = 0; // -1  => 0
      //     this.contactList[index].unReadCount = 1;
      //     params.index = 0;
      //     params.count = 1;
      //   }
      // }
      this.notify("receiveMsg", params);
      this.sort(index);
    }
    // 撤回事件,改变未读数量 & 消息部分，不排序
    recall(msgInfo) {
      const index = this.contactList.findIndex(
        (item) => item.lastMessage.session === msgInfo.sessionKey
      );
      const params = {
        ...msgInfo,
        index,
      };
      if (this.contactList[index].unReadCount) {
        this.contactList[index].unReadCount--;
        params.count = this.contactList[index].unReadCount;
      }
      this.notify("receiveMsg", params);
    }
    notify(fnName, params) {
      if (Array.isArray(params)) {
        this[fnName](...params);
      } else {
        this[fnName](params);
      }
    }
    sort(index) {
      this.reSort(index);
      // contactList 排序
      const sessionItem = this.contactList.splice(index, 1);
      this.contactList.unshift(...sessionItem);
    }
  }

  const contactStore = new ContactStore();

  return {
    contactStore,
  };
});
