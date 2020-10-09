import axios from 'axios'
import types from './mutation-types'
import auth_types from '../auth/mutation-types'
import API from '../../shared/api'

const state = ({
    current_user: null,
    activated: true,
    usuarios: [
        { id: '001', nome: 'Mikeias', idade: 27 },
        { id: '002', nome: 'Alda', idade: 35 }
    ]
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
        return axios.post(API.API_USER + '/register/', payload)
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

    activateUser(context, payload) {
        return axios.post(API.API_USER + '/activate/', payload)
            .then(response => {
                if (response) {
                    if (response.status) {
                        if (response.status === 200) {
                            context.commit(types.ACTIVATED, true)
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

    async getCurrentUser(context, discrete) {
        if (discrete) {
            try {
                axios.get(API.API_USER + '/profile')
                    .then(response => {
                        context.commit(types.CURRENT_USER, response.data)
                        context.commit(auth_types.LOGGED)
                    }, () => console.log('Faça login para continuar.'))
                    .catch(() => console.log('Faça login para continuar.'))
            } catch {
                return null;
            }
        } else {
            return axios.get(API.API_USER + '/profile')
                .then(response => {
                    context.commit(types.CURRENT_USER, response.data)
                    context.commit(auth_types.LOGGED)
                })
                .catch(() => context.commit('logout'))
        }

    }
}

export default {
    state,
    getters,
    mutations,
    actions
}