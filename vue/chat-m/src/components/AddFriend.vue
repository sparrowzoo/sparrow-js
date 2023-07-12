<template>
  <div class="addFriend">
    <van-nav-bar
      left-arrow
      title="添加好友"
      @click-left="onClickLeft"
    ></van-nav-bar>
    <van-search v-model="phone" placeholder="请输入手机号" @search="onSearch" />
    <div v-if="user">
      <div class="wrap">
        <div class="wrap_name">{{ user.userName }}</div>
        <van-button size="small" type="primary" @click="sendAddFriend()"
          >确认申请</van-button
        >
      </div>
    </div>
  </div>
</template>

<script>
import { ChatApi } from "../../../api/Chat";
import { Toast } from "vant";

export default {
  data() {
    return {
      phone: "",
      user: null,
    };
  },
  methods: {
    onClickLeft() {
      this.$router.go(-1);
    },
    async sendAddFriend() {
      ChatApi.addFriendById(this.user.userId)
        .then((res) => {
          if (res.code === 200) {
            Toast.success("提交申请成功");
          } else {
            Toast.fail(res.msg);
          }
        })
        .catch((err) => {
          console.log(err);
        });
    },
    async onSearch() {
      this.user = null;
      if (this.phone.length !== 11) {
        Toast.fail("请输入正确的手机号");
        return;
      }
      //正则验证手机号码
      var reg = /^1[3|4|5|7|8][0-9]{9}$/;
      if (!reg.test(this.phone)) {
        Toast.fail("请输入正确的手机号");
        return;
      }

      ChatApi.getUserByPhone(this.phone)
        .then((res) => {
          console.log(res);
          if (res.data.userId != this.$getUserId()) {
            this.user = res.data;
          } else {
            Toast.fail("不能向自己发出申请");
          }
        })
        .catch((err) => {
          console.log(err);
        });
    },
  },
};
</script>

<style scoped>
.addFriend {
}

.wrap {
  display: flex;
  align-items: center;
  padding: 1rem;
}

.wrap_name {
  flex: 1 0 0;
}
</style>
