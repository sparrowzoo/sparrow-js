<template>
  <div class="">
    <!-- 头部 -->
    <div class="top-part">
      <div v-for="item of topCardList" :key="item.id" class="select-item">
        <i class="iconfont" :class="item.iconName"></i>
        <span @click="switchContent(item)">{{ item.title }}</span>
      </div>
    </div>
    <!-- 主体展示的内容 -->
    <div class="content">
      <router-view></router-view>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      topCardList: [
        {
          id: 1,
          title: "添加朋友",
          iconName: "icon-zengjia",
          pathName: "addFriend",
        },
        {
          id: 2,
          title: "新的朋友",
          iconName: "icon-user",
          pathName: "newFriend",
        },
        {
          id: 3,
          title: "我的群聊",
          iconName: "icon-yonghuqun",
          pathName: "myGroup",
        },
      ],
    };
  },
  methods: {
    switchContent(item) {
      // console.log(item);
      this.$router.push({ name: item.pathName });
    },
  },
};
</script>

<style lang="less" scoped>
.top-part {
  background-color: @theme-color;
  display: flex;
  padding: 18px 0;
  border-bottom: 8px solid #fff;
}
.select-item {
  flex: 1;
  text-align: center;
  cursor: pointer;

  .iconfont {
    vertical-align: text-top;
    font-size: 24px;
  }

  &:nth-child(2) {
    border-left: 1px solid #999;
    border-right: 1px solid #999;
  }
}

.content {
  position: relative;
  height: 570px;
  padding: 0 60px;
  background-color: @theme-color;
  overflow: auto;
  // 隐藏滚动条
  scrollbar-width: none; /* Firefox */
  -ms-overflow-style: none; /* IE 10+ */
  &::-webkit-scrollbar {
    display: none; /* Chrome Safari */
  }
}
</style>
