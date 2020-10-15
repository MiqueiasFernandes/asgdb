import { verify_perm } from '@/shared/utils/permissions'

const routes = [
    {
        path: '/user',
        name: 'User',
        component: () => import('./User.component.vue'),
        beforeEnter: (to, from, next) => verify_perm(['USER_LIST'], next, to.path)
    },
]

export default routes;