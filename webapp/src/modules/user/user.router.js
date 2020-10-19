import { authenticated_admin } from '@/shared/utils/permissions'

// #  PERM
// #  Create => create
// #  View   => retrieve
// #  List   => list
// #  Update => update, partial_update
// #  Remove => destroy

const routes = [
    {
        path: '/user',
        name: 'User',
        component: () => import('./user.component.vue'),
        beforeEnter: authenticated_admin // & user_List
    },
    {
        // /user/new => cria o user 1
        path: '/user/new',
        props: false,
        component: () => import('./user.edit.component.vue'),
        beforeEnter: authenticated_admin  // & user_Create
    },
    {
        // /user/1 => apresenta o user 1
        path: '/user/:userId',
        props: true,
        component: () => import('./user.detail.component.vue'),
        beforeEnter: authenticated_admin, // & user_View
        children: [
            {
                path: 'edit',
                props: true,
                component: () => import('./user.edit.component.vue'),
                //beforeEnter: authenticated_admin & user_Update
            },
            {
                path: 'delete',
                props: true,
                component: () => import('./user.delete.component.vue'),
                //beforeEnter: authenticated_admin & user_Remove
            }
        ],
    }
]

export default routes;