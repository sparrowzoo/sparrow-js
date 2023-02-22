<template>
    <div class="myFriend">
        <van-nav-bar title="我的群聊" left-arrow @click-left="onClickLeft">
        </van-nav-bar>
        <div class="chat_item" v-for="item in viewList" :key="item.id" @click="toChatPerson(item)">
            <van-badge :content="item.count > 1 ? item.count : null" :dot="item.count == 1">
                <img :src="item.headUrl" class="child" />
            </van-badge>
            <div class="chat_right">
                <div class="chat_top">
                    <span class="chat_name ">{{ item.title }}</span>
                    <span class="chat_time gray">{{ item.time }}</span>
                </div>
                <div class="chat_bottom gray" v-html="item.content">
                </div>
            </div>
        </div>
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

        };
    },
    methods: {
        onClickLeft() {
            this.$router.go(-1)
        },
        toChatPerson(user) {
            this.$router.push({ name: 'chatPerson', query: { id: user.id, target: user.target, title: user.title } })
        }
    },
    computed: {
        ...mapState(['contacts', 'sessions', "userId"]),
        ...mapGetters(['getSessionById']),
        viewList() {
            return this.contacts.quns.map(qun => {
                const session = this.getSessionById(qun.qunId);
                console.log(session)
                const chatType = 1; //1群 0用户
                const title = qun.qunName;
                const sessionKey = qun.qunId;//唯一id，可以作为群名
                const target = -1;//用户id
                const lastMessage = session ? session.messages[session.messages.length - 1] : null;//最后收到的一条消息
                const lastMessageTime = session && lastMessage ? lastMessage.clientSendTime : null;//最后一条消息的发送时间
                const lastMessageContent = session && lastMessage ? (lastMessage.messageType === 1 ? '/图片/' : this.$Base64.decode(lastMessage.content)) : null;
                const unReadCount = session ? session.messages.filter(message => message.serverTime >= session.lastReadTime).length : 0;
                return {
                    id: sessionKey,
                    target: target,
                    type: chatType,
                    title: title,
                    lastMessageTime: lastMessageTime,
                    time: lastMessageTime ? this.$moment(lastMessageTime).format('YY/MM/DD') : null,
                    content: lastMessage ? '用户' + lastMessage.fromUserId + "：" + lastMessageContent : null,
                    count: unReadCount,
                    headUrl: groupImage
                }
                // return this.sessions.filter(session => session.messages.length > 0).map(session => {
                //     console.log(session)
                //     const chatType = session.chatSession.chatType; //1群 0用户
                //     const sessionKey = session.chatSession.sessionKey;//唯一id，可以作为群名
                //     const target = session.chatSession.target;//用户id
                //     const lastMessage = session.messages[session.messages.length - 1];//最后收到的一条消息
                //     const lastMessageTime = lastMessage.clientSendTime;//最后一条消息的发送时间
                //     const lastMessageContent = lastMessage.messageType === 1 ? '/图片/' : this.$Base64.decode(lastMessage.content);
                //     const unReadCount = session.messages.filter(message => message.serverTime >= session.lastReadTime).length;
                //     if (chatType === 0) {
                //         return {
                //             id: sessionKey,
                //             target: target,
                //             type: chatType,
                //             title: '用户' + target,
                //             lastMessageTime: lastMessageTime,
                //             time: this.$moment(lastMessageTime).format('YY/MM/DD'),
                //             content: lastMessageContent,
                //             count: unReadCount,
                //             headUrl: target !== session.chatSession.me ? this.getUserImageById(target) : "https://img01.yzcdn.cn/vant/cat.jpeg",
                //         }
                //     } else {
                //         return {
                //             id: sessionKey,
                //             target: target,
                //             type: chatType,
                //             title: sessionKey,
                //             lastMessageTime: lastMessageTime,
                //             time: this.$moment(lastMessageTime).format('YY/MM/DD'),
                //             content: '用户' + lastMessage.fromUserId + "：" + lastMessageContent,
                //             count: unReadCount,
                //             headUrl: groupImage
                //         }
                //     }
                // })
                //     .sort((s1, s2) => s2.lastMessageTime - s1.lastMessageTime)
            })
        }
    }
}
</script>

<style scoped>
.myFriend {}

.cmd {
    display: flex;
    align-items: center;
}

.cmd span {
    margin-left: 0.5rem;
}

.header {
    width: 2.5rem;
    height: 2.5rem;
}


.chat_item {
    margin-top: 1rem;
    display: flex;
    padding: 0 1rem;
}

.chat_right {
    flex: 1 0 0;
    margin-left: 1rem;
    display: flex;
    flex-direction: column;
    justify-content: space-around;
    width: 0;
}

.chat_top {

    display: flex;
    flex-direction: row;
    align-items: center;
}

.chat_name {
    flex: 1 0 0;
}

.chat_header {

    width: 1.5rem;
    height: 1.5rem;
    border-radius: 0.75rem;
}

.child {
    width: 4rem;
    height: 4rem;
    background: #f2f3f5;
    border-radius: 4px;
    display: block;
}

.chat_bottom {
    white-space: nowrap;
    text-overflow: ellipsis;
    overflow: hidden;
}

.gray {
    color: #999
}
</style>
