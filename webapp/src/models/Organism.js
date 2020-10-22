import api from '@/shared/api'

const BASE_NAME = 'organism'
const HUMAN_NAME = 'Organism'

const config = {
    base_name: BASE_NAME,
    human_name: HUMAN_NAME,
    permission: `entity/${BASE_NAME}`,
    plural: `${HUMAN_NAME}s`,
    ico: "gem"
}

const entity_api = new api.Generic(BASE_NAME)

class Organism {
    fields =  [
        {
            label: 'Id',
            type: Number
        }
    ]
}

const instance = new Organism()

export default {
    config,
    model: instance,
    api: entity_api
}

