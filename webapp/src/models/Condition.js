import base from './BaseModel'
import Organism from './Organism'

export default class Condition extends base.Model {
    constructor() {
        super('condition')
        this.fields = [
            new base.NumberField('Id').header().noForm(),
            new base.StringField('Name').asBaseLabel(),
            new base.StringField('Label'),
            new base.StringField('Replicate'),
            new base.StringField('Reference').noTable(),
            new base.StringField('Ontology').noTable(),
        ]
        this.relations = [
            new base.ForeignKey(new Organism())
        ]
    }
}