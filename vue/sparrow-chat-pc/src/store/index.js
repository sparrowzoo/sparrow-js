import Vuex from "vuex";
import Vue from "vue";

Vue.use(Vuex);

// 创建一个新的 store 实例
export default new Vuex.Store({
  state() {
    return {
      menuId: 1, //菜单ID
    };
  },
  mutations: {
    // 设置索引
    activeMenu(state, menuId) {
      state.menuId = menuId;
    },
  },
});
