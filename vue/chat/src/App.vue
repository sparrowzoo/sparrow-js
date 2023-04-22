<template>
    <div id="app">
        <img alt="Vue logo" src="@/assets/logo.png">
        <h1>菜单</h1>
        <ul>
            <li>
                <!--相当于a标签-->
                <router-link to="/nin1">多合1页面case</router-link>
            </li>
            <li>
                <router-link to="/login?name=123">登录</router-link>
            </li>
            <li>
                <router-link to="/menu">聊天</router-link>
            </li>
            <li>
                <router-link to="/new-friend">加好友</router-link>
            </li>
            <li>
                <router-link to="/ajax">数据请求</router-link>
            </li>
        </ul>

        <h2>参数获取</h2>
        <div>
            route-full-path: {{ $route.fullPath }}<br/>
            route-path: {{ $route.path }}<br/>
        </div>
        <!--        <router-view/>-->
        等于<br/>
        <!--        <router-view name="default" :key="$route.fullPath"/>-->
        <router-view :key="$route.fullPath"></router-view>
        <router-view name="a" :key="$route.fullPath"></router-view>
        <router-view name="b" :key="$route.fullPath"></router-view>
    </div>
</template>

<script>

export default {
    name: 'ChatMain',
    components: {},
    computed: {},
    //除了App.vue，其他的vue文件都要加上name （copilot的badcase 不对 ）
    //降了App.vue的name，其他的vue文件命名必须是驼峰命名法
    //https://sparrowzoo.feishu.cn/docx/RzKZdWXQioxE5vxamcec8YBencb
    data() {
        return {};
    },
    mounted() {
    }
}
</script>

<style>
#app {
}
</style>
