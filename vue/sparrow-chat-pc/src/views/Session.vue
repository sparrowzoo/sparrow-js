<template>
  <div class="chat">
    <!-- 左侧消息列表 -->
    <div class="msg-part">
      <!-- 搜索框 -->
      <div class="search-part">
        <!--              <div class="search-icon">-->
        <!--                <i class="iconfont icon-search"></i>-->
        <!--                &lt;!&ndash;          <input class="search-input" placeholder="搜索" type="text" />&ndash;&gt;-->
        <!--              </div>-->
        <!--              <div class="search-add iconfont icon-add-user"></div>-->
      </div>
      <!-- 消息列表 -->
      <div class="msg-list">
        <div
          v-for="item of sessionList"
          :key="item.key"
          :class="item.key === activeSession.key ? 'session-active' : ''"
          class="msg-item"
          @click="switchSession(item)"
        >
          <div class="avatar">
            <img :src="item.avatar" alt="用户头像" class="avatar-img" />
            <img
              v-if="item.type === $protocol.CHAT_TYPE_1_2_1"
              :src="item.flag"
              alt="国籍"
              class="nation"
            />
            <span v-if="item.unReadCount > 0" class="unread">{{
              item.unReadCount
            }}</span>
          </div>
          <div class="msg-user-time">
            <div class="msg-user">
              <span class="user-name">{{ item.title }}</span>
              <span class="msg-time">{{ item.time }}</span>
            </div>
            <span class="msg-last">{{ item.lastMessageContent }}</span>
          </div>
        </div>
      </div>
    </div>
    <!-- 右侧聊天框 -->
    <div class="msg-content">
      <ChatPart :session="activeSession"></ChatPart>
    </div>
  </div>
</template>

<script>
import ChatPart from "@/components/ChatPart.vue";

export default {
  components: { ChatPart },
  data() {
    return {
      sessionList: this.$sessions,
      //一定要添加初始化数据，否则会报错
      activeSession: { key: -1 },
    };
  },
  computed: {},
  mounted() {
    this.$store.commit("activeMenu", 2);
    this.$initialization.initActiveSession(this);
    this.$chatApi.setRead(this.activeSession, this);
  },
  methods: {
    // 切换聊天用户
    switchSession(session) {
      this.activeSession = session;
      this.$chatApi.setRead(this.activeSession, this);
    },
  },
};
</script>

<style lang="less" scoped>
.chat {
  width: 95%;
  height: 100%;
  display: flex;
}

.msg-part {
  width: 32%;
  min-width: 250px;
  background-color: @theme-color;
  border: 1px solid @border-color;

  .search-part {
    height: 75px;
    padding: 0 15px;
    display: flex;
    justify-content: space-around;
    align-items: center;
    background-color: #f3f0f0;
    border-bottom: 1px solid #fff;
    position: relative;

    .search-icon {
      position: relative;
      margin-right: 15px;
      flex: 1;

      input {
        box-sizing: border-box;
        width: 100%;
        height: 35px;
        border: none;
        outline: none;
        padding-left: 27px;
      }

      .iconfont {
        position: absolute;
        top: 50%;
        transform: translateY(-50%);
        left: 5px;
        color: #a3a3a3;
        font-size: 18px;
      }
    }

    .search-add {
      width: 35px;
      height: 35px;
      line-height: 35px;
      font-size: 18px;
      font-weight: 600;
      color: @text-gray-color;
      text-align: center;
      background-color: #fff;
      cursor: pointer;
    }
  }

  .msg-list {
    overflow: auto;
    height: 657px;
    // 隐藏滚动条
    scrollbar-width: none; /* Firefox */
    -ms-overflow-style: none; /* IE 10+ */

    &::-webkit-scrollbar {
      display: none; /* Chrome Safari */
    }

    .msg-item {
      width: 100%;
      padding: 20px 15px;
      box-sizing: border-box;
      display: flex;
      background-color: @theme-color;
      cursor: pointer;

      .avatar {
        width: 60px;
        height: 60px;
        position: relative;
        border-radius: 5px;
        margin-right: 10px;

        .nation {
          width: 20px;
          height: 20px;
          border-radius: 50%;
          position: absolute;
          bottom: -5px;
          left: -1px;
        }

        .avatar-img {
          width: 100%;
          height: 100%;
          border-radius: 5px;
        }

        span {
          position: absolute;
          top: 0;
          right: 0;
          transform: translate(40%, -40%);
          display: inline-block;
          width: 20px;
          height: 20px;
          background-color: red;
          border-radius: 50%;
          text-align: center;
          line-height: 20px;
          color: #fff;
        }
      }

      .msg-user-time {
        flex: 1;
        display: flex;
        flex-direction: column;
        justify-content: space-around;

        .msg-user {
          display: flex;
          justify-content: space-between;

          .user-name {
            max-width: 85px;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
          }

          .msg-time {
            color: #8c8c8c;
            font-size: 14px;
          }
        }

        .msg-last {
          color: #8c8c8c;
          font-size: 14px;
          max-width: 130px;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }
      }
    }
  }
}

.session-active {
  background-color: #f3f0f0 !important;
}

.msg-content {
  width: 68%;
  min-width: 400px;
  border: 1px solid @border-color;
  border-left: none;
  position: relative;
}
</style>
