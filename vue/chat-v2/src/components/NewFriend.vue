<template>
  <div class="apply_friend_list">
    <van-nav-bar
      left-arrow
      left-text="返回"
      title="新的朋友"
      @click-left="onClickLeft"
    ></van-nav-bar>
    <div>
      <div v-for="user in users" :key="user.id" class="friend_container">
        <div class="friend_name">{{ user.userName }}添加您为好友</div>
        <!--好友状态-->
        <span v-if="user.status !== 0" class="status">{{
          user.status === 1 ? "已通过" : "已驳回"
        }}</span>
        <van-button
          v-if="user.status === 0"
          class="reject"
          size="small"
          type="default"
          @click="reject(user)"
          >拒绝
        </van-button>
        <van-button
          v-if="user.status === 0"
          size="small"
          type="primary"
          @click="pass(user)"
          >通过
        </van-button>
      </div>
    </div>
  </div>
</template>

<script>
import { Toast } from "vant";
import { ChatApi } from "../../../api/Chat";

export default {
  name: "ChatApplyFriendList",
  data() {
    return {
      phone: "",
      users: [],
    };
  },
  watch: {},
  computed: {},
  async mounted() {
    this.refresh();
  },
  methods: {
    onClickLeft() {
      this.$router.go(-1);
    },
    async refresh() {
      var promise = ChatApi.newFriendList();
      promise.then(
        (res) => {
          this.users = res.data.map((item) => {
            return {
              id: item.id,
              userId: item.vo.userId,
              status: item.status,
              userName: item.vo.userName,
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
      await ChatApi.auditFriend(user.id, 2).then(
        (res) => {
          Toast.success("操作成功");
          that.refresh();
          console.log(res);
        },
        (err) => {
          console.log(err);
          Toast.fail("操作失败");
        }
      );
    },
    async pass(user) {
      var that = this;
      await ChatApi.auditFriend(user.id, 1).then(
        (res) => {
          Toast.success("操作成功");
          that.refresh();
          console.log(res);
        },
        (err) => {
          console.log(err);
          Toast.fail("操作失败");
        }
      );
    },
  },
};
</script>

<style scoped>
.apply_friend_list {
}

.friend_container {
  display: flex;
  align-items: center;
  padding: 1rem;
}

.friend_name {
  flex: 1 0 0;
}

.status {
  color: #999;
}

.reject {
  margin-right: 0.5rem;
}
</style>
