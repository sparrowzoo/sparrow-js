import Vue from 'vue'
import VueRouter from 'vue-router';

// const A = { template: '<div>foo</div>' }
// const B = { template: '<div>B</div>' }
import A from '@/components/multi-tab/tab/A.vue'
import B from '@/components/multi-tab/tab/B.vue'


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
			path: '/ajax',
			meta: {pass: true, title: '数据请求'},
			name: "Ajax",
			component: () => import('../components/Ajax')
		},
		{
			path: '/nin1',
			meta: {pass: true, title: '多合一页面s'},
			components: {
				default: A,
				a: A,
				b: B,
			},
		},
		{path: '/chat',meta: {pass: true, title: '聊天窗口'}, name: "chat", component: () => import('../components/Chat')},

		{
			path: '/new-friend',
			meta: {pass: true},
			name: "new-friend",
			component: () => import('../components/NewFriend')
		},
		{
			path: 'add-friend',
			meta: {pass: true},
			name: "add-friend",
			component: () => import('../components/AddFriend')
		},

		{
			path: '/contact',
			meta: {pass: true},
			name: "contact", component: () => import('../components/Contact')
		},
		{
			path: '/menu',
			meta: {pass: true, title: '菜单'},
			component: () => import('../components/Menu'),
			children: [
				{
					path: '/',
					redirect: 'session'
				},
				// {
				// 	path: 'qun',
				// 	name: "qun",
				// 	component: () => import('../components/Qun')
				// },
				{
					path: 'me',
					meta: {pass: true},
					name: "me", component: () => import('../components/Me')
				},
				//消息
				{
					path: 'session',
					meta: {pass: true},
					name: "session",
					component: () => import('../components/Session')
				},
				{
					path: 'qun',
					meta: {pass: true},
					name: "qun", component: () => import('../components/Qun')
				},
				{
					path: 'qun-detail',
					name: "qunDetail",
					component: () => import('../components/QunDetail')
				}
			]
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
	if (to.meta.pass) {
		console.log('route pass')
		next()
	} else {
		console.log("route 拒绝")
	}
})

export default router