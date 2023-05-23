<template>
  <div class="">
    <div class="msg-content">
      <!-- 聊天头部信息 -->
      <div class="title">
        <span class="user"
          >{{ session.title }} {{ session.platform ? "[平台]" : "" }}</span
        >
        <i
          v-show="session.type === $protocol.CHAT_TYPE_1_2_N"
          class="iconfont icon-more show-more-icon"
          @click="showMore"
        ></i>
      </div>
      <div class="msg-detail">
        <!-- 渲染聊天记录 -->

        <template v-for="item of session.messages">
          <div :key="item.id">
            <!-- 首先判断是否为 撤回的消息 -->
            <div v-if="item.messageType === 'recall'">
              <div v-if="item.isMe" class="show-recall-mime recall">
                <p>你撤回了一条消息<span class="reset"> 重新编辑</span></p>
              </div>
              <div v-else class="show-recall-other recall">
                <p>
                  <span class="recall-user">{{ session.title }}</span
                  >撤回了一条消息
                </p>
              </div>
            </div>
            <!-- 普通的消息 -->
            <div v-else>
              <ChatItem v-if="item.isMe" :message-item="item"></ChatItem>
              <ChatItem v-else :message-item="item"></ChatItem>
            </div>
          </div>
        </template>
      </div>
      <div class="input-part">
        <div class="conver-button">
          <span>英</span>
          <span class="active-lang">中</span>
          <div class="upload-part">
            <label for="upload">
              <i class="iconfont icon-img"></i>
            </label>
            <input
              id="upload"
              class="upload-img"
              style="display: none"
              type="file"
              @change="sendImage($event.target.files[0])"
            />
          </div>
        </div>
        <div class="input-message">
          <div class="text">
            <textarea v-model="content" class="input-content"></textarea>
          </div>
          <button class="send-btn" @click="sendText">发送</button>
        </div>
      </div>
      <!-- 群聊的详细信息 -->
      <MoreDetail ref="showMore"></MoreDetail>
    </div>
  </div>
</template>

<script>
import MoreDetail from "./MoreDetail.vue";
import ChatItem from "./ChartItem.vue";
import { ImProtocol } from "../../../../source/scripts/ImProtocol";
import { Initialization } from "../../../api/Initialization";

export default {
  components: { MoreDetail, ChatItem },
  props: {
    // 当前聊天对象 / 群 的信息
    session: {
      type: Object,
      default: () => {},
    },
  },
  mounted() {
    let that = this;
    that.handleScrollBottom();

    document.onkeydown = function (e) {
      let key = e.keyCode;
      if (key !== 13) return;
      that.sendText();
    };
    Initialization.toBottom = function () {
      that.handleScrollBottom();
    };
    console.log("session:" + JSON.stringify(this.session));
  },
  data() {
    return {
      // 当前聊天的内容
      content: "",
    };
  },
  methods: {
    showMore(e) {
      // 阻止冒泡，防止触发window 的click 事件
      e.stopPropagation();
      // 展开详细信息
      this.$refs["showMore"].showDetail();
    },
    handleScrollBottom() {
      this.$nextTick(() => {
        var msgDetail = document.querySelector(".msg-detail");
        msgDetail.scrollTop = msgDetail.scrollHeight;
      });
    },
    async sendImage(file) {
      const fileReader = new FileReader();
      var that = this;
      fileReader.onload = function () {
        const result = fileReader.result;
        console.log(result);
        var content = new Uint8Array(result);
        if (content.byteLength >= 1024 * 1024 * 3) {
          that.$message("图片大小不能超过3M");
          return;
        }
        var time = new Date().getTime();
        //如果是1对1聊天，则传过来的key=对方用户ID
        var chatType = parseInt(that.session.type, 10);
        var protocol = new that.$protocol(
          chatType,
          that.$protocol.IMAGE_MESSAGE,
          that.$getUserId(),
          that.session.oppositeUserId,
          that.session.key,
          content,
          time
        );
        that.$webSocket.sendMessage(protocol);
        this.content = "";
        Initialization.rebuild(protocol, that);
        Initialization.resortSessions(that);
        that.handleScrollBottom();
      };
      fileReader.readAsArrayBuffer(file);
    },
    sendText() {
      if (!this.content) {
        this.$message("嘿！你还没有输入内容哦！");
        return;
      }
      var time = new Date().getTime();
      var chatType = parseInt(this.session.type, 10);
      //如果是1对1聊天，则传过来的key=对方用户ID
      var protocol = new ImProtocol(
        chatType,
        ImProtocol.TEXT_MESSAGE,
        this.$getUserId(),
        this.session.oppositeUserId,
        this.session.key,
        this.content,
        time
      );
      this.$webSocket.sendMessage(protocol);
      this.content = "";
      Initialization.rebuild(protocol, this);
      Initialization.resortSessions(this);
      this.handleScrollBottom();
      console.log("parse protocol:" + protocol);
    },
  },
};
</script>

<style lang="less" scoped>
// 全局 消息撤回

.msg-content {
  // float: right;
  width: 100%;
  min-width: 400px;
  border: 1px solid @border-color;
  border-left: none;
  position: relative;

  .title {
    height: 75px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    background-color: #f5f3f3;
    border-bottom: 1px solid @border-color;
    padding: 0 20px;

    .user {
      line-height: 60px;
      font-size: 20px;
      font-weight: 500;
    }

    .iconfont {
      font-size: 30px;
      cursor: pointer;
    }
  }

  .msg-detail {
    width: 100%;
    height: 450px;
    background-color: #f8f8f8;
    overflow: auto;

    // 隐藏滚动条
    scrollbar-width: none; /* Firefox */
    -ms-overflow-style: none; /* IE 10+ */

    &::-webkit-scrollbar {
      display: none; /* Chrome Safari */
    }

    .recall {
      text-align: center;
      color: #666;

      .reset {
        color: #607298;
        cursor: pointer;
      }
    }
  }

  .input-part {
    width: 100%;
    border-top: 1px solid @border-color;
    background-color: @theme-color;

    .conver-button {
      height: 60px;
      line-height: 60px;
      display: flex;
      align-items: center;
      background-color: #f5f3f3;
      padding-left: 15px;

      span {
        text-align: center;
        height: 26px;
        width: 26px;
        line-height: 26px;
        border: 2px solid @text-color;
        color: @text-color;
        background-color: #fff;
        cursor: pointer;
      }

      .upload-part {
        height: 100%;

        .iconfont {
          font-size: 28px;
          margin-left: 10px;
          cursor: pointer;
        }
      }
    }

    .input-message {
      background-color: @theme-color;
      padding-left: 15px;
      position: relative;

      .text {
        height: 134px;
        margin-right: 20px;
        margin-top: 10px;

        .input-content {
          width: 100%;
          height: 70px;
          font-size: 20px;
          outline: none;
          border: none;
          resize: none;
          background-color: @theme-color;
        }
      }

      .send-btn {
        position: absolute;
        bottom: 10px;
        right: 10px;
        width: 110px;
        height: 40px;
        background-color: #f3f0f0;
        border: none;
        font-size: 18px;
        cursor: pointer;
      }
    }
  }

  .active-lang {
    color: #fff !important;
    background-color: @text-color !important;
  }
}
</style>
