<template>
    <div class="ajax">
        <van-nav-bar title="AJAX 接口请求" left-arrow @click-left="onClickLeft"></van-nav-bar>
        <van-button @click="exportTest">Export Test</van-button>
        <van-button @click="awaitTest">Await Test</van-button>
        <van-button @click="indexedDBTest">indexedDBTest</van-button>
        <van-button @click="addContact">addContact</van-button>
        <van-button @click="login">login</van-button>
        <van-button @click="getUserById">getUserById</van-button>
        <van-button @click="getUserByMobile">getUserByMobile</van-button>


    </div>
</template>

<script>
// import { login, getContacts, getSession, getSystemInfos } from '../request'

// import { searchUser, addFriend } from '../request'
// import { mapState } from 'vuex'
import { Toast } from 'vant';
import { HttpApiDemo} from '@/lib/HttpApiDemo.js';
import { ChatApi} from '@/api/Chat.js';
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

        login() {
            ChatApi.login("8888","13581579282","123456").then(res => {
                console.log(res.data.token);
                localStorage.setItem('token', res.data.token); // memberInfo
            }, err => {
                console.log("error:"+err);
            })
        },
        getUserById() {
            ChatApi.getUserById(7).then(res => {
                console.log(res);
            }, err => {
                console.log("error:"+err);
            })
        },
        getUserByMobile() {
            ChatApi.getUserByPhone(13581579282).then(res => {
                console.log(res);
            }, err => {
                console.log("error:"+err);
            })
        },

        exportTest() {
            alert(HttpApiDemo);
            HttpApiDemo.change();
        },

        awaitTest() {
            HttpApiDemo.awaitTest();
        },
        indexedDBTest() {
            HttpApiDemo.indexedDBTest();
        },
        addContact() {
            HttpApiDemo.addContact();
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
