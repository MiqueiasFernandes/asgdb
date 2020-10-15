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
    is_authenticated: state => state.auth === LoginState.AUTHENTICATED,
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

    async login(context, payload) {
        context.commit(types.AUTH, LoginState.UN_VERIFIED)
        axios.post(API.API_AUTH_LOGIN, payload)
            .then(() => {
                context.commit(types.AUTH, LoginState.AUTHENTICATED)
                context.dispatch(user_types.actions.current_user, null, { root: true })
                return true;
            })
            .catch(() => context.commit(types.AUTH, LoginState.UN_AUTHENTICATED))
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

    async logout(context) {
        context.commit(types.AUTH, LoginState.UN_AUTHENTICATED)
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