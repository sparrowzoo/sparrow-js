import {Sparrow} from '../../../../source/scripts/sparrow_es.js'

const HttpApiDemo = {
    name: 'SparrowAjax',
    userId: 1,
    db: null,
    addContact: function () {
        this.db.put('contact', {"userId": this.userId++, "name": 'zhangsan', "age": 18}).then(function (data) {
            console.log(data);
        }, function (error) {
            console.log(error);
        });
    },
    indexedDBTest: async function () {
        var db = new Sparrow.indexedDB({
            name: 'sparrow',
            version: "5.0",
            tableNames: [{"name": "contact", "key": "userId"}, {"name": "session", "key": "sessionKey"}, {
                "name": "qun",
                "key": "qunId"
            }]
        });

        await db.init();
        this.db = db;
        console.log("init successful");
        db.put('contact', {"userId": HttpApiDemo.userId++, "name": 'zhangsan', "age": 18})
            .then(function (data) {
                console.log("put contact:", data);
            }, function (error) {
                console.log(error);
            });

        //连接确认成功后提交数据

        db.put('session', {
            "sessionKey": '1',
            "message-list": [{'id': 123, 'content': 'content'}, {'id': 456, 'content': 'content'}]
        }).then(function (data) {
                console.log("put session", data);
            }, function (error) {
                console.log(error);
            }
        );

        db.get('session', '1').then(function (data) {
            console.log("get session 1", data);
        }, function (error) {
            console.log(error);
        });


        db.getAll('session').then(function (data) {
            console.log("get session all", data);
        }, function (error) {
            console.log(error);
        });

        db.count('session').then(function (data) {
            console.log("count session", data);
        }, function (error) {
            console.log(error);
        });

        db.getAllKeys('session').then(function (data) {
            console.log("get session all keys", data);
        }, function (error) {
            console.log(error);
        });

        // db.delete('session', '1').then(function (data) {
        //     console.log("delete session ", data);
        // }, function (error) {
        //     console.log(error);
        // });
    },
    //await命令只能用在async函数中，用在普通函数中会报错
    awaitTest: async function () {
        //await命令只能用在async函数中，用在普通函数中会报错。
        var result = await Sparrow.http.post('http://localhost:10000/api/json-post.json', {
            "name": "Sparrow",
            "age": 18
        });
        console.log(result);
    },
    awaitTestMultiWaiter: async function () {
        await new Promise(function (resolve) {
            setTimeout(function () {
                setTimeout(function () {
                    console.log("waiter 3");
                }, 2000);
                console.log("waiter 1");
                resolve();
            }, 1000);
        });

        await new Promise(function (resolve) {
                setTimeout(function () {
                    console.log("waiter 2");
                    resolve();
                }, 1000);
            }
        );
    },
    _promise: async function (t) {
        return await new Promise(function (resolve) {
            setTimeout(function () {
                console.log("waiter " + t);
                resolve();
            }, 1000 * t);
        })
    },
    awaitTestMultiWaiter2: async function () {
        for (var i = 0; i < 5; i++) {
            await this._promise(i);
        }
        console.log("multi waiter end");
    },
    change: function () {
        console.log(Sparrow.url.name);
        // alert($.url.name);
        alert(this.name);

        var promise = Sparrow.http.post('http://localhost:10000/api/json-post.json', {
            "name": "Sparrow",
            "age": 18
        });
        promise.then(function (data) {
            console.log("success:" + data);
        }, function (error) {
            console.log("fail:" + error);
        });
    }
}

export {HttpApiDemo}
