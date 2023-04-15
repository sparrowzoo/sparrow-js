
<template>
    <H1>A</H1>
</template>

<script>
//import { login, getContacts, getSession, getSystemInfos } from '../request'
//import { mapActions, mapMutations } from 'vuex';
export default {
    name: "ChatLoginA",
    //除了APP.vue外，其他组件都需要加上name属性[copilot 提示不严谨，有误导]
    data() {
        return {
            phone: "",
            code: "",
        };
    },
    methods: {
        // ...mapMutations(["setUserId", "setToken", "setSessions", "setContacts", "initWs", "setSystemInfos"]),
        // ...mapActions(['initWs']),
        // async onSubmit() {
        //     let res = await login({
        //         code: this.code,
        //         mobile: this.phone,
        //         password: "123456"
        //     })
        //     console.log(res)
        //     this.setUserId(res.memberInfo.id)
        //     this.setToken(res.token)
        //     const contacts = await getContacts(res.memberInfo.id)
        //     this.setContacts(contacts)
        //     const sessions = await getSession(res.memberInfo.id)
        //     this.setSessions(sessions)
        //     // 系统消息
        //     const systemInfos = await getSystemInfos()
        //     this.setSystemInfos(systemInfos)
        //     // res = await this.$http.get(`/app/message/systemInform`)
        //     // console.log(res)
        //     // 好友列表
        //     // res = await this.$http.get(`/app/message/myFriend`)
        //     // console.log(res)
        //     this.initWs()
        //     this.$router.replace({ name: 'chat' })
        // }
    }
}
</script>

<style scoped>
.login {}
</style>
