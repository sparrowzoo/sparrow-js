import Vue from "vue";
import router from "./router";
import store from "./store";

import app from "@/App"; // 引入主组件
import "element-ui/lib/theme-chalk/index.css";
import "@/assets/style/base.less";
import "@/assets/style/font.css";
import { Sparrow } from "../../../source/scripts/sparrow_es.js";
import { ImProtocol } from "../../../source/scripts/ImProtocol";
import { Initialization } from "../../api/Initialization";

var isProd = process.env.NODE_ENV === "prod";
if (!isProd) {
  await import("element-ui").then((ElementUI) => {
    Vue.use(ElementUI);
  });
}

Vue.config.productionTip = false;

const vue = new Vue({
  // 创建vue实例
  router,
  store,
  render: (h) => h(app), // 渲染主组件
});
Vue.prototype.$sparrow = Sparrow;
Vue.prototype.$protocol = ImProtocol;
Vue.prototype.$getUserId = function () {
  if (this.$webSocket != null && this.$webSocket.userId != null) {
    return this.$webSocket.userId;
  }

  console.log("兜底获取用户id");
  // this.$webSocket.userId = await ChatApi.getUserId(this.$token()).then(res => {
  //     return res;
  // }, err => {
  //     console.log(err);
  // });
  //return this.$webSocket.userId;
  return null;
};
Vue.prototype.$init = async function () {
  Vue.prototype.$token = Sparrow.user.getToken();
  //router.token = Vue.prototype.$token;
  await Initialization.initWebSocket(Vue, vue);

  //初始化用户联系人信息
  await Initialization.initContact(Vue, vue);
  //初始化平台客服信息
  if (!vue.$webSocket.platform) {
    await Initialization.initPlatformService(Vue);
  }
  await Initialization.initSessions(Vue, vue);
};
//非登录页面，则初始化用户信息
//刷新页面时执行
if (window.location.href.indexOf("/login") < 0) {
  await vue.$init();
}
vue.$mount("#app");
