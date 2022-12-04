define(function (require, exports, module) {
  const {
    DB_NAME,
    DB_VERSION,
    DB_STORE_NAME,
    DB_STORE_NAME_MSG,
    DB_STORE_NAME_USER,
    DB_STORE_NAME_QUN,
    SELFID,
  } = require("../store/store.js");
  if (!window.indexedDB) {
    window.alert(
      "Your browser doesn't support a stable version of IndexedDB. Such and such feature will not be available."
    );
  }
  class IndexedDb {
    db = null;
    constructor() {
      this.request = window.indexedDB.open(DB_NAME, DB_VERSION);
      this.initDB();
    }

    // 初始化数据库
    initDB() {
      this.request.onsuccess = (event) => {
        this.db = event.target.result;
        console.log("数据库连接成功");
      };
      this.request.onupgradeneeded = (event) => {
        const db = event.target.result;
        // 创建存储仓库  以 session 作为查找的主键
        db.createObjectStore(DB_STORE_NAME, { keyPath: "session" });
        db.createObjectStore(DB_STORE_NAME_MSG, { keyPath: "session" });
        db.createObjectStore(DB_STORE_NAME_USER, { keyPath: "userId" });
        db.createObjectStore(DB_STORE_NAME_QUN, { keyPath: "qunId" });
      };
      this.request.onerror = () => {
        console.log("数据库发生错误");
      };
    }

    // 初始化整个历史记录 也就是向数据库中添加数据
    initSession(sessionItem, store = DB_STORE_NAME) {
      const req = this.db
        .transaction(store, "readwrite")
        .objectStore(store)
        .put(sessionItem);
      req.onsuccess = function () {
        console.log("添加成功~");
      };
    }

    // 添加单条数据 也就是修改数据库中的数据
    addSession(key, session, storeName = DB_STORE_NAME) {
      console.log(key, session);
      const updateStore = this.db
        .transaction(storeName, "readwrite")
        .objectStore(storeName);
      const request = updateStore.get(key);
      // 查询成功后的回调
      request.onsuccess = (event) => {
        const sessionItem = event.target.result;
        if (!sessionItem) {
          // 当前没有保存当前用户的session_key 需要添加
          this.createSessionByKey(key, session, storeName);
          return;
        }
        // 添加数据  也就是更新store
        if (sessionItem.messages) {
          // 当前聊天对象 有历史记录 直接push
          sessionItem.messages.push(session);
        } else {
          // 没有messages 会话列表 那么先创建一个
          sessionItem.messages = [];
          sessionItem.messages.push(session);
        }

        const updateRequest = updateStore.put(sessionItem);
        updateRequest.onsuccess = function () {
          console.log("数据更新成功");
        };
      };
    }

    // 根据session_key 创建
    createSessionByKey(key, session, storeName) {
      const sessionItem = {
        session: key,
        chatSession: {
          chatType: session.chatType,
          me: SELFID,
          sessionKey: session.session,
          target: session.targetUserId,
        },
        messages: [session],
      };
      this.initSession(sessionItem, storeName);
    }

    // 查询数据
    getData(key, storeName = DB_STORE_NAME) {
      return new Promise((resolve, reject) => {
        const getStore = this.db
          .transaction(storeName, "readonly")
          .objectStore(storeName);
        const request = getStore.get(key);
        request.onsuccess = (event) => {
          resolve(event.target.result);
        };
      });
    }

    // 查询所有数据
    getAll(storeName) {
      return new Promise((resolve, reject) => {
        const getStore = this.db
          .transaction(storeName, "readonly")
          .objectStore(storeName);
        const request = getStore.getAll();
        request.onsuccess = (event) => {
          resolve(event.target.result);
        };
      });
    }
  }

  const initIndexedDB = (function () {
    let dbInstance;
    return function () {
      if (!dbInstance) {
        dbInstance = new IndexedDb();
      }
      return dbInstance;
    };
  })();

  module.exports = { initIndexedDB };
});