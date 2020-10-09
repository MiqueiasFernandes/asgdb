import axios from 'axios'
import types from './mutation-types'
import user_types from '../user/mutation-types'
import auth_state from './auth.state'

import API from '../../shared/api'

const state = {
    AUTH_STATE: auth_state.UNAUTH
}

const getters = {
    IS_AUTH: state => state.AUTH_STATE === auth_state.AUTHSUCESS
}

const mutations = {
    [types.AUTH](state, new_state) {
        state.AUTH_STATE = new_state
    },
    [types.LOGGED](state) {
        state.AUTH_STATE = auth_state.AUTHSUCESS
    }
}

const actions = {
    async login(context, payload) {
        context.commit(types.AUTH, auth_state.TRYAUTH)
        return axios.post(API.API_AUTH_LOGIN, payload)
            .then(() => context.commit(types.AUTH, auth_state.AUTHSUCESS))
            .catch(() => context.commit(types.AUTH, auth_state.ERRORAUTH))

    },
    async logout(context) {
        return axios.get(API.API_AUTH_LOGOUT)
            .then(() => {
                context.commit(types.AUTH, auth_state.UNAUTH)
                context.commit(user_types.CURRENT_USER, null)
            })
            .catch(e => { console.log(e) })
    },
}

export default {
    state,
    getters,
    mutations,
    actions
}