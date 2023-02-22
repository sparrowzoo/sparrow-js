<template>
    <div class="addFriend">
        <van-nav-bar title="添加好友" left-arrow @click-left="onClickLeft"></van-nav-bar>
        <van-search v-model="phone" placeholder="请输入手机号" @search="onSearch" />
        <div v-if="user">
            <div class="wrap">
                <div class="wrap_name">{{ user.name || user.mobile }}</div>
                <van-button type="primary" size="small" @click="sendAddFriend(user)">确认申请</van-button>
            </div>
        </div>
    </div>
</template>

<script>
import { searchUser, addFriend } from '../request'
import { mapState } from 'vuex'
import { Toast } from 'vant';
export default {
    data() {
        return {
            phone: "",
            user: null
        };
    },
    computed: {
        ...mapState(['userId']),
    },
    methods: {
        onClickLeft() {
            this.$router.go(-1)
        },
        async sendAddFriend(user) {
            await addFriend(user.id)
            Toast.success("提交申请成功")
        },
        async onSearch() {
            this.user = null
            if (this.phone) {
                let user = await searchUser(this.phone)
                console.log(user)
                if (user.id !== this.userId) {
                    this.user = user
                } else {
                    Toast.fail("不能向自己发出申请");
                }
            }
        }
    }
}
</script>

<style scoped>
.addFriend {}

.wrap {
    display: flex;
    align-items: center;
    padding: 1rem;
}

.wrap_name {
    flex: 1 0 0;
}
</style>
