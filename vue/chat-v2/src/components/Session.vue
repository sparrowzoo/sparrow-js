<template>
    <div class="chat">
        <van-row gutter="10">
            <van-col span="18">
                <van-button type="default" icon="search" size="small" block>搜索</van-button>
            </van-col>
            <van-col span="3">
                <van-button type="default" icon="plus" size="small" block
                            @click="toAddFriend"></van-button>
            </van-col>
            <van-col span="3">
                <van-button type="default" icon="friends-o" size="small" block
                            @click="toContact"></van-button>
            </van-col>
        </van-row>
        <div class="chat_item" v-for="session in sessionList" :key="session.id"
             @click="toChat(session)">
            <van-badge :content="session.count > 1 ? session.count : null" :dot="session.count == 1">
                <img :src="session.icon" class="child"/>
            </van-badge>
            <div class="chat_right">
                <div class="chat_top">
                    <span class="chat_name ">{{ session.fromUserName }}</span>
                    <span class="chat_time gray">{{ session.time }}</span>
                </div>
                <div class="chat_bottom gray">
                    {{ session.content }}
                </div>
            </div>
        </div>
    </div>
</template>

<script>
// import systemImage from "../assets/system.png";
// import serviceImage from "../assets/service.png";
// import qunIcon from "../assets/group.png";
// import { mapState, mapGetters } from 'vuex'
import {ChatApi} from "@/api/Chat";

export default {
    name: "ChatChat",
    data() {
        return {
            ws: null,
            sessionList: null
        };
    },
    mounted() {
        //生成sessions 假数据
       var sessionList= await ChatApi.getSession(7);
        const user = await ChatApi.getUserById(target, this.$userMap);

        //.then(async sessions => {
       const sessionList = sessions.map(async session => {
                const chatType = session.chatSession.chatType; //1群 0单聊
                const sessionKey = session.chatSession.sessionKey;//唯一id，可以作为群名
                const target = session.chatSession.target;//用户id
                var lastMessage = null;
                var lastMessageTime = null;
                var lastMessageContent = null;
                if (session.messages != null && session.messages.length > 0) {
                    lastMessage = session.messages[session.messages.length - 1];//最后收到的一条消息
                    lastMessageTime = lastMessage.clientSendTime;//最后一条消息的发送时间
                    lastMessageContent = lastMessage.messageType === 1 ? '/图片/' : this.$Base64.decode(lastMessage.content);
                }
                const unReadCount = session.messages.filter(message => message.serverTime >= session.lastReadTime).length;
                if (chatType === 0) {
                    // 普通用户
                    if (!user) {
                        return null;
                    }
                    console.log("get user from db", user)
                    return {
                        id: sessionKey,
                        target: target,
                        type: chatType,
                        lastMessageTime: lastMessageTime,
                        //time: this.$moment(lastMessageTime).format('YY/MM/DD'),
                        content: lastMessageContent,
                        count: unReadCount,
                        icon: user.avatar,
                        fromUserName: user.userName,
                        // icon: qunIcon
                    }
                }
                if(chatType===1){
                    // 普通用户
                    const user = await ChatApi.getUserById(target, this.$userMap);
                    if (!user) {
                        return null;
                    }
                    console.log("get user from db", user)
                    return {
                        id: sessionKey,
                        target: target,
                        type: chatType,
                        lastMessageTime: lastMessageTime,
                        //time: this.$moment(lastMessageTime).format('YY/MM/DD'),
                        content: lastMessageContent,
                        count: unReadCount,
                        icon: user.avatar,
                        fromUserName: user.userName,
                        // icon: qunIcon
                    }
                }
            });
            this.sessionList = await Promise.all(sessionList);
            console.log(this.sessionList);
        }, err => {
            console.log(err)
        });
    },
    computed: {},
    methods: {
        toAddFriend() {
            this.$router.push({name: 'add-friend'})
        },
        toChat(item) {
            console.log(item)
            this.$router.push({name: 'chat', query: {id: item.id, target: item.target, title: item.title}})
        },
        toContact() {
            this.$router.push({name: 'contact'})
        }
    }
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
