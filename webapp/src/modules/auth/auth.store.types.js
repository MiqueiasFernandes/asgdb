export const _prefix_ = 'auth'

export const LOGIN = 'LOGIN'
export const LOGOUT = 'LOGOUT'

export const getters = {
    is_authenticated: `${_prefix_}/is_authenticated`,
    is_user: `${_prefix_}/is_user`,
    is_admin: `${_prefix_}/is_admin`,
    has_permission: `${_prefix_}/has_permission`,
    has_permissions: `${_prefix_}/has_permissions`
}

export const mutations = {
    LOGIN: `${_prefix_}/${LOGIN}`,
    LOGOUT: `${_prefix_}/${LOGOUT}`,
}

export const actions = {
    login: `${_prefix_}/login`,
    logout: `${_prefix_}/logout`,
    permissions: `${_prefix_}/permissions`,
    register: `${_prefix_}/register`,
    activate: `${_prefix_}/activate`,
    reset_password: `${_prefix_}/reset_password`,
    update_password: `${_prefix_}/update_password`,
    update_profile: `${_prefix_}/update_profile`,
}

export default {
    LOGIN, LOGOUT,
    getters, mutations, actions
}