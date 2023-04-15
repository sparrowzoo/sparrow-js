<template>
    <div class="ajax">
        <van-nav-bar title="AJAX 接口请求" left-arrow @click-left="onClickLeft"></van-nav-bar>
        <van-button @click="exportTest">Export Test</van-button>
    </div>
</template>

<script>
// import { login, getContacts, getSession, getSystemInfos } from '../request'

// import { searchUser, addFriend } from '../request'
// import { mapState } from 'vuex'
import { Toast } from 'vant';
import { ExportDemo} from '../lib/ExportDemo.js';
export default {
    name: "AjaxDemo",
    data() {
        return {
            phone: "",
            user: null
        };
    },
    computed: {
        // ...mapState(['userId']),
    },
    methods: {
        onClickLeft() {
            this.$router.go(-1)
        },
        exportTest() {
            alert(ExportDemo);
            ExportDemo.change();
        },
        async sendAddFriend(user) {
            console.log(user);
            // await addFriend(user.id)
            Toast.success("提交申请成功")
        }
    }
}
</script>
<style scoped>
.ajax {}

.wrap {
    display: flex;
    align-items: center;
    padding: 1rem;
}

.wrap_name {
    flex: 1 0 0;
}
</style>
