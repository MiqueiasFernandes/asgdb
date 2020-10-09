export default {
    show(app, entity, form, callback, cancel) {
        app.$dialog(
            {
                title: "Edit " + entity,
                icon: "pencil",
                btns: [
                    {
                        label: "Cancel",
                        action: "cancel",
                        color: "secondary",
                        close: true,
                        icon: "x",
                    },
                    { label: "Salve", action: "save", close: true, icon: "check2" },
                ],
                form,
            },
            (action, form) => {
                if ((action === 'save' || action === 'default') && callback) {
                    callback(form)
                } else if (cancel) {
                    cancel()
                }
            }
        );
    }
}