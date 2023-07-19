<template>
  <div v-show="showDetailFlag" ref="detail-ref" class="more-message">
    <div class="group-more-part">
      <div class="more-search">
        <i class="iconfont icon-sousuo"></i>
        <input class="search-member" placeholder="搜索" type="text" />
      </div>
      <div class="group-more-content">
        <!-- 群成员 -->
        <div class="user-list">
          <div
            v-for="member of qun.members"
            :key="member.userId"
            class="more-user"
          >
            <img :src="member.avatar" alt="" />
            <span>{{ member.userName }}</span>
          </div>
          <!--          <div class="more-icon">-->
          <!--            <div class="search-add">+</div>-->
          <!--            <span>添加</span>-->
          <!--          </div>-->
        </div>

        <!--        <el-button type="primary" @click="existGroup">退出群聊</el-button>-->
        <!--        <div class="look-more-user">-->
        <!--          <span>退出群聊</span>-->
        <!--          <i class="iconfont icon-down-more"></i>-->
        <!--        </div>-->
        <div class="more-common">
          <p>{{ qun.qunName }}</p>
          <span class="qun-name"></span>
          <p>{{ qun.announcement }}</p>
          <span class="qun-announcement"></span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    // 当前聊天对象 / 群 的信息
    session: {},
  },
  destroyed() {
    console.log("销毁");
  },
  computed: {
    qun() {
      if (this.session == null || this.session.key === -1) {
        return { members: [] };
      }
      return this.$qunMap[this.session.key];
    },
  },
  data() {
    return {
      showDetailFlag: false,
    };
  },
  methods: {
    async showDetail() {
      if (this.qun.members == null) {
        this.qun.members = await this.$chatApi
          .getQunMembers(this.session.key)
          .then(
            (res) => {
              return res.data;
            },
            (err) => {
              console.log(err);
            }
          );
      }
      this.showDetailFlag = true;
      var detailRef = this.$refs["detail-ref"];
      var detailClickHandler = function (e) {
        e.stopPropagation();
      };
      var windowClickHandler = () => {
        this.showDetailFlag = false;
        detailRef.removeEventListener("click", detailClickHandler);
        window.removeEventListener("click", windowClickHandler);
      };
      detailRef.addEventListener("click", detailClickHandler);
      window.addEventListener("click", windowClickHandler);
    },
    existGroup() {
      this.$confirm("退出群聊？")
        .then(async () => {
          this.$chatApi.existGroup(this.qun.qunId).then(
            (res) => {
              if (res.code === 200) {
                this.$contact.quns = this.$contact.quns.filter(
                  (qun) => qun.qunId !== this.qun.qunId
                );
                this.$message("退出成功");
                this.$router.push({ name: "qun" });
              }
            },
            () => {
              this.$message("退出失败，请稍等重试");
            }
          );
        })
        .catch(() => {
          // on cancel
        });
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
