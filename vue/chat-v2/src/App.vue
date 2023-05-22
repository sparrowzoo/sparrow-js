<template>
  <div id="app">
    <router-view :key="$route.fullPath"></router-view>

    <van-tabbar v-if="$route.path != '/chat'" route>
      <van-tabbar-item :to="{ name: 'session' }" icon="chat-o" replace
        >消息
      </van-tabbar-item>
      <van-tabbar-item :to="{ name: 'contact' }" icon="user-o" replace
        >通讯录
      </van-tabbar-item>
    </van-tabbar>
  </div>
</template>
<script>
export default {
  components: {},
  computed: {},
  //除了App.vue，其他的vue文件都要加上name （copilot的badcase 不对 ）
  //除了App.vue的name，其他的vue文件命名必须是驼峰命名法
  //https://sparrowzoo.feishu.cn/docx/RzKZdWXQioxE5vxamcec8YBencb
  data() {
    return {};
  },
  mounted() {
    console.log("welcome to sparrow im");
  },
};
</script>

<style>
#app {
  padding-bottom: 4rem;
}
</style>
