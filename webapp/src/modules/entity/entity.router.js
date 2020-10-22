import permissions from '@/shared/utils/permissions'

export default {
    buildRouter: (entity) => ([
        {
            path: `/${entity.config.base_name}`,
            name: entity.config.human_name,
            component: () => import('./entity.component.vue'),
            props: (route) => ({
                entity,
                ...route.params
            }),
            beforeEnter: (to, _, next) => permissions.user_can_view(to, next, [entity.config.permission])
        },
        {
            path: `/${entity.config.base_name}/new`,
            props: (route) => ({
                entity,
                ...route.params
            }),
            component: () => import('./entity.edit.component.vue'),
            beforeEnter: (to, _, next) => permissions.user_can_add(to, next, [entity.config.permission])
        },
        {
            path: `/${entity.config.base_name}/:entityId`,
            props: (route) => ({
                entity,
                ...route.params
            }),
            component: () => import('./entity.detail.component.vue'),
            beforeEnter: (to, _, next) => permissions.user_can_view(to, next, [entity.config.permission]),
            children: [
                {
                    path: 'edit',
                    props: (route) => ({
                        entity,
                        ...route.params
                    }),
                    component: () => import('./entity.edit.component.vue'),
                    beforeEnter: (to, _, next) => permissions.user_can_change(to, next, [entity.config.permission])
                },
                {
                    path: 'delete',
                    props: (route) => ({
                        entity,
                        ...route.params
                    }),
                    component: () => import('./entity.delete.component.vue'),
                    beforeEnter: (to, _, next) => permissions.user_can_delete(to, next, [entity.config.permission])
                }
            ],
        }
    ])
}