<template>
  <div class="menu">
    <div
      v-for="menu of menuList"
      :key="menu.id"
      class="menu"
      @click="switchMenu(menu, menu.id)"
    >
      <button
        :class="
          $store.state.menuId === menu.id ? 'active-btn' : 'un-active-btn'
        "
        class="btn"
      >
        {{ menu.title }}
      </button>
    </div>
  </div>
</template>

<script>
export default {
  name: "chat-menu",
  data() {
    return {
      menuList: [
        { id: 1, title: "我的好友", pathName: "contact" },
        { id: 2, title: "聊天消息", pathName: "session" },
      ],
    };
  },
  created() {
    // console.log(this.$route);  拿到当前路径信息
    const index = this.menuList.findIndex(
      (item) => item.pathName === this.$route.name
    );
    if (index !== -1) {
      this.$store.commit("activeMenu", index);
    }

    if (!this.$isInner) {
      // this.menuList.push({
      //   id: 3,
      //   title: "系统通知",
      //   pathName: "notice",
      // });
      // if (!this.$webSocket.platform) {
      //   this.menuList.push({
      //     id: 4,
      //     title: "联系客服",
      //     pathName: "platform-service",
      //   });
      // }
    }
  },
  methods: {
    // 切换右侧 内容
    switchMenu(item, index) {
      console.log(item, index);
      // 激活当前
      console.log(index);
      this.$store.commit("activeMenu", index);
      // 路由跳转
      this.$router.push({ name: item.pathName });
    },
  },
};
</script>

<style lang="less" scoped>
.menu {
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
