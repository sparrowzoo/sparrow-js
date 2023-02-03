var microServiceController = {
    api: {
        add: "new",
        search: "search.do",
        enable:"enable",
        disable:"disable",
        delete:"delete"
    },

    load: function () {
        $.gridView.id="grvMicroServiceList";
        document.forms[0].action=microServiceController.api.search;
        $.dispatcher.eventRegistry = [
            {
                id: "btnSearch",
                delegate: function (e, srcElement) {
                    $("#hdnCurrentPageIndex").value(1);
                    $.submit(microServiceController.api.search);
                }
            },
            {
                id: "btnAdd",
                delegate: function (e, srcElement) {
                    window.location.href = microServiceController.api.add;
                }
            },
            {
                id: "btnEnable",
                delegate: function (e, srcElement) {
                    $.gridView.submit(microServiceController.api.enable,lang.message.enable);
                }
            },
            {
                id: "btnDisable",
                delegate: function (e, srcElement) {
                    $.gridView.submit(microServiceController.api.disable,lang.message.disable);
                }
            },
            {
                id: "btnDelete",
                delegate: function (e, srcElement) {
                        $.gridView.submit(microServiceController.api.delete, lang.message.delete);
                }
            }
        ];
        $.dispatcher.bind();
    }
};
define("microService", [], function () {
    return microServiceController;
});