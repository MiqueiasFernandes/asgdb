import store from '@/plugins/store'
import auth_types from '@/modules/auth/auth.store.types'
import user_types from '@/modules/user/user.store.types'


export const verify_perm = (perms, router, route = '/') => {
    const needed_permissions = typeof (perms) === 'string' ? [perms] : perms
    const is_authenticated = store.getters[auth_types.getters.is_authenticated]
    const user_has_permissions = (p) => store.getters[auth_types.getters.has_permissions](p)

    if (is_authenticated) {
        if (user_has_permissions(needed_permissions)) router()
        else router({ name: 'Unauthorized', query: { reason: route } })
    } else {
        router({ name: 'Login', query: { next: route } })
    }
}

let verified = false;

const ifNotVerified = (run) => (verified = verified || run() || true)

export const when_verified = (process) => {
    store.dispatch(user_types.actions.current_user)
        .then(() => ifNotVerified(process))
        .catch(() => ifNotVerified(process))
}

export const authenticated_user = (to, next, permissions) => {
    verify_perm(['USER', ...permissions], next, to.path)
}

export const authenticated_admin = (to, next, permissions) => {
    verify_perm(['ADMIN', ...permissions], next, to.path)
}
