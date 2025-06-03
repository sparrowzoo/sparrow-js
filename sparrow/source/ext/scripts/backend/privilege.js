var privilegeController = {
    api: {
        init: "/role/privilege",
        set: "/privilege/set"
    },
    // 资源树
    resourceTree: null,
    // 加载角色树
    load: function () {
        resourceTree = new $.tree('resourceTree');
        if ($.request("roleId")) {
            $.ajax.json($.url.root + privilegeController.api.init,
                "roleId=" + $.request("roleId"),
                privilegeController.initPrivilege);
        }
        $("#btnSave").bind("onclick", function () {
            privilegeController.submit();
        });
    },
    initPrivilege: function (result) {
        var privilegeWrap = result.data;
        privilegeController.writeResource(privilegeWrap.allResources, privilegeWrap.selectedResourceIds);
    },

    writeResource: function (allResource, selectedResource) {
        if (allResource != null && allResource.length > 0) {
            resourceTree.aNodes = [];
            resourceTree.config.useIcons = true;
            resourceTree.config.useLines = false;
            resourceTree.config.useRootIcon = false;
            resourceTree.config.usePlusMinusIcons = false;
            resourceTree.config.useTreeIdInNodeClass = true;
            resourceTree.config.useLevelInNodeClass = true;
            resourceTree.config.useCheckbox = true;
            resourceTree.resetIcon();
            resourceTree.add(0, -1, "");
            // id, pid, name, url, title, target, childCount,showCtrl, businessEntity, icon
            // title=manageURL
            for (var i = 0; i < allResource.length; i++) {
                var resource = allResource[i];
                resourceTree.add(
                    resource.id,
                    resource.parentId,
                    resource.name,
                    "javascript:void(0)",
                    resource.url + "|" + resource.permission,
                    undefined, undefined, true, resource,
                    resourceTree.config.imageDir + "/base.gif");
            }

            $("divResource").innerHTML = resourceTree;
            resourceTree.openAll();
            resourceTree.setChecked(selectedResource);
        }
    },

    submit: function () {
        var data = "resourceIds=" + resourceTree.getAllCheckedId()
            + "&roleId=" + $.request("roleId");

        $.ajax.json($.url.root + privilegeController.api.set,
            data, function (result) {
                $.alert("权限设置成功", "smile");
            });
    }
}

define("privilege", [], function () {
    return privilegeController;
});