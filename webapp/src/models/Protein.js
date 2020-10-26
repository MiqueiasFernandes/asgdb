import Annotation from './Annotation'
import base from './BaseModel'

export default class Protein extends base.Model {
    constructor() {
        super('protein')
        this.fields = [
            new base.NumberField('Id').noForm().noTable().noFilter(),
            new base.StringField('Id', 'protein_id').header().asBaseLabel(),
            new base.StringField('Name').optional(),
            new base.StringField('Family').optional(),
            new base.StringField('Sequence').noTable().noFilter().long().optional(),
        ]
        this.relations = [
            new base.ManyToMany(new Annotation())
        ]
    }
}