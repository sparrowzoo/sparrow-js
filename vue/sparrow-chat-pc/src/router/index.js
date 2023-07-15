import Vue from "vue";
import VueRouter from "vue-router";
// import store from "../store";
// import Login from "../views/login.vue"; "../views/login.vue"

const Login = () => import("@/views/Login");
const Main = () => import("@/views/layout/Layout");
const ContactMenu = () => import("@/views/layout/ContactMenu");
const Contact = () => import("@/views/Contact.vue");
const NewFriend = () => import("@/views/NewFriend");
const NewQunMember = () => import("@/views/NewQunMember");

const Qun = () => import("@/views/Qun");

const PlatformService = () => import("@/views/PlatformService");

const Session = () => import("@/views/Session");
const SystemNotice = () => import("@/views/SystemNotice");

Vue.use(VueRouter);
// 解决重复push同一路径报错问题
const originalPush = VueRouter.prototype.push;
// 修改原型对象中的push方法
VueRouter.prototype.push = function push(location) {
  return originalPush.call(this, location).catch((err) => err);
};

const router = new VueRouter({
  base: process.env.BASE_URL,
  routes: [
    {
      path: "/login",
      name: "login",
      component: Login,
    },
    {
      path: "/",
      name: "main",
      component: Main,
      children: [
        {
          path: "/contact",
          name: "contact-menu",
          component: ContactMenu,
          children: [
            {
              path: "/",
              name: "contact",
              component: Contact,
            },
            {
              path: "new-friend",
              name: "new-friend",
              component: NewFriend,
            },
            {
              path: "new-qun-member",
              name: "new-qun-member",
              component: NewQunMember,
            },
            {
              path: "qun",
              name: "qun",
              component: Qun,
            },
          ],
        },
        {
          path: "session",
          name: "session",
          component: Session,
        },
        {
          path: "notice",
          name: "notice",
          component: SystemNotice,
        },
        {
          path: "platform-service",
          name: "platform-service",
          component: PlatformService,
        },
      ],
    },
  ],
});

// router.beforeEach((to, from, next) => {
//   console.log(to, "to");
//   console.log(from, "from");
//   console.log(store.state);
//   next();
// });

export default router;
