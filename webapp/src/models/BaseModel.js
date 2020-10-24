import api from '@/shared/api'

class Model {

    constructor(base_name, ico, human_name, permission, plural) {
        this.base_name = base_name
        this.human_name = human_name || (this.base_name.substr(0, 1).toUpperCase() + this.base_name.slice(1))
        this.human_name_lower = this.human_name.toLowerCase()
        this.plural = plural || `${this.human_name}s`
        this.plural_lower = this.plural.toLowerCase()
        this.ico = ico || 'asterisk'
        this.fields = []

        this.api = new api.Generic(base_name)

        this.permission = permission || `entity/${base_name}`
        this.permission_view = this.permission.replace("/", ".view_")
        this.permission_add = this.permission.replace("/", ".add_")
        this.permission_change = this.permission.replace("/", ".change_")
        this.permission_delete = this.permission.replace("/", ".delete_")
    }

    compare(a, b) {
        return (!a && !b) || (a && b && this.fields.every((f) => a[f.id] === b[f.id]))
    }

    fabric(base) {
        return this.fields.reduce((o, key) => ({ ...o, [key.id]: base ? base[key.id] : key.default }), {})
    }
}

class Field {
    constructor(label, id, type) {
        this.label = label
        this.type = type
        this.id = id || this.label.toLowerCase()
        this.is_header = false
        this.in_table = true
        this.in_form = true
        this.in_filter = true
        this.in_sort = true
        this.center = false;
        this.default = undefined;
    }

    value(val) {
        this.default = val
        return this;
    }

    header() {
        this.is_header = true
        return this;
    }

    noTable() {
        this.in_table = false;
        return this;
    }

    noForm() {
        this.in_form = false;
        return this;
    }

    noFilter() {
        this.in_filter = false;
        return this;
    }
    
    noSort() {
        this.in_sort = false;
        return this;
    }

    colCenter() {
        this.center = true;
        return this;
    }
}

class StringField extends Field {
    constructor(label, id) {
        super(label, id, String)
    }
}

class NumberField extends Field {
    constructor(label, id) {
        super(label, id, Number)
    }
}

export default {
    Model, StringField, NumberField
}

