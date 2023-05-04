<template>
  <div class="">
    <div class="user-item" v-for="item of newFriendList" :key="item.id">
      <div class="user-info">
        <div class="avatar">
          <img :src="item.avatar" alt="" />
          <img class="img-flag" :src="item.flag" alt="" />
        </div>
        <div class="user-name">
          <span>{{ item.name }}</span>
        </div>
      </div>
      <div v-if="item.state === 0" class="operate">
        <button>拒绝</button>
        <button class="chat">通过</button>
      </div>
      <div v-else-if="item.state === 1" class="operate-res">已通过</div>
      <div v-else class="operate-res">已拒绝</div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      newFriendList: [
        {
          id: 1,
          userId: 6,
          name: "用户1",
          avatar:
            "https://fast-refuel.oss-cn-shenzhen.aliyuncs.com/xu1vxs0yg2wjw30jrlvd.png",
          flag: "https://fast-refuel.oss-cn-shenzhen.aliyuncs.com/ipt97p56wya010s3vpde.png",
          state: 0,
        },
        {
          id: 2,
          userId: 7,
          name: "用户2",
          avatar:
            "https://fast-refuel.oss-cn-shenzhen.aliyuncs.com/xu1vxs0yg2wjw30jrlvd.png",
          flag: "https://fast-refuel.oss-cn-shenzhen.aliyuncs.com/ipt97p56wya010s3vpde.png",
          state: 1,
        },
        {
          id: 3,
          userId: 7,
          name: "用户2",
          avatar:
            "https://fast-refuel.oss-cn-shenzhen.aliyuncs.com/xu1vxs0yg2wjw30jrlvd.png",
          flag: "https://fast-refuel.oss-cn-shenzhen.aliyuncs.com/ipt97p56wya010s3vpde.png",
          state: 2,
        },
      ],
    };
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
