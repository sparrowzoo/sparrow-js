var groupController = {
    api: {
        save: "save",
        manage: "manage"
    },

    initGroupType:function (groupType) {
        if(groupType==="SYSTEM"){
            $("divLevel").style.display="none";
            $("divCent").style.display="none";
            $("divDepartment").style.display="block";
            $("divDepartmentMaxUser").style.display="block";
        }
        else
        {
            $("divLevel").style.display="block";
            $("divCent").style.display="block";
            $("divDepartment").style.display="none";
            $("divDepartmentMaxUser").style.display="none";
        }
    },

    load: function () {
        document.domain = $.browser.cookie.root_domain;
        $.file.initImageUploadEvent('group', "GroupIco");
        $.dispatcher.eventRegistry = [
            {
                id: "btnReturn",
                delegate: function (e, srcElement) {
                    window.location.href = groupController.api.manage;
                },
                strategy: lang.command.return
            },
            {
                id: "btnSave",
                delegate: function (e, srcElement) {
                    $.v.getValidateResult(groupInfo, function () {
                        $.submit(groupController.api.save);
                    });
                },
                strategy: lang.command.save
            }];
        $.dispatcher.bind();

        $("&groupType").each(function () {
            if(this.checked){
                groupController.initGroupType(this.value);
            }
            this.onclick=function () {
                groupController.initGroupType(this.value);
            }
        });
    }
};
define("group", [], function () {
    return groupController;
});