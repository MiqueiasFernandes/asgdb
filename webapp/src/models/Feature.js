import base from './BaseModel'
import Gene from './Gene'
import Isoform from './Isoform'

const FEATURE_TYPE = {Gene: 'G', mRNA: 'M', Exon: 'E', Isoform: 'I',CDS: 'C'}
const STRAND_TYPE = {Sense: 0, 'Anti-Sense': 1}

export default class Feature extends base.Model {
    constructor() {
        super('feature')
        this.fields = [
            new base.NumberField('Id').noForm().noTable().noFilter(),
            new base.StringField('Id', 'feature_id').header(),
            new base.StringField('Name'),
            new base.StringField('Contig'),
            new base.NumberField('Start'),
            new base.NumberField('End'),
            new base.OptionField('Feature', FEATURE_TYPE),
            new base.OptionField('Strand', STRAND_TYPE),
            new base.StringField('Sequence').long().noTable().noFilter().optional(),
        ]
        this.relations = [
            new base.ForeignKey(new Gene()),
            new base.ForeignKey(new Isoform()).optional()
        ]
    }
}
