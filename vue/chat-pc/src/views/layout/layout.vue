<template>
  <div class="">
    <el-container>
      <el-aside width="200px">
        <Aside></Aside>
      </el-aside>
      <el-main>
        <router-view></router-view>
      </el-main>
    </el-container>
  </div>
</template>

<script>
import Aside from "./aside.vue";
export default {
  name: "pageMain",
  components: { Aside },
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
