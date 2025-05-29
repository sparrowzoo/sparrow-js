var appController = {
    api: {
        save: "save",
        manage: "manage"
    },

    load: function () {
        document.domain = $.browser.cookie.root_domain;
        $.file.initImageUploadEvent('app', "AppLogo");
        $.dispatcher.eventRegistry = [
            {
                id: "btnReturn",
                delegate: function (e, srcElement) {
                    window.location.href = appController.api.manage;
                },
                strategy: lang.command.return
            },
            {
                id: "btnSave",
                delegate: function (e, srcElement) {
                    $.v.getValidateResult(appInfo, function () {
                        $.submit(appController.api.save);
                    });
                },
                strategy: lang.command.save
            }];
        $.dispatcher.bind();
    }
};
define("app", [], function () {
    return appController;
});