<template>
    <div class="myQunDetail">
        <van-nav-bar :title="qun ? qun.qunName : ''" left-arrow @click-left="onClickLeft">
        </van-nav-bar>

    </div>
</template>

<script>

// import groupImage from "../assets/group.png";
// import addImage from "../assets/add.png";
// import newFriendImage from "../assets/newFriend.png";
// import { getSessionKey } from '../lib/sparrowChat'
// import { mapGetters, mapActions, mapState } from 'vuex'
export default {
    name: "QunDetail",
    data() {
        return {
            session: null,
            qun: null
        };
    },
    methods: {
        onClickLeft() {
            this.$router.go(-1)
        },

    },
    mounted() {
        //this.session = this.getSessionById(this.$route.query.id);
        //this.qun = this.getQunById(this.$route.query.id);
    },
    computed: {
        // ...mapState(['contacts', 'sessions', "userId"]),
        // ...mapGetters(['getSessionById', "getQunById"]),
        viewList() {
            return [{
                id: 1,
                target: 2,
                type: 1,
                title: "群名1",
                lastMessageTime: 1,
                time: 1,
                content: "最后回复内容",
                count: "未读数",
                headUrl: "url"
            }, {
                id: 2,
                target: 3,
                type: 2,
                title: "title2",
                lastMessageTime: 1,
                time: 1,
                content: "content",
                count: 1,
                headUrl: "url"
            }]
        }
    }
}
</script>

<style scoped>
.myQunDetail {}
</style>
