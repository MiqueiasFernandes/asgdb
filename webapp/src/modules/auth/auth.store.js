import axios from 'axios'
import API from '@/shared/api'
import types from './auth.store.types'
import user_types from '@/modules/user/user.store.types'

const state = {
    is_authenticated: false,
    permissions: []
}

const getters = {
    is_authenticated: state => state.is_authenticated,
    is_user: (state, getters) => getters.has_permission('USER'),
    is_admin: (state, getters) => getters.has_permission('ADMIN'),
    has_permission: state => (permission) => state.permissions.includes(permission),
    has_permissions: state => (permissions) => permissions.every(p => state.permissions.includes(p))
}

const mutations = {
    [types.LOGIN](state, payload) {
        state.is_authenticated = true
        state.permissions = payload.profile.permissions
    },
    [types.LOGOUT](state) {
        state.is_authenticated = false
        state.permissions = []
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
        return new Promise((resolve, reject) => {
            axios.post(API.API_AUTH_LOGIN, payload)
                .then((response) => {
                    const data = response.data;
                    if (data.is_authenticated) {
                        context.commit(types.LOGIN, data)
                        context.commit(user_types.mutations.CURRENT_USER, data.profile, { root: true })
                    }
                    resolve(data);
                })
                .catch((e) => {
                    context.commit(types.LOGOUT)
                    reject(e);
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
        context.commit(types.LOGOUT)
        context.commit(user_types.mutations.CURRENT_USER, null, { root: true })
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