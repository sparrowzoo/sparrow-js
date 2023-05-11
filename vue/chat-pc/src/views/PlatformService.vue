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
import { Initialization } from "../../../api/Initialization";

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
      var sessionKey = Initialization.get121Session(friend, this);
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
