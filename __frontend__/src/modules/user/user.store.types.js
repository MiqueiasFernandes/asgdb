export const _prefix_ = "user"

export const ADD_USER = 'ADD_USER'
export const CURRENT_USER = 'CURRENT_USER'
export const ACTIVATED = 'ACTIVATED'

export const mutations = {
    ADD_USER: `${_prefix_}/${ADD_USER}`,
    CURRENT_USER: `${_prefix_}/${CURRENT_USER}`,
    ACTIVATED: `${_prefix_}/${ACTIVATED}`,
}

export const actions = {
    addUser: `${_prefix_}/addUser`,
    updateUser: `${_prefix_}/updateUser`,
    activateUser: `${_prefix_}/activateUser`,
    updateUserPassword: `${_prefix_}/updateUserPassword`,
    updateUserPasswordEmail: `${_prefix_}/updateUserPasswordEmail`,
    getCurrentUser: `${_prefix_}/getCurrentUser`,
    getPermissions: `${_prefix_}/getPermissions`
}

export const getters = {
    is_activated: `${_prefix_}/ACTIVATED`,
    get_current_user: `${_prefix_}/USER_CURRENT`,
    get_all_users: `${_prefix_}/USER_ALL`,
    get_user_by_id: `${_prefix_}/USER_BY_ID`
}

export default {
    ADD_USER, CURRENT_USER, ACTIVATED, mutations, actions, getters
}