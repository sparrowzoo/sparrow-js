var codeController = {
    api: {
        new_code: "/code/new-code.json",
        update_code: "/code/update-code.json",
        sort: "/code/sort.json",
        delete: "/code/delete.json",
        load_all: "/code/load-all.json",
        code_upload:"/file-upload?path-key=code_logo"
    },
    codeTree: null,
    selectingCodeTree: null,
    load: function (upload_path) {
        $.file.initImageUploadEvent(upload_path,'code_logo',"CodeLogo")

        $.dispatcher.eventRegistry = [
            {
                id: "btnSave",
                delegate: function (e, srcElement) {
                    $.v.getValidateResult(codeInfo, function () {
                        codeController.save(srcElement.value);
                    });
                },
                strategy: lang.command.save
            },
            {
                id: "btnSave",
                delegate: function (e, srcElement) {
                    srcElement.value = lang.command.save;
                    $("#editStatus").html(lang.command.add);
                    $("#btnCancel").value(lang.command.cancel);
                    codeController.clearForm();
                },
                strategy: lang.command.add
            },
            {
                id: "btnCancel",
                delegate: function (e, srcElement) {
                    codeController.nodeDetail();
                    srcElement.value = lang.command.update;
                },
                strategy: lang.command.cancel
            }, {
                id: "btnDelete",//控件标签 id
                delegate: function (e, srcElement) {
                    codeController.deleteCode();
                },
                strategy: lang.command.delete
            },
            {
                id: "btnCancel",
                delegate: function (e, srcElement) {
                    $.v.getValidateResult(codeInfo, function () {
                        codeController.save(srcElement.value);
                    });
                },
                strategy: lang.command.update
            },
            {
                id: "txtParentName",
                delegate: function (e, srcElement) {
                    codeTree.show(event, 225, 400);
                }
            }
        ];
        $.dispatcher.bind();
        codeController.codeTree = new $.tree('codeTree');
        codeController.selectingCodeTree = new $.tree('selectingCodeTree');
        window.codeTree =codeController.codeTree;
        window.selectingCodeTree=codeController.selectingCodeTree;
        var codeTree = codeController.codeTree;
        codeTree.aNodes = [];
        codeTree.config.orderURL = $.url.root + codeController.api.sort;
        codeTree.config.delete_click = codeController.deleteCode;
        codeTree.config.treeFrameId = "divCodeTree";
        codeTree.deleteItem = codeController.deleteCode;
        codeTree.config.showOrder = false;
        codeTree.config.floatTreeId = "selectCodeTree";
        codeTree.resetIcon();
        codeTree.config.reBuildTree = function () {
            var selectingCodeTree = codeController.selectingCodeTree;
            selectingCodeTree.resetIcon();
            var cn = codeTree.aNodes[codeTree.getSelectedAi()];
            for (var i = 0; i < codeTree.aNodes.length; i++) {
                if (cn) {
                    if (cn.pid == -1 || codeTree.aNodes[i].id != cn.id
                        && codeTree.aNodes[i].pid != cn.id) {
                        selectingCodeTree.addBusinessEntity(codeTree.aNodes[i].id,
                            codeTree.aNodes[i].pid, codeTree.aNodes[i].name,
                            "javascript:codeController.nodeDetail();", codeTree.aNodes[i].title,
                            codeTree.aNodes[i].value);
                    }
                    continue;
                }
                selectingCodeTree.addBusinessEntity(codeTree.aNodes[i].id, codeTree.aNodes[i].pid,
                    codeTree.aNodes[i].name, "javascript:codeController.nodeDetail();",
                    codeTree.aNodes[i].title, codeTree.aNodes[i].value);
            }
            var selectingTree = $("+div." + codeTree.config.floatTreeId);
            selectingTree.html(selectingCodeTree);
            document.body.appendChild(selectingTree.s);
        };


        $("#divCodeTree").html(codeTree.config.loadingString);
        $.ajax.json($.url.root + codeController.api.load_all, codeController.loadCodeTree);
        document.onclick = function () {
            codeTree.clearFloatFrame();
        };
    },

    loadCodeTree: function (result) {
        var codeTree = codeController.codeTree;
        codeTree.add(0, -1, lang.message.system_code, "javascript:codeController.nodeDetail(0);");
        var codeList = result.data;
        for (var i = 0; i < codeList.length; i++) {
            //id, pid, name, url, title, businessEntity
            var code = codeList[i];
            codeTree.addBusinessEntity(code.id, code.parentId,
                code.name, "javascript:codeController.nodeDetail();",
                code.code, code);
        }
        $("#divCodeTree").html(codeTree);
        codeController.clearForm();
    },
    clearForm: function () {
        $.clearForm(codeInfo);
        var codeTree = codeController.codeTree;
        var cn = codeTree.aNodes[codeTree.getSelectedAi()];
        if (!cn) {
            return;
        }
        $("txtParentName").value = cn.name;
        $("hdnParentId").value = cn.id;
        if (cn.businessEntity) {
            $("txtCode").value = cn.businessEntity.code;
        } else {
            $("txtCode").value = "";
        }
    },
    nodeDetail: function (e) {
        var srcElement = $.event(e).srcElement;
        var cn = null;
        var codeTree = codeController.codeTree;
        if (codeTree.floatTreeFrameId) {
            cn = codeController.selectingCodeTree.aNodes[selectingCodeTree.getSelectedAi()];
            $("txtParentName").value = cn.name;
            $("hdnParentId").value = cn.id;
            var currentNodeIndex = (cn.childCount + 1) + "";
            if (cn.businessEntity) {
                $("txtCode").value = cn.businessEntity.code
                    + currentNodeIndex.leftAlignWithChar();
            } else {
                $("txtCode").value = currentNodeIndex.leftAlignWithChar();
            }
            codeTree.clearFloatFrame();
            $.v.isNull(codeInfo, srcElement);
            return;
        }

        cn = codeTree.aNodes[codeTree.getSelectedAi()];
        if (!cn) {
            codeController.clearForm();
            return;
        }
        if (cn.pid === -1) {
            $("btnSave").value = lang.command.save;
            $("editStatus").innerHTML = lang.command.add;
            $("btnCancel").value = lang.command.cancel;
            codeController.clearForm();
            return;
        }
        var remark = "";
        if (cn.businessEntity.remark) {
            remark = cn.businessEntity.remark;
        }
        $("#txtParentName").value(cn._parentNode.name);
        $("#hdnParentId").value(cn._parentNode.id);
        $("#txtCode").value(cn.businessEntity.code);
        $("#txtName").value(cn.name);
        $("#txtUrl").value(cn.businessEntity.url);

        var logo=$.toString(cn.businessEntity.logo,"");
        $("#imgCodeLogo").html("<img style='border:0;' src='" + logo + "'/>");
        $("#hdnCodeLogo").value(logo);



        $("#txtStatus").value(cn.businessEntity.status);
        $("#txtSort").value(cn.businessEntity.sort);
        $("#txtValue").value($.toString(cn.businessEntity.value));
        $("#txtRemark").value($.toString(cn.businessEntity.remark));
        $("#spanTxtCount").html(500 - remark
                .getByteLength());
        $("#btnCancel").value(lang.command.update);
        $("#btnSave").value(lang.command.add);
        $("#editStatus").html(lang.command.update);
    },
    save: function (flag) {
        var codeTree = codeController.codeTree;
        var actionUrl = $.url.root + (flag === lang.command.update ? codeController.api.update_code : codeController.api.new_code);
        var data = $.getFormData(codeInfo);
        if (flag === lang.command.update) {
            data += "&id=" + codeTree.getSelectedId();
        }
        $.ajax.json(actionUrl, data, function (result) {
            var json = result.data;
            //id, pid, name, url, title, target, childCount, showCtrl, businessEntity,icon
            var newNode = new $.treeNode(json.id, json.parentId,
                json.name, "javascript:codeController.nodeDetail();", undefined, undefined,
                undefined, undefined, json);
            if (flag === lang.command.save) {
                codeTree.appendNode(newNode);
                $.message(lang.message.save.format(json.name));
            } else {
                codeTree.updateNode(newNode);
                $.message(lang.message.update.format(json.name));
            }
        });
    },
    deleteCode: function (ai) {
        var codeTree = codeController.codeTree;
        var cn;
        if (!ai) {
            cn = codeTree.aNodes[codeTree.getSelectedAi()];
        } else {
            cn = codeTree.aNodes[ai];
        }
        if (cn._hasChild) {
            $.message(lang.message.delete_hash_child.format(cn.name));
            return;
        }
        if (window.confirm(lang.message.delete_confirm.format(cn.name))) {
            var data = "codeId=" + cn.id;
            $.ajax.json($.url.root + codeController.api.delete, data, function (json) {
                codeTree.removeNode(cn);
                codeController.clearForm();
                $.message(lang.message.del);
            });
        }
    }
// function getArea(codeController, areaCtrlArray) {
//     if (!codeController || codeController.substring(4) != '00')return;
//         $.ajax.json($.url.root + "/codeController/load-area.json","codeController=" + codeController, function (jsonList) {
//             var ctrl = null;
//             if (!codeController)ctrl = areaCtrlArray[0];
//             else if (codeController.indexOf('0000') == 2)ctrl = areaCtrlArray[1];
//             else if (codeController.indexOf('00') == 4)ctrl = areaCtrlArray[2];
//             for (var i = 0; i < jsonList.length; i++) {
//                 $(ctrl).add(jsonList[i].codeController, jsonList[i].name);
//             }
//             var firstArea = xmlHttpRequest.responseText.json()[0].codeController;
//             getArea(firstArea, areaCtrlArray);
//     });
// }
};
define("code", [], function () {
    return codeController;
});


