import base from './BaseModel'

export default class Condition extends base.Model {
    constructor() {
        super('condition')
        this.fields = [
            new base.NumberField('Id').header().noForm(),
            new base.StringField('Name'),
            new base.StringField('Label'),
            new base.StringField('Replicate'),
            new base.StringField('Reference'),
            new base.StringField('Ontology').noTable(),
        ]
    }
}