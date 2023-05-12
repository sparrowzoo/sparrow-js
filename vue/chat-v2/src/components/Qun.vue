<template>
  <div class="qun">
    <van-nav-bar left-arrow title="我的群聊" @click-left="$router.go(-1)">
    </van-nav-bar>
    <div
      v-for="qun in qunList"
      :key="qun.id"
      class="chat_item"
      @click="toChat(qun)"
    >
      <van-badge
        :content="qun.unReadCount > 1 ? qun.unReadCount : null"
        :dot="qun.unReadCount > 1"
      >
        <img :src="qun.avatar" class="child" />
      </van-badge>
      <div class="chat_right">
        <div class="chat_top">
          <span class="chat_name">{{ qun.title }}</span>
          <span class="chat_time gray">{{ qun.lastMessageTime }}</span>
        </div>
        <div class="chat_bottom gray" v-html="qun.lastMessageContent"></div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "ChatQun",
  data() {
    return {};
  },
  methods: {
    toChat(qun) {
      this.$router.push({
        name: "chat",
        query: {
          key: qun.id,
        },
      });
    },
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
};
</script>

<style scoped>
.cmd {
  display: flex;
  align-items: center;
}

.cmd span {
  margin-left: 0.5rem;
}

.avatar {
  width: 2.5rem;
  height: 2.5rem;
}

.chat_item {
  margin-top: 1rem;
  display: flex;
  padding: 0 1rem;
}

.chat_right {
  flex: 1 0 0;
  margin-left: 1rem;
  display: flex;
  flex-direction: column;
  justify-content: space-around;
  width: 0;
}

.chat_top {
  display: flex;
  flex-direction: row;
  align-items: center;
}

.chat_name {
  flex: 1 0 0;
}

.chat_header {
  width: 1.5rem;
  height: 1.5rem;
  border-radius: 0.75rem;
}

.child {
  width: 2.5rem;
  height: 2.5rem;
  background: #f2f3f5;
  border-radius: 4px;
  display: block;
}

.chat_bottom {
  white-space: nowrap;
  text-overflow: ellipsis;
  overflow: hidden;
}

.gray {
  color: #999;
}
</style>
