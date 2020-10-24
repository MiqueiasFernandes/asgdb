import { createStore } from 'vuex'

import { _prefix_ as auth_prefix } from '../modules/auth/auth.store.types'
import AuthStore from '../modules/auth/auth.store'

import { _prefix_ as user_prefix } from '../modules/user/user.store.types'
import UserStore from '../modules/user/user.store'

const global = {
  state: { query: '', loading: false, placeholder: 'Search all' },
  getters: {
    search_query: state => state.query,
    search_placeholder: state => state.placeholder,
    search_all: state => state.placeholder === 'Search all',
    search_loading: state => state.loading
  },
  mutations: {
    search_loading: (s, m) => {
      s.loading = m
    },
    search: (s, p) => {
      s.query = p
    },
    search_register: (s, p) => {
      s.placeholder = p
      s.query = null
    },
    search_unregister: (s) => {
      s.placeholder = 'Search all'
    },
    reset_search: (s) => {
      s.query = ''
      s.loading = false
    }
  }
}

export default createStore({
  modules: {
    global,
    [auth_prefix]: AuthStore,
    [user_prefix]: UserStore
  }
})
