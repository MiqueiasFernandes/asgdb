//const HOST = "http://localhost"
//const PORT = "8000"
const URL = '' //`${HOST + ':' + PORT}`

const path = (p, s) => `${p + '/' + s}`

const API = path(URL, "api")

// AUTH
const API_AUTH_LOGIN = path(API, "users/login/")
const API_AUTH_LOGOUT = path(URL, 'api-auth/logout/')
const API_AUTH_PERMISSIONS = path(API, 'users/permission/')

// USER
export const API_USER = path(API, "users")

import axios from 'axios'

const PAGE_SIZE = 5

export const get_actives = () => {
    return axios.get(`${API_USER}/count`)
}

export const list = (endpoint, query) => {
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

export const get = (endpoint, id) => {
    return axios.get(`${endpoint}/${id}`)
}


export default {
    API_AUTH_LOGIN,
    API_AUTH_LOGOUT,
    API_AUTH_PERMISSIONS,
    API_USER
}