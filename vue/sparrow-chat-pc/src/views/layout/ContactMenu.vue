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

    <el-dialog :visible.sync="dialogFormVisible" title="添加好友" width="50%">
      <el-form>
        <el-form-item
          :label-width="formLabelWidth"
          label="请输入Email"
          tabindex="-1"
        >
          <el-row :gutter="20">
            <el-col :span="12">
              <el-input v-model="email" autocomplete="off"></el-input>
            </el-col>
            <el-col :span="6">
              <el-button @click="searchFriend">查找</el-button>
            </el-col>
          </el-row>
        </el-form-item>

        <div v-if="user">
          <div class="wrap">
            <el-row :gutter="30">
              <el-col :span="10">
                <div class="wrap_info">
                  <img :src="user.avatar" alt="头像" class="wrap_avatar" />
                  <div class="wrap_name">{{ user.nickName }}</div>
                </div>
              </el-col>
              <el-col :span="12">
                <el-button @click="dialogFormVisible = false">取 消</el-button>
                <el-button type="primary" @click="addFriend"
                  >确认申请
                </el-button>
              </el-col>
            </el-row>
            <!-- <div class="wrap_name">{{ user.userName }}</div>
            <el-button @click="dialogFormVisible = false">取 消</el-button>
            <el-button type="primary" @click="addFriend">确认申请</el-button> -->
          </div>
        </div>
      </el-form>
    </el-dialog>
  </div>
</template>

<script>
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
      email: "",
      user: null,
      dialogFormVisible: false,
      formLabelWidth: "100px",
    };
  },
  methods: {
    async searchFriend() {
      this.user = null;
      //验证邮箱正则
      var reg = /[a-zA-Z0-9_\-\\.]+@[a-zA-Z0-9_\-\\.]+\.[a-zA-Z]{2,3}$/;
      if (!reg.test(this.email)) {
        this.$message("请输入正确的邮箱");
        this.dialogFormVisible = false;
        return;
      }

      await this.$chatApi
        .getUserByIdentify(this.email)
        .then((res) => {
          this.dialogFormVisible = true;
          this.user = res.data;
        })
        .catch((err) => {
          console.log(err);
        });
    },
    addFriend() {
      this.$chatApi
        .addFriendById(this.user.userSecretIdentify)
        .then(() => {
          this.$message("提交申请成功");
        })
        .catch((err) => {
          this.$message(err.message);
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

.wrap {
  .wrap_info {
    display: flex;
    align-items: center;
  }

  .wrap_avatar {
    margin-right: 6px;
    width: 40px;
    height: 40px;
  }
}

::v-deep .el-form-item__label {
  text-align: start;
}
</style>
