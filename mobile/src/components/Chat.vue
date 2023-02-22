<template>
    <div class="chat">
        <van-row gutter="10">
            <van-col span="18"><van-button type="default" icon="search" size="small" block>搜索</van-button></van-col>
            <van-col span="3"><van-button type="default" icon="plus" size="small" block
                    @click="toAddFriend"></van-button> </van-col>
            <van-col span="3"><van-button type="default" icon="friends-o" size="small" block
                    @click="toMyFriend"></van-button> </van-col>
        </van-row>
        <div class="chat_item" v-for="item in viewList" :key="item.id"
            @click="item.isSystem ? toSystem() : toChatPerson(item)">
            <van-badge :content="item.count > 1 ? item.count : null" :dot="item.count == 1">
                <img :src="item.headUrl" class="child" />
            </van-badge>
            <div class="chat_right">
                <div class="chat_top">
                    <span class="chat_name ">{{ item.title }}</span>
                    <span class="chat_time gray">{{ item.time }}</span>
                </div>
                <div class="chat_bottom gray">
                    {{ item.content }}
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import systemImage from "../assets/system.png";
import serviceImage from "../assets/service.png";
import groupImage from "../assets/group.png";
import { mapState, mapGetters } from 'vuex'
export default {
    data() {
        return {
            ws: null,
        };
    },
    computed: {
        ...mapState(['sessions', "systemInfos"]),
        ...mapGetters(["getQunById", "getUserById"]),
        viewList() {
            const concat = this.sessions.filter(session => session.messages.length > 0).map(session => {
                const chatType = session.chatSession.chatType; //1群 0用户
                const sessionKey = session.chatSession.sessionKey;//唯一id，可以作为群名
                const target = session.chatSession.target;//用户id
                const lastMessage = session.messages[session.messages.length - 1];//最后收到的一条消息
                const lastMessageTime = lastMessage.clientSendTime;//最后一条消息的发送时间
                const lastMessageContent = lastMessage.messageType === 1 ? '/图片/' : this.$Base64.decode(lastMessage.content);
                const unReadCount = session.messages.filter(message => message.serverTime >= session.lastReadTime).length;
                if (chatType === 0) {
                    // 普通用户
                    const user = this.getUserById(target);
                    return {
                        id: sessionKey,
                        target: target,
                        type: chatType,
                        title: user.userName,
                        lastMessageTime: lastMessageTime,
                        time: this.$moment(lastMessageTime).format('YY/MM/DD'),
                        content: lastMessageContent,
                        count: unReadCount,
                        headUrl: user.avatar
                    }
                } else {
                    const qun = this.getQunById(sessionKey);
                    const user = this.getUserById(lastMessage.fromUserId);
                    const userTitle = user.userName
                    // 群
                    return {
                        id: sessionKey,
                        target: target,
                        type: chatType,
                        title: qun.qunName,
                        lastMessageTime: lastMessageTime,
                        time: this.$moment(lastMessageTime).format('YY/MM/DD'),
                        content: userTitle + "：" + lastMessageContent,
                        count: unReadCount,
                        headUrl: groupImage
                    }
                }
            })
                .sort((s1, s2) => s2.lastMessageTime - s1.lastMessageTime)

            let systemInfo;
            if (this.systemInfos.length > 0) {
                systemInfo = {
                    isSystem: true,
                    id: "noticeId_" + this.systemInfos[0].noticeId,
                    title: this.systemInfos[0].noticeContent,
                    time: this.$moment(this.systemInfos[0].createTime).format('YY/MM/DD'),
                    content: this.systemInfos[0].noticeTitle,
                    count: 0,
                    headUrl: systemImage
                }
            } else {
                systemInfo = {
                    isSystem: true,
                    id: "noticeId_0",
                    title: null,
                    time: null,
                    content: null,
                    count: 0,
                    headUrl: systemImage
                }
            }
            return [systemInfo].concat(concat)
            // [
            // {
            //     id: Math.random(),
            //     type: "2",
            //     title: "系统消息",
            //     time: "22/10/18",
            //     content: "版本更新",
            //     count: 1,
            //     headUrl: systemImage
            // },
            // {
            //     id: Math.random(),
            //     type: "3",
            //     title: "客服",
            //     time: "22/10/18",
            //     content: "再见",
            //     count: 1,
            //     headUrl: serviceImage,
            // }
            // ].concat(


        }
    },
    methods: {
        toSystem() {
            this.$router.push({ name: 'systemInfo' })
        },
        toAddFriend() {
            this.$router.push({ name: 'addFriend' })
        },
        toChatPerson(item) {
            console.log(item)
            this.$router.push({ name: 'chatPerson', query: { id: item.id, target: item.target, title: item.title } })
        },
        toMyFriend() {
            this.$router.push({ name: 'myFriend' })
        }
    },
}
</script>

<style scoped>
.chat {
    padding: 1rem;
}

.chat_item {
    margin-top: 1rem;
    display: flex;
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
