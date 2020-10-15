import store from '../plugins/store'
import auth_state from '../modules/auth/auth.state'
import user_types from '../modules/user/user.store.types'

export const is_authenticated = () => store.state.auth.AUTH_STATE === auth_state.AUTHSUCCESS
export const is_unauthenticated = () => !is_authenticated()
export const is_verified = () => store.state.auth.AUTH_STATE !== auth_state.UNVERIFIED

export const verify = () => store
    .dispatch(user_types.actions.getCurrentUser)
    .then(() => is_authenticated())

export const get_permissions = () => new Promise((resolve, reject) => {
    const get_perm = () => store.dispatch(user_types.actions.getPermissions).then(
        result => resolve(result),
        error => reject(error)
    )
    if (is_authenticated()) {
        get_perm()
    } else {
        verify().then((is_auth) => {
            if (is_auth) {
                get_perm()
            } else {
                reject()
            }
        })
    }
})

export const check_permissions = (permissions, success, error) => {
    get_permissions().then(
        perm =>
            !permissions ||
            (permissions.length < 1) ||
            (permissions.every(p => perm.includes(p)) && (success() || true)) ||
            error(),
        () => error())
}
