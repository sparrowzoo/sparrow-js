import Vue from "vue";
import router from "./router";
import store from "./store";

import app from "@/App"; // 引入主组件
import "@/assets/style/base.less";
import "@/assets/style/font.css";
//vue  需要支持 ES6 语法
import { Sparrow } from "../../../source/scripts/sparrow_es.js";

var isProd = process.env.NODE_ENV === "prod";
debugger;
var root = process.env.VUE_APP_SPARROW_BASE_URL;
var tokenConfig = {};
tokenConfig[root] = {
  "login-token": Sparrow.user.getToken,
};
Sparrow.ajax.tokenConfig = tokenConfig;
console.log("env" + process.env.NODE_ENV);

if (!isProd) {
  await import("element-ui/lib/theme-chalk/index.css");
  await import("element-ui").then((ElementUI) => {
    Vue.use(ElementUI);
  });
}

var ChatApi = await import("../../api/SparrowChat").then((chatModule) => {
  return chatModule.ChatApi;
});

var ImProtocol = await import("../../../source/scripts/ImProtocol").then(
  (chatModule) => {
    return chatModule.ImProtocol;
  }
);
var Initialization = await import("../../api/Initialization").then(
  (chatModule) => {
    return chatModule.Initialization;
  }
);

Vue.config.productionTip = !isProd;

const vue = new Vue({
  // 创建vue实例
  router,
  store,
  render: (h) => h(app), // 渲染主组件
});
Vue.prototype.$sparrow = Sparrow;
Vue.prototype.$protocol = ImProtocol;
Vue.prototype.$chatApi = ChatApi;
Vue.prototype.$initialization = Initialization;
Vue.prototype.$baseUrl = process.env.VUE_APP_SPARROW_BASE_URL;

Vue.prototype.$getUserId = function () {
  if (this.$webSocket != null && this.$webSocket.userId != null) {
    return this.$webSocket.userId;
  }
  console.log("兜底获取用户id");
  return null;
};
Vue.prototype.$init = async function () {
  Vue.prototype.$token = encodeURIComponent(this.$sparrow.user.getToken());
  //router.token = Vue.prototype.$token;
  await Initialization.initWebSocket(Vue, vue);

  //初始化用户联系人信息
  await Initialization.initContact(Vue, vue);
  //初始化平台客服信息
  if (!vue.$webSocket.platform) {
    await Initialization.initPlatformService(Vue, vue);
  }
  await Initialization.initSessions(Vue, vue);
};
//非登录页面，则初始化用户信息
//刷新页面时执行
console.log("url" + window.location.href);
if (window.location.href.indexOf("/login") < 0) {
  //await vue.$init();
}
vue.$mount("#app");
