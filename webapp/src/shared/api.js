import axios from 'axios'

const API = `/api`
export const PAGE_SIZE = 5

/*  GENERIC  */

const list = (endpoint, query, data_name) => {
    query = Object.assign({ page: 1 }, query)
    Object.keys(query).forEach((key) => !query[key] && delete query[key]);
    return new Promise((resolve, reject) =>
        axios.get(endpoint, { params: query })
            .then(res => resolve({
                query,
                page: {
                    page: query.page,
                    pages: parseInt(res.data.count / PAGE_SIZE) + ((res.data.count % PAGE_SIZE) > 0 ? 1 : 0),
                    size: res.data.results.length,
                    max_size: PAGE_SIZE,
                    items: res.data.results.map((i, idx) => ({[data_name]: i, page_id: 1+idx, item_id: (((query.page - 1) * PAGE_SIZE) + 1) + idx})),
                    total_items: res.data.count,
                    current_items: [((query.page - 1) * PAGE_SIZE) + 1, ((query.page - 1) * PAGE_SIZE) + res.data.results.length]
                }
            }))
            .catch(reject)
    )
}

const get = (endpoint, id) => {
    return axios.get(`${endpoint}/${id}`)
}

const post = (endpoint, entity) => {
    return axios.post(`${endpoint}`, entity)
}

const put = (endpoint, entity) => {
    return axios.put(`${endpoint}`, entity)
}

const remove = (endpoint) => {
    return axios.delete(`${endpoint}`)
}


class Generic {
    constructor(endpoint, data_name = 'item') {
        this.endpoint = endpoint
        this.list = (query) => list(`${API}/${endpoint}`, query, data_name)
        this.view = (id) => get(`${API}/${endpoint}`, id)
        this.create = (entity) => post(`${API}/${endpoint}`, entity)
        this.update = (entity, id) => put(`${API}/${endpoint}/${id || entity.id}`, entity)
        this.remove = (id) => remove(`${API}/${endpoint}/${id}`)
        this.page = { page: 1, ordering: '-id', count: 0, results: [], size: 0 }
    }
}


// AUTH
export const API_AUTH_LOGIN = `${API}/users/login/`
export const API_AUTH_LOGOUT = `api-auth/logout/`


// USER
export const API_USER = `${API}/users`

export const users = new Generic('users', 'user')
//users.remove = (id) => remove(`${API_USER}/remove/${id}`)
users.profile = () => axios.get(`${API_USER}/profile`)
users.get_actives = () => axios.get(`${API_USER}/count`)
users.set_permissions = (id, permissions) => {
    return axios.put(`${API_USER}/setpermissions`, {
        id,
        permissions: permissions.map(p => p.replace(".", " ").replace("_", " ")).join(",")
    })
}
users.profile_update_partial = (user) => axios.put(`${API_USER}/profile_update_partial`, user)
users.register = (user) => axios.post(`${API_USER}/register`, user)

export default {
    Generic,
    users,
}