import { createRouter, createWebHashHistory } from 'vue-router'

import HomeRouter from '@/modules/home/home.router'
import AuthRouter from '@/modules/auth/auth.router'
import UserRouter from '@/modules/user/user.router'

import EntityRouter from '@/modules/entity/entity.router.js'
import Annotation from '@/models/Annotation'
import Condition from '@/models/Condition'
import Domain from '@/models/Domain'
import Expression from '@/models/Expression'
import Feature from '@/models/Feature'
import Gene from '@/models/Gene'
import Isoform from '@/models/Isoform'
import Organism from '@/models/Organism'
import Protein from '@/models/Protein'
 
const routes = [
    ...HomeRouter,
    ...AuthRouter,
    ...UserRouter,
    ...EntityRouter.buildRouter(new Annotation()),
    ...EntityRouter.buildRouter(new Condition()),
    ...EntityRouter.buildRouter(new Domain()),
    ...EntityRouter.buildRouter(new Expression()),
    ...EntityRouter.buildRouter(new Feature()),
    ...EntityRouter.buildRouter(new Gene()),
    ...EntityRouter.buildRouter(new Isoform()),
    ...EntityRouter.buildRouter(new Organism()),
    ...EntityRouter.buildRouter(new Protein()),
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
