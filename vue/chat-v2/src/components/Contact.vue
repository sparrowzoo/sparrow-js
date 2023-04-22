<template>
    <div class="contact">
        <van-nav-bar title="我的好友" left-arrow @click-left="goBack">
        </van-nav-bar>
        <van-index-bar>
            <van-cell v-for="menu in menus" :key="menu.name">
                <template>
                    <div class="menu" @click="menu.command">
                        <img class="header" :src="menu.image" :alt="menu.name">
                        <span>{{ menu.name }}</span>
                    </div>
                </template>
            </van-cell>
        </van-index-bar>
        <van-index-bar>
            <template v-for="friendGroup in friendGroupList">
                <van-index-anchor :key="friendGroup.index" :index="friendGroup.index"/>
                <van-cell v-for="friend in friendGroup.members" :key="friend.userId" @click="toChat(friend)">
                    <template>
                        <div class="friend">
                            <img class="avatar" :src="friend.avatar" :alt="friend.userName">
                            <span>{{ friend.userName }}</span>
                        </div>
                    </template>
                </van-cell>
            </template>
        </van-index-bar>
    </div>
</template>
<script>
import groupImage from "@/assets/group.png";
import addImage from "@/assets/add.png";
import newFriendImage from "@/assets/newFriend.png";
// import {Toast} from "vant";
import {ChatApi} from "@/api/Chat";
import {Sparrow} from '../../../../source/scripts/sparrow_es.js'

export default {
    name: 'ChatContact',
    data() {
        return {
            menus: [
                {name: "添加好友", image: addImage, command: this.addFriend},
                {name: "新的朋友", image: newFriendImage, command: this.newFriend},
                {name: "我的群聊", image: groupImage, command: this.myQun},
            ],
            friendGroupList: [],
            //indexed db 数据库
            db: null,
        };
    },
    computed: {
        // friendGroupList() {
        //     return [
        //         {
        //             index: "A",
        //             members: [
        //                 {
        //                     //生成假数据
        //                     userId: 1,
        //                     userName: "A",
        //                     avatar: "https://img.yzcdn.cn/vant/cat.jpeg"
        //                 }
        //             ]
        //         },
        //         {
        //             index: "B",
        //             members: [
        //                 {
        //                     //生成假数据
        //                     userId: 2,
        //                     userName: "B",
        //                     avatar: "https://img.yzcdn.cn/vant/cat.jpeg"
        //                 },
        //                 {
        //                     //生成假数据
        //                     userId: 3,
        //                     userName: "B1",
        //                     avatar: "https://img.yzcdn.cn/vant/cat.jpeg"
        //                 },
        //                 {
        //                     //生成假数据
        //                     userId: 4,
        //                     userName: "B2",
        //                     avatar: "https://img.yzcdn.cn/vant/cat.jpeg"
        //                 },
        //                 {
        //                     //生成假数据
        //                     userId: 5,
        //                     userName: "b3",
        //                     avatar: "https://img.yzcdn.cn/vant/cat.jpeg"
        //                 }
        //             ]
        //         },
        //         {
        //             index: "C",
        //             members: [
        //                 {
        //                     //生成假数据
        //                     userId: 6,
        //                     userName: "C",
        //                     avatar: "https://img.yzcdn.cn/vant/cat.jpeg"
        //                 }
        //             ]
        //         }
        //     ]
        // }
    },
    methods: {
        //返回上一页
        goBack() {
            this.$router.go(-1)
        },
        //添加好友
        addFriend() {
            this.$router.push({name: 'add-friend'})
        },
        //新的朋友
        newFriend() {
            this.$router.push({name: 'new-friend'})
        },
        //聊天
        toChat(user) {
            console.log(user);
            // Toast('toChatPerson');
            this.$router.push({ name: 'chat', query: {target: user.userId, title: user.userName } })

            // this.$router.push({
            // 	name: 'chatPerson',
            // 	query: {id: "1-2", target: user.userId, title: '用户' + user.userId}
            // })
        },
        myQun() {
            this.$router.push({name: 'qun'})
        },
        //初始化数据库条目 包括用户或者群
        _initItem(tableName, items) {
            for (var i = 0; i < items.length; i++) {
                this.db.put(tableName, items[i])
                    .then(function (data) {
                        console.log(data);
                    }, function (error) {
                        console.log(error);
                    });
            }
        },
        //按照首字母分组
        //friends:好友列表
        _groupFriends(friends) {
            //分组 key:首字母 value:好友列表
            var groupFriends = [];
            //按照首字母分组
            for (var i = 0; i < friends.length; i++) {
                var friend = friends[i];
                //获取首字母
                var index = friend.userName.substr(0, 1).toUpperCase();
                //在分组中查找是否存在该首字母
                var groupFriend = groupFriends.find(function (item) {
                    return item.index === index;
                });
                //如果存在则添加到该分组中
                if (groupFriend) {
                    groupFriend.members.push(friend);
                    continue;
                }
                //如果不存在则创建该分组
                groupFriends.push({
                    index: index,
                    members: [friend]
                });
            }
            return groupFriends;
        },
        _initContact() {
            ChatApi.getContacts(7).then((res) => {
                console.log(res);
                this._initItem("qun", res.data.quns);
                this._initItem("contact", res.data.users);
                this.friendGroupList = this._groupFriends(res.data.users);
            }, (err) => {
                console.log("联系人获取失败", err);
            });
        }
    },
    mounted() {
        console.log("init contact");
        // var token = localStorage.getItem("token");
        this.db = new Sparrow.indexedDB({
            name: 'sparrow',
            version: "1.0",
            tableNames: [
                {"name": "contact", "key": "userId"},
                {"name": "qun", "key": "qunId"},
                {"name": "session", "key": "sessionId"}
            ]
        });
        var initPromise = this.db.init();
        //连接确认成功后提交数据
        initPromise.then((data) => {
            console.log("数据库连接成功", data);
            this._initContact();
        }, (error) => {
            console.log("数据库连接失败", error);
        });
    }
}
</script>

<style scoped>
.contact {
}

.friend {
    display: flex;
    align-items: center;
}

.friend span {
    margin-left: 0.5rem;
}

.menu {
    display: flex;
    align-items: center;
}

.menu span {
    margin-left: 0.5rem;
}

.avatar {
    width: 2.5rem;
    height: 2.5rem;
}
</style>
