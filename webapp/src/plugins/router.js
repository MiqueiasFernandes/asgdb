import { createRouter, createWebHashHistory } from 'vue-router'

import HomeRouter from '@/modules/home/home.router'
import AuthRouter from '@/modules/auth/auth.router'
import UserRouter from '@/modules/user/user.router'

const routes = [
    ...HomeRouter,
    ...AuthRouter,
    ...UserRouter,
    {
        path: '/401',
        name: 'Unauthorized',
        component: () => import('@/views/401.vue')
    },
    {
        path: '/:pathMatch(.*)*',
        name: 'NotFound',
        component: () => import('@/views/404.vue')
    }
]

const router = createRouter({
    history: createWebHashHistory(),
    routes
})

export default router
