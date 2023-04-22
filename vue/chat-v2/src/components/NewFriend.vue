<template>
    <div class="apply_friend_list">
        <van-nav-bar title="新的朋友" left-text="left-text" left-arrow @click-left="onClickLeft"></van-nav-bar>
        <div>
            <div class="friend_container" v-for="user in users" :key="user.userId">
                <div class="friend_name">{{ user.userName }}添加您为好友</div>
                <!--好友状态-->
                <span class="status" v-if="user.status !== 0">{{ user.status === 1 ? "已通过" : "已驳回" }}</span>
                <van-button class="reject" type="default" size="small" v-if="user.status === 0"
                            @click="reject(user)">拒绝
                </van-button>
                <van-button type="primary" size="small" @click="pass(user)" v-if="user.status === 0">通过
                </van-button>
            </div>
        </div>
    </div>
</template>

<script>
import {Toast} from 'vant';
import {ChatApi} from "@/api/Chat";

export default {
    name: "ChatApplyFriendList",
    data() {
        return {
            phone: "",
            users: []
        };
    },
    watch: {
        //监听users
        // users: function (newVal, oldVal) {
        // 	//将user 对象json 化
        // 	let userJson = JSON.stringify(newVal)
        // 	//oldVal 为旧的值
        // 	console.log('newVal: ', newVal, 'oldVal: ', oldVal);
        // 	Toast(userJson);
        // }
    },
    computed: {},
    async mounted() {
        this.fresh()
    },
    methods: {
        onClickLeft() {
            this.$router.go(-1)
        },
        async fresh() {
            var userId = localStorage.getItem("userId");
            var promise = ChatApi.newFriendList(userId);
            promise.then(res => {
                this.users = res.data.map(item => {
                    return {
                        userId: item.vo.userId,
                        status: item.status,
                        userName: item.vo.userName
                    }
                });
            }, err => {
                console.log(err);
            });
        },
        async reject(user) {

            // await auditFriend(user.id, 2)
            //将user 对象json 化
            let userJson = JSON.stringify(user)
            Toast.success(userJson)
            Toast.success("操作成功")
            this.fresh()
        },
        async pass(user) {
            // await auditFriend(user.id, 1)
            // Toast.success("操作成功")
            let userJson = JSON.stringify(user)
            Toast.success(userJson)
            this.fresh()
        }
    }
}
</script>

<style scoped>
.apply_friend_list {
}

.friend_container {
    display: flex;
    align-items: center;
    padding: 1rem;
}

.friend_name {
    flex: 1 0 0;
}

.status {
    color: #999;
}

.reject {
    margin-right: 0.5rem;
}
</style>
