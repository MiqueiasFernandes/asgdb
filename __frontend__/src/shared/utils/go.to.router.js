export default {
    back($router) {
        window.history.length > 1 ? $router.go(-1) : $router.push('/')
    }
}