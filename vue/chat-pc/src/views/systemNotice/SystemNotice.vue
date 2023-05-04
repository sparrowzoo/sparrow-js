<template>
  <div class="system-notice">
    <div class="inform-item" v-for="item of noticeList" :key="item.id">
      <div class="setting-icon"></div>
      <div class="inform-content">
        <span>{{ item.title }}</span>
        <p>
          {{ item.content }}
        </p>
        <div class="inform-message">
          <span class="inform-time">{{ item.timer }}</span>
          <span class="inform-operate">{{
            item.flod ? "展开全部" : "收起"
          }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      noticeList: [
        {
          id: 1,
          title: "系统通知",
          content:
            "关于公布浙江大学第十届大学生英语写作比赛、第七届大学生英语阅读比赛考场安排的通知外国语学院2022-09-21...",
          time: "2022-11-17 16:15:20",
          flod: true,
        },
        {
          id: 2,
          title: "系统通知",
          content:
            "关于公布浙江大学第十届大学生英语写作比赛、第七届大学生英语阅读比赛考场安排的通知外国语学院2022-09-21...",
          time: "2022-11-17 16:15:20",
          flod: true,
        },
        {
          id: 3,
          title: "系统通知",
          content:
            "关于公布浙江大学第十届大学生英语写作比赛、第七届大学生英语阅读比赛考场安排的通知外国语学院2022-09-21...",
          time: "2022-11-17 16:15:20",
          flod: true,
        },
      ],
    };
  },
};
</script>

<style lang="less" scoped>
.system-notice {
  width: 90%;
  min-width: 550px;
  height: 638px;
  background-color: @theme-color;
  box-sizing: border-box;
  padding: 0 50px;
  overflow-y: auto;

  // 隐藏滚动条
  scrollbar-width: none; /* Firefox */
  -ms-overflow-style: none; /* IE 10+ */

  &::-webkit-scrollbar {
    display: none; /* Chrome Safari */
  }
}
.inform-item {
  padding: 30px 0;
  border-bottom: 1px solid @border-color;
  display: flex;

  &:last-child {
    border: none;
  }

  .setting-icon {
    width: 50px;
    height: 50px;
    background-color: #fff;
    border-radius: 50%;
    margin-right: 20px;
    background-image: url("@/assets/image/setting.png");
    background-repeat: no-repeat;
    background-position: center;
  }

  .inform-content {
    flex: 1;

    & > span {
      color: @text-color;
      font-weight: 500;
    }

    p {
      font-size: 14px;
      color: @text-color;
    }

    .inform-message {
      display: flex;
      justify-content: space-between;
      margin-top: 5px;

      .inform-time {
        color: @text-gray-color;
        font-size: 14px;
      }

      .inform-operate {
        color: @text-color;
        font-size: 14px;
        cursor: pointer;
      }
    }
  }
}

p {
  line-height: 22px;
}
</style>
