import Annotation from './Annotation'
import base from './BaseModel'
import Organism from './Organism'

export default class Gene extends base.Model {
    constructor() {
        super('gene')
        this.fields = [
            new base.NumberField('Id').noForm().noTable().noFilter(),
            new base.StringField('Id', 'gene_id').header().asBaseLabel(),
            new base.StringField('Name'),
            new base.StringField('Family'),
        ]
        this.relations = [
            new base.ForeignKey(new Organism()),
            new base.ManyToMany(new Annotation())
        ]
    }
}