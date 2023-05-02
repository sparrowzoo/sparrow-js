<template>
  <div class="chat">
    <!-- 左侧消息列表 -->
    <div class="msg-part">
      <!-- 搜索框 -->
      <div class="search-part">
        <div class="search-icon">
          <i class="iconfont icon-sousuo"></i>
          <input class="search-input" type="text" placeholder="搜索" />
        </div>
        <div class="search-add">+</div>
      </div>
      <!-- 消息列表 -->
      <div class="msg-list">
        <div
          class="msg-item"
          v-for="item of sesstionList"
          :key="item.id"
          @click="switchSession(item)"
          :class="
            item.userId === $store.state.targetInfo.userId
              ? 'session-active'
              : ''
          "
        >
          <div class="avatar">
            <img :src="item.avatar" class="avatar-img" alt="用户头像" />
            <img
              v-if="item.sessionType === 'user'"
              :src="item.flag"
              class="nation"
              alt="国籍"
            />
            <span class="unread">{{ item.unread }}</span>
          </div>
          <div class="msg-user-time">
            <div class="msg-user">
              <span class="username">{{ item.name }}</span>
              <span class="msg-time">{{ item.lastTime }}</span>
            </div>
            <span class="msg-last">{{
              item.messageType === "txt" ? item.lastMsg : "图片"
            }}</span>
          </div>
        </div>
      </div>
    </div>
    <!-- 右侧聊天框 -->
    <div class="msg-content">
      <ChatPart
        :message-list="messageList"
        :target-info="targetInfo"
        :isService="true"
      ></ChatPart>
    </div>
  </div>
</template>

<script>
import ChatPart from "@/components/chatPart.vue";
export default {
  components: { ChatPart },
  data() {
    return {
      sesstionList: [
        {
          id: 1,
          sessionType: "user",
          name: "张三",
          userId: 6,
          avatar:
            "https://fast-refuel.oss-cn-shenzhen.aliyuncs.com/xu1vxs0yg2wjw30jrlvd.png",
          flag: "https://fast-refuel.oss-cn-shenzhen.aliyuncs.com/ipt97p56wya010s3vpde.png",
          unread: 10,
          lastTime: "19:03",
          lastMsg: "你好",
          messageType: "txt",
        },
        {
          id: 2,
          userId: 7,
          sessionType: "user",
          name: "用户2",
          avatar:
            "https://fast-refuel.oss-cn-shenzhen.aliyuncs.com/xu1vxs0yg2wjw30jrlvd.png",
          flag: "https://fast-refuel.oss-cn-shenzhen.aliyuncs.com/ipt97p56wya010s3vpde.png",
          unread: 10,
          lastTime: "19:03",
          lastMsg: "你好",
          messageType: "txt",
        },
        {
          id: 3,
          userId: 8,
          sessionType: "user",
          name: "用户3",
          avatar:
            "https://fast-refuel.oss-cn-shenzhen.aliyuncs.com/xu1vxs0yg2wjw30jrlvd.png",
          flag: "https://fast-refuel.oss-cn-shenzhen.aliyuncs.com/ipt97p56wya010s3vpde.png",
          unread: 10,
          lastTime: "19:03",
          lastMsg: "你好",
          messageType: "txt",
        },
      ],
      activeSessionIndex: 0,
      messageList: [
        {
          id: 1,
          messageType: "txt",
          messageContent: "这是一条文本信息",
          messageTime: "2020-12-10",
          isSelf: true,
        },
        {
          id: 2,
          messageType: "image",
          messageContent: "https://img1.imgtp.com/2023/01/29/odnUWlDQ.jpg",
          messageTime: "2020-12-10",
          isSelf: true,
        },
        {
          id: 3,
          messageType: "txt",
          messageContent: "这是一条文本信息",
          messageTime: "2020-12-10",
          isSelf: false,
        },
        {
          id: 4,
          messageType: "image",
          messageContent: "https://img1.imgtp.com/2023/04/30/xQeYeb8b.jpg",
          messageTime: "2020-12-10",
          isSelf: false,
        },
        {
          id: 5,
          messageType: "recall",
          messageContent: "撤回的内容",
          isSelf: false,
        },
      ],
      targetInfo: {
        name: "用户2",
        avatar: "https://img1.imgtp.com/2023/04/30/xQeYeb8b.jpg",
      },
    };
  },
  methods: {
    // 切换聊天用户
    switchSession(item) {
      // console.log(item);
      // 将最新的聊天对象保存到全局
      const newTarget = {
        type: item.sessionType,
        userId: item.userId,
        name: item.name,
        avatar: item.avatar,
        targetId: item.targetId,
      };
      this.$store.commit("setTargetUser", newTarget);
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
          .username {
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
