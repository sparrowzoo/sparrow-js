<template>
    <div class="menu">
        聊天菜单<br/>
        <router-view keep-alive :key="$route.fullPath"/>
        <van-tabbar route>
<!--            <van-tabbar-item replace to="/main/home" icon="home-o">首页</van-tabbar-item>-->
            <van-tabbar-item replace :to="{ name: 'chat' }" icon="chat-o">消息</van-tabbar-item>
            <van-tabbar-item replace :to="{ name: 'me' }" icon="user-o">我的</van-tabbar-item>
        </van-tabbar>
    </div>
</template>
<script>

export default {
	name: 'ChatMenu',
	data() {
		return {};
	},
}
</script>

<style scoped>
.menu {
    padding-bottom: 4rem;
}
</style>
