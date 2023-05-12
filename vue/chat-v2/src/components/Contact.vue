<template>
  <div class="contact">
    <van-index-bar>
      <van-cell v-for="menu in menus" :key="menu.name">
        <template>
          <div class="menu" @click="menu.command">
            <img :alt="menu.name" :src="menu.image" class="icon" />
            <span>{{ menu.name }}</span>
          </div>
        </template>
      </van-cell>
    </van-index-bar>
    <van-index-bar>
      <template v-for="friendGroup in friendGroupList">
        <van-index-anchor :key="friendGroup.index" :index="friendGroup.index" />
        <van-cell
          v-for="friend in friendGroup.members"
          :key="friend.userId"
          @click="toChat(friend)"
        >
          <template>
            <div class="friend">
              <img :alt="friend.userName" :src="friend.avatar" class="avatar" />
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

export default {
  name: "ChatContact",
  data() {
    return {
      menus: [
        { name: "添加好友", image: addImage, command: this.addFriend },
        { name: "新的朋友", image: newFriendImage, command: this.newFriend },
        { name: "我的群聊", image: groupImage, command: this.myQun },
      ],
      friendGroupList: [],
    };
  },
  computed: {},
  methods: {
    //添加好友
    addFriend() {
      this.$router.push({ name: "add-friend" });
    },
    //新的朋友
    newFriend() {
      this.$router.push({ name: "new-friend" });
    },
    //聊天
    toChat(friend) {
      var sessionKey = this.$protocol.generate121SessionKey(
        friend.userId,
        this.$getUserId()
      );
      console.log(friend);
      this.$router.push({
        name: "chat",
        query: { key: sessionKey },
      });
    },
    myQun() {
      this.$router.push({ name: "qun" });
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
          members: [friend],
        });
      }
      return groupFriends;
    },
  },

  async mounted() {
    console.log("mounted init contact");
    console.log("init contact");
    // var token = localStorage.getItem("token");
    this.friendGroupList = this._groupFriends(this.$contact.users);
    // console.log("mounted");
  },
};
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

.icon {
  width: 1.5rem;
  height: 1.5rem;
}

.avatar {
  width: 2.5rem;
  height: 2.5rem;
}
</style>
