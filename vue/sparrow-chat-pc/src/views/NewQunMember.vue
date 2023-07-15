<template>
  <div class="">
    <div v-for="item of users" :key="item.auditId" class="user-item">
      <div class="user-info">
        <div class="avatar">
          <img :src="item.avatar" alt="" />
          <!--          <img :src="item.flagUrl" alt="" class="img-flag" />-->
        </div>
        <div class="user-name">
          <span>{{ item.nickName }}</span>
        </div>
      </div>
      <div v-if="item.status === 2" class="operate">
        <button @click="reject(item)">拒绝</button>
        <button class="chat" @click="pass(item)">通过</button>
      </div>
      <div v-else>
        <div class="operate-res">{{ item.statusName }}</div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      users: [],
    };
  },
  async mounted() {
    this.refresh();
  },
  methods: {
    onClickLeft() {
      this.$router.go(-1);
    },
    async refresh() {
      var qunId = this.$route.query.qunId;
      var promise = this.$chatApi.qunMemberApplyList(qunId);
      promise.then(
        (res) => {
          this.users = res.data.friendAudits.map((item) => {
            return {
              auditId: item.auditId,
              status: item.auditStatus,
              statusName: res.data.auditStatusDict[item.auditStatus],
              userName: item.nickName,
              avatar: item.avatar,
            };
          });
        },
        (err) => {
          console.log(err);
        }
      );
    },
    async reject(user) {
      var that = this;
      await this.$chatApi.auditQunMember(user.auditId, false).then(
        (res) => {
          this.$message("操作成功");
          that.refresh();
          console.log(res);
        },
        (err) => {
          console.log(err);
          this.$message("操作失败");
        }
      );
    },
    async pass(user) {
      var that = this;
      await this.$chatApi.auditQunMember(user.auditId, true).then(
        (res) => {
          this.$message("操作成功");
          that.refresh();
          console.log(res);
        },
        (err) => {
          console.log(err);
          this.$message("操作失败");
        }
      );
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
