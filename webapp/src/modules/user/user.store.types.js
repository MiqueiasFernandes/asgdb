export const _prefix_ = "user"

export const CURRENT_USER = 'CURRENT_USER'

export const getters = {
    current_user: `${_prefix_}/current_user`,
}

export const mutations = {
    CURRENT_USER: `${_prefix_}/${CURRENT_USER}`
}

export const actions = {
    current_user: `${_prefix_}/current_user`,
}

export default {
    _prefix_, CURRENT_USER, getters, mutations, actions
}