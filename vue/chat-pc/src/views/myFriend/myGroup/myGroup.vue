<template>
  <div class="">
    <ContacterItem
      :contacter-list="groupList"
      :is-user="false"
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
      groupList: [
        {
          id: 1,
          groupId: 6,
          name: "群聊1",
          avatar:
            "https://fast-refuel.oss-cn-shenzhen.aliyuncs.com/xu1vxs0yg2wjw30jrlvd.png",
        },
        {
          id: 2,
          groupId: 7,
          name: "群聊2",
          avatar:
            "https://fast-refuel.oss-cn-shenzhen.aliyuncs.com/xu1vxs0yg2wjw30jrlvd.png",
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
