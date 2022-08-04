var groupController = {
    api: {
        add: "new",
        manage: "manage",
        enable:"enable",
        disable:"disable",
        delete:"delete",
        search:"search"
    },

    load: function () {
        $.gridView.id="grvGroupList";
        document.forms[0].action=this.api.manage;

        $.dispatcher.eventRegistry = [
            {
                id: "btnSearch",
                delegate: function (e, srcElement) {
                    $.submit(groupController.api.manage);
                }
            },
            {
                id: "btnAdd",
                delegate: function (e, srcElement) {
                    window.location.href = groupController.api.add;
                }
            },
            {
                id: "btnEnable",
                delegate: function (e, srcElement) {
                    $.gridView.submit(groupController.api.enable,lang.message.enable);
                }
            },
            {
                id: "btnDisable",
                delegate: function (e, srcElement) {
                    $.gridView.submit(groupController.api.disable,lang.message.disable);
                }
            },
            {
                id: "btnDelete",
                delegate: function (e, srcElement) {
                        $.gridView.submit(groupController.api.delete, lang.message.delete);
                }
            }
        ];
        $.dispatcher.bind();
    }
};
define("group", [], function () {
    return groupController;
});