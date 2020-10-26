import base from './BaseModel'
import Expression from './Expression'
import Gene from './Gene'
import Protein from './Protein'

export default class Isoform extends base.Model {
    constructor() {
        super('isoform')
        this.fields = [
            new base.NumberField('Id').noForm().noTable().noFilter(),
            new base.StringField('Id', 'isoform_id').asBaseLabel(),
            new base.StringField('Splicing type', 'splicing'),
            new base.NumberField('PSI', 'psi'),
        ]
        this.relations = [
            new base.ForeignKey(new Gene()),
            new base.ForeignKey(new Expression()).optional(),
            new base.ForeignKey(new Protein()).optional()
        ]
    }
}