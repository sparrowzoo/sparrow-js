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

  beforeCreate() {
    console.log("beforeCreate");
  },
  created() {
    console.log("created");
  },
  async beforeMount() {
    console.log("beforeMount");
  },
  beforeUpdate() {
    console.log("beforeUpdate");
  },
  updated() {
    console.log("updated");
  },

  destroyed() {
    console.log("destroyed");
  },
  activated() {
    console.log("activated");
  },
  deactivated() {
    console.log("deactivated");
  },
  errorCaptured() {
    console.log("errorCaptured");
  },

  beforeDestroy() {
    console.log("beforeDestroy");
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
