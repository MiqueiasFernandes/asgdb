export default {
    back($router, alternative = "/") {
        if (window.history.length > 1) {
            const back = window.history.state.back
            let next = back ? back.split("next=") : null
            if (next) {
                next = next.length > 1 ? next[1].split('&')[0] : null
                if (next === window.history.state.current) {
                    return $router.push(alternative)
                }
                return $router.go(-1)
            }
        }
        return $router.push('/')
    }
}