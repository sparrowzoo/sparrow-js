var menuController = {
    lang: {
        command: {
            openAll: "展开全部",
            closeAll: "关闭全部"
        },
        message: {
            accessDenied: "访问被拒绝"
        }
    },
    menuTree: null,
    load: function () {
        $.ajax.referWindow = window.parent;
        this.menuTree = new $.tree('menuTree');
        $("#divMenuTree").html(this.menuTree.config.loadingString);
        var btnOpen = $("#btnOpen");
        btnOpen.value(this.lang.command.openAll);

        btnOpen.bind("onclick", function () {
            if (this.value == menuController.lang.command.openAll) {
                menuController.menuTree.openAll();
                this.value = menuController.lang.command.closeAll
            }
            else {
                menuController.menuTree.closeAll();
                this.value = menuController.lang.command.openAll;
            }
        });
        $.ajax.json($.url.root + "/privilege/menu.json", menuController.render);
    },
    render: function (result) {
        var json = result.data;
        if (json.length === 0) {
            var divMenu = $("#divMenuTree");
            divMenu.class("highlight");
            divMenu.html(this.lang.message.accessDenied);
            return;
        }
        var menuTree = menuController.menuTree;
        menuTree.aNodes = [];
        menuTree.config.showOrder = false;
        menuTree.config.useIcons = true;
        menuTree.config.useLines = false;
        menuTree.config.useRootIcon = false;
        menuTree.config.usePlusMinusIcons = false;
        menuTree.config.useTreeIdInNodeClass = true;
        menuTree.config.useLevelInNodeClass = true;
        menuTree.config.closeSameLevel = true;
        menuTree.resetIcon();
        menuTree.add(0, -1, "");
        var menuList = json;

        for (var i = 0; i < menuList.length; i++) {
            var url = "";
            if (menuList[i].actualManageUrl && menuList[i].resourceType != 1) {
                url = $.url.root
                    + menuList[i].actualManageUrl;
            }
            if ($.isNullOrEmpty(menuList[i].icoUrl)) {
                menuList[i].icoUrl = $.DEFAULT_RESOURCE_ICO_URL;
            }
            menuTree.add(menuList[i].id, menuList[i].parentId,
                menuList[i].name, url, menuList[i].name,
                menuList[i].openType, undefined, true, undefined,
                menuList[i].icoUrl);
        }
        $("#divMenuTree").html(menuTree);
        var height = document.documentElement.clientHeight;
        document.getElementById('iframe-page-content').style.height = (height-100) + 'px';
    }
}


define("menu", [], function () {
    return menuController;
});


