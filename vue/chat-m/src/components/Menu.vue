<template>
    <div class="menu">
        <router-view keep-alive :key="$route.fullPath"/>
        <van-tabbar route>
            <van-tabbar-item replace :to="{ name: 'contact'}" icon="chat-o">消息</van-tabbar-item>
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
