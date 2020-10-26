import base from './BaseModel'

export default class Annotation extends base.Model {
    constructor() {
        super('annotation')
        this.fields = [
            new base.NumberField('Id').header().noForm(),
            new base.StringField('Entry').asBaseLabel(),
            new base.StringField('Name').optional(),
            new base.StringField('Data Base', 'db').optional(),
            new base.StringField('Link', 'link').noTable().noFilter().optional(),
        ]
    }
}