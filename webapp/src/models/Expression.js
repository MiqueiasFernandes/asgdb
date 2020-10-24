import base from './BaseModel'

export default class Expression extends base.Model {
    constructor() {
        super('expression')
        this.fields = [
            new base.NumberField('Id').header().noForm(),
            new base.NumberField('Count'),
            new base.NumberField('RPKM', 'RPKM'),
            new base.StringField('Note').noTable(),
        ]
    }
}