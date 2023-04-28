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
                        <img v-longpress="() => cancel(message)" v-else class="img" :src="message.imgUrl"/>
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
        var chatType=parseInt(this.$route.query.chatType,10);
        if (chatType=== this.$protocol.CHAT_TYPE_1_2_1) {
            sessionKey = this.$sessionKey(this.$route.query.key, this.$getUserId())
        }
        this.session = this.$sessions[sessionKey];
        if (!this.session) {

            var icon = chatType=== this.$protocol.CHAT_TYPE_1_2_1 ?
                this.$userMap[this.$route.query.key].avatar :
                this.$qunMap[this.$route.query.key].unitIcon;
            var title = chatType=== this.$protocol.CHAT_TYPE_1_2_1 ?
                this.$userMap[this.$route.query.key].userName :
                this.$qunMap[this.$route.query.key].qunName;


            this.session = {
                key: sessionKey,
                type: this.$route.query.chatType,
                icon: icon,
                title: title,
                messages: []
            }
            this.$sessions[sessionKey] = this.session;
        }


        var that = this;
        this.$webSocket.onMsgCallback = function (data) {
            ImProtocol.parse(data, function (protocol) {
                var message = that.getMessageByProtocol(protocol);
                that.$sessions[message.session].messages.push(message);
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
        goBack(){
            this.$router.go(-1);
        },
        qunDetail() {
            this.$router.push({name: 'qunDetail', query: {key: this.$route.query.key}})
        },
        getMessageByProtocol(protocol) {
            var sender = this.$userMap[protocol.senderId];
            var imgUrl = null;
            if (protocol.msgType === this.$protocol.IMAGE_MESSAGE) {
                var fileBlob = new Blob([protocol.msg]);
                imgUrl = window.URL.createObjectURL(fileBlob);
            }


            return {
                id: protocol.clientSendTime,
                chatType: protocol.chatType,
                fromUserId: protocol.senderId,
                clientSendTime: protocol.clientSendTime,
                messageType: protocol.msgType,
                content: protocol.msg,
                imgUrl: imgUrl,
                isMe: protocol.senderId === this.$getUserId(),
                userName: sender.userName,
                avatar: sender.avatar,
                time: new Date().format("MM/dd hh:mm:ss"),
                isText: protocol.msgType === this.$protocol.TEXT_MESSAGE,
                session: protocol.chatType === this.$protocol.CHAT_TYPE_1_2_N ? protocol.sessionKey :
                    this.$sessionKey(protocol.senderId, protocol.sessionKey)
            };

        },
        async cancel(item) {
            var currentUserId = this.$getUserId();
            if (item.fromUserId !== currentUserId) {
                return
            }
            Dialog.confirm({
                title: '消息撤回',
                message: '请确认是否撤销消息',
            }).then(async () => {
                console.log("cancel", item)
                const param = {
                    fromUserId: currentUserId,
                    token: currentUserId,
                    clientSendTime: item.clientSendTime,
                    sessionKey: item.session,
                    chatType: item.chatType,
                }
                var result =await ChatApi.cancelMsg(param);
                if (result === true) {
                    var session = this.$sessions[param.sessionKey]
                    session.messages = session.messages.filter(message => message.clientSendTime !== item.clientSendTime)
                }
            }).catch(() => {
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
                console.log(scrollElem);
                if (scrollElem) {
                    scrollElem.scrollTo({top: scrollElem.scrollHeight + 100});
                }
            });
        },
        async sendImage(file) {
            const fileReader = new FileReader();
            var that = this;
            fileReader.onload = function () {
                const result = fileReader.result;
                console.log(result);
                var content = new Uint8Array(result)
                var time = new Date().getTime();
                //如果是1对1聊天，则传过来的key=对方用户ID
                var chatType = parseInt(that.$route.query.chatType, 10);
                var protocol = new that.$protocol(chatType, that.$protocol.IMAGE_MESSAGE, that.$getUserId(), that.$route.query.key, content, time);
                that.$webSocket.sendMessage(protocol);
                var message = that.getMessageByProtocol(protocol);
                message.imgUrl = window.URL.createObjectURL(file.file);
                that.$sessions[message.session].messages.push(message);
            }
            fileReader.readAsArrayBuffer(file.file);
            this.handleScrollBottom()
        },
        sendText() {
            if (!this.content) {
                Toast.fail("嘿！你还没有输入内容哦！");
                return
            }
            var time = new Date().getTime();
            var chatType = parseInt(this.$route.query.chatType, 10);
            //如果是1对1聊天，则传过来的key=对方用户ID
            var protocol = new ImProtocol(chatType, ImProtocol.TEXT_MESSAGE, this.$getUserId(), this.$route.query.key, this.content, time);
            this.$webSocket.sendMessage(protocol);
            this.content = ''
            var message = this.getMessageByProtocol(protocol);
            this.$sessions[message.session].messages.push(message);
            console.log("parse protocol:" + protocol);
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
    height: 90%;
    margin-bottom: 4rem;
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
    padding-bottom: 4rem;
    position: fixed;
    bottom: 0;
}


.send {
    width: 4rem;
}
</style>
