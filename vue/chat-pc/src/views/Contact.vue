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
import { Initialization } from "../../../api/Initialization";

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
      var sessionKey = Initialization.get121Session(friend, this);
      this.$router.push({
        name: "session",
        query: { key: sessionKey },
      });
    },
  },
};
</script>

<style lang="less" scoped></style>
