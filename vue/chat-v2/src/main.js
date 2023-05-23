import Vue from "vue"; // 引入vue
import router from "@/route"; // 引入路由
import app from "@/App"; // 引入主组件
import { Sparrow } from "../../../source/scripts/sparrow_es.js";
import { ImProtocol } from "../../../source/scripts/ImProtocol";
import { Base64 } from "js-base64";
import { Initialization } from "../../api/Initialization";

import Vant from "vant"; //  引入vant, 一个移动端的ui框架
import "vant/lib/index.css";

Vue.use(Vant);

// var isProd = process.env.NODE_ENV === "prod";
// if (!isProd) {
//   await import("vant/lib/index.css");
//   await import("vant").then((Vant) => {
//     Vue.use(Vant);
//   });
// }
Vue.config.productionTip = false; // 关闭生产模式下给出的提示
const vue = new Vue({
  // 创建vue实例
  router,
  render: (h) => h(app), // 渲染主组件
});
Vue.prototype.$sparrow = Sparrow;
Vue.prototype.$Base64 = Base64;
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
  await Initialization.initContact(Vue, vue);
  await Initialization.initSessions(Vue, vue);
};
//非登录页面，则初始化用户信息
//刷新页面时执行s
if (window.location.href.indexOf("/login") < 0) {
  await vue.$init();
}
vue.$mount("#app");
