import base from './BaseModel'

export default class Domain extends base.Model {
    constructor() {
        super('domain')
        this.fields = [
            new base.NumberField('Id').header().noForm(),
            new base.NumberField('Start'),
            new base.NumberField('End'),
            new base.StringField('Description'),
        ]
    }
}