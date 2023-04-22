// Sparrow.indexedDB = {
//     config: {
//         name: 'Sparrow',
//         version: "1.0",
//         tableNames: [{"name":"t1","key":"id"}]
//     }
// };
Sparrow.indexedDB = function (config) {
    this.instance = null;
    this.name = config.name;
    this.config = config;
};
Sparrow.indexedDB.prototype = {
    init: function () {
        if (!window.indexedDB) {
            return Promise.reject('浏览器不支持indexedDB');
        }
        this.request = window.indexedDB.open(this.config.name, this.config.version);
        return new Promise((resolve, reject) => {
            this.request.onsuccess = (event) => {
                //数据库实例
                this.instance = event.target.result;
                console.log('数据库连接成功');
                this.flush().then(r => {
                    console.log(r);
                    resolve(this);
                }, e => {
                    console.log(e);
                    reject(e);
                });
                resolve(this.instance);
            };
            this.request.onupgradeneeded = (event) => {
                console.log('首次创建数据库');
                this.instance = event.target.result;
                this._initTables();
                resolve(this.instance);
            };
            this.request.onerror = (e) => {
                console.log('数据库发生错误', e);
                reject('连接indexedDB出错');
            };
        });
    },
    _createTable: function (tableName, key) {
        this.instance.createObjectStore(tableName, {keyPath: key});
    },
    _initTables: function () {
        this.config.tableNames.forEach((tableName) => {
            this._createTable(tableName.name, tableName.key);
        });
    },
    _getTableInstance: function (tableName) {
        return this.instance
            .transaction(tableName, 'readwrite')
            .objectStore(tableName);
    },
    put: function (tableName, item) {
        if (!window.indexedDB) {
            return Promise.reject('浏览器不支持indexedDB');
        }
        return new Promise((resolve, reject) => {
            return this._getTableInstance(tableName)
                .put(item);
        });
    },
    get: function (tableName, key) {
        if (!window.indexedDB) {
            return Promise.reject('浏览器不支持indexedDB');
        }
        return new Promise((resolve, reject) => {
            console.log("get key:" + this._getTableInstance(tableName)
                .get(key));
            const request = this._getTableInstance(tableName)
                .get(key);
            request.onsuccess = (event) => {
                resolve(event.target.result);
            };
            request.fail = (event) => {
                reject(event.target.result);
            };
        });
    },
    delete: function (tableName, key) {
        if (!window.indexedDB) {
            return Promise.reject('浏览器不支持indexedDB');
        }
        return new Promise((resolve, reject) => {
            return this._getTableInstance(tableName)
                .delete(key);
        });
    },
    clear: function (tableName) {
        if (!window.indexedDB) {
            return Promise.reject('浏览器不支持indexedDB');
        }
        return new Promise((resolve, reject) => {
            return this._getTableInstance(tableName)
                .clear();
        });
    },
    flush: function () {
        if (!window.indexedDB) {
            return Promise.reject('浏览器不支持indexedDB');
        }
        return new Promise((resolve, reject) => {
            this.config.tableNames.forEach((table) => {
                this.clear(table.name).then(r => {
                    console.log(r);
                }).catch(e => {
                    console.log(e);
                });
            }, this);
        });
    },
    getAll: function (tableName) {
        if (!window.indexedDB) {
            return Promise.reject('浏览器不支持indexedDB');
        }
        return new Promise((resolve, reject) => {
            return this._getTableInstance(tableName)
                .getAll();
        });
    },
    getAllKeys: function (tableName) {
        if (!window.indexedDB) {
            return Promise.reject('浏览器不支持indexedDB');
        }
        return new Promise((resolve, reject) => {
            return this._getTableInstance(tableName)
                .getAllKeys();
        });
    },
    count: function (tableName) {
        if (!window.indexedDB) {
            return Promise.reject('浏览器不支持indexedDB');
        }
        return new Promise((resolve, reject) => {
            return this._getTableInstance(tableName)
                .count();
        });
    },
    openCursor: function (tableName) {
        if (!window.indexedDB) {
            return Promise.reject('浏览器不支持indexedDB');
        }
        return new Promise((resolve, reject) => {
            return this._getTableInstance(tableName)
                .openCursor();
        });
    },
    openKeyCursor: function (tableName) {
        if (!window.indexedDB) {
            return Promise.reject('浏览器不支持indexedDB');
        }
        return new Promise((resolve, reject) => {
            return this._getTableInstance(tableName)
                .openKeyCursor();
        });
    }
};
