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
        //privilegeController.writeStrategy(privilegeWrap.allStrategyList, privilegeWrap.strategyList);
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

    writeStrategy: function (allStrategy, selectedStrategy) {
        var strategyHTML = [];
        var selectedStrategyId = [];
        if (selectedStrategy) {
            for (var i = 0; i < selectedStrategy.length; i++) {
                selectedStrategyId.push(selectedStrategy[i].resourceStrategy);
            }
        }
        strategyHTML.push('<div class="pure-form pure-form-aligned"><fieldset>');
        for (var i = 0; i < allStrategy.length; i++) {
            var strategy = allStrategy[i];
            if (strategy.value.trim() === "Type") {
                strategyHTML.push('<legend>' + strategy.name + '</legend>');
                continue;
            }

            strategyHTML.push('<div class="pure-control-group">');
            strategyHTML.push('<label>' + strategy.name + '</label>');
            if (strategy.value.trim() === "CheckBox") {
                strategyHTML.push('<input id="' + strategy.strategy
                    + '" name="strategy" value="true" type="checkbox"');
                if (selectedStrategyId.indexOf(strategy.strategy) >= 0) {
                    strategyHTML.push(' checked="true"');
                }
                strategyHTML.push(' /></div>');
                continue;
            }
            strategyHTML.push('<input id="' + strategy.strategy
                + '" name="strategy" type="text" ');
            if (selectedStrategyId.indexOf(strategy.strategy) > -0) {
                strategyHTML.push(' value="' + selectedStrategy[index].value + '"');
            }
            strategyHTML.push(' /></div>');
        }
        strategyHTML.push("</fieldset></div>");
        $("divStrategy").innerHTML = strategyHTML.join("");
    },


    submit: function () {
        //不用缓存
        // var strategyArray = $("&strategy", false);
        // var selectedStrategy = [];
        // for (var i = 0; i < strategyArray.length; i++) {
        //     if (strategyArray[i].type === "text") {
        //         selectedStrategy.push(strategyArray[i].id + ": "
        //             + strategyArray[i].value);
        //     } else if (strategyArray[i].checked) {
        //         selectedStrategy.push(strategyArray[i].id + ": true");
        //     }
        // }
        //resourceTree.getAllCheckedTitle()
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