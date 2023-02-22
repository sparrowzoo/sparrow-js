<template>
    <div class="newFriend">
        <van-nav-bar title="新的朋友" left-arrow @click-left="onClickLeft"></van-nav-bar>
        <div>
            <div class="wrap" v-for="user in users">
                <div class="wrap_name">id为{{ user.applyUserId }}的用户申请</div>
                <span class="gray" v-if="user.status !== 0">{{ user.status === 1 ? "已通过" : "已驳回" }}</span>
                <van-button class="reject" type="default" size="small" v-if="user.status === 0"
                    @click="reject(user)">拒绝</van-button>
                <van-button type="primary" size="small" @click="resolve(user)" v-if="user.status === 0">通过</van-button>
            </div>
        </div>
    </div>
</template>

<script>
import { newFriend, auditFriend } from '../request'
import { mapState } from 'vuex'
import { Toast } from 'vant';
export default {
    data() {
        return {
            phone: "",
            users: []
        };
    },
    computed: {
        ...mapState(['userId']),
    },
    async mounted() {
        this.fresh()
    },
    methods: {
        onClickLeft() {
            this.$router.go(-1)
        },
        async fresh() {
            this.users = await newFriend()
        },
        async reject(user) {
            await auditFriend(user.id, 2)
            Toast.success("操作成功")
            this.fresh()
        },
        async resolve(user) {
            await auditFriend(user.id, 1)
            Toast.success("操作成功")
            this.fresh()
        }

    }
}
</script>

<style scoped>
.newFriend {}

.wrap {
    display: flex;
    align-items: center;
    padding: 1rem;
}

.wrap_name {
    flex: 1 0 0;
}

.gray {
    color: #999;
}

.reject {
    margin-right: 0.5rem;
}
</style>
