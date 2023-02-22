import Vue from 'vue'
import VueRouter from 'vue-router';
import store from "../store"
Vue.use(VueRouter);
const router = new VueRouter({
    routes: [
        {
            path: '/',
            redirect: '/login'
        },
        {
            path: '/login',
            meta: { pass: true },
            name: "login", component: () => import('../components/Login')
        },
        { path: '/chatPerson', name: "chatPerson", component: () => import('../components/ChatPerson') },
        { path: '/addFriend', name: "addFriend", component: () => import('../components/AddFriend') },
        { path: '/newFriend', name: "newFriend", component: () => import('../components/NewFriend') },
        { path: '/systemInfo', name: "systemInfo", component: () => import('../components/SystemInfo') },
        {
            path: '/main',
            component: () => import('../components/Main'),
            children: [
                {
                    path: '/',
                    redirect: 'chat'
                },
                //一个个对象

                //一个个对象
                { path: 'home', name: "home", component: () => import('../components/Home') }
                ,
                //一个个对象
                { path: 'chat', name: "chat", component: () => import('../components/Chat') }
                ,
                //一个个对象
                { path: 'me', name: "me", component: () => import('../components/Me') }
                ,
                { path: '/myFriend', name: "myFriend", component: () => import('../components/MyFriend') },
                ,
                { path: '/myQun', name: "myQun", component: () => import('../components/MyQun') },
                ,
                { path: '/myQunDetail', name: "myQunDetail", component: () => import('../components/MyQunDetail') },
            ]
        }
    ]
});

router.beforeEach((to, from, next) => {
    if (to.meta.pass) {
        console.log('route pass')
        next()
    } else {
        if (store.state.userId != null && store.state.userId != undefined) {
            console.log('route pass')
            next()
        } else {
            console.log('route reject')
            // router.replace({ name: 'login' })
            next({ name: 'login' })
        }
    }
})

export default router