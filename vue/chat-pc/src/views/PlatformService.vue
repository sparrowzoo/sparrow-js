<template>
  <div class="">
    <ContactItem
      :contact-list="friendList"
      :platform="true"
      @chat="onChat"
    ></ContactItem>
  </div>
</template>

<script>
import ContactItem from "@/components/ContactItem.vue";

export default {
  components: { ContactItem },
  data() {
    return {
      friendList: this.$platformServers,
    };
  },
  methods: {
    onRemove(data) {
      console.log(data);
    },
    onChat(friend) {
      var sessionKey = this.$protocol.generate121SessionKey(
        friend.userId,
        this.$getUserId()
      );
      // 跳 我的消息
      this.$router.push({
        name: "session",
        query: { key: sessionKey },
      });
    },
  },
};
</script>

<style lang="less" scoped></style>
