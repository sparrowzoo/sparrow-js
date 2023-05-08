<template>
    <div class="newFriend">
        <van-nav-bar left-arrow left-text="left-text" title="新的朋友" @click-left="onClickLeft"></van-nav-bar>
        <div>
            <div v-for="user in userWithFullNames" :key="user.userId" class="wrap">
                <div class="wrap_name">id为{{ user.fullName }}的用户申请</div>
                <span v-if="user.status !== 0" class="gray">{{ user.status === 1 ? "已通过" : "已驳回" }}</span>
                <van-button v-if="user.status === 0" class="reject" size="small" type="default"
                            @click="reject(user)">拒绝
                </van-button>
                <van-button v-if="user.status === 0" size="small" type="primary" @click="pass(user)">通过
                </van-button>
            </div>
        </div>
    </div>
</template>

<script>
// import { newFriend, auditFriend } from '../request'
// import { mapState } from 'vuex'
import {Toast} from 'vant';
// import {re} from "@babel/core/lib/vendor/import-meta-resolve";

export default {
    name: "ChatNewFriend",
    data() {
        return {
            phone: "",
            users: []
        };
    },
    watch: {
        //监听users
        users: function (newVal, oldVal) {
            //将user 对象json 化
            let userJson = JSON.stringify(newVal)
            //oldVal 为旧的值
            console.log('newVal: ', newVal, 'oldVal: ', oldVal);
            Toast(userJson);
        }
    },
    computed: {
        //计算属性
        userWithFullNames() {
            return this.users.map(user => {
                return {
                    ...user,
                    fullName: user.userId + ' ' + user.userName
                }
            })
        }
    },
    async mounted() {
        this.fresh()
    },
    methods: {
        onClickLeft() {
            this.$router.go(-1)
        },
        async fresh() {
            this.users = [{userId: 1, status: 0, userName: "zhangsan"}, {
                userId: 2,
                status: 1,
                userName: "lisi"
            }, {userId: 3, status: 2, userName: "wangwu"}]
        },
        async reject(user) {

            // await auditFriend(user.id, 2)
            //将user 对象json 化
            let userJson = JSON.stringify(user)
            Toast.success("操作成功")
            this.fresh()
        },
        async pass(user) {
            // await auditFriend(user.id, 1)
            // Toast.success("操作成功")
            let userJson = JSON.stringify(user)
            this.fresh()
        }
    }
}
</script>

<style scoped>
.newFriend {
}

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
