<template>
  <div class="">
    <!-- 头部 -->
    <div class="top-part">
      <div v-for="item of menuList" :key="item.id" class="select-item">
        <i :class="item.iconName" class="iconfont"></i>
        <span @click="switchContent(item)">{{ item.title }}</span>
      </div>
    </div>
    <!-- 主体展示的内容 -->
    <div class="content">
      <router-view></router-view>
    </div>

    <el-dialog :visible.sync="dialogFormVisible" title="添加好友">
      <el-form>
        <el-form-item
          :label-width="formLabelWidth"
          label="请输入手机号"
          tabindex="-1"
        >
          <el-input v-model="phone" autocomplete="off"></el-input>
          <el-button @click="searchFriend">查找</el-button>
        </el-form-item>

        <div v-if="user">
          <div class="wrap">
            <div class="wrap_name">{{ user.userName }}</div>
            <el-button @click="dialogFormVisible = false">取 消</el-button>
            <el-button type="primary" @click="addFriend">确认申请</el-button>
            <!--            <van-button size="small" type="primary" @click="sendAddFriend()">确认申请</van-button>-->
          </div>
        </div>
      </el-form>
    </el-dialog>
  </div>
</template>

<script>
import { ChatApi } from "../../../../api/Chat";

export default {
  data() {
    return {
      menuList: [
        {
          id: 1,
          title: "添加朋友",
          iconName: "icon-add-user",
          pathName: "add-friend",
        },
        {
          id: 2,
          title: "新的朋友",
          iconName: "icon-user",
          pathName: "new-friend",
        },
        {
          id: 3,
          title: "我的群聊",
          iconName: "icon-qun",
          pathName: "qun",
        },
      ],
      phone: "",
      user: null,
      dialogFormVisible: false,
      formLabelWidth: "120px",
    };
  },
  methods: {
    async searchFriend() {
      this.user = null;
      if (this.phone.length !== 11) {
        this.$message("请输入正确的手机号");
        return;
      }
      //正则验证手机号码
      var reg = /^1[3|4|5|7|8][0-9]{9}$/;
      if (!reg.test(this.phone)) {
        this.$message("请输入正确的手机号");
        this.dialogFormVisible = false;
        return;
      }

      await ChatApi.getUserByPhone(this.phone)
        .then((res) => {
          if (res.code != 200) {
            this.$message(res.msg);
            this.dialogFormVisible = true;
          }
          console.log(res);
          if (res.data.userId != this.$getUserId()) {
            this.user = res.data;
          } else {
            this.$message("不能向自己发出申请");
            this.dialogFormVisible = true;
          }
        })
        .catch((err) => {
          console.log(err);
        });
    },
    addFriend() {
      ChatApi.addFriendById(this.user.userId)
        .then((res) => {
          if (res.code === 200) {
            this.$message("提交申请成功");
          } else {
            this.$message(res.msg);
          }
        })
        .catch((err) => {
          console.log(err);
        });
    },
    switchContent(item) {
      if (item.id === 1) {
        this.dialogFormVisible = true;
        return;
      }
      this.$router.push({ name: item.pathName });
    },
  },
};
</script>

<style lang="less" scoped>
.top-part {
  background-color: @theme-color;
  display: flex;
  padding: 18px 0;
  border-bottom: 8px solid #fff;
}

.select-item {
  flex: 1;
  text-align: center;
  cursor: pointer;

  .iconfont {
    vertical-align: text-top;
    font-size: 24px;
  }

  &:nth-child(2) {
    border-left: 1px solid #999;
    border-right: 1px solid #999;
  }
}

.content {
  position: relative;
  height: 570px;
  padding: 0 60px;
  background-color: @theme-color;
  overflow: auto;
  // 隐藏滚动条
  scrollbar-width: none; /* Firefox */
  -ms-overflow-style: none; /* IE 10+ */

  &::-webkit-scrollbar {
    display: none; /* Chrome Safari */
  }
}
</style>
