<template>
  <div class="aside">
    <div class="aside-item" v-for="(item, index) of asideList" :key="item.id">
      <button
        class="btn"
        :class="
          $store.state.currentPageIndex === index
            ? 'active-btn'
            : 'un-active-btn'
        "
        @click="switchPage(item, index)"
      >
        {{ item.title }}
      </button>
    </div>
  </div>
</template>

<script>
export default {
  name: "chat-menu",
  data() {
    return {
      asideList: [
        { id: 1, title: "我的好友", pathName: "addFriend" },
        { id: 2, title: "聊天消息", pathName: "message" },
        { id: 3, title: "系统通知", pathName: "notice" },
        { id: 4, title: "联系客服", pathName: "service" },
      ],
    };
  },
  created() {
    // console.log(this.$route);  拿到当前路径信息
    const index = this.asideList.findIndex(
      (item) => item.pathName === this.$route.name
    );
    if (index !== -1) {
      this.$store.commit("setPageIndex", index);
    }
  },
  methods: {
    // 切换右侧 内容
    switchPage(item, index) {
      // 激活当前btn
      this.$store.commit("setPageIndex", index);
      // 路由跳转
      this.$router.push({ name: item.pathName });
    },
  },
};
</script>

<style lang="less" scoped>
.aside-item {
  width: 180px;
  height: 60px;
  margin-bottom: 10px;
}
.btn {
  width: 100%;
  height: 100%;
  padding: 0;
  margin: 0;
  font-size: 16px;
  cursor: pointer;
}
</style>
