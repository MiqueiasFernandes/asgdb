import base from './BaseModel'

export default class Organism extends base.Model {
    constructor() {
        super('organism')
        this.fields = [
            new base.NumberField('Id').header().noForm(),
            new base.NumberField('Taxonomy').colCenter(),
            new base.StringField('Scientific Name', 'name'),
            new base.StringField('Popular name', 'aka'),
            new base.StringField('Lineage').noTable()
        ]
    }
}
