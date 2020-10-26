import Annotation from './Annotation'
import base from './BaseModel'
import Protein from './Protein'

export default class Domain extends base.Model {
    constructor() {
        super('domain')
        this.fields = [
            new base.NumberField('Id').header().noForm(),
            new base.NumberField('Start'),
            new base.NumberField('End'),
            new base.StringField('Description'),
        ]
        this.relations = [
            new base.ForeignKey(new Protein()),
            new base.ManyToMany(new Annotation())
        ]
    }
}