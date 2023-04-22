<template>
    <div class="login">
        <van-form @submit="onSubmit">
            <van-field v-model="phone" name="用户名" autocomplete="off" label="用户名" placeholder="请输入手机号" />
            <van-field v-model="code" name="验证码" autocomplete="off" label="验证码" placeholder="请输入验证码" />
            <div style="margin: 16px;">
                <van-button round block type="info" native-type="submit">登录</van-button>
            </div>
        </van-form>
    </div>
</template>

<script>
import { login, getContacts, getSession, getSystemInfos } from '../request'
import { mapActions, mapMutations } from 'vuex';
export default {

    data() {
        return {
            phone: "",
            code: "",
        };
    },
    methods: {
        ...mapMutations(["setUserId", "setToken", "setSessions", "setContacts", "initWs", "setSystemInfos"]),
        ...mapActions(['initWs']),
        async onSubmit() {
            let res = await login({
                code: this.code,
                mobile: this.phone,
                password: "123456"
            })
            console.log(res)
            this.setUserId(res.memberInfo.id)
            this.setToken(res.token)
            const contacts = await getContacts(res.memberInfo.id)
            this.setContacts(contacts)
            const sessions = await getSession(res.memberInfo.id)
            this.setSessions(sessions)
            // 系统消息
            const systemInfos = await getSystemInfos()
            this.setSystemInfos(systemInfos)
            // res = await this.$http.get(`/app/message/systemInform`)
            // console.log(res)
            // 好友列表
            // res = await this.$http.get(`/app/message/myFriend`)
            // console.log(res)
            this.initWs()
            this.$router.replace({ name: 'chat' })
        }
    }
}
</script>

<style scoped>
.login {}
</style>
