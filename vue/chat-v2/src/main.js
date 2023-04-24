import Vue from 'vue' // 引入vue
import Vant from 'vant';//  引入vant, 一个移动端的ui框架
import 'vant/lib/index.css';
import router from '@/route' // 引入路由
import app from '@/App' // 引入主组件
import {Sparrow} from '../../../source/scripts/sparrow_es.js'
import {ImProtocol} from "../../../source/scripts/ImProtocol";
import {Base64} from 'js-base64'
import {Initialization} from '@/api/Initialization';
import {ChatApi} from "@/api/Chat";

Vue.use(Vant); // 使用vant
Vue.config.productionTip = false // 关闭生产模式下给出的提示
const vue = new Vue({// 创建vue实例
    router,
    render: h => h(app),// 渲染主组件
});
Vue.prototype.$sparrow = Sparrow;
Vue.prototype.$Base64 = Base64;
Vue.prototype.$protocol = ImProtocol;


var token = Sparrow.request("token");
var userId = await ChatApi.getUserId(token);
Vue.prototype.$userId = userId;
Vue.prototype.$token = token;
Vue.prototype.$getUserId = function () {
    return this.$userId;
};
Vue.prototype.$sessionKey = function (userId, userId2) {
    if (userId < userId2) {
        return userId + "_" + userId2;
    }
    return userId2 + "_" + userId;
};

await Initialization.initContact(Vue, vue);
await Initialization.initSessions(Vue, vue);
Initialization.initWebSocket(Vue, vue);
vue.$mount('#app')
