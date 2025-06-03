define(['store'], function (store) {
  const {
    DB_NAME,
    DB_VERSION,
    DB_STORE_NAME_SESSION,
    DB_STORE_NAME_USER,
    DB_STORE_NAME_QUN,
    selfId,
  } = store;
  if (!window.indexedDB) {
    window.alert(
      "Your browser doesn't support a stable version of IndexedDB. Such and such feature will not be available."
    );
  }
  class IndexedDb {
    db = null;
    constructor(userId, version) {
      this.request = window.indexedDB.open(DB_NAME + '-' + userId, version);
      return this.initDB();
    }

    // 初始化数据库
    initDB() {
      return new Promise((resolve, reject) => {
        this.request.onsuccess = (event) => {
          this.db = event.target.result;
          // console.log('数据库连接成功');

          // 清空之前保存的内容
          this.clearStore([
            DB_STORE_NAME_SESSION,
            DB_STORE_NAME_USER,
            DB_STORE_NAME_QUN,
          ]).then((res) => {
            console.log(res);
            resolve(this);
          });
        };
        this.request.onupgradeneeded = (event) => {
          // console.log('首次创建数据库');
          const db = event.target.result;
          // 创建存储仓库
          db.createObjectStore(DB_STORE_NAME_SESSION, { keyPath: 'session' });
          db.createObjectStore(DB_STORE_NAME_USER, { keyPath: 'userId' });
          db.createObjectStore(DB_STORE_NAME_QUN, { keyPath: 'qunId' });
        };
        this.request.onerror = () => {
          // console.log('数据库发生错误');
          reject('连接indexedDB出错');
        };
      });
    }

    // 初始化整个store 也就是向数据库中添加数据
    putStoreItem(item, storeName) {
      return new Promise((resolve, reject) => {
        const req = this.db
          .transaction(storeName, 'readwrite')
          .objectStore(storeName)
          .put(item);
        req.onsuccess = function () {
          resolve('添加成功');
        };
      });
    }

    // 添加单条数据 也就是修改数据库中的数据
    updateStoreItem(sessionKey, messageItem, storeName) {
      const updateStore = this.db
        .transaction(storeName, 'readwrite')
        .objectStore(storeName);
      const request = updateStore.get(sessionKey);
      // 查询成功后的回调
      request.onsuccess = (event) => {
        const sessionItem = event.target.result;
        if (!sessionItem) {
          // 当前没有保存session_key 需要创建一个会话记录
          this.createItemByKey(sessionKey, messageItem, storeName);
          return;
        }
        // 添加数据  也就是更新store
        if (sessionItem.messages) {
          // 当前聊天对象 有历史记录 直接push
          sessionItem.messages.push(messageItem);
        } else {
          // 没有messages 会话列表 那么先创建一个
          sessionItem.messages = [];
          sessionItem.messages.push(messageItem);
        }

        const updateRequest = updateStore.put(sessionItem);
        updateRequest.onsuccess = function () {
          // console.log('数据更新成功');
        };
      };
    }

    // 根据session_key 创建
    createItemByKey(key, session, storeName) {
      const sessionItem = {
        session: key,
        chatSession: {
          chatType: session.chatType,
          me: selfId.value,
          sessionKey: session.session,
          target: session.targetUserId,
        },
        messages: [session],
      };
      this.putStoreItem(sessionItem, storeName);
    }

    // 根据session_key 删除数据
    deleteData(sessionKey, storeName) {
      return new Promise((resolve, reject) => {
        const request = this.db
          .transaction(storeName, 'readwrite')
          .objectStore(storeName)
          .delete(sessionKey);
        request.onsuccess = function (event) {
          resolve('ok');
        };
      });
    }

    // 查询数据
    getData(key, storeName) {
      return new Promise((resolve, reject) => {
        const getStore = this.db
          .transaction(storeName, 'readonly')
          .objectStore(storeName);
        const request = getStore.get(key);
        request.onsuccess = (event) => {
          resolve(event.target.result);
        };
      });
    }
    // 撤回 msg
    recallMsg(key, storeName, messageArr) {
      const updateStore = this.db
        .transaction(storeName, 'readwrite')
        .objectStore(storeName);
      const request = updateStore.get(key);
      // 查询成功后的回调
      request.onsuccess = (event) => {
        const sessionItem = event.target.result;
        if (!sessionItem) {
          return;
        }
        // 更新message
        sessionItem.messages = messageArr;
        const updateRequest = updateStore.put(sessionItem);
        updateRequest.onsuccess = function () {
          console.log('撤回成功');
        };
      };
    }

    // 查询所有数据
    getAll(storeName) {
      return new Promise((resolve, reject) => {
        const getStore = this.db
          .transaction(storeName, 'readonly')
          .objectStore(storeName);
        const request = getStore.getAll();
        request.onsuccess = (event) => {
          resolve(event.target.result);
        };
      });
    }

    // 清空store,有多个store 参数是要清空store的名字组成的数组
    clearStore(storeNameArr) {
      // 每次初始化之前，需要清空之前保存在indexedb中的数据
      return new Promise((resolve, reject) => {
        let count = 0;
        storeNameArr.forEach((store) => {
          const res = this.db
            .transaction(store, 'readwrite')
            .objectStore(store)
            .clear();
          res.onsuccess = callBack;
          res.onerror = (e) => {
            reject('未能删除旧数据');
          };
        });

        function callBack(e) {
          count++;
          if (count === storeNameArr.length) {
            resolve('删除旧数据成功');
          }
        }
      });
    }
  }
  let dbInstance = null;
  // 根据当前用户id 初始化 indexedDb
  async function createIndexedDB(userId, version) {
    this.dbInstance = await new IndexedDb(userId, version);
    return this.dbInstance;
  }
  const indexedDBInstance = {
    dbInstance: null,
    createIndexedDB,
  };

  return indexedDBInstance;
});
