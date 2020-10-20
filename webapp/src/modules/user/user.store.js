import axios from 'axios'
import types from './user.store.types'
import auth_types from '@/modules/auth/auth.store.types'
import API from '@/shared/api'

const state = {
    current_user: null
}

const getters = {
    current_user: (state) => state.current_user
}


const mutations = {
    [types.CURRENT_USER](state, payload) {
        state.current_user = payload
    }
}


const actions = {
    current_user(context) {
        return new Promise((resolve, reject) => {
            const un_authenticated = () => {
                context.commit(auth_types.mutations.LOGOUT, null, { root: true })
                context.commit(types.CURRENT_USER, null)
            }
            axios.get(`${API.API_USER}/profile`)
                .then(response => {
                    const data = response.data
                    if (data.is_authenticated) {
                        context.commit(auth_types.mutations.LOGIN, data, { root: true })
                        context.commit(types.CURRENT_USER, data.profile)
                    } else {
                        un_authenticated()
                    }
                    resolve(data.profile)
                }, (e) => {
                    un_authenticated()
                    reject(e)
                })
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
