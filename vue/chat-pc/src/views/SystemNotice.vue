<template>
  <div class="system-notice">
    <div v-for="item of noticeList" :key="item.noticeId" class="inform-item">
      <div class="setting-icon"></div>
      <div class="inform-content">
        <span>{{ item.noticeTitle }}</span>
        <p v-if="item.fold">
          {{ item.noticeContent }}
        </p>
        <div class="inform-message">
          <span class="inform-time">{{ item.updateTime }}</span>
          <span class="inform-operate" @click="change(item)">{{
            item.fold ? "展开全部" : "收起"
          }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ChatApi } from "../../../api/Chat";

export default {
  data() {
    return {
      noticeList: [
        {
          noticeId: 1,
          noticeTitle: "",
          noticeContent: "",
          updateTime: "",
          fold: true,
        },
      ],
    };
  },
  mounted() {
    ChatApi.systemNotice().then(
      (res) => {
        var result = res.data;
        //this.noticeList = result;
        // 加上这句话就无法正常显示？
        result.forEach((item) => {
          item.fold = true;
        });
        this.noticeList = result;
      },
      (err) => {
        console.log(err);
      }
    );
  },
  methods: {
    change(item) {
      console.log(item.fold);
      item.fold = !item.fold;
    },
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
