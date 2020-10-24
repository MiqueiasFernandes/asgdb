import base from './BaseModel'

export default class Feature extends base.Model {
    constructor() {
        super('feature')
        this.fields = [
            new base.NumberField('Id').noForm().noTable().noFilter(),
            new base.StringField('Id', 'feature_id'),
            new base.StringField('Name'),
            new base.StringField('Contig'),
            new base.NumberField('Start'),
            new base.NumberField('End'),
            new base.StringField('Feature'),
            new base.StringField('Strand').noFilter(),
        ]
    }
}
