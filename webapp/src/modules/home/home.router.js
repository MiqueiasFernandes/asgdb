const routes = [
    {
        path: '/',
        name: 'Home',
        component: () => import('./Home.component.vue')
    }
]

export default routes;