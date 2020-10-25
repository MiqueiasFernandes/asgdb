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
        this.relations = []
        this.relations_to_use = {}

        this.api = new api.Generic(base_name)

        this.permission = permission || `entity/${base_name}`
        this.permission_view = this.permission.replace("/", ".view_")
        this.permission_add = this.permission.replace("/", ".add_")
        this.permission_change = this.permission.replace("/", ".change_")
        this.permission_delete = this.permission.replace("/", ".delete_")
    }

    compare(a, b) {
        return (!a && !b) || 
        (a && b && 
            this.fields.every((f) => a[f.id] === b[f.id]) && 
            this.relations.every((r) => a[r.field] === b[r.field]))
    }

    fabric(base) {
        const newObj = this
        .fields
        .reduce((o, key) => ({ ...o, [key.id]: base ? base[key.id] : key.default }), {})

        this.relations.forEach(r => newObj[r.field] = base ? base[r.field] : undefined)
        return newObj
    }

    loadRelations(onEnd) {
        let complete = 0
        this.relations.forEach((relation) => {
            
            relation.model.api.list_all().then(res => {
                if (res.length > 0) {
                    const oth = Object.keys(res[0]).join(',').replace('id', '').replace(',', '')
                    this.relations_to_use[relation.model.base_name] = res
                        .map(e => ({ id: e.id, label: e[oth] }))
                } else {
                    this.relations_to_use[relation.model.base_name] = []
                }
                complete++;
                if (complete === this.relations.length && onEnd) onEnd()
            })
        })
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

class ForeignKey {
    constructor(to, field, label) {
        this.model = to
        this.field = field || `${to.base_name}_id`
        this.label = label || this.field
    }
}

export default {
    Model, StringField, NumberField, ForeignKey
}

