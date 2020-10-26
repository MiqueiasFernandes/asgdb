import Annotation from './Annotation'
import base from './BaseModel'

export default class Protein extends base.Model {
    constructor() {
        super('protein')
        this.fields = [
            new base.NumberField('Id').noForm().noTable().noFilter(),
            new base.StringField('Id', 'protein_id').header().asBaseLabel(),
            new base.StringField('Name'),
            new base.StringField('Family'),
        ]
        this.relations = [
            new base.ManyToMany(new Annotation())
        ]
    }
}