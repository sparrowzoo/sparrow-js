import Vue from 'vue' // 引入vue
import Vant from 'vant';//  引入vant, 一个移动端的ui框架
import 'vant/lib/index.css';
import router from '@/route' // 引入路由
import app from '@/App' // 引入主组件
import {Sparrow} from '../../../source/scripts/sparrow_es.js'
import {Base64} from 'js-base64'
import {ChatApi} from "@/api/Chat";

var res = await ChatApi.getContacts(7);
console.log('res', res);
var userMap = {};
res.data.users.forEach(each => {
    userMap[each.userId] = each;
});

var qunMap = {};
res.data.quns.forEach(each => {
    qunMap[each.qunId] = each;
});
console.log('userMap', userMap);
Vue.use(Vant); // 使用vant
Vue.config.productionTip = false // 关闭生产模式下给出的提示
const vue = new Vue({// 创建vue实例
    router,
    render: h => h(app),// 渲染主组件
});
Vue.prototype.$sparrow = Sparrow;
Vue.prototype.$Base64 = Base64;
Vue.prototype.$contact = res.data;
Vue.prototype.$userMap = userMap;
Vue.prototype.$qunMap = qunMap;
vue.$mount('#app')
