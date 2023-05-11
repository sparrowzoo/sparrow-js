<template>
  <div class="">
    <QunItem :qun-list="qunList" @chat="onChat" @remove="onRemove"></QunItem>
  </div>
</template>

<script>
import QunItem from "@/components/QunItem.vue";
import { Initialization } from "../../../api/Initialization";

export default {
  components: { QunItem },
  data() {
    return {};
  },
  computed: {
    qunList() {
      return this.$contact.quns
        .map((qun) => {
          const title = qun.qunName;
          const qunId = qun.qunId; //唯一id，可以作为群名
          var session = this.$sessions ? this.$sessions[qun.qunId] : null;
          var messages = session ? session.messages : null;
          const lastMessage =
            messages != null && messages.length > 0
              ? messages[messages.length - 1]
              : null; //最后收到的一条消息
          const lastMessageTime = lastMessage ? lastMessage.time : null; //最后一条消息的发送时间
          const lastMessageContent = lastMessage
            ? lastMessage.messageType === 1
              ? "/图片/"
              : lastMessage.content
            : null;
          const unReadCount = lastMessage
            ? session.messages.filter(
                (message) => message.serverTime >= session.lastReadTime
              ).length
            : 0;
          return {
            id: qunId,
            title: title,
            lastMessageTime: lastMessageTime,
            lastMessageContent: lastMessageContent,
            unReadCount: unReadCount,
            avatar: qun.unitIcon,
          };
        })
        .sort((s1, s2) => s2.lastMessageTime - s1.lastMessageTime);
    },
  },
  methods: {
    onRemove(data) {
      console.log(data);
    },
    onChat(qun) {
      var sessionKey = Initialization.getQunSession(qun, this);
      this.$router.push({
        name: "session",
        query: { key: sessionKey },
      });
    },
  },
};
</script>

<style lang="less" scoped></style>
