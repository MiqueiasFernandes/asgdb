import "bootstrap/dist/css/bootstrap.min.css"
import bootstrap from "bootstrap/dist/js/bootstrap.bundle.js"

import Icon from './Icon.component.vue'
import Button from './Button.component.vue'
import Spiner from './Spiner.component.vue'
import Display from './Display.component.vue'
import Alert from './Alert.component.vue'
import Dialog from './Dialog.component.vue'
import Toast from './Toast.component.vue'
import Dropdown from './Dropdown.component.vue'
import Badge from './Badge.component.vue'
import Pagination from './Pagination.component.vue'
import ProgressBar from './ProgressBar.component.vue'
import File from './File.component.vue'

// install: npm i bootstrap@next bootstrap-icons
// icons:   cp node_modules/bootstrap-icons/bootstrap-icons.svg src/assets/
// usage:   main.js => `.use(boostrap)`
// App-Main.vue => `` <Dialog global/>
//                    <Toast global/>  ``
// this.$dialog( ... ... => show dialog
// this.$toast( ... ...  => display toast

// Comonents:
// Alerts       OK
// Badge        OK
// Breadcrumb   CSS
// Buttons      OK
// Button group CSS
// Card         CSS
// Carousel      X
// Close button CSS
// Collapse     --- (complexo)
// Dropdowns    OK
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
    install(app, props) {

        app.config.globalProperties.$bootstrap = bootstrap

        const choose = (prop, key, def) => prop && prop[key] ? prop[key] : def

        app.config.globalProperties.$bootstrap_conf = {
            title: choose(props, 'title_size', '4'),
            subtitle: choose(props, 'subtitle_size', '6'),
        }

        //Icon
        app.component("Icon", Icon)

        //Button
        app.component("Button", Button)

        //Spiner
        app.component("Spiner", Spiner)

        //Display
        app.component("Display", Display)

        //Dialog
        app.component("Dialog", Dialog)
        app.config.globalProperties.$dialog_handler = (dc) => this.dialog_component = dc;
        app.config.globalProperties.$dialog = (config) => {
            if (this.dialog_component) {
                return this.dialog_component.enqueue(config);
            }
        };

        // File
        app.component("File", File)

        //Pagination
        app.component("Pagination", Pagination)

        //ProgressBar
        app.component("ProgressBar", ProgressBar)

        // //Badge
        app.component("Badge", Badge)

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

        //Alert
        app.component("Alert", Alert)

        //Dropdown
        app.component("Dropdown", Dropdown)

        //Toast
        app.component("Toast", Toast)
        app.config.globalProperties.$toast_handler = (tc) => this.toast_component = tc;
        app.config.globalProperties.$toast = (text, title, color, delay) => {
            if (this.toast_component) {
                this.toast_component.notify(text, title, color, delay);
            }
        };

    }
}