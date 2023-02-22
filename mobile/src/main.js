import Vue from 'vue'
import App from './App.vue'

Vue.config.productionTip = false

import Vant from 'vant';
import 'vant/lib/index.css';
Vue.use(Vant);

import router from './route'



import moment from "moment"
Vue.prototype.$moment = moment;

import { Base64 } from 'js-base64'
Vue.prototype.$Base64 = Base64;
import store from "./store"

import './lib/sparrowChat'

new Vue({
  store,
  router,
  render: h => h(App),
}).$mount('#app')
