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
import {Toast} from "vant";

export default {
    name: 'ChatContact',
    data() {
        return {
            menus: [
                {name: "添加好友", image: addImage, command: this.addFriend},
                {name: "新的朋友", image: newFriendImage, command: this.newFriend},
                {name: "我的群聊", image: groupImage, command: this.myQun},
            ],
            friendGroupList: []
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
            this.$router.push({
                name: 'chat',
                query: {chatType: this.$protocol.CHAT_TYPE_1_2_1, key: user.userId, title: user.userName}
            });
        },
        myQun() {
            this.$router.push({name: 'qun'})
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
        }
    },

    async mounted() {
        console.log("mounted init contact");
        console.log("init contact");
        // var token = localStorage.getItem("token");
        console.log("VUE property", this.$sparrow);
        console.log("VUE property", this.$sparrowDB);
        this.friendGroupList = this._groupFriends(this.$contact.users);
        //Toast.success("mounted");
    },

    beforeCreate() {
        Toast.success("beforeCreate");
    },
    created() {
        Toast.success("created");
    },
    async beforeMount() {
        Toast.success("beforeMount");
    },
    beforeUpdate() {
        Toast.success("beforeUpdate");
    },
    updated() {
        Toast.success("updated");
    },

    destroyed() {
        Toast.success("destroyed");
    },
    activated() {
        Toast.success("activated");
    },
    deactivated() {
        Toast.success("deactivated");
    }, errorCaptured() {
        Toast.success("errorCaptured");
    },

    beforeDestroy() {
        Toast.success("beforeDestroy");
    },
    /**
     * Vue生命周期函数有：
     * beforeCreate、
     * created、
     * beforeMount、
     * mounted、
     * beforeUpdate、
     * updated、
     * beforeDestroy、
     * destroyed、
     * activated、
     * deactivated、
     * errorCaptured。
     *
     * 1、beforeCreate：组件实例刚被创建，组件属性计算之前。
     *
     * 2、Created：组件实例刚被创建，属性已绑定，但DOM还未生成。
     *
     * 3、beforeMount：模板编译/挂载之前。
     *
     * 4、Mounted：模板编译/挂载之后。
     *
     * 5、beforeUpdate：组件更新之前。
     *
     * 6、Updated：组件更新之后。
     *
     * 7、beforeDestroy：组件销毁前调用。
     *
     * 8、Destroyed：组件销毁后调用。
     *
     * 9、activated：组件激活时调用。
     *
     * 10、deactivated：组件停用时调用。
     *
     * 11、errorCaptured：当捕获一个来自子孙组件的错误时被调用。
     */
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
