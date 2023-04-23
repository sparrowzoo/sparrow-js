<template>
    <div class="ajax">
        <van-nav-bar title="AJAX 接口请求" left-arrow @click-left="onClickLeft"></van-nav-bar>
        <van-button @click="exportTest">Export Test</van-button>
        <van-button @click="awaitTest">Await Test</van-button>
        <van-button @click="awaitTestMultiWaiter2">awaitTestMultiWaiter2</van-button>

        <van-button @click="indexedDBTest">indexedDBTest</van-button>
        <van-button @click="addContact">addContact</van-button>
        <van-button @click="login">login</van-button>
        <van-button @click="getUserById">getUserById</van-button>
        <van-button @click="connect">连接websocket</van-button>

        <van-button @click="getUserByMobile">getUserByMobile</van-button>
        <van-button @click="send1To1TextMessageBytes(7,'msg')">send1To1TextMessageBytes</van-button>
    </div>
</template>

<script>
// import { login, getContacts, getSession, getSystemInfos } from '../request'

// import { searchUser, addFriend } from '../request'
// import { mapState } from 'vuex'
import {Toast} from 'vant';
import {HttpApiDemo} from '@/lib/HttpApiDemo.js';
import {ChatApi} from '@/api/Chat.js';
import {ImProtocol} from "../../../../source/scripts/ImProtocol";
import {ImWebSocket} from "../../../../source/scripts/websocket";

export default {
    name: "AjaxDemo",
    data() {
        return {
            phone: "",
            user: null,
            websocket: null
        };
    },
    computed: {},
    mounted() {
        this.userId = localStorage.getItem("userId");
        this.websocket = new ImWebSocket('ws://chat.sparrowzoo.com/websocket', localStorage.getItem('token'));
        this.websocket.onMsgCallback = function (data) {
            ImProtocol.parse(data, function (protocol) {
                console.log("parse protocol:" + protocol);
            });
        };
        this.websocket.reconnectionAlarmCallback = function () {
            console.log("reconnection AlarmCallback");
        };
    },
    methods: {
        send1To1TextMessageBytes: function (targetUserId, msg) {
            var time = new Date().getTime();
            //当前用户id，不需要传，服务端会自动获取
            var data = new ImProtocol(ImProtocol.CHAT_TYPE_1_2_1, ImProtocol.TEXT_MESSAGE, this.userId, targetUserId, msg, time);
            this.websocket.sendMessage(data);
        },
        connect: function () {
            this.websocket.connect();
        },
        get1ToNTextMessageBytes: function (sessionKey, msg) {
            var time = new Date().getTime();
            var data = new ImProtocol(ImProtocol.CHAT_TYPE_1_2_N, ImProtocol.TEXT_MESSAGE, 0, sessionKey, msg, time).toBytes();
            this.websocket.sendMessage(data);
        },
        onClickLeft() {
            this.$router.go(-1)
        },
        login() {
            ChatApi.login("8888", "13581579282", "123456").then(res => {
                console.log(res.data.token);
                console.log(res.data.memberInfo.id);
                localStorage.setItem("userId", res.data.memberInfo.id);
                localStorage.setItem('token', res.data.token); // memberInfo
            }, err => {
                console.log("error:" + err);
            })
        },
        getUserById() {
            ChatApi.getUserById(7).then(res => {
                console.log(res);
            }, err => {
                console.log("error:" + err);
            })
        },
        getUserByMobile() {
            ChatApi.getUserByPhone(13581579282).then(res => {
                console.log(res);
            }, err => {
                console.log("error:" + err);
            })
        },

        exportTest() {
            alert(HttpApiDemo);
            HttpApiDemo.change();
        },
        awaitTestMultiWaiter2() {
            HttpApiDemo.awaitTestMultiWaiter2();
        },
        awaitTest() {
            //HttpApiDemo.awaitTest();
            HttpApiDemo.awaitTestMultiWaiter();
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
.ajax {
}

.wrap {
    display: flex;
    align-items: center;
    padding: 1rem;
}

.wrap_name {
    flex: 1 0 0;
}
</style>
