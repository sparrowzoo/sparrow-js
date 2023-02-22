<template>
    <div class="myFriend">
        <van-nav-bar title="我的好友" left-arrow @click-left="onClickLeft">
        </van-nav-bar>
        <van-index-bar>
            <van-cell v-for="cmd in cmds" :key="cmd.title">
                <template>
                    <div class="cmd" @click="cmd.fun">
                        <img class="header" :src="cmd.image" alt="">
                        <span>{{ cmd.title }}</span>
                    </div>
                </template>
            </van-cell>
        </van-index-bar>
        <van-index-bar>
            <template v-for="view in viewList">
                <van-index-anchor :index="view.index" />
                <van-cell v-for="user in view.children" :key="user.userId" @click="toChatPerson(user)">
                    <template>
                        <div class="cmd">
                            <img class="header" :src="user.avatar" alt="">
                            <span>{{ user.userName }}</span>
                        </div>
                    </template>
                </van-cell>
            </template>

        </van-index-bar>
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
            cmds: [
                { title: "添加好友", image: addImage, fun: this.toAddFriend },
                { title: "新的朋友", image: newFriendImage, fun: this.toNewFriend },
                { title: "我的群聊", image: groupImage, fun: this.toMyQun },
            ]
        };
    },
    methods: {
        onClickLeft() {
            this.$router.go(-1)
        },
        toAddFriend() {
            this.$router.push({ name: 'addFriend' })
        },
        toNewFriend() {
            this.$router.push({ name: 'newFriend' })
        },
        toChatPerson(user) {
            this.$router.push({ name: 'chatPerson', query: { id: getSessionKey(this.userId, user.userId), target: user.userId, title: '用户' + user.userId } })
        },
        toMyQun() {
            this.$router.push({ name: 'myQun' })
        }
    },
    computed: {
        ...mapState(['contacts', "userId"]),
        viewList() {
            return [
                {
                    index: "A",
                    children: this.contacts.users
                }
            ]
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
</style>
