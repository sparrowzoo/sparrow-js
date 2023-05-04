<template>
  <div ref="detail-ref" v-show="showDetailFlag" class="more-message">
    <div class="group-more-part">
      <div class="more-search">
        <i class="iconfont icon-sousuo"></i>
        <input type="text" class="search-member" placeholder="搜索" />
      </div>
      <div class="group-more-content">
        <!-- 群成员 -->
        <div class="user-list">
          <div class="more-user">
            <img src="https://img1.imgtp.com/2023/01/29/odnUWlDQ.jpg" alt="" />
            <span>用名</span>
          </div>
          <div class="more-icon">
            <div class="search-add">+</div>
            <span>添加</span>
          </div>
        </div>
        <div class="look-more-user">
          <span>查看更多</span>
          <i class="iconfont icon-xiala"></i>
        </div>
        <div class="more-common">
          <p>群聊名称</p>
          <span class="qun-name"></span>
          <p>群公告</p>
          <span class="qun-announcement"></span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  destroyed() {
    console.log("销毁");
  },
  data() {
    return {
      showDetailFlag: false,
    };
  },
  methods: {
    showDetail() {
      this.showDetailFlag = true;
      this.detailRegister();
    },
    // 给展示详细信息的区域注册点击事件
    detailRegister() {
      this.$refs["detail-ref"].addEventListener("click", this.showFn);
      this.windowRegister();
    },
    // 展示弹层事件
    showFn(e) {
      // 阻止冒泡，防止触发 window的click事件
      e.stopPropagation();
    },
    // 给全局注册点击事件
    windowRegister() {
      window.addEventListener("click", this.closeDetail);
    },
    // 关闭详细区域
    closeDetail() {
      this.showDetailFlag = false;
      window.removeEventListener("click", this.closeDetail);
      this.$refs["detail-ref"].removeEventListener("click", this.closeDetail);
    },
  },
};
</script>

<style lang="less" scoped>
.more-message {
  position: absolute;
  top: -1px;
  bottom: -1px;
  right: 0;
  width: 230px;
  padding: 15px;
  box-sizing: border-box;
  // transform: translateX(100%);
  background-color: @theme-color;
  border: 1px solid @border-color;
  .group-more-part {
    .more-search {
      position: relative;
      margin-bottom: 25px;
      .input();
      .iconfont {
        position: absolute;
        top: 8px;
        left: 5px;
        font-size: 18px;
      }
    }

    .group-more-content {
      overflow-y: auto;
      height: 650px;

      // 隐藏滚动条
      scrollbar-width: none; /* Firefox */
      -ms-overflow-style: none; /* IE 10+ */
      &::-webkit-scrollbar {
        display: none; /* Chrome Safari */
      }
      .user-list {
        display: flex;
        flex-wrap: wrap;
        // justify-content: space-between;
        margin: 5px 0;

        & > div {
          margin-bottom: 15px;
          &:nth-child(4n + 2) {
            margin-left: 12px;
            margin-right: 12px;
          }
          &:nth-child(4n + 3) {
            margin-right: 12px;
          }
        }

        span {
          width: 100%;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
          font-size: 14px;
          text-align: center;
          margin-top: 6px;
        }
        .more-user {
          display: flex;
          flex-direction: column;
          width: 40px;
          img {
            width: 100%;
            height: 40px;
            border-radius: 2px;
          }
        }
        .more-icon {
          text-align: center;
          .search-add {
            box-sizing: border-box;
            width: 40px;
            height: 40px;
            line-height: 35px;
            font-size: 18px;
            font-weight: 600;
            color: @text-gray-color;
            text-align: center;
            border: 1px solid #e7e7e8;
            cursor: pointer;
          }
        }
      }

      .look-more-user {
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 14px;
        color: @text-gray-color;
        cursor: pointer;
      }

      .more-common {
        margin-top: 20px;
        border-top: 1px solid @border-color;
        font-size: 14px;

        p {
          margin-top: 20px;
          margin-bottom: 0;
          color: @text-color;
        }
        span {
          color: @text-gray-color;
        }
      }
    }
  }
}
</style>
