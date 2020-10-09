export default {
    show(src, entity, id, deleteFn, cancelFn) {
        src.$dialog(
            {
                width: "30em",
                title: "Delete " + entity,
                icon: "trash",
                cancel: 'default',
                btns: [
                    {
                        label: "Delete",
                        action: "delete",
                        actionFn: deleteFn,
                        color: "danger",
                        close: true,
                        icon: "x"
                    },
                    {
                        label: "Cancel",
                        action: "cancel",
                        actionFn: cancelFn,
                        close: true,
                        icon: "check",
                        isDefault: true
                    },
                ],
                text: 'Tem certeza que deseja remover o usuario ' + id
            }
        );
    }
}
