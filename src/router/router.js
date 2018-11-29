import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)
export default new Router({
    routes: [{
            path: '/login',
            name: 'login',
            component: resolve => require(['views/login'], resolve)
        },
        {
            path: '/',
            redirect: '/login'
        },
        {
            path: '/index',
            name: 'main',
            component: resolve => require(['views/main'], resolve),
            children: [{
                    path: '/account/list',
                    name: 'account',
                    component: resolve => require(['views/account/index'], resolve)
                },
                {
                    path: '/system/menu',
                    name: 'menu',
                    component: resolve => require(['views/system/menu'], resolve)
                },
                {
                    path: '/system/labels',
                    name: 'labels',
                    component: resolve => require(['views/system/labels'], resolve)
                },
                {
                    path: '/system/keyword',
                    name: 'keyword',
                    component: resolve => require(['views/system/keywords'], resolve)
                },
                {
                    path: '/operating/comments',
                    name: 'comments',
                    component: resolve => require(['views/operating/comments'], resolve)
                },
                {
                    path: '/operating/user',
                    name: 'user',
                    component: resolve => require(['views/operating/user'], resolve)
                },
                {
                    path: '/operating/startPage',
                    name: 'startPage',
                    component: resolve => require(['views/operating/startPage'], resolve)
                },
                {
                    path: '/operating/startPage/img',
                    name: 'startPageImg',
                    component: resolve => require(['views/operating/startPageImg'], resolve)
                },
                {
                    path: '/edit/focus',
                    name: 'focus',
                    component: resolve => require(['views/edit/focus'], resolve)
                },
                {
                    path: '/edit/group',
                    name: 'group',
                    component: resolve => require(['views/edit/group'], resolve)
                },
                {
                    path: '/edit/group/new',
                    name: 'groupNew',
                    component: resolve => require(['views/edit/groupNew'], resolve)
                },
                {
                    path: '/edit/activity',
                    name: 'activity',
                    component: resolve => require(['views/edit/activity'], resolve)
                },
                {
                    path: '/edit/activity/new',
                    name: 'activityNew',
                    component: resolve => require(['views/edit/activityNew'], resolve)
                },
                {
                    path: '/edit/produce',
                    name: 'produce',
                    component: resolve => require(['views/edit/produce'], resolve)
                },
                {
                    path: '/edit/produce/new',
                    name: 'produceNew',
                    component: resolve => require(['views/edit/produceNew'], resolve)
                }
            ]
        }
    ]
})