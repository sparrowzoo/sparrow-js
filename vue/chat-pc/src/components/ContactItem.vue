<template>
  <div>
    <div v-for="item of contactList" :key="item.id" class="user-item">
      <div class="user-info">
        <div class="avatar">
          <img :src="item.avatar" alt="" />
          <img :src="item.flagUrl" alt="" class="img-flag" />
        </div>
        <div class="user-name">
          <span></span>
          <span>{{ item.userName }}</span>
        </div>
      </div>
      <div class="operate">
        <!--        <button v-if="platform === false" @click="remove(item)">-->
        <!--          {{ "删除好友" }}-->
        <!--        </button>-->
        <button class="chat" @click="chat(item)">聊一下</button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    contactList: {
      type: Array,
      default: () => [],
    },
    platform: {
      type: Boolean,
      default: false,
    },
  },

  data() {
    return {};
  },
  methods: {
    remove(item) {
      // console.log(item);
      this.$emit("remove", item);
    },
    chat(item) {
      // console.log(item);
      this.$emit("chat", item);
    },
  },
};
</script>

<style lang="less" scoped>
.user-item {
  width: 100%;
  height: 100px;
  padding: 5px 0;
  border-bottom: 1px solid #eee;
  display: flex;
  justify-content: space-between;
  align-items: center;

  .user-info {
    width: 200px;
    display: flex;
    align-items: center;

    .avatar {
      width: 60px;
      height: 60px;
      position: relative;

      img {
        border-radius: 5px;
        width: 100%;
        height: 100%;
      }

      .img-flag {
        position: absolute;
        bottom: -3px;
        left: -3px;
        width: 20px;
        height: 20px;
        border-radius: 50%;
        border: 1px solid #fff;
      }
    }

    .user-name {
      margin-left: 10px;
      display: flex;
      flex-direction: column;
      justify-content: start;

      span {
        &:last-child {
          color: @text-gray-color;
          font-size: 14px;
          padding-top: 5px;
        }
      }
    }
  }

  .operate {
    width: 70%;
    text-align: end;

    button {
      min-width: 80px;
      width: 15%;
      padding: 10px 0;
      background-color: @theme-color;
      border: 2px solid @text-color;
      color: @text-color;
      cursor: pointer;
      font-size: 14px;
    }

    .chat {
      margin-left: 5px;
      background-color: @text-color;
      color: #fff;
    }
  }

  .operate-res {
    color: @text-gray-color;
  }
}
</style>
