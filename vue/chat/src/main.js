import Vue from 'vue' // 引入vue
import Vant from 'vant';//  引入vant, 一个移动端的ui框架
import 'vant/lib/index.css';
import router from '@/route' // 引入路由


import app from '@/App' // 引入主组件
Vue.use(Vant); // 使用vant
Vue.config.productionTip = false // 关闭生产模式下给出的提示
new Vue({// 创建vue实例
	router,
	render: h => h(app),// 渲染主组件
}).$mount('#app')
