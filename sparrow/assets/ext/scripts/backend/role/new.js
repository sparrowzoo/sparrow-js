var roleController = {
    appTooltipTree: null,
    api: {
        save: "save",
        manage: "manage",
        app_tooltip: "/app/tooltip.json"
    },

    loadAppTooltip: function () {
        roleController.appTooltipTree = new $.tree("appTooltipTree");
        roleController.appTooltipTree.config.floatTreeId = "divAppTooltip";
        roleController.appTooltipTree.config.descHiddenId = "hdnAppId";
        roleController.appTooltipTree.config.descTextBoxId = "txtAppName";
    },
    load: function () {
        this.loadAppTooltip();
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
            },
            {
                id: "txtAppName",
                delegate: function (e, srcElement) {
                    roleController.appTooltipTree.initCodeTooltip('', $.url.root + roleController.api.app_tooltip);
                    roleController.appTooltipTree.show(e, 200, 250);
                }
            }
        ];
        $.dispatcher.bind();
    }
};
define("role", [], function () {
    return roleController;
});