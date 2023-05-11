<template>
  <div class="chat">
    <van-nav-bar :title="activeSession.title" left-arrow @click-left="goBack">
      <template
        v-if="activeSession.type === this.$protocol.CHAT_TYPE_1_2_N"
        #right
      >
        <van-icon name="ellipsis" size="1.5rem" @click="qunDetail()" />
      </template>
    </van-nav-bar>
    <div ref="scrollDiv" class="center">
      <div
        v-for="message in this.activeSession.messages"
        :key="message.id"
        class="chat"
      >
        <div class="time">{{ message.time }}</div>
        <div :class="message.isMe ? 'right' : 'left'">
          <img :src="message.avatar" class="avatar" />
          <div class="content_wrap">
            <div class="user_name">
              {{ message.userName }}
            </div>
            <div v-if="message.isText" class="content">
              <div v-if="message.isMe" v-longpress="() => cancel(message)">
                {{ message.content }}
              </div>
              <div v-else>
                {{ message.content }}
              </div>
            </div>
            <img
              v-else
              v-longpress="() => cancel(message)"
              :src="message.imgUrl"
              class="img"
            />
          </div>
        </div>
      </div>
    </div>
    <div class="bottom">
      <van-uploader :after-read="sendImage">
        <van-icon name="smile" size="2rem" />
      </van-uploader>
      <van-field
        v-model="content"
        :autosize="{ maxHeight: 80 }"
        class="content"
        placeholder=""
        rows="1"
        type="textarea"
      />
      <van-button class="send" size="small" type="primary" @click="sendText()"
        >发送
      </van-button>
    </div>
  </div>
</template>

<script>
import { Dialog, Toast } from "vant";
import { ChatApi } from "../../../api/Chat";
import { ImProtocol } from "../../../../source/scripts/ImProtocol";
import { Initialization } from "../../../api/Initialization";

export default {
  name: "ChatDialog",
  data() {
    return {
      activeSession: {
        key: -1,
        messages: [],
        title: "",
        chatType: -1,
      },
      content: "",
      messageList: [],
      interval: null,
    };
  },
  directives: {
    longpress: {
      bind(el, binding) {
        console.log(binding);
        let timer;
        const start = () => {
          timer = setTimeout(() => {
            if (binding.value) {
              binding.value();
            }
          }, 800);
        };
        const stop = () => {
          if (timer) {
            clearTimeout(timer);
          }
        };
        el.addEventListener("touchstart", (e) => {
          console.log("touch start");
          e.preventDefault();
          stop();
          start();
        });
        // el.addEventListener("touchmove", (e) => {
        //     stop()
        // })
        el.addEventListener("touchend", (e) => {
          e.preventDefault();
          stop();
        });
      },
    },
  },
  async mounted() {
    this.handleScrollBottom();
    this.initActiveSession();
  },
  beforeDestroy() {
    console.log("beforeDestroy");
  },
  computed: {},
  methods: {
    initActiveSession() {
      if (this.$sessionMap == null || this.$sessionMap.length === 0) {
        return;
      }
      var key = this.$route.query.key;
      if (key != null) {
        this.activeSession = this.$sessionMap[key];
        return;
      }
      this.activeSession = this.sessionList[0];
    },
    goBack() {
      this.$router.go(-1);
    },
    qunDetail() {
      this.$router.push({
        name: "qunDetail",
        query: { key: this.$route.query.key },
      });
    },
    async cancel(item) {
      console.log(item);
      var currentUserId = this.$getUserId();
      if (item.sender !== currentUserId) {
        return;
      }
      Dialog.confirm({
        title: "消息撤回",
        message: "请确认是否撤销消息",
      })
        .then(async () => {
          console.log("cancel", item);
          const param = {
            sender: currentUserId,
            token: this.$token,
            clientSendTime: item.clientSendTime,
            sessionKey: item.session,
            chatType: item.chatType,
          };
          console.log(param);
          var result = await ChatApi.cancelMsg(param);
          if (result === true) {
            var session = this.$sessionMap[param.sessionKey];
            session.messages = session.messages.filter(
              (message) => message.clientSendTime !== item.clientSendTime
            );
          }
        })
        .catch(() => {
          // on cancel
        });
    },
    read() {
      ChatApi.setRead(this.activeSession.sessionKey);
    },
    // 滚动到底部
    handleScrollBottom() {
      this.$nextTick(() => {
        let scrollElem = this.$refs.scrollDiv;
        console.log(scrollElem);
        if (scrollElem) {
          scrollElem.scrollTo({ top: scrollElem.scrollHeight + 100 });
        }
      });
    },
    async sendImage(file) {
      const fileReader = new FileReader();
      var that = this;
      fileReader.onload = function () {
        const result = fileReader.result;
        var content = new Uint8Array(result);
        var time = new Date().getTime();

        var chatType = parseInt(this.activeSession.type, 10);
        var protocol = new that.$protocol(
          chatType,
          that.$protocol.IMAGE_MESSAGE,
          that.$getUserId(),
          that.$route.query.key,
          content,
          time
        );
        that.$webSocket.sendMessage(protocol);
        this.content = "";
        Initialization.rebuild(protocol, that);
        console.log("parse protocol:" + protocol);
      };
      fileReader.readAsArrayBuffer(file.file);
      this.handleScrollBottom();
    },
    sendText() {
      if (!this.content) {
        Toast.fail("嘿！你还没有输入内容哦！");
        return;
      }
      var time = new Date().getTime();
      var chatType = parseInt(this.activeSession.type, 10);
      //如果是1对1聊天，则传过来的key=对方用户ID
      var oppositeUserId = ImProtocol.getOppositeUser(
        this.$route.query.key,
        this.$getUserId()
      );
      var protocol = new ImProtocol(
        chatType,
        ImProtocol.TEXT_MESSAGE,
        this.$getUserId(),
        oppositeUserId,
        this.$route.query.key,
        this.content,
        time
      );
      this.$webSocket.sendMessage(protocol);
      this.content = "";
      Initialization.rebuild(protocol, this);
      console.log("parse protocol:" + protocol);
      this.handleScrollBottom();
    },
  },
};
</script>

<style scoped>
.chat {
  height: 100%;
  display: flex;
  flex-direction: column;
}

.center {
  /*flex: 1 0 0;*/
  background-color: #eee;
  padding: 0 1rem 1rem;
  overflow-y: scroll;
  height: 90%;
  margin-bottom: 4rem;
}

.avatar {
  width: 3rem;
  height: 3rem;
  background: #f2f3f5;
  border-radius: 4px;
  display: block;
}

.time {
  text-align: center;
  color: #555;
  margin-top: 0.5rem;
}

.right {
  flex-direction: row-reverse;
  display: flex;
  margin-top: 0.5rem;
}

.left {
  flex-direction: row;
  display: flex;
  margin-top: 0.5rem;
}

.content_wrap {
  flex: 1 0 0;
  width: 0;
}

.right .content_wrap {
  margin-right: 1rem;
  text-align: right;
}

.left .content_wrap {
  margin-left: 1rem;
}

.right .user_name {
  text-align: right;
  margin-bottom: 0.1rem;
}

.content div {
  background-color: white;
  padding: 0.5rem 1rem;
  border-radius: 4px;
  white-space: pre-wrap;
  word-break: break-all;
}

.right .content {
  flex-direction: row-reverse;
  flex: 1 0 0;
}

.left .content {
  flex-direction: row;
  flex: 1 0 0;
}

.img {
  max-width: 10rem;
  max-height: 10rem;
  /* margin-left: 1rem; */
  /* margin-right: 1rem; */
}

.bottom {
  display: flex;
  align-items: center;
  padding: 1rem;
  padding-bottom: 4rem;
  position: fixed;
  bottom: 0;
}

.send {
  width: 4rem;
}
</style>
