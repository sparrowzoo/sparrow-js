<template>
    <div class="chatPerson">
        <van-nav-bar :title="$route.query.title" left-arrow @click-left="onClickLeft">
            <template #right v-if="$route.query.target == -1">
                <van-icon name="ellipsis" size="1.5rem" @click="toMyQunDetail()" />
            </template></van-nav-bar>
        <div class="center" ref="scrollDiv">
            <div class="chat" v-for="item in viewList" :key="item.id">
                <div class="chat_time">{{ item.time }}</div>
                <div class="chat_content" :class="item.isMe ? 'chat_content_right' : 'chat_content_left'">
                    <img :src="item.headUrl" class="chat_head" />
                    <div class="chat_content_wrap">
                        <div class="chat_content_name" v-if="item.chatType === 1 && !item.isMe">{{
                            item.userName
                        }}</div>
                        <div v-if="item.content" class="chat_text">
                            <div v-if="item.fromUserId === userId" v-longpress="() => cancel(item)">
                                {{ item.content }}
                            </div>
                            <div v-else>
                                {{ item.content }}
                            </div>
                        </div>
                        <img v-longpress="() => cancel(item)" v-else class="chat_img" :src="item.contentImage" alt="">
                    </div>
                </div>
            </div>
        </div>
        <div class="bottom">
            <van-uploader :after-read="afterRead">
                <van-icon name="smile" size="2rem" />
            </van-uploader>
            <van-field class="content" type="textarea" rows="1" :autosize="{ maxHeight: 80 }" v-model="content"
                placeholder="" />
            <van-button class="send" type="primary" size="small" @click="send()">发送</van-button>
        </div>
    </div>
</template>

<script>

import { mapGetters, mapActions, mapState, mapMutations } from 'vuex'
import '../lib/sparrowChat'
import { getSessionKey } from '../lib/sparrowChat'
import { Dialog } from 'vant';
import '../lib/imgCompression'
import imgCompression from '../lib/imgCompression';
const TEXT_MESSAGE = 0;
const IMAGE_MESSAGE = 1;
const CHAT_TYPE_1_2_1 = 0;
const CHAT_TYPE_1_2_N = 1;
export default {
    data() {
        return {
            content: '',
            session: null,
            interval: null,
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
        this.handleScrollBottom()
        this.read()
        this.interval = setInterval(() => {
            this.read()
        }, 10000);
    },
    beforeDestroy() {
        this.read()
        clearInterval(this.interval)
    },
    computed: {
        ...mapState(['userId']),
        ...mapGetters(['getSessionById', "getUserImageById", "getUserById"]),
        viewList() {
            this.session = this.getSessionById(this.$route.query.id);
            if (this.session == null) {
                return []
            }
            return this.session.messages.map(message => {

                const user = this.getUserById(message.fromUserId);
                return {
                    chatType: message.chatType,
                    userName: user.userName,
                    fromUserId: message.fromUserId,
                    id: message.clientSendTime,
                    isMe: message.fromUserId === this.userId,
                    time: this.$moment(message.clientSendTime).format('MM月DD日 HH:mm'),
                    content: message.messageType === 0 ? this.$Base64.decode(message.content) : null,
                    contentImage: message.messageType === 1 ? message.content : null,
                    headUrl: this.getUserImageById(message.fromUserId),
                }
            })
        }
    },
    methods: {
        ...mapActions(["sendMessage", "sendImage", "sendText", "readSession", "cancelMessage"]),
        ...mapMutations(["addSession"]),
        toMyQunDetail() {
            // this.$router.push({ name: 'myQunDetail', query: { id: this.session.chatSession.sessionKey } })
        },
        async cancel(item) {
            if (item.fromUserId !== this.userId) { return }
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
                        "sessionKey": getSessionKey(this.userId, this.$route.query.target),
                        "target": this.$route.query.target
                    },
                    "lastReadTime": Date.now(),
                    "messages": [
                    ]
                }
                this.addSession(session)
                this.session = session
            }
            this.readSession(this.session.chatSession.sessionKey)
        },
        // 滚动到底部
        handleScrollBottom() {
            this.$nextTick(() => {
                let scrollElem = this.$refs.scrollDiv;
                if (scrollElem)
                    scrollElem.scrollTo({ top: scrollElem.scrollHeight + 100 });
            });
        },
        onClickLeft() {
            this.$router.go(-1)
        },
        async afterRead(file) {
            const options = {
                maxSizeMB: 0.1,
                maxWidthOrHeight: 1920,
                useWebWorker: true,
            };
            file = await imgCompression(file.file, options)
            await new Promise((resolve, reject) => {
                const fileReader = new FileReader();
                fileReader.onload = () => {
                    //concatenate(msg,charType,current_user_id, msgType, session_key)
                    this.sendMessage(
                        {
                            chatType: this.session.chatSession.chatType,
                            msgType: IMAGE_MESSAGE,
                            from: this.session.chatSession.me,
                            to: this.session.chatSession.target,
                            sessionKey: this.session.chatSession.sessionKey,
                            msg: new Uint8Array(fileReader.result),
                            image: window.URL.createObjectURL(file),
                            clientSendTime: Date.now()
                        })
                    resolve();
                }
                fileReader.readAsArrayBuffer(file);
            })
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
.chatPerson {
    height: 100%;
    display: flex;
    flex-direction: column;
}

.center {
    flex: 1 0 0;
    background-color: #eee;
    padding: 0 1rem 1rem;
    overflow-y: scroll;

}


.chat_head {
    width: 3rem;
    height: 3rem;
    background: #f2f3f5;
    border-radius: 4px;
    display: block;
}




.chat_time {
    text-align: center;
    color: #555;
    margin-top: 0.5rem;
}

.chat_content {
    display: flex;
    margin-top: 0.5rem;
}

.chat_content_right {
    flex-direction: row-reverse;
}


.chat_content_left {
    flex-direction: row;
}

.chat_content_wrap {
    flex: 1 0 0;
    width: 0;
}

.chat_content_right .chat_content_wrap {
    margin-right: 1rem;
    text-align: right;
}

.chat_content_left .chat_content_wrap {
    margin-left: 1rem;
}

.chat_content_right .chat_content_name {
    text-align: right;
    margin-bottom: 0.1rem;
}

.chat_text {
    /* margin-left: 1rem; */
    /* margin-right: 1rem; */
    /* background-color: white; */
    /* display: flex; */
    /* justify-content: center; */
    /* align-items: center; */
    /* padding: 0.5rem 1rem; */
    /* border-radius: 4px; */
    /* white-space: pre-wrap; */
    /* flex: 1 0 0; */
    /* width: 0; */
    display: flex;
}

.chat_text div {
    background-color: white;
    padding: 0.5rem 1rem;
    border-radius: 4px;
    white-space: pre-wrap;
    word-break: break-all;
}

.chat_content_right .chat_text {
    flex-direction: row-reverse;
}

.chat_content_left .chat_text {
    flex-direction: row;
}

.chat_img {
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

.content {
    flex: 1 0 0;
}

.send {
    width: 3rem;
}
</style>
