import { authenticated_admin } from '@/shared/utils/permissions'

const routes = [
    {
        path: '/user',
        name: 'User',
        component: () => import('./User.component.vue'),
        beforeEnter: authenticated_admin
    },
]

export default routes;