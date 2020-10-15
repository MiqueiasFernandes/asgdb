export const _prefix_ = 'auth'

export const AUTH = 'AUTH'
export const LOGGED = 'LOGGED'
export const UNLOGGED = 'UNLOGGED'
export const PERM = 'PERM'

export const getters = {
    status: `${_prefix_}/status`,
    is_verified: `${_prefix_}/is_verified`,
    is_authenticated: `${_prefix_}/is_authenticated`,
    permissions_loaded: `${_prefix_}/permissions_loaded`,
    has_permission: `${_prefix_}/has_permission`,
    has_permissions: `${_prefix_}/has_permissions`
}

export const mutations = {
    AUTH: `${_prefix_}/${AUTH}`,
    PERM: `${_prefix_}/${PERM}`,
    LOGGED: `${_prefix_}/${LOGGED}`,
    UNLOGGED: `${_prefix_}/${UNLOGGED}`
}

export const actions = {
    login: `${_prefix_}/login`,
    logout: `${_prefix_}/logout`,
    permissions: `${_prefix_}/permissions`,
}

export default {
    AUTH, PERM, LOGGED, UNLOGGED,
    getters, mutations, actions
}