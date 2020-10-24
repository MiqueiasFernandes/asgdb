import base from './BaseModel'

export default class Isoform extends base.Model {
    constructor() {
        super('isoform')
        this.fields = [
            new base.NumberField('Id').noForm().noTable().noFilter(),
            new base.StringField('Id', 'isoform_id'),
            new base.StringField('Splicing type', 'splicing'),
            new base.NumberField('PSI', 'psi'),
        ]
    }
}