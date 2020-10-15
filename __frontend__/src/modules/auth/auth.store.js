import axios from 'axios'
import types from './auth.store.types'
import user_types from '../user/user.store.types'
import auth_state from './auth.state'

import API from '../../shared/api'

const state = {
    AUTH_STATE: auth_state.UNVERIFIED
}

const getters = {
    IS_AUTHENTICATED: state => state.AUTH_STATE === auth_state.AUTHSUCCESS
}

const mutations = {
    [types.AUTH](state, new_state) {
        state.AUTH_STATE = new_state
    },
    [types.LOGGED](state) {
        state.AUTH_STATE = auth_state.AUTHSUCCESS
    },
    [types.UNLOGGED](state) {
        state.AUTH_STATE = auth_state.UNAUTHENTICATED
    }
}

const actions = {
    async login(context, payload) {
        context.commit(types.AUTH, auth_state.TRYAUTH)
        return axios.post(API.API_AUTH_LOGIN, payload)
            .then(() => context.commit(types.AUTH, auth_state.AUTHSUCCESS))
            .catch(() => context.commit(types.AUTH, auth_state.ERRORAUTH))

    },
    async logout(context) {
        context.commit(types.AUTH, auth_state.UNAUTHENTICATED)
        context.commit(user_types.mutations.CURRENT_USER, null, {root: true})
        return axios.get(API.API_AUTH_LOGOUT).then(() => { })
    },
}

export default {
    namespaced: true,
    state,
    getters,
    mutations,
    actions
}