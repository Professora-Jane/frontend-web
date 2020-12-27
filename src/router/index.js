import Vue from 'vue'
import VueRouter from 'vue-router'
import BaseComponent from "../views/base/BaseComponent"


Vue.use(VueRouter)

const routes = [
	{
		path: '/',
		name: 'Init',
        component: BaseComponent,
        children: [
            {
                path: 'home',
                name: 'home',
                component: () => import(/* webpackChunkName: "home" */ '../views/Home.vue'), 
            },
            {
                path: 'schedule',
                name: 'schedule',
                component: () => import(/* webpackChunkName: "home" */ '../views/schedule/Schedule.vue'), 
            }
        ]
	},
	// {
	//     path: '/about',
	//     name: 'About',
	//     // route level code-splitting
	//     // this generates a separate chunk (about.[hash].js) for this route
	//     // which is lazy-loaded when the route is visited.
	//     component: () => import(/* webpackChunkName: "about" */ '../views/About.vue')
	// }
]

const router = new VueRouter({
	mode: 'history',
	base: process.env.BASE_URL,
	routes
})

export default router
