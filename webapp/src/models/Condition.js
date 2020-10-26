import base from './BaseModel'
import Organism from './Organism'

export default class Condition extends base.Model {
    constructor() {
        super('condition')
        this.fields = [
            new base.NumberField('Id').header().noForm(),
            new base.StringField('Name').asBaseLabel(),
            new base.StringField('Label').optional(),
            new base.StringField('Replicate'),
            new base.StringField('Reference').noTable().optional(),
            new base.StringField('Ontology').noTable().optional(),
        ]
        this.relations = [
            new base.ForeignKey(new Organism())
        ]
    }
}