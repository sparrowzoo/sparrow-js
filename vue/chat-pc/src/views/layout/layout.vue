<template>
  <div class="">
    <el-container>
      <el-aside width="200px">
        <ChatMenu></ChatMenu>
      </el-aside>
      <el-main>
        <router-view></router-view>
      </el-main>
    </el-container>
  </div>
</template>

<script>
import ChatMenu from "./ChatMenu.vue";
export default {
  name: "pageMain",
  components: { ChatMenu },
  data() {
    return {};
  },
};
</script>

<style lang="less" scoped>
.el-main {
  padding: 0;
}
</style>
