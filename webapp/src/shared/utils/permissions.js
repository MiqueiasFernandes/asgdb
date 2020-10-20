import store from '@/plugins/store'
import auth_types from '@/modules/auth/auth.store.types'
import user_types from '@/modules/user/user.store.types'


export const verify_perm = (perms, router, route = '/') => {
    const needed_permissions = typeof (perms) === 'string' ? [perms] : perms
    const is_authenticated = store.getters[auth_types.getters.is_authenticated]
    const user_has_permissions = (p) => store.getters[auth_types.getters.has_permissions](p)

    if (is_authenticated) {
        if (user_has_permissions(needed_permissions)) router()
        else router({ name: 'Unauthorized', query: { reason: route } })
    } else {
        router({ name: 'Login', query: { next: route } })
    }
}

let verified = false;

const ifNotVerified = (run) => (verified = verified || run() || true)

export const when_verified = (process) => {
    store.dispatch(user_types.actions.current_user)
        .then(() => ifNotVerified(process))
        .catch(() => ifNotVerified(process))
}

export const authenticated_user = (to, from, next) => {
    verify_perm(['USER'], next, to.path)
}

export const authenticated_admin = (to, from, next) => {
    verify_perm(['ADMIN'], next, to.path)
}

export const has_permissions = (to, next, entity_permissions) => {
    verify_perm(entity_permissions, next, to.path)
}

export const admin_has_permissions = (to, next, entity_permissions) => {
    verify_perm(['ADMIN', ...entity_permissions], next, to.path)
}

export const user_has_permissions = (to, next, entity_permissions) => {
    verify_perm(['USER', ...entity_permissions], next, to.path)
}

export const has_view_permissions = (to, next, entity_permissions) => {
    verify_perm(entity_permissions.map(p => p.replace('/', '.view_')), next, to.path)
}
export const has_add_permissions = (to, next, entity_permissions) => {
    verify_perm(entity_permissions.map(p => p.replace('/', '.add_')), next, to.path)
}
export const has_change_permissions = (to, next, entity_permissions) => {
    verify_perm(entity_permissions.map(p => p.replace('/', '.change_')), next, to.path)
}
export const has_delete_permissions = (to, next, entity_permissions) => {
    verify_perm(entity_permissions.map(p => p.replace('/', '.delete_')), next, to.path)
}

const user_can_view = (to, next, entityes) => has_view_permissions(to, next, ['USER', ...entityes])
const user_can_add = (to, next, entityes) => has_add_permissions(to, next, ['USER', ...entityes])
const user_can_change = (to, next, entityes) => has_change_permissions(to, next, ['USER', ...entityes])
const user_can_delete = (to, next, entityes) => has_delete_permissions(to, next, ['USER', ...entityes])

const admin_can_view = (to, next, entityes) => has_view_permissions(to, next, ['ADMIN', ...entityes])
const admin_can_add = (to, next, entityes) => has_add_permissions(to, next, ['ADMIN', ...entityes])
const admin_can_change = (to, next, entityes) => has_change_permissions(to, next, ['ADMIN', ...entityes])
const admin_can_delete = (to, next, entityes) => has_delete_permissions(to, next, ['ADMIN', ...entityes])

export const short_name = (p) => p.replace(/.+_/, '')
export const p2c = (p) => {
    if (p.includes(".change_")) {
        return "warning";
    }
    if (p.includes(".delete_")) {
        return "danger";
    }
    if (p.includes(".view_")) {
        return "primary";
    }
    if (p.includes(".add_")) {
        return "success";
    }
    if (p === "ADMIN") {
        return "info";
    }
    return "secondary";
}

export default {
    user_can_view, user_can_add, user_can_change, user_can_delete,
    admin_can_view, admin_can_add, admin_can_change, admin_can_delete
}