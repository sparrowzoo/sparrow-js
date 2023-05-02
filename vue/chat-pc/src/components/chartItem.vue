<template>
  <div :class="messageItem.isSelf ? 'right' : 'left'" class="message">
    <!-- 根据条件展示聊天时间 -->
    <div class="time" v-if="messageItem.messageTime">
      {{ messageItem.messageTime }}
    </div>
    <div class="user-msg">
      <img class="avatar-user" :src="targetUser.avatar" alt="" />
      <!-- 文本信息和图片信息 动态显示 -->
      <div class="message-detail" v-if="messageItem.messageType === 'txt'">
        <div class="user-name">{{ targetUser.name }}</div>
        <span class="block"></span>
        <span class="message-text">{{ messageItem.messageContent }}</span>
      </div>
      <!-- 图片类型 -->
      <div class="msg-picture-detail" v-else>
        <div class="user-name">{{ targetUser.name }}</div>
        <div style="display: none" class="user-name">
          {{ messageItem.name }}
        </div>
        <img :src="targetUser.avatar" class="msg-picture" alt="" />
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    messageItem: {
      type: Object,
      require: true,
    },
    targetUser: {
      type: Object,
      require: true,
    },
  },
  data() {
    return {};
  },
};
</script>

<style lang="less" scoped>
.message {
  margin: 20px;
  .time {
    color: #666;
    font-size: 14px;
    text-align: center;
    padding: 10px 0;
  }
  .user-msg {
    display: flex;
    padding: 10px 0;

    .avatar-user {
      width: 35px;
      height: 35px;
      border-radius: 5px;
    }
    .message-detail {
      max-width: 50%;
      margin: 0 20px 0 25px;
      padding: 12px 10px;
      border-radius: 5px;
      overflow-wrap: break-word;

      .message-text {
        white-space: pre-wrap;
      }

      &:hover {
        cursor: pointer;
      }
    }
    .msg-picture-detail {
      position: relative;
      margin: 0 20px;
      .msg-picture {
        border-radius: 5px;
        max-width: 150px;
        cursor: pointer;
      }
    }
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

.left {
  .user-msg {
    flex-direction: row;
    .user-name {
      position: absolute;
      top: 0;
      left: 0;
      transform: translateY(-110%);
      width: 100px;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
      color: #999;
    }
    .message-detail {
      background-color: #fff;
      color: #000;
      position: relative;

      .block {
        // display: inline-block;
        border: 10px solid transparent;
        border-right-color: #fff;
        position: absolute;
        top: 8px;
        left: -20px;
      }
    }
  }
}
.right {
  .user-msg {
    flex-direction: row-reverse;
    .user-name {
      display: none !important;
    }
    .message-detail {
      background-color: @text-color;
      color: #eee;
      position: relative;

      .block {
        // display: inline-block;
        border: 10px solid transparent;
        border-left-color: @text-color;
        position: absolute;
        top: 8px;
        right: -20px;
      }
    }
  }
}
</style>
