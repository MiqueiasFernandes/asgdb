import { createStore } from 'vuex'

import AuthStore from '@/modules/auth/auth.store'
import UsuarioStore from '@/modules/user/user.store'

export default createStore({
  modules: {
    AuthStore,
    UsuarioStore
  }
})
