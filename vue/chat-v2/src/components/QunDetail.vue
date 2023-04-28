<template>
    <div class="myQunDetail">
        <van-nav-bar :title="qun ? qun.qunName : ''" left-arrow @click-left="onClickLeft">
        </van-nav-bar>
        <van-grid :column-num="3">
            <van-grid-item v-for="(member,index) in qun.members" :key="index" :icon="member.avatar"
                           :text="member.userName"/>
        </van-grid>
        <van-cell-group inset>
            <van-cell title="群名称" :value="qun.qunName"/>
            <van-cell title="群公告" value="" :label="qun.announcement"/>
            <van-cell title="国籍" value="" :label="qun.nationality"/>
        </van-cell-group>
        <br/>
        <div class="center">
            <van-button type="primary" @click="existGroup">退出群聊</van-button>
        </div>
    </div>
</template>
<script>
import {Dialog, Toast} from "vant";
import {ChatApi} from "@/api/Chat";

export default {
    name: "QunDetail",
    data() {
        return {
            session: null,
            qun: {
                members: []
            }
        };
    },
    methods: {
        onClickLeft() {
            this.$router.go(-1)
        },
        existGroup() {
            Dialog.confirm({
                title: '退出群聊',
                message: '请确认退出群聊',
            }).then(async () => {
                ChatApi.existGroup(this.qun.qunId).then(res => {
                    if (res.code === 200) {
                        this.$contact.quns = this.$contact.quns.filter(qun => qun.qunId !== this.qun.qunId);
                        Toast.success("退出成功");
                        this.$router.push({name: 'qun'})
                    }
                }, () => {
                    Toast.fail("退出失败，请稍等重试");
                });
            }).catch(() => {
                // on cancel
            });
        }
    },
    mounted() {
        this.qun = this.$qunMap[this.$route.query.key];
    }
}
</script>

<style scoped>
.myQunDetail {
}

.center {
    text-align: center;
}
</style>
