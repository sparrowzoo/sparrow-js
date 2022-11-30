//版块管理的tree对象
var resourceController = {
    api: {
        load_all: "/resource/manage",
        order: "/resource/order",
        delete: "/resource/delete",
        save: "/resource/save",
        resource_upload: "/file-upload?path-key=resource",
        resource_cover_upload: "/file-upload?path-key=resource_cover"
    },
    resourceTree: null,
    selectingResourceTree: null,
    load: function () {
        var pathKeySuffixPair = {'resource': 'Ico', 'resource_cover': 'Cover'};
        $.file.initImageUploadEvent('resource', pathKeySuffixPair);
        $.file.initImageUploadEvent('resource_cover', pathKeySuffixPair);
        $.dispatcher.eventRegistry = [
            {
                id: "btnCancel",
                delegate: function (e, srcElement) {
                    resourceController.nodeDetail();
                },
                strategy: lang.command.cancel
            },
            {
                id: "btnCancel",
                delegate: function (e, srcElement) {
                    $.v.getValidateResult(resourceInfo, function () {
                        resourceController.save(srcElement.value);
                    });
                },
                strategy: lang.command.update
            },
            {
                id: "btnSave",
                delegate: function (e, srcElement) {
                    srcElement.value = lang.command.save;
                    $("#editStatus").html(lang.command.save);
                    $("#btnCancel").value(lang.command.cancel);
                    resourceController.resetForm();
                },
                strategy: lang.command.add
            },
            {
                id: "btnSave",
                delegate: function (e, srcElement) {
                    $.v.getValidateResult(resourceInfo, function () {
                        resourceController.save(srcElement.value);
                    });
                },
                strategy: lang.command.save
            },
            {
                id: "btnDelete",
                delegate: function (e, srcElement) {
                    resourceController.deleteClick();
                }
            }];
        $.dispatcher.bind();

        resourceController.resourceTree = new $.tree("resourceTree");
        var resourceTree = resourceController.resourceTree;
        resourceTree.config.reBuildTree = function () {
            resourceController.selectingResourceTree = new $.tree("selectingResourceTree");
            selectingResourceTree = resourceController.selectingResourceTree;
            selectingResourceTree.resetIcon();
            for (var i = 0; i < resourceTree.aNodes.length; i++) {
                var resourceNode = resourceTree.aNodes[i];
                var resourceType = resourceNode.businessEntity ? resourceNode.businessEntity.resourceType : 1;
                selectingResourceTree.addBusinessEntity(
                    resourceNode.id,
                    resourceNode.pid,
                    resourceNode.name,
                    "javascript:resourceController.nodeDetail();",
                    resourceTree.config.RESOURCE_TYPE[resourceType],
                    resourceNode.businessEntity);
            }
            var selectingTree = $("+div." + resourceTree.config.floatTreeId);
            selectingTree.html(selectingResourceTree);
            document.body.appendChild(selectingTree.s);
        };

        $.tree.prototype.dbs = function (nodeId) {
            var cn = resourceTree.aNodes[nodeId];
            $.message(cn.permission);
        };

        document.onclick = function () {
            resourceController.resourceTree.clearFloatFrame();
            if (resourceController.selectingResourceTree) {
                resourceController.selectingResourceTree.clearFloatFrame();
            }
        };
        resourceTree.aNodes = [];
        resourceTree.config.showOrder = false;
        resourceTree.config.orderURL = $.url.root + this.api.order;
        resourceTree.config.treeFrameId = "divResourceTree";
        resourceTree.config.floatTreeId = "divSelectingResourceTree";
        resourceTree.config.treeNodeClass = "Menu";
        resourceTree.config.usePlusMinusIcons = false;
        resourceTree.config.useTreeIdInNodeClass = true;
        resourceTree.config.useLevelInNodeClass = true;
        resourceTree.config.closeSameLevel = true;
        resourceTree.delete_click = resourceController.deleteClick;
        resourceTree.resetIcon();
        var websiteName=$.browser.getCookie($.browser.cookie.website_name);
        if(!websiteName){
            websiteName="ROOT";
        }
        resourceTree.add(0, -1,websiteName ,
            "javascript:resourceController.nodeDetail(0);");

        $("#divResourceTree").html(resourceTree.config.loadingString);
        $.ajax.json($.url.root + this.api.load_all, function (result) {
            resourceTree = resourceController.resourceTree;
            var jsonList = result.data;
            for (var i = 0; i < jsonList.length; i++) {
                resourceEntity = jsonList[i];
                resourceTree.addBusinessEntity(
                    resourceEntity.id,
                    resourceEntity.parentId,
                    resourceEntity.name,
                    "javascript:resourceController.nodeDetail();",
                    resourceTree.config.RESOURCE_TYPE[resourceEntity.resourceType] + "|" + resourceEntity.permission,
                    resourceEntity);
            }
            $("#divResourceTree").html(resourceTree);
            resourceController.resetForm();
        });
    },
    // 重置版块输入项
    resetForm: function () {
        $.clearForm(resourceInfo);
        var cn = resourceController.resourceTree.aNodes[resourceTree.getSelectedAi()];
        if (!cn) {
            return;
        }
        $("#txtParentResourceName").value(cn.name);
        $("#hdnParentId").value(cn.id);
        $("#txtPermission").value(cn.businessEntity ? cn.businessEntity.permission : "");
    },
    // 版块点击事件
    nodeDetail: function () {
        var resourceTree = resourceController.resourceTree;
        var selectingResourceTree = resourceController.selectingResourceTree;
        if (resourceTree.floatTreeFrameId) {
            var cn = selectingResourceTree.aNodes[selectingResourceTree.getSelectedAi()];
            var txtParentResourceName = $("#txtParentResourceName");
            txtParentResourceName.value(cn.name);
            $("#hdnParentId").value(cn.id);
            if (cn.businessEntity) {
                $("#txtPermission").value(cn.businessEntity.permission);
            }
            resourceTree.clearFloatFrame();
            $.v.isNull(resourceInfo, txtParentResourceName.s);
            return
        }
        var cn = resourceTree.aNodes[resourceTree.getSelectedAi()];
        if (!cn) {
            resourceController.resetForm();
            return;
        }
        if (cn.pid === -1) {
            $("#btnSave").value(lang.command.save);
            $("#editStatus").html(lang.command.save);
            $("#btnCancel").value(lang.command.cancel);
            resourceController.resetForm();
            return;
        }
        $("#txtParentResourceName").value($.toString(cn._parentNode.name));
        $("#hdnParentId").value(cn._parentNode.id);
        $("#txtPermission").value(cn.businessEntity.permission);
        $("#txtResourceType").value($.toString(cn.businessEntity.resourceType, 2));
        $("#txtOpenType").value($.toString(cn.businessEntity.openType));
        $("#divIco").html("<img style='border:0px;' src='"
            + $.toString(cn.businessEntity.icoUrl, $.DEFAULT_RESOURCE_ICO_URL) + "'/>");
        $("#divCover").html("<img style='border:0px;' src='"
            + $.toString(cn.businessEntity.cover, $.DEFAULT_RESOURCE_ICO_URL) + "'/>");
        $("#hdnIco").value($.toString(cn.businessEntity.icoUrl, $.DEFAULT_RESOURCE_ICO_URL));
        $("#hdnCover").value($.toString(cn.businessEntity.cover, $.DEFAULT_RESOURCE_ICO_URL));
        $("#txtRemark").value($.toString(cn.businessEntity.remark));
        $("#spanTxtCount").html(500 - $.toString(cn.businessEntity.remark).getByteLength());
        $("#txtStatus").value($.toString(cn.businessEntity.status, 1));
        $("#txtResourceName").value($.toString(cn.businessEntity.name));
        $("#btnCancel").value(lang.command.update);
        $("#btnSave").value(lang.command.add);
        $("#editStatus").html(lang.command.update);
    },

    // 新建或更新版块信息
    save: function (flag) {
        var resourceTree = resourceController.resourceTree;
        var actionUrl = $.url.root + resourceController.api.save;
        var data = $.getFormData(resourceInfo);
        if (flag === lang.command.update) {
            data += "&id=" + resourceTree.getSelectedId();
        }
        $.ajax.json(actionUrl, data, function (result) {
            var resource = result.data;
            var newNode = new $.treeNode(
                resource.id,
                resource.parentId,
                resource.name,
                "javascript:resourceController.nodeDetail();",
                resourceTree.config.RESOURCE_TYPE[resource.type] + "|" + resource.permission,
                undefined,
                undefined,
                undefined,
                resource);
            if (flag === lang.command.save) {
                resourceTree.appendNode(newNode);
                $.message(lang.message.save.format(resource.name));
                return;
            }
            resourceTree.updateNode(newNode);
            $.message(lang.message.update.format(resource.name));
        });
    },

    // 版块删除事件
    deleteClick: function (ai) {
        var resourceTree = resourceController.resourceTree;
        var cn;
        if (!ai) {
            cn = resourceTree.aNodes[resourceTree.getSelectedAi()];
        } else {
            cn = resourceTree.aNodes[ai];
        }
        if (cn._hasChild) {
            $.message(lang.message.delete_has_child);
            return;
        }
        if (window.confirm(lang.message.delete_confirm)) {
            var deletePostString = "resourceId=" + cn.id;
            $.ajax.json($.url.root + this.api.delete, deletePostString,
                function (result) {
                    resourceController.resourceTree.removeNode(cn);
                    resourceController.resetForm();
                    $.message(lang.message.del);
                });
        }
    }
};

define("resource", [], function () {
    return resourceController;
});