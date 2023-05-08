<template>
    <div class="login" @submit="login">
        <van-form>
            <van-field v-model="phone" autocomplete="off" label="用户名" name="用户名" placeholder="请输入手机号"/>
            <van-field v-model="password" autocomplete="off" label="密码" name="密码" placeholder="请输入密码"/>
            <van-field v-model="code" autocomplete="off" label="验证码" name="验证码" placeholder="请输入验证码"/>
            <div style="margin: 16px;">
                <van-button block native-type="submit" round type="info">登录</van-button>
            </div>
        </van-form>
    </div>
</template>

<script>
// import {ChatApi} from "@/api/Chat";
import router from "@/route";
import {Toast} from "vant";
import {ChatApi} from "@/api/Chat";

export default {
    name: "ChatLogin",
    //除了APP.vue外，其他组件都需要加上name属性[copilot 提示不严谨，有误导]
    data() {
        return {
            phone: "",
            code: "",
            password: "",
        };
    },
    methods: {
        login() {

            Toast.success("登录成功");
            ChatApi.login(this.code, this.phone, this.password).then(res => {
                console.log(res.data.token);
                console.log(res.data.memberInfo.id);
                localStorage.setItem("userId", res.data.memberInfo.id);
                localStorage.setItem('token', res.data.token); // memberInfo
                Toast.success("登录成功");
                this.$init();
                router.push("/contact");
            }, err => {
                console.log("error:" + err);
            })
        },
    }
}
</script>

<style scoped>
.login {
}
</style>
