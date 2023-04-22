import {Sparrow} from '../../../../source/scripts/sparrow_es.js'

const HttpApiDemo = {
    name: 'SparrowAjax',
    userId: 1,
    db:null,
    addContact:function (){
        this.db.put('contact', {"userId": this.userId++, "name": 'zhangsan', "age": 18}).then(function (data) {
            console.log(data);
        }, function (error) {
            console.log(error);
        });
    },
    indexedDBTest: function () {
        var db = new Sparrow.indexedDB({
            name: 'sparrow',
            version: "4.0",
            tableNames: [{"name": "contact", "key": "userId"}, {"name": "session", "key": "sessionId"}, {
                "name": "qun",
                "key": "qunId"
            }]
        });

        var initPromise = db.init();
        this.db=db;
        //连接确认成功后提交数据
        initPromise.then(function () {
                db.put('contact', {"userId": HttpApiDemo.userId++, "name": 'zhangsan', "age": 18})
                    .then(function (data) {
                        console.log(data);
                    }, function (error) {
                        console.log(error);
                    });
            }
            , function (error) {
                console.log("fail:" + error);
            }
        );
    },
    //await命令只能用在async函数中，用在普通函数中会报错
    awaitTest: async function () {
        //await命令只能用在async函数中，用在普通函数中会报错。
        var result = await Sparrow.http.post('http://localhost:10000/api/json-post.json', {
            "name": "Sparrow",
            "age": 18
        });
        alert(result);
    },
    change: function () {
        console.log(Sparrow.url.name);
        // alert($.url.name);
        alert(this.name);

        var promise = Sparrow.http.post('http://localhost:10000/api/json-post.json', {"name": "Sparrow", "age": 18});
        promise.then(function (data) {
            console.log("success:" + data);
        }, function (error) {
            console.log("fail:" + error);
        });
    }
}

export {HttpApiDemo}
