import axios from 'axios'

const API = `/api`
export const PAGE_SIZE = 5

/*  GENERIC  */

const list = (endpoint, query) => {
    query = query || { page: 1 }
    return new Promise((resolve, reject) =>
        axios.get(endpoint, { params: query })
            .then(res => resolve({
                count: res.data.count,
                results: res.data.results,
                page: query.page,
                pages: parseInt(res.data.count / PAGE_SIZE) + ((res.data.count % PAGE_SIZE) > 0 ? 1 : 0),
                first: query.page === 1,
                last: !res.data.next,
                size: res.data.results.length,
                items: [((query.page - 1) * PAGE_SIZE) + 1, ((query.page - 1) * PAGE_SIZE) + res.data.results.length]
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
    return axios.post(`${endpoint}`, entity)
}

const remove = (endpoint) => {
    return axios.delete(`${endpoint}`)
}


class Generic {
    constructor(endpoint) {
        this.endpoint = endpoint
        this.list = (query) => list(`${API}/${endpoint}`, query)
        this.view = (id) => get(`${API}/${endpoint}`, id)
        this.create = (entity) => post(`${API}/${endpoint}`, entity)
        this.update = (id, entity) => put(`${API}/${endpoint}/${id}`, entity)
        this.remove = (id) => remove(`${API}/${endpoint}/${id}`)
    }
}


// AUTH
const API_AUTH_LOGIN = `${API}/users/login/`
const API_AUTH_LOGOUT = `api-auth/logout/`


// USER
export const API_USER = `${API}/users`

export const users = new Generic('users')
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
    API_AUTH_LOGIN,
    API_AUTH_LOGOUT,
    Generic,
    users,
}