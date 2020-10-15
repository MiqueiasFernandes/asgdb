export default {
    alert(app, entity, id, action) {
        app.$alert('O ' + entity + ' ' + id, ' foi ' + action + ' com sucesso.', null, 'warning', 5)
    }
}