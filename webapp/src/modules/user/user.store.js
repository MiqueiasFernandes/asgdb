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
    async current_user(context) {
        try {
            const response = await axios.get(`${API.API_USER}/profile`)
            context.commit(types.CURRENT_USER, response.data)
            context.commit(auth_types.mutations.LOGGED, null, { root: true })
        } catch (e) {
            context.commit(auth_types.mutations.UNLOGGED, null, { root: true })
            context.commit(types.CURRENT_USER, null)
        }
    },
}


export default {
    namespaced: true,
    state,
    getters,
    mutations,
    actions
}
