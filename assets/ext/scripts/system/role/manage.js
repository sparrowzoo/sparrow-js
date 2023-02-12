var roleController = {
    api: {
        add: "new",
        search: "search.do",
        enable: "enable",
        disable: "disable",
        delete: "delete",
        set_privilege:'/role/set-privilege'
    },
    showPrivilege: function (roleId) {
        $.window({url: $.url.root+this.api.set_privilege+'?roleId='+roleId})
    },
    load: function () {
        $.gridView.id = "grvRoleList";
        document.forms[0].action = this.api.search;
        $.dispatcher.eventRegistry = [
            {
                id: "btnSearch",
                delegate: function (e, srcElement) {
                    $("#currentPageIndex").value(1);
                    $.submit(roleController.api.search);
                }
            },
            {
                id: "btnAdd",
                delegate: function (e, srcElement) {
                    window.location.href = roleController.api.add;
                }
            },
            {
                id: "btnEnable",
                delegate: function (e, srcElement) {
                    $.gridView.submit(roleController.api.enable, lang.message.enable);
                }
            },
            {
                id: "btnDisable",
                delegate: function (e, srcElement) {
                    $.gridView.submit(roleController.api.disable, lang.message.disable);
                }
            },
            {
                id: "btnDelete",
                delegate: function (e, srcElement) {
                    $.gridView.submit(roleController.api.delete, lang.message.delete);
                }
            }
        ];
        $.dispatcher.bind();
    }
};
define("role", [], function () {
    return roleController;
});