import Vue from 'vue'
import VueRouter from 'vue-router';
import {Sparrow} from "../../../../source/scripts/sparrow_es";

Vue.use(VueRouter);

const router = new VueRouter({
    // mode: 'history',
    routes: [
        {
            path: '/login',
            meta: {need_auth: false, title: '登录'},
            name: "Login",
            component: () => import('../components/Login')
        },
        {
            path: '/chat',
            meta: {need_auth: true, title: '聊天窗口'},
            name: "chat",
            component: () => import('../components/Dialog')
        },
        {
            path: '/new-friend',
            meta: {need_auth: true},
            name: "new-friend",
            component: () => import('../components/NewFriend')
        },
        {
            path: '/add-friend',
            meta: {need_auth: true},
            name: "add-friend",
            component: () => import('../components/AddFriend')
        },
        {
            path: '/me',
            meta: {need_auth: true},
            name: "me", component: () => import('../components/Me')
        },
        //消息
        {
            path: '/session',
            meta: {need_auth: true},
            name: "session",
            component: () => import('../components/Session')
        },
        {
            path: '/qun',
            meta: {need_auth: true},
            name: "qun", component: () => import('../components/Qun')
        },
        {
            path: '/qun-detail',
            meta: {need_auth: true},
            //按名字跳转
            //this.$router.push({name: 'qunDetail', query: {chatType: this.$protocol.CHAT_TYPE_1_2_N}});
            name: "qunDetail",
            component: () => import('../components/QunDetail')
        },
        {
            path: '/contact',
            meta: {need_auth: true},
            name: "contact", component: () => import('../components/Contact')
        }],
});
VueRouter.prototype.getToken = function () {
    //url 优先
    var token = Sparrow.request("token");
    if (!Sparrow.isNullOrEmpty(token)) {
        localStorage.setItem("token", token);
        return token;
    }
    return localStorage.getItem("token");
};
router.afterEach((to, from) => {
    console.log("route after" + from.path)
    if (!to.meta.need_auth) {
        console.log('route pass')
    } else {
        console.log("route 拒绝")
    }
});

router.beforeEach((to, from, next) => {
    console.log("before  from:" + from.path + ",to:" + to.path + ",from full-path " + from.fullPath + ",to full-path" + to.fullPath);
    console.log("before  meta:" + from.meta);

    if (!to.meta.need_auth) {
        next();
        return;
    }
    if (router.getToken() != null) {
        next();
        return;
    }
    console.log("route 拒绝")
})

export default router
