import Vue from 'vue'
import VueRouter from 'vue-router';

Vue.use(VueRouter);

const router = new VueRouter({
    // mode: 'history',
    routes: [
        {
            path: '/login',
            meta: {pass: true, title: '登录'},
            name: "Login",
            component: () => import('../components/Login')
        },
        {
            path: '/chat',
            meta: {pass: true, title: '聊天窗口'},
            name: "chat",
            component: () => import('../components/Dialog')
        },
        {
            path: '/new-friend',
            meta: {pass: true},
            name: "new-friend",
            component: () => import('../components/NewFriend')
        },
        {
            path: '/add-friend',
            meta: {pass: true},
            name: "add-friend",
            component: () => import('../components/AddFriend')
        },
        {
            path: '/me',
            meta: {pass: true},
            name: "me", component: () => import('../components/Me')
        },
        //消息
        {
            path: '/session',
            meta: {pass: true},
            name: "session",
            component: () => import('../components/Session')
        },
        {
            path: '/qun',
            meta: {pass: true},
            name: "qun", component: () => import('../components/Qun')
        },
        {
            path: '/qun-detail',
            meta: {pass: true},
            //按名字跳转
            //this.$router.push({name: 'qunDetail', query: {chatType: this.$protocol.CHAT_TYPE_1_2_N}});
            name: "qunDetail",
            component: () => import('../components/QunDetail')
        },
        {
            path: '/contact',
            meta: {pass: true},
            name: "contact", component: () => import('../components/Contact')
        }],
});
router.afterEach((to, from) => {
    console.log("route after" + from.path)
    if (to.meta.pass) {
        console.log('route pass')
    } else {
        console.log("route 拒绝")
    }
});

router.beforeEach((to, from, next) => {
    console.log("before  from:" + from.path + ",to:" + to.path + ",from full-path " + from.fullPath + ",to full-path" + to.fullPath);
    console.log("before  meta:" + from.meta);
    localStorage.setItem("lastPath", from.fullPath);
    next();
    // if (to.meta.pass) {
    //     console.log('route pass')
    //     //next()
    // } else {
    //     console.log("route 拒绝")
    // }
})

export default router
