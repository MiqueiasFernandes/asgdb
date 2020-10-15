import { createStore } from 'vuex'

import AuthStore from '@/modules/auth/auth.store'
import { _prefix_ as AUTH_PREFIX } from '@/modules/auth/auth.store.types'
import UserStore from '@/modules/user/user.store'
import { _prefix_ as USER_PREFIX } from '@/modules/user/user.store.types'

export default createStore({
  modules: {
    [AUTH_PREFIX]: AuthStore,
    [USER_PREFIX]: UserStore
  }
})
