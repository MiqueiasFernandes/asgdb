export const _prefix_ = 'auth'

export const AUTH = 'AUTH'
export const LOGGED = 'LOGGED'
export const UNLOGGED = 'UNLOGGED'

export const mutations = {
    AUTH: `${_prefix_}/${AUTH}`,
    LOGGED: `${_prefix_}/${LOGGED}`,
    UNLOGGED: `${_prefix_}/${UNLOGGED}`,
}

export const actions = {
    login: `${_prefix_}/login`,
    logout: `${_prefix_}/logout`,
}

export const getters = {
    is_authenticated: `${_prefix_}/IS_AUTHENTICATED`
}
export default {
    AUTH, LOGGED, UNLOGGED, mutations, actions, getters
}