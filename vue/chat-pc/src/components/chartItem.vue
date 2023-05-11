<template>
  <div :class="messageItem.isMe ? 'right' : 'left'" class="message">
    <el-table @row-contextmenu="rightClick"></el-table>
    <!-- 根据条件展示聊天时间 -->
    <div v-if="messageItem.time" class="time">
      {{ messageItem.time }}
    </div>
    <div class="user-msg">
      <img :src="messageItem.avatar" alt="" class="avatar-user" />
      <!-- 文本信息和图片信息 动态显示 -->

      <div v-if="messageItem.isText" class="message-detail">
        <div class="user-name">{{ messageItem.userName }}</div>
        <span class="block"></span>
        <span class="message-text">{{ messageItem.content }}</span>
      </div>
      <!-- 图片类型 -->
      <div v-else class="msg-picture-detail">
        <div class="user-name">{{ messageItem.userName }}</div>
        <img :src="messageItem.imgUrl" alt="" class="msg-picture" />
      </div>
    </div>
    <div id="menu" class="menuDiv">
      <ul class="menuUl">
        <li
          v-for="(item, index) in menus"
          :key="index"
          @click.stop="alert(index)"
        >
          <i :class="item.icon"></i> {{ item.name }}
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    messageItem: {
      type: Object,
      require: true,
    },
  },
  methods: {
    // 表格右击的功能
    rightClick(row, column, event) {
      this.$alert("你点击了" + row.name + "的" + column.label);
      event.preventDefault();
      let menu = document.querySelector("#menu");
      // 根据事件对象中鼠标点击的位置，进行定位
      menu.style.left = event.clientX - 258 + "px";
      menu.style.top = event.clientY - 75 + "px";
      // 改变自定义菜单的隐藏与显示
      menu.style.display = "block";
      menu.style.zIndex = 1000;
    },
  },
  data() {
    return {
      //右键菜单栏
      menus: [
        { name: "菜单一", operType: 1, icon: "el-icon-upload2" },
        { name: "菜单二", operType: 2, icon: "el-icon-folder-add" },
        { name: "菜单三", operType: 3, icon: "el-icon-edit-outline" },
        { name: "菜单四", operType: 4, icon: "el-icon-folder-remove" },
        { name: "菜单五", operType: 5, icon: "el-icon-download" },
      ],
    };
  },
};
</script>

<style lang="less" scoped>
// 菜单样式
.menuDiv {
  position: absolute;

  .menuUl {
    height: auto;
    width: auto;
    font-size: 14px;
    text-align: left;
    border-radius: 4px;
    border: none;
    background-color: #ffffff;
    color: #606266;
    list-style: none;
    border: 1px solid #ebeef5;

    li {
      width: 140px;
      height: 35px;
      line-height: 35px;
      padding: 0 10px;
      cursor: pointer;
      border-bottom: 1px solid rgba(255, 255, 255, 0.47);

      &:hover {
        display: block;
        background-color: #ecf5ff;
        color: #7abbff;
      }
    }
  }
}

.message {
  margin: 20px;

  .time {
    color: #666;
    font-size: 14px;
    text-align: center;
    padding: 10px 0;
  }

  .user-msg {
    display: flex;
    padding: 10px 0;

    .avatar-user {
      width: 35px;
      height: 35px;
      border-radius: 5px;
    }

    .message-detail {
      max-width: 50%;
      margin: 0 20px 0 25px;
      padding: 12px 10px;
      border-radius: 5px;
      overflow-wrap: break-word;

      .message-text {
        white-space: pre-wrap;
      }

      &:hover {
        cursor: pointer;
      }
    }

    .msg-picture-detail {
      position: relative;
      margin: 0 20px;

      .msg-picture {
        border-radius: 5px;
        max-width: 150px;
        cursor: pointer;
      }
    }
  }

  .recall {
    text-align: center;
    color: #666;

    .reset {
      color: #607298;
      cursor: pointer;
    }
  }
}

.left {
  .user-msg {
    flex-direction: row;

    .user-name {
      position: absolute;
      top: 0;
      left: 0;
      transform: translateY(-110%);
      width: 100px;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
      color: #999;
    }

    .message-detail {
      background-color: #fff;
      color: #000;
      position: relative;

      .block {
        // display: inline-block;
        border: 10px solid transparent;
        border-right-color: #fff;
        position: absolute;
        top: 8px;
        left: -20px;
      }
    }
  }
}

.right {
  .user-msg {
    flex-direction: row-reverse;

    .user-name {
      display: none !important;
    }

    .message-detail {
      background-color: @text-color;
      color: #eee;
      position: relative;

      .block {
        // display: inline-block;
        border: 10px solid transparent;
        border-left-color: @text-color;
        position: absolute;
        top: 8px;
        right: -20px;
      }
    }
  }
}
</style>
