<template>
  <div class="login">
    <el-form ref="form" :model="login" label-width="80px">
      <el-form-item label="手机号" prop="phone">
        <el-input v-model="login.phone"></el-input>
      </el-form-item>
      <el-form-item label="密码" prop="password">
        <el-input v-model="login.password"></el-input>
      </el-form-item>
      <el-form-item label="验证码" prop="code">
        <el-input v-model="login.code"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="onSubmit">登录</el-button>
        <el-button @click="cancel">取消</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import { ChatApi } from "../../../api/Chat";

export default {
  data() {
    return {
      login: {
        phone: "",
        password: "",
        code: "",
      },
    };
  },
  methods: {
    onSubmit() {
      if (
        this.login.phone === "" ||
        this.login.password === "" ||
        this.login.code === ""
      ) {
        this.$message("请填写完整信息");
        return;
      }
      ChatApi.login(
        this.login.code,
        this.login.phone,
        this.login.password
      ).then(
        async (res) => {
          if (res.code === 200) {
            console.log(res.data.token);
            console.log(res.data.memberInfo.id);
            localStorage.setItem("userId", res.data.memberInfo.id);
            localStorage.setItem("token", res.data.token); // memberInfo
            this.$message("登录成功");
            await this.$init();
            // 这里先发送登录请求 获取到 当前用户的信息 然后跳转 路由
            await this.$router.push("/contact");
          } else {
            this.$message("登录失败-" + res.msg);
          }
        },
        (err) => {
          console.log("error:" + err);
        }
      );
    },
    cancel() {
      console.log("cancel");
      this.$refs.form.resetFields();
    },
  },
};
</script>

<style lang="less" scoped>
.login {
  background-color: #eee;
  padding: 20px;
}
</style>
