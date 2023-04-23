// Sparrow.indexedDB = {
//     config: {
//         name: 'Sparrow',
//         version: "1.0",
//         tableNames: [{"name":"t1","key":"id"}]
//     }
// };
Sparrow.indexedDB = function (config) {
    //当前浏览器是否支持indexedDB
    this.support = window.indexedDB;
    //数据库实例
    this.instance = null;
    //数据库名称
    this.name = config.name;
    //数据库相关配置
    this.config = config;

    this.userId=localStorage.getItem("userId");
    //是否初始化成功
    this.initSuccess = false;

    //自定义数据库初始化方法
    this.$initDB=null
};
Sparrow.indexedDB.prototype = {
    init: async function () {
        if (!this.support) {
            return this.support;
        }
        this.request = window.indexedDB.open(this.name+this.userId, this.config.version);
        return await new Promise((resolve, reject) => {
            this.request.onsuccess = async (event) => {
                //数据库实例
                this.instance = event.target.result;
                console.log('数据库连接成功');
                var result = await this.flush();
                console.log('数据库flush结果', result);
                if (result) {
                    this.initSuccess = true;
                    console.log('数据库flush成功');
                    if (this.$dbInit) {
                       await this.$dbInit();
                    }
                    resolve(this.instance);
                } else {
                    reject('数据库连接失败');
                }
            };
            this.request.onupgradeneeded = async (event) => {
                console.log('首次创建数据库');
                this.instance = event.target.result;
                this._initTables();
                if (this.$dbInit) {
                    await this.$dbInit();
                }
                this.initSuccess = true;
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
    put: async function (tableName, item) {
        if (!this.support) {
            return this.support;
        }
        if (!this.initSuccess) {
            await this.init();
        }
        return await new Promise((resolve, reject) => {
            const request = this._getTableInstance(tableName)
                .put(item);
            request.onsuccess = (event) => {
                console.log("put success: TABLE-NAME" + tableName + " item " + item);
                resolve(event.target.result);
            };
            request.fail = (event) => {
                reject(event.target.result);
            };
        });
    },
    get: async function (tableName, key) {
        if (!this.support) {
            return this.support;
        }
        if (!this.initSuccess) {
            await this.init();
        }
        return await new Promise((resolve, reject) => {
            console.log("GET tableName " + tableName + ", get key:" + key);
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
    delete: async function (tableName, key) {
        if (!this.support) {
            return this.support;
        }
        if (!this.initSuccess) {
            await this.init();
        }
        return await new Promise((resolve, reject) => {
            const request = this._getTableInstance(tableName)
                .delete(key);
            request.onsuccess = () => {
                console.log("delete success: TABLE-NAME" + tableName + " ,key " + key)
                resolve("tableName " + tableName + " ,key " + key);
            };
            request.fail = (event) => {
                reject(event);
            };
        });
    },
    clear: async function (tableName) {
        if (!this.support) {
            return this.support;
        }
        //await 必须在async函数中使用
        return await new Promise((resolve, reject) => {
            const request = this._getTableInstance(tableName)
                .clear();
            request.onsuccess = (event) => {
                console.log("clear success: TABLE-NAME", tableName)
                resolve(event.target.result);
            };
            request.fail = (event) => {
                reject(event.target.result);
            };
        });
    },
    flush: async function () {
        if (!this.support) {
            return this.support;
        }
        //await 多个 需要Promise 封装

        for (var i = 0; i < this.config.tableNames.length; i++) {
            var tableName = this.config.tableNames[i].name;
            //这里只有一个await 不起作用
            await this.clear(tableName).then(() => {
                console.log("clear success: TABLE-NAME", tableName);
            }).catch(e => {
                console.log(e);
            });
        }
        console.log("flush all table success");
        return true;
    },
    getAll: async function (tableName) {
        if (!this.support) {
            return this.support;
        }
        if (!this.initSuccess) {
            await this.init();
        }
        return await new Promise((resolve, reject) => {
            const request = this._getTableInstance(tableName)
                .getAll();
            request.onsuccess = (event) => {
                console.log("getAll success: TABLE-NAME", tableName);
                resolve(event.target.result);
            };
            request.fail = (event) => {
                reject(event.target.result);
            };
        });
    },
    getAllKeys: async function (tableName) {
        if (!this.support) {
            return this.support;
        }
        if (!this.initSuccess) {
            await this.init();
        }
        return await new Promise((resolve, reject) => {
            const request = this._getTableInstance(tableName)
                .getAllKeys();
            request.onsuccess = (event) => {
                console.log("getAllKeys success: TABLE-NAME:", tableName + " ,keys:", event.target.result);
                resolve(event.target.result);
            };
            request.fail = (event) => {
                reject(event.target.result);
            };
        });
    },
    count: async function (tableName) {
        if (!this.support) {
            return this.support;
        }
        if (!this.initSuccess) {
            await this.init();
        }
        return await new Promise((resolve, reject) => {
            const request = this._getTableInstance(tableName)
                .count();
            request.onsuccess = (event) => {
                console.log("count success: TABLE-NAME", tableName);
                resolve(event.target.result);
            };
            request.fail = (event) => {
                reject(event.target.result);
            };
        });
    },
    openCursor: async function (tableName) {
        if (!this.support) {
            return this.support;
        }
        if (!this.initSuccess) {
            await this.init();
        }
        return await new Promise((resolve, reject) => {
            const request = this._getTableInstance(tableName)
                .openCursor();
            request.onsuccess = (event) => {
                console.log("openCursor success: TABLE-NAME.", tableName);
                resolve(event.target.result);
            };
            request.fail = (event) => {
                reject(event.target.result);
            };
        });
    },
    openKeyCursor: async function (tableName) {
        if (!this.support) {
            return this.support;
        }
        if (!this.initSuccess) {
            await this.init();
        }
        return await new Promise((resolve, reject) => {
            const request = this._getTableInstance(tableName)
                .openKeyCursor();
            request.onsuccess = (event) => {
                console.log("openKeyCursor success:TABLE-NAME", tableName);
                resolve(event.target.result);
            };
            request.fail = (event) => {
                reject(event.target.result);
            };
        });
    }
};
