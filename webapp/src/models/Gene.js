import base from './BaseModel'

export default class Gene extends base.Model {
    constructor() {
        super('gene')
        this.fields = [
            new base.NumberField('Id').noForm().noTable().noFilter(),
            new base.StringField('Id', 'gene_id').header(),
            new base.StringField('Name'),
            new base.StringField('Family'),
        ]
    }
}