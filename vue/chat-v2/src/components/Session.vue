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
        <div class="chat_item" v-for="session in sessionList" :key="session.key"
             @click="toChat(session)">
            <van-badge :content="session.count > 1 ? session.count : null" :dot="session.count == 1">
                <img :src="session.icon" class="child"/>
            </van-badge>
            <div class="chat_right">
                <div class="chat_top">
                    <span class="chat_name ">{{ session.title }}</span>
                    <span class="chat_time gray">{{ session.time }}</span>
                </div>
                <div class="chat_bottom gray">
                    {{ session.lastMessageContent }}
                </div>
            </div>
        </div>
    </div>
</template>

<script>
// import qunIcon from "../assets/group.png";
export default {
    name: "ChatSession",
    data() {
        return {
            sessionList: []
        };
    },
    async mounted() {
        this.sessionList=this.$sessions;
        console.log(this.sessionList);
    },
    computed: {},
    methods: {
        toAddFriend() {
            this.$router.push({name: 'add-friend'})
        },
        toChat(item) {
            console.log(item)
            this.$router.push({name: 'chat', query: {chatType: item.type, key: item.key, title: item.title}})
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
