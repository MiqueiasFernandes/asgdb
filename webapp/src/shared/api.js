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
const API_USER = path(API, "users")

export default {
    API_AUTH_LOGIN,
    API_AUTH_LOGOUT,
    API_AUTH_PERMISSIONS,
    API_USER
}