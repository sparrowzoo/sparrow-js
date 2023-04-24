<template>
    <div class="chat">
        <van-nav-bar :title="$route.query.title" left-arrow @click-left="goBack">
            <template #right v-if="$route.query.chatType == this.$protocol.CHAT_TYPE_1_2_N">
                <van-icon name="ellipsis" size="1.5rem" @click="qunDetail()"/>
            </template>
        </van-nav-bar>
        <div class="center" ref="scrollDiv">
            <div class="chat" v-for="message in this.session.messages" :key="message.id">
                <div class="time">{{ message.time }}</div>
                <div :class="message.isMe ? 'right' : 'left'">
                    <img :src="message.avatar" class="avatar"/>
                    <div class="content_wrap">
                        <div class="user_name">
                            {{ message.userName }}
                        </div>
                        <div v-if="message.isText" class="content">
                            <div v-if="message.isMe" v-longpress="() => cancel(message)">
                                {{ message.content }}
                            </div>
                            <div v-else>
                                {{ message.content }}
                            </div>
                        </div>
                        <img v-longpress="() => cancel(message)" v-else class="img" :src="message.contentImage"
                             alt="image">
                    </div>
                </div>
            </div>
        </div>
        <div class="bottom">
            <van-uploader :after-read="sendImage">
                <van-icon name="smile" size="2rem"/>
            </van-uploader>
            <van-field class="content" type="textarea" rows="1" :autosize="{ maxHeight: 80 }" v-model="content"
                       placeholder=""/>
            <van-button class="send" type="primary" size="small" @click="sendText()">发送</van-button>
        </div>
    </div>
</template>

<script>
// import { getSessionKey } from '../lib/sparrowChat'
import {Dialog, Toast} from 'vant';
import {ChatApi} from "@/api/Chat";
import {ImProtocol} from "../../../../source/scripts/ImProtocol";
// import imgCompression from '../lib/imgCompression';
export default {
    name: "ChatDialog",
    data() {
        return {
            session: {},
            content: "",
            messageList: [],
            interval: null
        };
    },
    directives: {
        longpress: {
            bind(el, binding) {
                console.log(binding)
                let timer;
                const start = () => {
                    timer = setTimeout(() => {
                        if (binding.value) {
                            binding.value()
                        }
                    }, 800);
                }
                const stop = () => {
                    if (timer) {
                        clearTimeout(timer)
                    }
                }
                el.addEventListener("touchstart", (e) => {
                    e.preventDefault()
                    stop()
                    start()
                })
                // el.addEventListener("touchmove", (e) => {
                //     stop()
                // })
                el.addEventListener("touchend", (e) => {
                    e.preventDefault()
                    stop()
                })
            }
        }
    },
    async mounted() {
        this.handleScrollBottom();
        console.log(this.$protocol.TEXT_MESSAGE);
        //如果是1对1单聊，则session key 需要组装
        var sessionKey = this.$route.query.key;
        if (this.$route.query.chatType == this.$protocol.CHAT_TYPE_1_2_1) {
            sessionKey = this.$sessionKey(this.$route.query.key, this.$getUserId())
        }
        this.session = this.$sessions[sessionKey];


        var that=this;
        this.$webSocket.onMsgCallback = function (data) {
            ImProtocol.parse(data, function (protocol) {
                var message = that.getMessageByProtocol(protocol);
                that.$sessions[protocol.sessionKey].messages.push(message);
                console.log("parse protocol:" + protocol);
            });
        };

        this.read();
    },
    beforeDestroy() {
        Toast.success("beforeDestroy");
    },
    computed: {},
    methods: {
        qunDetail() {
            this.$router.push({name: 'qun-detail', query: {key: this.$route.query.key}})
        },
        getMessageByProtocol(protocol){
            var sender = this.$userMap[protocol.fromUserId];
            return  {
                id: protocol.id,
                fromUserId: protocol.fromUserId,
                clientSendTime: protocol.clientSendTime,
                serverTime: protocol.serverTime,
                messageType: protocol.messageType,
                content: protocol.content,
                contentImage: protocol.contentImage,
                isMe: protocol.fromUserId === this.$getUserId(),
                userName: sender.userName,
                avatar: sender.avatar,
                time: new Date(protocol.serverTime).format("MM/dd hh:mm:ss"),
                isText: protocol.messageType=== this.$protocol.TEXT_MESSAGE
            };

        },
        async cancel(item) {
            if (item.fromUserId !== this.userId) {
                return
            }
            Dialog.confirm({
                title: '消息撤回',
                message: '请确认是否撤销消息',
            })
                .then(() => {
                    console.log("cancel", item)
                    const param = {
                        fromUserId: item.fromUserId,
                        clientSendTime: item.clientSendTime,
                        sessionKey: this.session.key,
                        chatType: this.session.chatType,
                    }
                    this.cancelMessage(param);
                })
                .catch(() => {
                    // on cancel
                });
        },
        read() {
            ChatApi.setRead(this.session.sessionKey)
        },
        // 滚动到底部
        handleScrollBottom() {
            this.$nextTick(() => {
                let scrollElem = this.$refs.scrollDiv;
                if (scrollElem)
                    scrollElem.scrollTo({top: scrollElem.scrollHeight + 100});
            });
        },
        goBack() {
            this.$router.go(-1)
        },
        async sendImage(file) {
            const fileReader = new FileReader();
            var img = new Image();
            img.src = window.URL.createObjectURL(file);
            fileReader.onload = function () {
                const result = fileReader.result;
                console.log(result);
                var content = new Uint8Array(result)
                var time = new Date().getTime();
                //如果是1对1聊天，则传过来的key=对方用户ID
                var data = new this.$protocol(this.$route.query.chatType, this.$protocol.IMAGE_MESSAGE, this.$getUserId(), this.$route.query.key, content, time);
                this.$webSocket.sendMessage(data);
            }
            fileReader.readAsArrayBuffer(file);
            this.handleScrollBottom()
        },
        sendText() {
            if (!this.content) {
                Toast.fail("嘿！你还没有输入内容哦！");
                return
            }
            var time = new Date().getTime();
            //如果是1对1聊天，则传过来的key=对方用户ID
            var data = new ImProtocol(this.$route.query.chatType, ImProtocol.TEXT_MESSAGE, this.$getUserId(), this.$route.query.key, this.content, time);
            this.$webSocket.sendMessage(data);
            this.content = ''
            this.handleScrollBottom()
        },
    }
}
</script>

<style scoped>
.chat {
    height: 100%;
    display: flex;
    flex-direction: column;
}

.center {
    /*flex: 1 0 0;*/
    background-color: #eee;
    padding: 0 1rem 1rem;
    overflow-y: scroll;
    height: 100%;
}


.avatar {
    width: 3rem;
    height: 3rem;
    background: #f2f3f5;
    border-radius: 4px;
    display: block;
}


.time {
    text-align: center;
    color: #555;
    margin-top: 0.5rem;
}


.right {
    flex-direction: row-reverse;
    display: flex;
    margin-top: 0.5rem;
}


.left {
    flex-direction: row;
    display: flex;
    margin-top: 0.5rem;
}

.content_wrap {
    flex: 1 0 0;
    width: 0;
}

.right .content_wrap {
    margin-right: 1rem;
    text-align: right;
}

.left .content_wrap {
    margin-left: 1rem;
}

.right .user_name {
    text-align: right;
    margin-bottom: 0.1rem;
}

.content div {
    background-color: white;
    padding: 0.5rem 1rem;
    border-radius: 4px;
    white-space: pre-wrap;
    word-break: break-all;
}

.right .content {
    flex-direction: row-reverse;
    flex: 1 0 0;
}

.left .content {
    flex-direction: row;
    flex: 1 0 0;
}

.img {
    max-width: 10rem;
    max-height: 10rem;
    /* margin-left: 1rem; */
    /* margin-right: 1rem; */
}

.bottom {
    display: flex;
    align-items: center;
    padding: 1rem;
}


.send {
    width: 3rem;
}
</style>
