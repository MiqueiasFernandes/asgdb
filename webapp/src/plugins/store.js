import { createStore } from 'vuex'

import { _prefix_ as auth_prefix } from '../modules/auth/auth.store.types'
import AuthStore from '../modules/auth/auth.store'

import { _prefix_ as user_prefix } from '../modules/user/user.store.types'
import UserStore from '../modules/user/user.store'

export default createStore({
  modules: {
    [auth_prefix]: AuthStore,
    [user_prefix]: UserStore
  }
})
