import Vuex from "vuex";
import Vue from "vue";
Vue.use(Vuex);

// 创建一个新的 store 实例
export default new Vuex.Store({
  state() {
    return {
      currentPageIndex: 0,
      // 当前聊天对象
      targetInfo: {
        type: "user",
        userId: 7,
        name: "聊天对象",
        avatar: "https://img1.imgtp.com/2023/01/29/odnUWlDQ.jpg",
        targetId: 9, // 群聊对象的用户id
      },
      // 当前登录用户的信息
      userInfo: {
        type: "user",
        name: "过客",
        avatar: "https://img1.imgtp.com/2023/04/30/xQeYeb8b.jpg",
        userId: 6, // 群聊对象的用户id
      },
    };
  },
  mutations: {
    // 设置索引
    setPageIndex(state, payload) {
      state.currentPageIndex = payload;
    },
    // 设置全局聊天对象
    setTargetUser(state, payload) {
      state.targetInfo = payload;
    },
  },
});
// export default store;
