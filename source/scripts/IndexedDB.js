if (!window.indexedDB) {
    window.alert(
        "Your browser doesn't support a stable version of IndexedDB. Such and such feature will not be available."
    );
}
Sparrow.indexedDB = {
    config: {
        name: 'Sparrow',
        version: "1.0",
        tableNames: [{"name":"t1","key":"id"}]
    }
};
Sparrow.indexedDB = function (config) {
    this.instance = null;
    this.name = config.name;
    this.config = config;
};
Sparrow.indexedDB.prototype = {
    init: function () {
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
            this.request.onerror = () => {
                console.log('数据库发生错误');
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
        return new Promise((resolve, reject) => {
            const req = this._getTableInstance(tableName)
                .put(item);
            req.onsuccess = function () {
                resolve('添加成功');
            };
            req.onerror = function () {
                reject('添加失败');
            }
        });
    },
    get: function (tableName, key) {
        return new Promise((resolve, reject) => {
            const req = this._getTableInstance(tableName)
                .get(key);
            req.onsuccess = function () {
                resolve(req.result);
            };
            req.onerror = function () {
                reject('查询失败');
            }
        });
    },
    delete: function (tableName, key) {
        return new Promise((resolve, reject) => {
            const req = this._getTableInstance(tableName)
                .delete(key);
            req.onsuccess = function () {
                resolve('删除成功');
            };
            req.onerror = function () {
                reject('删除失败');
            }
        });
    },
    clear: function (tableName) {
        return new Promise((resolve, reject) => {
            const req = this._getTableInstance(tableName)
                .clear();
            req.onsuccess = function () {
                resolve('清空成功');
            };
            req.onerror = function () {
                reject('清空失败');
            }
        });
    },
    flush: function () {
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
        return new Promise((resolve, reject) => {
            const req = this._getTableInstance(tableName)
                .getAll();
            req.onsuccess = function () {
                resolve(req.result);
            };
            req.onerror = function () {
                reject('查询失败');
            }
        });
    },
    getAllKeys: function (tableName) {
        return new Promise((resolve, reject) => {
            const req = this._getTableInstance(tableName)
                .getAllKeys();
            req.onsuccess = function () {
                resolve(req.result);
            };
            req.onerror = function () {
                reject('查询失败');
            }
        });
    },
    count: function (tableName) {
        return new Promise((resolve, reject) => {
            const req = this._getTableInstance(tableName)
                .count();
            req.onsuccess = function () {
                resolve(req.result);
            };
            req.onerror = function () {
                reject('查询失败');
            }
        });
    },
    openCursor: function (tableName) {
        return new Promise((resolve, reject) => {
            const req = this._getTableInstance(tableName)
                .openCursor();
            req.onsuccess = function () {
                resolve(req.result);
            };
            req.onerror = function () {
                reject('查询失败');
            }
        });
    },
    openKeyCursor: function (tableName) {
        return new Promise((resolve, reject) => {
            const req = this._getTableInstance(tableName)
                .openKeyCursor();
            req.onsuccess = function () {
                resolve(req.result);
            };
            req.onerror = function () {
                reject('查询失败');
            }
        });
    }
};
