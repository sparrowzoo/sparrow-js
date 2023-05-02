<template>
  <div class="">
    <div class="msg-content">
      <!-- 聊天头部信息 -->
      <div class="title">
        <span class="user">{{ $store.state.targetInfo.name }}</span>
        <i
          class="iconfont icon-gengduo show-more-icon"
          v-show="$store.state.targetInfo.type === 'group' && !isService"
          @click="showMore"
        ></i>
      </div>
      <div class="msg-detail">
        <!-- 渲染聊天记录 -->
        <template v-for="item of messageList">
          <div :key="item.id">
            <!-- 首先判断是否为 撤回的消息 -->
            <div v-if="item.messageType === 'recall'">
              <div v-if="item.isSelf" class="show-recall-mime recall">
                <p>你撤回了一条消息<span class="reset"> 重新编辑</span></p>
              </div>
              <div v-else class="show-recall-other recall">
                <p>
                  <span class="recall-user">{{
                    $store.state.targetInfo.name
                  }}</span
                  >撤回了一条消息
                </p>
              </div>
            </div>
            <!-- 普通的消息 -->
            <div v-else>
              <ChatItem
                v-if="item.isSelf"
                :message-item="item"
                :targetUser="$store.state.userInfo"
              ></ChatItem>
              <ChatItem
                v-else
                :message-item="item"
                :targetUser="$store.state.targetInfo"
              ></ChatItem>
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
              <i class="iconfont icon-tupian"></i>
            </label>
            <input
              style="display: none"
              type="file"
              class="upload-img"
              id="upload"
            />
          </div>
        </div>
        <div class="input-message">
          <div class="text">
            <textarea class="input-content"></textarea>
          </div>
          <button class="send-btn">发送</button>
        </div>
      </div>
      <!-- 群聊的详细信息 -->
      <MoreDetail v-if="!isService" ref="showMore"></MoreDetail>
    </div>
  </div>
</template>

<script>
import MoreDetail from "./MoreDetail.vue";
import ChatItem from "./ChartItem.vue";
export default {
  components: { MoreDetail, ChatItem },
  props: {
    // 聊天记录
    messageList: {
      type: Array,
      default: () => [],
    },
    // 当前聊天对象 / 群 的信息
    targetInfo: {
      type: Object,
      default: () => {},
    },
    // 是否为联系客服
    isService: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {};
  },
  methods: {
    showMore(e) {
      // 阻止冒泡，防止触发window 的click 事件
      e.stopPropagation();
      // 展开详细信息
      this.$refs["showMore"].showDetail();
    },
  },
};
</script>

<style lang="less" scoped>
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
