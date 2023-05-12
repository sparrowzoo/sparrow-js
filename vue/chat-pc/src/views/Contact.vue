<template>
  <div class="">
    <ContactItem
      :contact-list="friendList"
      @chat="onChat"
      @remove="onRemove"
    ></ContactItem>
  </div>
</template>

<script>
import ContactItem from "@/components/ContactItem.vue";

export default {
  components: { ContactItem },
  data() {
    return {
      friendList: this.$contact.users,
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

      this.$router.push({
        name: "session",
        query: { key: sessionKey },
      });
    },
  },
};
</script>

<style lang="less" scoped></style>
