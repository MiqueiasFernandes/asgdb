export class ValidatorCustom {
    constructor(validator, invalidText, validText) {
        this.validator = validator
        this.invalidText = invalidText || 'value is wrong.'
        this.validText = validText
    }

    validate = v => this.validator(v)
}

export class ValidatorRegex {
    constructor(regex, invalidText, validText) {
        this.re = new RegExp(regex)
        this.invalidText = invalidText || ('value must be match ' + regex + '.')
        this.validText = validText
    }

    validate(v) {
        return this.re.test(`${v}`)
    }
}

export class ValidatorRange {
    constructor(min, max, invalidText, validText) {
        this.min = min
        this.max = max
        const default_inval_text = `${'value must be ' + ((!min || !max) ? ((!max ? 'greather' : 'smaller') + ' than ' + (!max ? min : max)) : (' between ' + min + ' and ' + max))}`
        this.invalidText = invalidText || default_inval_text
        this.validText = validText
    }

    validate(v) {
        if (!this.max) {
            return v >= this.min
        }
        if (!this.min) {
            return v <= this.max
        }
        return v >= this.min && v <= this.max
    }
}

export class ValidatorRequired {
    constructor(invalidText, validText) {
        this.invalidText = invalidText || 'this field is required.'
        this.validText = validText || ''
    }

    validate = (v) => !!v
}

class Validator {
    constructor() {
        this.validators = []
    }

    extendValidator(vs) {
        this.validators.push(...vs)
    }

    hasValidator(validatorClass) {
        return this.validators.some(v => v instanceof validatorClass)
    }

    validText() {
        return this.validators.map(v => v.validText).join(' ')
    }

    invalidText() {
        return this.validators.map(v => v.invalidText).join(' ')
    }

    build() {
        const vs = this.validators
        const validator = function (value) {
            return vs.length < 1 || !vs.some(v => !v.validate(value))
        }
        return validator
    }
}

export class Field {
    constructor(id) {
        this.id = id
        this.label = id
        this.type = 'text'
        this.placeholder = undefined
        this.value = undefined
        this.validator = new Validator()
        this.style_div = null
        this.label_style = null
        this.style = null
        this.icon = null
    }

    parse() {
        return {
            id: this.id,
            label: this.label,
            type: this.type,
            placeholder: this.placeholder,
            value: this.value,
            validate: this.validator.build(),
            val_text: this.validator.validText(),
            inval_text: this.validator.invalidText(),
            required: this.validator.hasValidator(ValidatorRequired),
            style_div: this.style_div,
            label_style: this.label_style,
            style: this.style,
            icon: this.icon
        }
    }
}

export class FormBuilder {
    constructor() {
        this.currentfield = null
        this.fields = []
    }

    addField(id) {
        if (this.currentfield) {
            this.fields.push(this.currentfield)
        }
        this.currentfield = new Field(id)
        return this
    }

    withType(t) {
        this.currentfield.type = t
        return this
    }

    withLabel(l) {
        this.currentfield.label = l
        return this
    }

    withPlaceholder(p) {
        this.currentfield.placeholder = p
        return this
    }

    withValue(v) {
        this.currentfield.value = v
        return this
    }

    withValidation(validators) {
        this.currentfield.validator.extendValidator(validators)
        return this
    }

    withIcon(icon) {
        this.currentfield.icon = icon
        return this
    }

    style(style) {
        this.currentfield.style_div = style
        return this
    }

    styleLabel(style) {
        this.currentfield.label_style = style
        return this
    }

    styleInput(style) {
        this.currentfield.style = style
        return this
    }

    build() {
        if (!this.fields.some(f => f === this.currentfield)) {
            this.fields.push(this.currentfield)
        }
        return this.fields.map(f => f.parse())
    }
}
