const routes = [
    // /user => lista os user
    {
        path: '/user',
        name: 'user',
        component: () => import('./user.component.vue'),
        beforeEnter: (to, from, next) => {
            console.log('liberar acesso a /user')
            next()
        }
    },
    {
        // /user/1 => apresenta o user 1
        path: '/user/:userId',
        props: true,
        component: () => import('./user.detail.component.vue'),
        children: [
            {
                // /user/1/edit => edita o user 1
                path: 'edit',
                props: true,
                component: () => import('./user.edit.component.vue'),
                beforeEnter: (to, from, next) => {
                    console.log('liberar acesso a /user/*/ (editar/criar)')
                    next()
                }
            },
            {
                // /user/1/delete => deleta o user 1
                path: 'delete',
                props: true,
                component: () => import('./user.delete.component.vue'),
                beforeEnter: (to, from, next) => {
                    console.log('liberar acesso a /user/* deletar')
                    next()
                }
            }
        ]
    }
]

export default routes
