var roleController = {
    api: {
        save: "save",
        manage: "manage"
    },

    load: function () {
        document.domain = $.browser.cookie.root_domain;
        $.dispatcher.eventRegistry = [
            {
                id: "btnReturn",
                delegate: function (e, srcElement) {
                    window.location.href = roleController.api.manage;
                },
                strategy: lang.command.return
            },
            {
                id: "btnSave",
                delegate: function (e, srcElement) {
                    $.v.getValidateResult(roleInfo, function () {
                        $.submit(roleController.api.save);
                    });
                },
                strategy: lang.command.save
            }];
        $.dispatcher.bind();
    }
};
define("role", [], function () {
    return roleController;
});