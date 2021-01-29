import Vue from 'vue'
import VueRouter from 'vue-router'
import store from "../store"

Vue.use(VueRouter)

const routes = [
	{
		path: '/',
		name: 'base',
        component: () => import(/* webpackChunkName: "base_component" */ '../views/base/BaseComponent.vue'),
        children: [
            /**
             * TEACHER ROUTES
             */
            {
                path: 'schedule',
                name: 'schedule',
                meta: {
                    title: "Agenda"
                },
                beforeEnter: (to,from, next) => requireTeacherAuth(to, from, next),
                component: () => import(/* webpackChunkName: "schedule" */ '../views/teacherViews/schedule/Schedule.vue'), 
            },
            {
                path: 'students',
                name: 'students',
                meta: {
                    title: "Estudantes"
                },
                beforeEnter: (to,from, next) => requireTeacherAuth(to, from, next),
                component: () => import(/* webpackChunkName: "students" */ '../views/teacherViews/students/Students.vue'), 
            },
            {
                path: 'student/detail/:id',
                name: 'studentDetails',
                meta: {
                    title: "Detalhes do estudante"
                },
                beforeEnter: (to,from, next) => requireTeacherAuth(to, from, next),
                component: () => import(/* webpackChunkName: "student_detail" */ '../views/teacherViews/students/StudentDetails.vue'), 
            },
            /**
             * END OF TEACHER ROUTES
             */

            /** 
             * STUDENTS ROUTES
             */

            {
                path: 'student/schedule',
                name: 'studentSchedule',
                meta: {
                    title: "Minhas aulas"
                },
                beforeEnter: (to,from, next) => requireStudentAuth(to, from, next),
                component: () => import(/* webpackChunkName: "student_schedule" */ '../views/studentViews/schedule/Schedule.vue'), 
            },
            {
                path: 'student/teacher/list',
                name: 'studentTeachers',
                meta: {
                    title: "Meus professores"
                },
                beforeEnter: (to,from, next) => requireStudentAuth(to, from, next),
                component: () => import(/* webpackChunkName: "student_teachers" */ '../views/studentViews/myTeachers/Teachers.vue'), 
            },
            {
                path: 'student/teacher/:id',
                name: 'studentTeacherDetails',
                meta: {
                    title: "Detalhes do professor"
                },
                beforeEnter: (to,from, next) => requireStudentAuth(to, from, next),
                component: () => import(/* webpackChunkName: "student_teacher_details" */ '../views/studentViews/myTeachers/TeacherDetails.vue'), 
            },
            /**
             * END OF STUDENTS ROUTES  
             */
            {
                path: 'room',
                name: 'room',
                meta: {
                    title: "Salas de aula"
                },
                beforeEnter: requireAuth,
                component: () => import(/* webpackChunkName: "room" */ '../views/room/RoomIndex.vue'), 
            },
            {
                path: 'room/:id',
                name: 'roomDetail',
                meta: {
                    title: "Salas de aula"
                },
                beforeEnter: requireAuth,
                component: () => import(/* webpackChunkName: "room" */ '../views/room/Room.vue'), 
            },
            {
                path: 'home',
                name: 'home',
                meta: {
                    title: "Home page"
                },
                component: () => import(/* webpackChunkName: "home" */ '../views/Home.vue'), 
            },
        ]
    },
    {
        path: '/auth',
		name: 'base_login',
        component: () => import(/* webpackChunkName: "base_login" */ '../views/auth/BaseLogin.vue'),
        children: [
            {
                path: 'create_teacher',
                name: 'create_teacher',
                component: () => import(/* webpackChunkName: "create_teacher" */ '../views/auth/register/RegisterTeacher.vue'), 
            },
            {
                path: 'create_student',
                name: 'create_student',
                component: () => import(/* webpackChunkName: "create_student" */ '../views/auth/register/RegisterStudent.vue'), 
            },
            {
                path: 'login',
                name: 'login',
                component: () => import(/* webpackChunkName: "login" */ '../views/auth/login/Login.vue'), 
            },
        ]
    }
]

const requireTeacherAuth = (to, from, next) => {
    if (store.state.authUser.token && store.state.authUser.type === "professor") {
        next()
        return
    }
    next('/auth/login')
}

const requireAuth = (to, from, next) => {
    if (store.state.authUser.token) {
        next()
        return
    }
    next('/auth/login')
}

const requireStudentAuth = (to, from, next) => {
    if (store.state.authUser.token && store.state.authUser.type === "aluno") {
        next()
        return
    }
    next('/login')
}

const router = new VueRouter({
	mode: 'history',
	base: process.env.BASE_URL,
	routes
})

export default router
