var appController = {
    api: {
        add: "new",
        search: "search.do",
        enable:"enable",
        disable:"disable",
            delete:"delete"
    },load: function () {
        $.gridView.id="grvAppList";
        document.forms[0].action=this.api.search;
        $.dispatcher.eventRegistry = [
            {
                id: "btnSearch",
                delegate: function (e, srcElement) {
                    $("#hdnCurrentPageIndex").value(1);
                    $.submit(appController.api.search);
                }
            },
            {
                id: "btnAdd",
                delegate: function (e, srcElement) {
                    window.location.href = appController.api.add;
                }
            },
            {
                id: "btnEnable",
                delegate: function (e, srcElement) {
                    $.gridView.submit(appController.api.enable,lang.message.enable);
                }
            },
            {
                id: "btnDisable",
                delegate: function (e, srcElement) {
                    $.gridView.submit(appController.api.disable,lang.message.disable);
                }
            },
            {
                id: "btnDelete",
                delegate: function (e, srcElement) {
                        $.gridView.submit(appController.api.delete, lang.message.delete);
                }
            }
        ];
        $.dispatcher.bind();
  }
};
define("app", [], function () {
    return appController;
});