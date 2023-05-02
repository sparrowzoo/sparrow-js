<template>
  <div class="login">
    <el-form ref="form" :model="form" label-width="80px">
      <el-form-item label="手机号" prop="phone">
        <el-input v-model="form.phone"></el-input>
      </el-form-item>
      <el-form-item label="密码" prop="password">
        <el-input v-model="form.password"></el-input>
      </el-form-item>
      <el-form-item label="验证码" prop="code">
        <el-input v-model="form.code"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="onSubmit">登录</el-button>
        <el-button @click="cancel">取消</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
export default {
  data() {
    return {
      form: {
        phone: "",
        password: "",
        code: "",
      },
    };
  },
  methods: {
    onSubmit() {
      console.log("提交");
      // 这里先发送登录请求 获取到 当前用户的信息 然后跳转 路由
      this.$router.push("/main");
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
