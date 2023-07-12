<template>
    <div class="me" >
        <van-form @submit="me">
            <div style="margin: 16px;">
                <van-button round block type="info" native-type="submit">这里是我的内容</van-button>
            </div>
        </van-form>
    </div>
</template>

<script>
// import { mapActions, mapMutations } from 'vuex';
export default {
    name: "ChatMe",
    data() {
        return {
        };
    },
    methods: {
        // ...mapActions(["logout"]),
        out() {
            this.logout();
            this.$router.replace({ name: 'login' })
        },
        me() {
            this.$dialog.alert({
                title: "我的",
                message: '我的内容'
            })
        }
    }
}
</script>

<style scoped>
.me {}
</style>
