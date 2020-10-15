import store from '@/plugins/store'
import auth_types from '@/modules/auth/auth.store.types'

const has_perms = (permissions) => store.getters[auth_types.getters.has_permissions](permissions)

export const verify_perm = (perms, router) => {

    const unauthorized = () => router({ name: 'Unauthorized', query: { reason: '/user' } })
    const authorized = () => router()
    const unveryfied = () => router({ name: 'Login', query: { next: '/user' } })

    if (store.getters[auth_types.getters.permissions_loaded]) {
        if (has_perms(perms)) authorized()
        else unauthorized()
    } else {
        store.dispatch(auth_types.actions.permissions)
            .then(() => {
                if (has_perms(perms)) authorized()
                else unauthorized()
            })
            .catch(unveryfied)
    }
}
