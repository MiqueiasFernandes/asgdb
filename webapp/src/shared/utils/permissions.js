import store from '@/plugins/store'
import auth_types from '@/modules/auth/auth.store.types'


export const verify_perm = (perms, router, route = '/') => {
    const unauthorized = () => router({ name: 'Unauthorized', query: { reason: route } })
    const authorized = () => router()
    const unveryfied = () => router({ name: 'Login', query: { next: route } })

    const permissions = typeof (perms) === 'string' ? [perms] : perms
    const has_perms = () => store.getters[auth_types.getters.has_permissions](permissions)

    const un_authenticated = store.getters[auth_types.getters.is_verified_unauthenticated]
    const permissions_loaded = store.getters[auth_types.getters.permissions_loaded]

    const verify_if_has_permissions = () => has_perms() ? authorized() : unauthorized()

    if (un_authenticated) {
        unveryfied()
    } else if (permissions_loaded) {
        verify_if_has_permissions()
    } else {
        store.dispatch(auth_types.actions.permissions)
            .then(verify_if_has_permissions)
            .catch(unveryfied)
    }
}

export const when_verified = (process) => verify_perm(['USER'], process)

export const authenticated_user = (to, from, next) => {
    verify_perm(['USER'], next, to.path)
}

export const authenticated_admin = (to, from, next) => {
    verify_perm(['ADMIN'], next, to.path)
}
