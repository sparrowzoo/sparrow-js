import Vue from 'vue' // 引入vue
import Vant from 'vant';//  引入vant, 一个移动端的ui框架
import 'vant/lib/index.css';
import router from '@/route' // 引入路由
import app from '@/App' // 引入主组件
import {Sparrow} from '../../../source/scripts/sparrow_es.js'
import {ImProtocol} from "../../../source/scripts/ImProtocol";
import {Base64} from 'js-base64'
import {Initialization} from '@/api/Initialization';

Vue.use(Vant); // 使用vant
Vue.config.productionTip = false // 关闭生产模式下给出的提示
const vue = new Vue({// 创建vue实例
    router,
    render: h => h(app),// 渲染主组件
});
Vue.prototype.$sparrow = Sparrow;
Vue.prototype.$Base64 = Base64;
Vue.prototype.$protocol = ImProtocol;

Vue.prototype.$getUserId = function () {
    return localStorage.getItem("userId");
};
Vue.prototype.$token=function (){
    return localStorage.getItem("token");
}
Vue.prototype.$sessionKey = function (userId, userId2) {
    if (userId < userId2) {
        return userId + "_" + userId2;
    }
    return userId2 + "_" + userId;
};
var userId =vue.$getUserId();
var url=window.location.href;
if(userId&&url.indexOf("/login")<0){
    await Initialization.initContact(Vue, vue);
    await Initialization.initSessions(Vue, vue);
    Initialization.initWebSocket(Vue, vue);
}
vue.$mount('#app')
