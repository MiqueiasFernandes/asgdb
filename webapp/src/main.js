import { createApp } from 'vue'

import Main from './layout/Main.component.vue'

import router from './plugins/router'
import store from './plugins/store'
import bootstrap from './plugins/bootstrap'

import axios from 'axios'
axios.defaults.xsrfCookieName = 'csrftoken'
axios.defaults.xsrfHeaderName = 'X-CSRFToken'
axios.defaults.withCredentials = true

import titleMixin from '@/shared/mixins/titleMixin'

createApp(Main)
    .use(store)
    .use(router)
    .use(bootstrap)
    .mixin(titleMixin)
    .mount('#app')

console.log('\n\
    █████╗ ███████╗ ██████╗     ██╗██╗    \n\
   ██╔══██╗██╔════╝██╔════╝     ██║██║    \n\
   ███████║███████╗██║  ███╗██████║██████╗\n\
   ██╔══██║╚════██║██║   ██║██  ██║██  ██║\n\
   ██║  ██║███████║╚██████╔╝██████║██████║\n\
   ╚═╝  ╚═╝╚══════╝ ╚═════╝ ╚═════╝╚═════╝\n\
   developed by bio@mikeias.net\n')
