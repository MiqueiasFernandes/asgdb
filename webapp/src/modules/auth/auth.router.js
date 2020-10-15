const routes = [
    {
        path: '/login',
        name: 'Login',
        component: () => import('./Login.component.vue')
    },
    {
        path: '/logout',
        name: 'Logout',
        component: () => import('./Login.component.vue')
    },
    {
        path: '/register',
        name: 'Register',
        component: () => import('./Register.component.vue')
    },
    {
        path: '/password',
        name: 'Password',
        component: () => import('./Password.component.vue')
    }
]

export default routes;