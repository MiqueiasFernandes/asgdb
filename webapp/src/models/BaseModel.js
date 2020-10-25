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
        const arrayComp = (c, d) => (!c && !d) || (c && d && c.every(x => d.includes(x)) && c.every(x => d.includes(x)))
        return (!a && !b) ||
            (a && b &&
                this.fields.every((f) => a[f.id] === b[f.id]) &&
                this.relations.filter(r => !r.multiple).every((r) => a[r.write] === b[r.write]) &&
                this.relations.filter(r => r.multiple).every((r) => arrayComp(a[r.write], b[r.write]))
                )
    }

    fabric(base, write) {
        const newObj = this
            .fields
            .reduce((o, key) => ({ ...o, [key.id]: base ? base[key.id] : key.default }), {})
        if (write) {
            this.relations.forEach(r => { 
                if (r.multiple) {
                    newObj[r.write] = base ? base[r.read].map(i => i.id) : []
                } else {
                    newObj[r.write] = base ? base[r.read].id : undefined
                }
            })
        } else {
            this.relations.forEach(r => newObj[r.read] = base ? base[r.read] : undefined)
        }
        return newObj
    }

    loadRelations(onEnd) {
        this.relations.forEach((relation) => {
            relation.model.api.list_all().then(res => {
                if (res.length > 0) {
                    this.relations_to_use[relation.name] = res
                        .map(e => ({ id: e.id, label: e[relation.label] }))
                } else {
                    this.relations_to_use[relation.name] = []
                }
                if (onEnd) onEnd()
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
        this.base_label = false;
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

    asBaseLabel() {
        this.base_label = true;
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
    constructor(to, label, read, write, human, sort) {
        this.model = to
        this.name = to.base_name
        this.label = label || to.fields.filter(f => f.base_label)[0].id
        this.read = read || to.base_name
        this.write = write || `${to.base_name}_id`
        this.human = to.human_name || human
        this.sort = sort || `${this.name}__${this.label}`
        this.center = true
    }

    noSort() {
        this.sort = null;
        return this;
    }

    noCenter() {
        this.center = false
    }
}

class ManyToMany extends ForeignKey {
    constructor(to, label, read, write, human) {
        super(to, label, read || to.plural_lower, write || to.plural_lower, human)
        this.multiple = true
        this.name = to.plural_lower
        this.noSort()
    }
}

export default {
    Model, StringField, NumberField, ForeignKey, ManyToMany
}

