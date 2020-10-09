const routes = [
    {
        path: '/login',
        name: 'Login',
        component: () => import('./auth.component.vue')
    },
    {
        path: '/logout',
        name: 'Logout',
        component: () => import('./auth.component.vue')
    },
    {
        path: '/register',
        name: 'Register',
        component: () => import('./register.component.vue')
    },
    {
        path: '/password',
        name: 'Password',
        component: () => import('./password.component.vue')
    },
]

export default routes
