import permissions from '@/shared/utils/permissions'

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
        beforeEnter: (to, _, next) => permissions.admin_can_view(to, next, ['users/user'])
    },
    {
        // /user/new => cria o user 1
        path: '/user/new',
        props: false,
        component: () => import('./user.edit.component.vue'),
        beforeEnter: (to, _, next) => permissions.admin_can_add(to, next, ['users/user'])
    },
    {
        // /user/1 => apresenta o user 1
        path: '/user/:userId',
        props: true,
        component: () => import('./user.detail.component.vue'),
        beforeEnter: (to, _, next) => permissions.admin_can_view(to, next, ['users/user']),
        children: [
            {
                path: 'edit',
                props: true,
                component: () => import('./user.edit.component.vue'),
                beforeEnter: (to, _, next) => permissions.admin_can_change(to, next, ['users/user'])
            },
            {
                path: 'delete',
                props: true,
                component: () => import('./user.delete.component.vue'),
                beforeEnter: (to, _, next) => permissions.admin_can_delete(to, next, ['users/user'])
            }
        ],
    }
]

export default routes;