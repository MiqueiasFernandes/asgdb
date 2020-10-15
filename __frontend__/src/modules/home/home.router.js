const routes = [
    {
        path: '/',
        name: 'Home',
        component: () => import('./home.component.vue')
    }
]

export default routes;