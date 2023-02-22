<template>
    <div class="me">
        <van-form @submit="out">
            <div style="margin: 16px;">
                <van-button round block type="info" native-type="submit">退出登录</van-button>
            </div>
        </van-form>
    </div>
</template>

<script>
import { mapActions, mapMutations } from 'vuex';
export default {
    data() {
        return {
        };
    },
    methods: {
        ...mapActions(["logout"]),
        out() {
            this.logout();
            this.$router.replace({ name: 'login' })
        }
    }
}
</script>

<style scoped>
.me {}
</style>
