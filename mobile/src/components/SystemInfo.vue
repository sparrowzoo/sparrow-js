<template>
    <div class="systemInfo">
        <van-nav-bar title="系统消息" left-arrow @click-left="onClickLeft"></van-nav-bar>
        <div>
            <div class="wrap" v-for="systemInfo in users" :key="systemInfo.noticeId">
                <div class="head">
                    <div class="title">{{ systemInfo.noticeContent }}</div>
                    <div class="time">{{ systemInfo.createTime }}</div>
                </div>
                <div class="content" :class="{ content_close: !systemInfo.isOpen }">
                    {{ systemInfo.noticeTitle }}
                </div>
                <div class="split"></div>
                <div class="foot" @click="changeOpen(systemInfo)" v-if="systemInfo.isOpen === true">收起
                    <van-icon name="arrow-up" />
                </div>
                <div class="foot" @click="changeOpen(systemInfo)" v-else>展开全部
                    <van-icon name="arrow-down" />
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import { mapState } from 'vuex'
export default {
    data() {
        return {
            users: []
        };
    },
    computed: {
        ...mapState(['systemInfos']),
    },
    async mounted() {
        this.users = this.systemInfos.map(({ noticeId, noticeContent, createTime, noticeTitle }) => {
            return {
                noticeId, noticeContent, createTime, noticeTitle, isOpen: false
            }
        })
    },
    methods: {
        changeOpen(systemInfo) {
            systemInfo.isOpen = !systemInfo.isOpen
        },
        onClickLeft() {
            this.$router.go(-1)
        },
    }
}
</script>

<style scoped>
.systemInfo {
    height: 100%;
    display: flex;
    flex-direction: column;
    background-color: #eee;

}

.wrap {
    padding: 1rem;
    background: #ffffff;
    margin-bottom: 0.5rem;
}

.head {
    display: flex;
    align-items: center;
}

.title {
    flex: 1 0 0;
}

.time {
    color: #999;
}

.content {
    margin-top: 0.5rem;
    white-space: pre-wrap;
    word-break: break-all;
}

.content_close {
    display: -webkit-box;
    overflow: hidden;
    text-overflow: ellipsis;
    -webkit-line-clamp: 3;
    -webkit-box-orient: vertical;
}

.split {
    border-top: 1px solid #eee;
    margin: 0.5rem 0;
}

.foot {
    text-align: center;
}
</style>
