<template>
    <div class="chat">
        <van-nav-bar :title="$route.query.title" left-arrow @click-left="goBack">
            <template #right v-if="$route.query.target == -1">
                <van-icon name="ellipsis" size="1.5rem" @click="qunDetail()"/>
            </template>
        </van-nav-bar>
        <div class="center" ref="scrollDiv">
            <div class="chat" v-for="item in messageList" :key="item.id">
                <div class="time">{{ item.time }}</div>
                <div :class="item.isMe ? 'right' : 'left'">
                    <img :src="item.headUrl" class="avatar"/>
                    <div class="content_wrap">
                        <div class="user_name">
                            {{ item.userName }}
                        </div>
                        <div v-if="item.text" class="content">
                            <div v-if="item.fromUserId === 1" v-longpress="() => cancel(item)">
                                {{ item.content }}
                            </div>
                            <div v-else>
                                {{ item.content }}
                            </div>
                        </div>
                        <img v-longpress="() => cancel(item)" v-else class="img" :src="item.contentImage" alt="image">
                    </div>
                </div>
            </div>
        </div>
        <div class="bottom">
            <van-uploader :after-read="afterRead">
                <van-icon name="smile" size="2rem"/>
            </van-uploader>
            <van-field class="content" type="textarea" rows="1" :autosize="{ maxHeight: 80 }" v-model="content"
                       placeholder=""/>
            <van-button class="send" type="primary" size="small" @click="send()">发送</van-button>
        </div>
    </div>
</template>

<script>

// import {IndexdedDB} from "@/char/indexedDB";
// import { mapGetters, mapActions, mapState, mapMutations } from 'vuex'
// import '../lib/sparrowChat'
// import { getSessionKey } from '../lib/sparrowChat'
import {Dialog, Toast} from 'vant';
import {ChatApi} from "@/api/Chat";
// import '../lib/imgCompression'
// import imgCompression from '../lib/imgCompression';
const TEXT_MESSAGE = 0;
// const IMAGE_MESSAGE = 1;
// const CHAT_TYPE_1_2_1 = 0;
// const CHAT_TYPE_1_2_N = 1;
export default {
    name: "ChatDialog",
    data() {
        return {
            content: '',
            session: null,
            interval: null,
            messageList: [{
                chatType: 1,
                userName: "admin",
                fromUserId: 1,
                id: 1,
                isMe: true,
                time: "2020-12-12 12:12:12",
                content: "content",
                isText: true,
                contentImage: "url",
                avatar: "head",
            },
                {
                    chatType: 1,
                    userName: "admin2",
                    fromUserId: 1,
                    id: 2,
                    isMe: false,
                    time: "2020-12-12 12:12:12",
                    content: "content",
                    isText: false,
                    contentImage: "url",
                    avatar: "head",
                }]
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
    mounted() {
        this.handleScrollBottom();
        var p = this.loadMessage();
        p.then(() => {
            this.read();
        })
    },
    beforeDestroy() {
        Toast.success("beforeDestroy");
    },
    computed: {},
    methods: {
        loadMessage() {
            console.log("loadMessage");
            return ChatApi.getSessionFromLocal("1").then((session) => {
                console.log(session);
            }, (error) => {
                console.log(error);
            });
        },
        // ...mapActions(["sendMessage", "sendImage", "sendText", "readSession", "cancelMessage"]),
        // ...mapMutations(["addSession"]),
        qunDetail() {
            this.$router.push({name: 'qun-detail', query: {id: this.session.chatSession.sessionKey}})
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
                        clientSendTime: item.id,
                        sessionKey: this.session.chatSession.sessionKey,
                        chatType: this.session.chatSession.chatType,
                    }
                    this.cancelMessage(param);
                })
                .catch(() => {
                    // on cancel
                });
        },
        read() {
            if (this.session == null) {
                const session =
                    {
                        "chatSession": {
                            "chatType": 0,
                            "me": this.userId,
                            "sessionKey": "1",// getSessionKey(this.userId, this.$route.query.target),
                            "target": this.$route.query.target
                        },
                        "lastReadTime": Date.now(),
                        "messages": []
                    }
                // this.addSession(session)
                this.session = session
            }
            //this.readSession(this.session.chatSession.sessionKey)
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
        async afterRead(file) {
            console.log(file)
            // const options = {
            //     maxSizeMB: 0.1,
            //     maxWidthOrHeight: 1920,
            //     useWebWorker: true,
            // };
            //file = await imgCompression(file.file, options)
            // await new Promise((resolve, reject) => {
            //     const fileReader = new FileReader();
            //     fileReader.onload = () => {
            //         //concatenate(msg,charType,current_user_id, msgType, session_key)
            //         this.sendMessage(
            //             {
            //                 chatType: this.session.chatSession.chatType,
            //                 msgType: IMAGE_MESSAGE,
            //                 from: this.session.chatSession.me,
            //                 to: this.session.chatSession.target,
            //                 sessionKey: this.session.chatSession.sessionKey,
            //                 msg: new Uint8Array(fileReader.result),
            //                 image: window.URL.createObjectURL(file),
            //                 clientSendTime: Date.now()
            //             })
            //         resolve();
            //     }
            //     fileReader.readAsArrayBuffer(file);
            // })
            this.handleScrollBottom()
        },
        send() {
            if (this.content) {
                //chatType, msgType, from, to, sessionKey, msg
                this.sendMessage(
                    {
                        chatType: this.session.chatSession.chatType,
                        msgType: TEXT_MESSAGE,
                        from: this.session.chatSession.me,
                        to: this.session.chatSession.target,
                        sessionKey: this.session.chatSession.sessionKey,
                        msg: this.content.toArray().toUint8Array(),
                        image: null,
                        clientSendTime: Date.now()
                    }
                )
                this.content = ''
                this.handleScrollBottom()
            }
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
