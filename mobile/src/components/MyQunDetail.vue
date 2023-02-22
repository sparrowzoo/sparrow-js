<template>
    <div class="myQunDetail">
        <van-nav-bar :title="qun ? qun.qunName : ''" left-arrow @click-left="onClickLeft">
        </van-nav-bar>

    </div>
</template>

<script>

import groupImage from "../assets/group.png";
import addImage from "../assets/add.png";
import newFriendImage from "../assets/newFriend.png";
import { getSessionKey } from '../lib/sparrowChat'
import { mapGetters, mapActions, mapState } from 'vuex'
export default {
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
        this.session = this.getSessionById(this.$route.query.id);
        this.qun = this.getQunById(this.$route.query.id);
    },
    computed: {
        ...mapState(['contacts', 'sessions', "userId"]),
        ...mapGetters(['getSessionById', "getQunById"]),

    }
}
</script>

<style scoped>
.myQunDetail {}
</style>
