<template>
  <div class="">
    <ContacterItem
      :contacter-list="friendList"
      @remove="onRemove"
      @chat="onChat"
    ></ContacterItem>
  </div>
</template>

<script>
import ContacterItem from "@/components/contacterItem.vue";
export default {
  components: { ContacterItem },
  data() {
    return {
      friendList: [
        {
          id: 1,
          userId: 6,
          name: "张三",
          avatar:
            "https://fast-refuel.oss-cn-shenzhen.aliyuncs.com/xu1vxs0yg2wjw30jrlvd.png",
          flag: "https://fast-refuel.oss-cn-shenzhen.aliyuncs.com/ipt97p56wya010s3vpde.png",
        },
        {
          id: 2,
          userId: 7,
          name: "李四",
          avatar:
            "https://fast-refuel.oss-cn-shenzhen.aliyuncs.com/xu1vxs0yg2wjw30jrlvd.png",
          flag: "https://fast-refuel.oss-cn-shenzhen.aliyuncs.com/ipt97p56wya010s3vpde.png",
        },
      ],
    };
  },
  methods: {
    onRemove(data) {
      console.log(data);
    },
    onChat(data) {
      console.log(data);
      // 修改索引
      this.$store.commit("setPageIndex", 1);
      // 跳 我的消息
      this.$router.push({
        name: "message",
      });
    },
  },
};
</script>

<style lang="less" scoped></style>
