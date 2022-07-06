var privilegeController = {
    api: {
        enable_list: "/group/enable-list.json",
        init: "/privilege/init.json",
        set: "/privilege/set.json"
    },
//用户组树
    groupTree: null,
// 资源树
    resourceTree: null,

// 加载角色树
    load: function () {
        resourceTree = new $.tree('resourceTree'),
            groupTree = new $.tree("groupTree");
        groupTree.config.floatTreeId = "divGroupTree";
        groupTree.config.useIcons = true;
        groupTree.config.useLines = false;
        groupTree.config.useRootIcon = false;
        groupTree.config.usePlusMinusIcons = false;
        groupTree.config.useTreeIdInNodeClass = true;
        groupTree.config.useLevelInNodeClass = true;
        groupTree.resetIcon();
        // 延迟加载 鼠标点击时加载
        groupTree.config.loadFloatTree = function () {
            privilegeController.initGroup();
        };


        $("#txtGroupName").bind("onclick", function () {
            groupTree.show(event, 325, 400);
        });

        $("#txtGroupName").bind("onfocus", function () {
            this.value = '';
        });

        $("#btnSubmit").bind("onclick", function () {
            privilegeController.submit();
        });

        if ($.request("groupId")) {
            $("hdnGroupId").value = $.request("groupId");
        }
        document.onclick = function () {
            groupTree.clearFloatFrame();
        };
    },

// 角色、用户组回调
    initGroup: function () {
        $.ajax.json($.url.root + privilegeController.api.enable_list, function (data) {
            groupTree.aNodes = [];
            groupTree.add(0, -1, "");

            if (data.code == 0) {
                groupList = data.data;

                for (i = 0; i < groupList.length; i++) {
                    var group = groupList[i];
                    groupTree.add(group.groupId, 0,
                        group.groupName, "javascript:privilegeController.nodeDetail();",
                        group.groupName);
                }

                $(groupTree.config.floatTreeId).innerHTML = groupTree;
                if ($.request("groupId")) {
                    privilegeController.nodeDetail(groupTree.aNodes[groupTree.getAiById($.request("groupId"))]);
                }
            }
        })
    },

// 角色 点击事件
    nodeDetail: function (cn) {
        if (!cn) {
            cn = groupTree.aNodes[groupTree.getSelectedAi()];
        }
        $("#txtGroupName").value(cn.name);
        $("#hdnGroupId").value(cn.id);
        $.ajax.json($.url.root + privilegeController.api.init, "groupId=" + cn.id, privilegeController.initPrivilege);
        groupTree.clearFloatFrame();
    },

    initPrivilege: function (result) {
        var resourceStrategy = result.data;
        privilegeController.writeResource(resourceStrategy.allResourceList, resourceStrategy.resourceList);
        privilegeController.writeStrategy(resourceStrategy.allStrategyList, resourceStrategy.strategyList);
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
            var selectedResourceId = [];
            // (id, pid, name, url, title, target,
            // childCount,showCtrl,remark,icon)
            // title=manageURL+code
            for (var i = 0; i < allResource.length; i++) {
                var resource = allResource[i];
                resourceTree.add(
                    resource.id,
                    resource.parentId,
                    resource.name,
                    "javascript:void(0)",
                    resource.manageUrl,
                    undefined, undefined, true, resource.code,
                    resourceTree.config.imageDir + "/base.gif");
            }
            for (var i = 0; i < selectedResource.length; i++) {
                selectedResourceId.push(selectedResource[i].id);
            }

            $("divResource").innerHTML = resourceTree;
            resourceTree.openAll();
            resourceTree.setChecked(selectedResourceId);
        }
    },

    writeStrategy: function (allStrategy, selectedStrategy) {
        var strategyHTML = [];
        var selectedStrategyId = [];
        for (var i = 0; i < selectedStrategy.length; i++) {
            selectedStrategyId.push(selectedStrategy[i].resourceStrategy);
        }
        strategyHTML.push('<div class="pure-form pure-form-aligned"><fieldset>');
        for (var i = 0; i < allStrategy.length; i++) {
            var strategy = allStrategy[i];
            if (strategy.value.trim() === "Type") {
                strategyHTML
                    .push('<legend>' + strategy.name + '</legend>');
                continue;
            }

            strategyHTML.push('<div class="pure-control-group">');
            strategyHTML.push('<label>' + strategy.name + '</label>');
            if (strategy.value.trim() === "CheckBox") {
                strategyHTML.push('<input id="' + strategy.code
                    + '" name="strategy" value="true" type="checkbox"');
                if (selectedStrategyId.indexOf(strategy.code) >= 0) {
                    strategyHTML.push(' checked="true"');
                }
                strategyHTML.push(' /></div>');
                continue;
            }
            strategyHTML.push('<input id="' + strategy.code
                + '" name="strategy" type="text" ');
            if (selectedStrategyId.indexOf(strategy.code) > -0) {
                strategyHTML.push(' value="' + selectedStrategy[index].value + '"');
            }
            strategyHTML.push(' /></div>');
        }
        strategyHTML.push("</fieldset></div>");
        $("divStrategy").innerHTML = strategyHTML.join("");
    },


    submit: function () {
        var strategyArray = $("&strategy");
        var selectedStrategy = [];
        for (var i = 0; i < strategyArray.length; i++) {
            if (strategyArray[i].type === "text") {
                selectedStrategy.push(strategyArray[i].id + ": "
                    + strategyArray[i].value);
            } else if (strategyArray[i].checked) {
                selectedStrategy.push(strategyArray[i].id + ": true");
            }
        }
        var data = "selectedStrategies=" + selectedStrategy.join()
            + "&selectedResources=" + resourceTree.getAllCheckedTitle()
            + "&groupId=" + $("hdnGroupId").value;

        $.ajax.json($.url.root + privilegeController.api.set,
            data, function (result) {
                alert(result);
                $.alert(lang.message.setPrivilegeSucessMessage.forms($("txtGroupName").value), "smile");
            });
    }
}

define("privilege", [], function () {
    return privilegeController;
});