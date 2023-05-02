import Vue from "vue";
import VueRouter from "vue-router";
// import store from "../store";
// import Login from "../views/login.vue"; "../views/login.vue"
const Login = () => import("@/views/login.vue");
const Main = () => import("@/views/layout/layout.vue");
const MyFriend = () => import("@/views/myFriend/myFriend.vue");
const ChatMsg = () => import("@/views/chatMsg/chatMsg.vue");
const ContactService = () =>
  import("@/views/contactService/contactService.vue");
const SystemNotice = () => import("@/views/systemNotice/systemNotice.vue");
const AddFriend = () => import("@/views/myFriend/addFriend/addFriend.vue");
const NewFriend = () => import("@/views/myFriend/newFriend/newFriend.vue");
const MyGroup = () => import("@/views/myFriend/myGroup/myGroup");

Vue.use(VueRouter);
// 解决重复push同一路径报错问题
const originalPush = VueRouter.prototype.push;
// 修改原型对象中的push方法
VueRouter.prototype.push = function push(location) {
  return originalPush.call(this, location).catch((err) => err);
};

const routes = [
  {
    path: "/",
    name: "login",
    component: Login,
  },
  {
    path: "/main",
    name: "main",
    component: Main,
    children: [
      {
        path: "/main",
        name: "friend",
        component: MyFriend,
        children: [
          { path: "/main", name: "addFriend", component: AddFriend },
          { path: "new", name: "newFriend", component: NewFriend },
          { path: "group", name: "myGroup", component: MyGroup },
        ],
      },
      { path: "message", name: "message", component: ChatMsg },
      {
        path: "notice",
        name: "notice",
        component: SystemNotice,
      },
      {
        path: "service",
        name: "service",
        component: ContactService,
      },
    ],
  },
];

const router = new VueRouter({
  mode: "history",
  base: process.env.BASE_URL,
  routes,
});

// router.beforeEach((to, from, next) => {
//   console.log(to, "to");
//   console.log(from, "from");
//   console.log(store.state);
//   next();
// });

export default router;
