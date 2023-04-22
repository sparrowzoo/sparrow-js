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
                <van-index-anchor :key="view.index" :index="view.index"/>
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
import {Toast} from "vant";
// import { getSessionKey } from '../lib/sparrowChat'
// import { mapGetters, mapActions, mapState } from 'vuex'
export default {
	name: 'ChatContact',
	data() {
		return {
			cmds: [
				{title: "添加好友", image: addImage, fun: this.toAddFriend},
				{title: "新的朋友", image: newFriendImage, fun: this.toNewFriend},
				{title: "我的群聊", image: groupImage, fun: this.toMyQun},
			]
		};
	},
	methods: {
		onClickLeft() {
			this.$router.go(-1)
		},
		toAddFriend() {
			this.$router.push({name: 'add-friend'})
		},
		toNewFriend() {
			this.$router.push({name: 'new-friend'})
		},
		toChatPerson(user) {
			console.log(user);
			Toast('toChatPerson');
			// this.$router.push({
			// 	name: 'chatPerson',
			// 	query: {id: "1-2", target: user.userId, title: '用户' + user.userId}
			// })
		},
		toMyQun() {
			this.$router.push({name: 'qun'})
		}
	},
	computed: {
		// ...mapState(['contacts', "userId"]),
		viewList() {
			return [
				{
					index: "A",
					children: [
						{
							//生成假数据
							userId: 1,
							userName: "A",
							avatar: "https://img.yzcdn.cn/vant/cat.jpeg"
						}
					]
				},
				{
					index: "B",
					children: [
						{
							//生成假数据
							userId: 1,
							userName: "B",
							avatar: "https://img.yzcdn.cn/vant/cat.jpeg"
						},
						{
							//生成假数据
							userId: 1,
							userName: "B1",
							avatar: "https://img.yzcdn.cn/vant/cat.jpeg"
						},
						{
							//生成假数据
							userId: 1,
							userName: "B2",
							avatar: "https://img.yzcdn.cn/vant/cat.jpeg"
						},
						{
							//生成假数据
							userId: 1,
							userName: "b3",
							avatar: "https://img.yzcdn.cn/vant/cat.jpeg"
						}
					]
				},
				{
					index: "C",
					children: [
						{
							//生成假数据
							userId: 1,
							userName: "C",
							avatar: "https://img.yzcdn.cn/vant/cat.jpeg"
						}
					]
				}
			]
		}
	}
}
</script>

<style scoped>
.myFriend {
}

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
