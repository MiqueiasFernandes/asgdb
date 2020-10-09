import "bootstrap/dist/css/bootstrap.min.css"
import bootstrap from "bootstrap/dist/js/bootstrap.bundle.js"

import Button from './Button.component.vue'
import Icon from './Icon.component.vue'
import Alert from './Alert.component.vue'
import Dialog from './Dialog.component.vue'
import Toast from './Toast.component.vue'
import Dropdown from './Dropdown.component.vue'
import Pagination from './Pagination.component.vue'
import ProgressBar from './ProgressBar.component.vue'

import { FormBuilder, ValidatorCustom, ValidatorRegex } from "../../shared/utils/formBuilder"

// install: npm install bootstrap@next bootstrap-icons
// icons:   cp node_modules/bootstrap-icons/bootstrap-icons.svg src/assets/
// usage:   main.js => `.use(boostrap)`
// App-Main.vue => `` <Dialog />
//                    <Alert />
//                    <Toast />  ``
// this.$alert( ... ...  => call alert
// this.$dialog( ... ... => show dialog
// this.$toast( ... ...  => display toast

// Alerts       OK
// Badge        OK
// Breadcrumb   CSS
// Buttons      OK
// Button group CSS
// Card         CSS
// Carousel      X
// Close button CSS
// Collapse     --- (complexo)
// Dropdowns     X
// List group   CSS
// Modal        OK
// Navs         --- (complexo)
// Navbar       OK
// Pagination   OK
// Popovers     OK
// Progress     OK
// Scrollspy    ---
// Spinners     OK
// Toasts       OK
// Tooltips     OK



export default {
    install(app) {

        app.config.globalProperties.$bootstrap = bootstrap

        //Icon
        app.component("Icon", Icon)

        //Pagination
        app.component("Pagination", Pagination)

        //ProgressBar
        app.component("ProgressBar", ProgressBar)

        //Button
        app.component("Button", Button)

        //Badge
        app.directive('badge', {
            mounted(el, b) {
                const color = 'bg-' + (b.arg || 'primary')
                const type = b.modifiers && b.modifiers.rounded ? 'rounded-pill' : ''
                el.className += ['badge', color, type].join(' ')
            }
        })

        //Tooltip
        app.directive('tooltip', {
            mounted(el, b) {
                if (b.value) {
                    el.setAttribute('data-toggle', "tooltip")
                    new bootstrap.Tooltip(el, {
                        title: b.value,
                        container: "body",
                        placement: b.arg || 'auto',
                        boundary: 'window'
                    });
                }
            }
        })

        //Popover
        app.directive('popover', {
            mounted(el, b) {
                if (b.value) {
                    if (typeof b.value === 'string') {
                        el.setAttribute('data-content', b.value)
                    } else {
                        if (b.value.title) {
                            el.title = b.value.title
                        }
                        if (b.value.content) {
                            el.setAttribute('data-content', b.value.content)
                        }
                    }
                    if (b.arg) {
                        el.setAttribute('data-placement', b.arg)
                    }
                    el.setAttribute('data-container', "body")
                    el.setAttribute('data-toggle', "popover")
                    new bootstrap.Popover(el);
                }
            }
        })

        //Spiner
        app.directive('spiner', {
            mounted(el, b) {
                var type = 'spinner-' + (b.modifiers.grow ? 'grow' : 'border')
                type += b.modifiers.sm ? (' ' + type + '-sm') : ''
                const color = b.arg ? (' text-' + b.arg) : ''
                const classes = type + color
                classes.split(' ')
                    .forEach(c => el.classList.add(c))
                el.setAttribute('role', "status")
                el.innerHtml = '<span class="sr-only">Loading...</span>'
            }
        })

        //Alert
        app.directive('alert', {
            mounted(el, b) {
                const color = 'alert-' + (b.arg || 'warning')
                el.className += ' alert fade show ' + color
                if (b.modifiers && b.modifiers.closeable) {
                    el.className += ' alert-dismissible'
                    el.innerHTML += '  <button type="button"  class="btn-close" data-dismiss="alert" aria-label="Close"></button>'
                }
            }
        })
        app.component("Alert", Alert)
        app.config.globalProperties.$alert_handler = (ac) => this.alert_component = ac;
        app.config.globalProperties.$alert = (prefix, message, btn, color, time, action) => {
            if (this.alert_component) {
                return this.alert_component.show(prefix, message, btn, color, time, action);
            }
        };
        app.config.globalProperties.$alert_close = id => {
            if (this.alert_component) {
                this.alert_component.close(id)
            }
        }

        //Dialog
        app.component("Dialog", Dialog)
        app.config.globalProperties.$dialog_handler = (dc) => this.dialog_component = dc;
        app.config.globalProperties.$dialog = (config, action) => {
            if (this.dialog_component) {
                return this.dialog_component.open(config, action);
            }
        };

        //Dropdown
        app.component("Dropdown", Dropdown)

        //Toast
        app.component("Toast", Toast)
        app.config.globalProperties.$toast_handler = (tc) => this.toast_component = tc;
        app.config.globalProperties.$toast = (title, text, detail) => {
            if (this.toast_component) {
                this.toast_component.push(title, text, detail);
            }
        };

        // Helpers
        // Login Dialog
        app.config.globalProperties.$login_dialog = (login, register, email, reset) => app.config.globalProperties.$dialog(
            {
                width: "20em",
                btn_center: true,
                title: "Login",
                icon: "lock-fill",
                centered: true,
                btns: [
                    {
                        label: "Register",
                        action: "register",
                        color: "info",
                        close: true,
                        icon: "person-plus",
                        actionFn: register
                    },
                    {
                        label: "Password",
                        close: true,
                        icon: "key",
                        actionFn: reset
                    },
                    {
                        label: "Login",
                        action: "login",
                        close: false,
                        icon: "power",
                        actionFn: login,
                        isDefault: true
                    },
                ],
                form_focus: email ? 'password' : 'login',
                form: new FormBuilder()

                    .addField('login')
                    .withIcon('person-fill')
                    .withPlaceholder('user@email.com')
                    .withValue(email)
                    .style('margin-bottom: 0 !important;')
                    .styleLabel('border-bottom-left-radius: 0 !important; border-bottom: 0 !important;')
                    .styleInput('border-bottom-right-radius: 0 !important; border-bottom: 0 !important;')
                    .withValidation([
                        new ValidatorRegex('^\\S+@(\\S+\\.){1,}\\S+$', ' ')
                    ])

                    .addField('password')
                    .withIcon('key')
                    .withPlaceholder("•••")
                    .withType('password')
                    .styleInput("border-top-right-radius: 0 !important;")
                    .styleLabel("border-top-left-radius: 0 !important;")
                    .withValidation([
                        new ValidatorCustom(v => v && v.length > 3, 'password incorrect.')
                    ])

                    .build()
            },
            (a, f) => a === 'default' ? login(f) : null
        );
    }
}