import axios from 'axios'
import API from '@/shared/api'
import types from './auth.store.types'
import user_types from '@/modules/user/user.store.types'

export const LoginState = {
    UN_VERIFIED: 1,
    AUTHENTICATED: 2,
    UN_AUTHENTICATED: 3
}

const state = {
    auth: LoginState.UN_VERIFIED,
    permissions: []
}

const getters = {
    status: state => state.auth,
    is_verified: state => state.auth !== LoginState.UN_VERIFIED,
    is_verified_unauthenticated: state => state.auth === LoginState.UN_AUTHENTICATED,
    is_admin: (state, getters) => getters.has_permission('ADMIN'),
    is_authenticated: state => state.auth === LoginState.AUTHENTICATED,
    permissions: state => state.permissions,
    permissions_loaded: state => state.permissions.length > 0,
    has_permission: state => (permission) => state.permissions.includes(permission),
    has_permissions: state => (permissions) => permissions.every(p => state.permissions.includes(p))
}

const mutations = {
    [types.AUTH](state, payload) {
        state.auth = payload
        if (state.auth !== LoginState.AUTHENTICATED) {
            state.permissions = []
        }
    },
    [types.LOGGED](state) {
        state.auth = LoginState.AUTHENTICATED
    },
    [types.UNLOGGED](state) {
        state.auth = LoginState.UN_AUTHENTICATED
        state.permissions = []
    },
    [types.PERM](state, payload) {
        state.permissions = payload
    }
}

const actions = {

    async register(context, payload) {
        return new Promise((resolve, reject) => {
            axios.post(API.API_USER + '/register/', payload)
                .then(response => {
                    if (response.status === 201) {
                        resolve()
                    } else if (response.data && response.data.message) {
                        reject([response.data.message, response.data.severity || 'warning'])
                    } else {
                        reject(['Tente novamente mais tarde.', 'danger'])
                    }
                }, () => {
                    reject(['Tente novamente mais tarde.', 'danger'])
                })
        });
    },

    activate(context, payload) {
        return new Promise((resolve, reject) => {
            axios.post(API.API_USER + '/activate/', payload)
                .then(response => {
                    if (response) {
                        if (response.status) {
                            if (response.status === 200) {
                                return resolve()
                            }
                        }
                    }
                    reject()
                },
                    () => reject()
                )
        })
    },

    reset_password(context, payload) {
        return new Promise((resolve, reject) => {
            axios.post(API.API_USER + '/password_reset/', payload)
                .then(response => {
                    if (response) {
                        if (response.status) {
                            if (response.status === 200) {
                                return resolve()
                            }
                        }
                    }
                    reject()
                },
                    () => reject())
        })
    },

    update_password(context, payload) {
        return new Promise((resolve, reject) => {
            axios.post(API.API_USER + '/password_change/', payload)
                .then(response => {
                    if (response) {
                        if (response.status) {
                            if (response.status === 200) {
                                return resolve()
                            }
                        }
                    }
                    reject()
                },
                    () => reject())
        })
    },

    async login(context, payload) {
        if (!payload.remove) {
            context.commit(types.AUTH, LoginState.UN_VERIFIED)
        }
        return new Promise((resolve, reject) => {
            axios.post(API.API_AUTH_LOGIN, payload)
                .then(() => {
                    if (!payload.remove) {
                        context.commit(types.AUTH, LoginState.AUTHENTICATED)
                        context.dispatch(user_types.actions.current_user, null, { root: true })
                        context.dispatch('permissions')
                    }
                    if (resolve) {
                        resolve();
                    }
                })
                .catch((e) => {
                    if (payload.remove) {
                        context.commit(types.AUTH, LoginState.AUTHENTICATED)
                    } else {
                        context.commit(types.AUTH, LoginState.UN_AUTHENTICATED)
                        context.commit(types.PERM, [])
                    }
                    if (reject) {
                        reject(e)
                    }
                })
        })
    },

    async permissions(context) {
        return new Promise((resolve, reject) => {
            axios.get(API.API_AUTH_PERMISSIONS)
                .then((response) => {
                    const permissions = response.data.permissions
                    context.commit(types.AUTH, LoginState.AUTHENTICATED)
                    context.commit(types.PERM, permissions)
                    resolve(permissions)
                })
                .catch(() => {
                    context.commit(types.AUTH, LoginState.UN_AUTHENTICATED)
                    context.commit(types.PERM, []);
                    reject()
                })
        })
    },

    update_profile(context, payload) {
        return new Promise((resolve, reject) => {
            axios.post(API.API_USER + '/profile_update/', payload, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            }).then(response => {
                context.commit(user_types.mutations.CURRENT_USER, response.data, { root: true });
                resolve(response.data)
            }, reject)
        })
    },

    async logout(context) {
        context.commit(types.AUTH, LoginState.UN_AUTHENTICATED)
        context.commit(user_types.mutations.CURRENT_USER, null, { root: true })
        context.commit(types.PERM, []);
        return new Promise((resolve, reject) => {
            axios.get(API.API_AUTH_LOGOUT)
                .then(resolve)
                .catch(reject)
        })
    },

}

export default {
    namespaced: true,
    state,
    getters,
    mutations,
    actions
}