import axios from 'axios'
import types from './user.store.types'
import auth_types from '../auth/auth.store.types'
import API from '../../shared/api'

const state = ({
    current_user: null,
    activated: true,
    usuarios: []
})

const getters = {
    ACTIVATED: state => state.activated,
    USER_CURRENT: state => state.current_user,
    USER_ALL: state => state.usuarios,
    USER_BY_ID: (state, getters) => (id) => {
        const u = getters.TODOS_USUARIOS.find(u => u.id === id)
        return u;
    }
}

const mutations = {
    [types.ADD_USER](state, payload) {
        payload.id = (payload.idade + '').padStart(3, '0');
        state.usuarios.push(payload)
    },
    [types.CURRENT_USER](state, payload) {
        state.current_user = payload
    },
    [types.ACTIVATED](state, payload) {
        state.activated = payload
    },
}

const actions = {

    addUser(context, payload) {
        return axios.post(API.API_USER + '/register/', payload, { timeout: 60000 * 5 })
            .then(response => {
                if (response) {
                    if (response.status) {
                        if (response.status === 201) {
                            return 201;
                        } else if (response.data && response.data.status) {
                            return response.data.status;
                        }
                        return response.status
                    }
                    return 1
                }
                return 2
            })
    },

    updateUser(context, payload) {
        return axios.post(API.API_USER + '/profile_update/', payload, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        }).then(response => context.commit(types.mutations.CURRENT_USER, response.data))
    },

    activateUser(context, payload) {
        return axios.post(API.API_USER + '/activate/', payload)
            .then(response => {
                if (response) {
                    if (response.status) {
                        if (response.status === 200) {
                            context.commit(types.mutations.ACTIVATED, true)
                        }
                        return response.status
                    }
                    return 1
                }
                return 2
            })
    },

    updateUserPassword(context, payload) {
        return axios.post(API.API_USER + '/password_change/', payload)
            .then(response => {
                if (response) {
                    if (response.status) {
                        if (response.status === 200) {
                            return 'OK'
                        }
                    }
                }
                return null
            })
    },

    updateUserPasswordEmail(context, payload) {
        return axios.post(API.API_USER + '/password_reset/', payload)
            .then(response => {
                if (response) {
                    if (response.status) {
                        if (response.status === 200) {
                            return 'OK'
                        }
                    }
                }
                return null
            })
    },

    getPermissions() {
        return new Promise((resolve, reject) => {
            axios.get(API.API_USER + '/permission')
                .then(
                    response => resolve(Array(...response.data.permissions)),
                    error => reject(error)
                )
        })
    },

    async getCurrentUser(context) {
        return new Promise((resolve) => {

            const handle_result = (profile) => {
                context.commit(types.CURRENT_USER, profile)
                if (profile && profile.email) {
                    context.commit(auth_types.mutations.LOGGED, null, { root: true })
                    resolve(profile)
                    return profile;
                }

                context.commit(auth_types.mutations.UNLOGGED, null, { root: true })
                resolve(null)
                return null;
            }

            axios.get(API.API_USER + '/profile').then(
                response => handle_result(response.data),
                _ => handle_result(null))
        })
    }
}

export default {
    namespaced: true,
    state,
    getters,
    mutations,
    actions
}