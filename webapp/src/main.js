import { createApp } from 'vue'

import Main from './layout/Main.component.vue'

import router from './plugins/router'
import store from './plugins/store'
import bootstrap from './plugins/bootstrap'

import axios from 'axios'
axios.defaults.xsrfCookieName = 'csrftoken'
axios.defaults.xsrfHeaderName = 'X-CSRFToken'
axios.defaults.withCredentials = true

import { when_verified } from '@/shared/utils/permissions'

import titleMixin from '@/shared/mixins/titleMixin'

const app = createApp(Main)
    .use(store)
    .use(bootstrap)
    .mixin(titleMixin)

when_verified(() => app.use(router).mount('#app'))

console.log('\n\
    █████╗ ███████╗ ██████╗     ██╗██╗    \n\
   ██╔══██╗██╔════╝██╔════╝     ██║██║    \n\
   ███████║███████╗██║  ███╗██████║██████╗\n\
   ██╔══██║╚════██║██║   ██║██  ██║██  ██║\n\
   ██║  ██║███████║╚██████╔╝██████║██████║\n\
   ╚═╝  ╚═╝╚══════╝ ╚═════╝ ╚═════╝╚═════╝\n\
   developed by bio@mikeias.net\n')
