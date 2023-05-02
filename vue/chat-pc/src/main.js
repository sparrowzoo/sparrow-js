import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";

import ElementUI from "element-ui";
import "element-ui/lib/theme-chalk/index.css";
import "@/assets/style/base.less";
import "@/assets/style/font.css";

Vue.config.productionTip = false;
Vue.use(ElementUI);
// 将 store 实例作为插件安装
// Vue.use(store);
new Vue({
  router,
  store,
  render: (h) => h(App),
}).$mount("#app");
