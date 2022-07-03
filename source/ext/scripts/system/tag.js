page.defaction = search;
//标签的操作菜单
var tagMenuInType = new Menu("tagMenuInType");
// 标签的操作菜单 管理中使用
var tagMenu = new Menu("tagMenu");
// 标签类别的操作菜单
var tagTypeMenu = new Menu("tagTypeMenu");
// 标签操作菜单的更多类别的子菜单
var moreTagTypeMenu = new Menu("moreTagTypeMenu");

var forumTree = null;

// 加载所有标签列表
document.ready(function () {
    // 标签(有类别)的兄弟菜单
    tagMenuInType.config.width = 100;
    tagMenuInType.config.container = $("divTagList");
    tagMenuInType.config.brothers.push(tagTypeMenu);
    tagMenuInType.config.brothers.push(tagMenu);
    // 标签(无类别)的兄弟菜单
    tagMenu.config.width = 100;
    tagMenu.config.container = $("divTagWithoutTypeList");
    tagMenu.config.brothers.push(tagTypeMenu);
    tagMenu.config.brothers.push(tagMenuInType);

    // 类别的兄弟菜单
    tagTypeMenu.config.brothers.push(tagMenuInType);
    tagTypeMenu.config.brothers.push(tagMenu);

    // 标签操作事件
    tagMenuInType.itemClick = function (index) {
        tag_menu_item_click(index, tagMenuInType);
    };
    tagMenu.itemClick = function (index) {
        tag_menu_item_click(index, tagMenu);
    };

    tagMenuInType.itemMore = function (srcElement, index) {
        this.config.childs.push(moreTagTypeMenu);
        moreTagTypeMenu.show(srcElement, this);
    };

    tagMenu.itemMore = function (srcElement, index) {
        this.config.childs.push(moreTagTypeMenu);
        moreTagTypeMenu.show(srcElement, this);
    };

    tagMenu.config.menu = [{
        text: l.command.enable,
        more: false
    }, {
        text: l.command.disable,
        more: false
    }, {
        text: l.command.del,
        more: false
    }, {
        text: l.command.edit,
        more: false
    }, {
        text: l.command.add,
        more: true
    }];
    tagMenuInType.config.menu = [{
        text: l.command.enable,
        more: false
    }, {
        text: l.command.disable,
        more: false
    }, {
        text: l.command.del,
        more: false
    }, {
        text: l.command.edit,
        more: false
    }, {
        text: l.command.remove,
        more: false
    }, {
        text: l.command.add,
        more: true
    }];
    tagMenuInType.init();
    tagMenu.init();
    // 初始化标签类别的操作菜单
    tagTypeMenu.config.width = 100;
    tagTypeMenu.config.container = $("divTagList");
    tagTypeMenu.config.brothers.push(tagMenuInType);
    tagTypeMenu.config.menu = [{
        text: l.command.del,
        more: false
    }, {
        text: l.command.edit,
        more: false
    }];
    tagTypeMenu.itemClick = function (index) {
        var menuText = tagTypeMenu.config.menu[index].text;
        var TypeId = $(tagTypeMenu.config.srcElement).attr("TypeId");
        var TypeNameArray = tagTypeMenu.config.srcElement.innerHTML.split("|");
        var TypeName = TypeNameArray[0];
        var orderNo = TypeNameArray[1];
        switch (menuText) {
            case l.command.del:
                ajax.json($.url.root + "/tag/delete-tag-type.json","tagTypeId=" + TypeId,callback);
                break;
            case l.command.edit:
                $("txtTypeName").value = TypeName;
                $("txtOrderNo").value = orderNo;
                $("hdnTypeId").value = TypeId;
                $("btnSaveType").value = l.command.update;
                $("btnCancelUpdateType").style.display = "block";
                break;
        }
    };
    tagTypeMenu.init();
    loadTagList();

    // 实现主题转换树的选择确认事件
    forumTree = new iTree("forumTree");
    forumTree.config.floatTreeId = "divForumList";
    forumTree.config.descHiddenId = "hdnForumCode";
    forumTree.config.descTextBoxId = "spanForumName";
    forumTree.codeNodeCallBack = function () {
        loadTagList();
    };
    forumTree.initForum("loadOption=child|001");
});
// 初始化标签列表
function loadTagList() {
    ajax.json($.url.root + "/tag/load-all-tags.json", "forumCode=" + $("hdnForumCode").value,
        function (result) {
            var allTags = result.message;
            if (allTags == null) {
                $("divTagList").innerHTML = "";
                $("spanRecordCount").innerHTML = 0;
                return;
            }
            var tagCount = 0;
            var tagHTML = [];
            // 初始化标签类别子菜单
            moreTagTypeMenu.config.width = 100;
            moreTagTypeMenu.config.position = moreTagTypeMenu.TOP_RIGHT;
            moreTagTypeMenu.config.menu = [];

            for (var i = 0; i < allTags.length; i++) {
                if (allTags[i].typeName) {
                    moreTagTypeMenu.config.menu.push({
                        text: allTags[i].typeName,
                        id: allTags[i].tagTypeId,
                        more: false
                    });
                }
                tagHTML
                    .push('<div class="tag-title"><span onmouseover="$.event(event).cancelBubble();{0}.show(this);" TypeId="{1}">'
                        .format(tagTypeMenu.obj,
                        allTags[i].tagTypeId));
                tagHTML
                    .push(allTags[i].tagTypeId == -1 ? l.message.noType
                        : allTags[i].typeName + "|"
                    + allTags[i].orderNo);
                tagHTML.push('</span></div>');
                tagHTML.push('<div class="tag-content">');
                for (var j = 0; j < allTags[i].tagList.length; j++) {
                    tagCount++;
                    tagHTML
                        .push(('<span tagId="{0}" TypeId="{1}" status="{2}"  class="{3}" onmouseover="$.event(event).cancelBubble();{4}.show(this);" ' + getStyle(allTags[i].tagList[j].format) + '>{5}</span>')
                            .format(
                            allTags[i].tagList[j].tagId,
                            allTags[i].tagTypeId,
                            allTags[i].tagList[j].status,
                            allTags[i].tagList[j].status == 1 ? "tag"
                                : "disabletag",
                            tagMenuInType.obj,
                            allTags[i].tagList[j].tagName));
                }
                tagHTML.push('</div>');
            }
            moreTagTypeMenu.itemClick = function (index) {
                var tagId = $(this.config.parent.config.srcElement).attr("tagId");
                var tagTypeId = this.config.menu[index].id;
                ajax.json($.url.root + "/tag/add-to-type.json",
                    "tagId=" + tagId
                    + "&tagTypeId=" + tagTypeId
                    + "&forumCode="
                    + $("hdnForumCode").value, callback);
            };
            moreTagTypeMenu.init();
            $("divTagList").innerHTML = tagHTML.join("");
            $("spanRecordCount").innerHTML = tagCount;
            search();
        });
}
// 标签菜单的单击事件
function tag_menu_item_click(index, menu) {
    if (typeof (menu) == undefined) {
        menu = tagMenuInType;
    }
    var menuText = menu.config.menu[index].text;
    var tagId = $(menu.config.srcElement).attr("tagId");
    var status = $(menu.config.srcElement).attr("status");
    var tagName = menu.config.srcElement.innerHTML;
    switch (menuText) {
        case l.command.enable:
            ajax.json($.url.root + "/tag/enable-tag.json", "tagId=" + tagId, callback);
            break;
        case l.command.disable:
            ajax.json($.url.root + "/tag/disable-tag.json", "tagId=" + tagId, callback);
            break;
        case l.command.del:
            ajax.json($.url.root + "/tag/delete-tag.json", "tagId=" + tagId, callback);
            break;
        case l.command.remove:
            var typeId = $(menu.config.srcElement).attr("TypeId");
            ajax.json($.url.root + "/tag/remove.json", "tagId=" + tagId + "&typeId=" + typeId, callback);
            break;
        case l.command.edit:
            $("hdnTagId").value = tagId;
            $("hdnStatus").value = status;
            $("txtTagName").value = tagName;
            $("btnSaveTag").value = l.command.update;
            $("btnCancelUpdateTag").style.display = "block";


            var fontSize = menu.config.srcElement.style.fontSize;
            var fontColor = menu.config.srcElement.style.color;
            var backgroundColor = menu.config.srcElement.style.backgroundColor;

            if (!$.isNullOrEmpty(fontSize)) {
                $("ddlFontSize").value = fontSize;
            }
            else {
                $("ddlFontSize").value = "0";
            }

            if (!$.isNullOrEmpty(fontColor)) {
                $("name.frontColor").check(fontColor);
            }
            else {
                $("name.frontColor").check("0");
            }
            if (!$.isNullOrEmpty(backgroundColor)) {
                $("name.backgroundColor").check(backgroundColor);
            }
            else {
                $("name.backgroundColor").check("0");
            }
            break;
    }
}
// 标签操作的回调函数
function callback(result) {
    loadTagList();
}
// 保存标签类别事件
function saveTagType(srcElement) {
    var postUrl = null;
    var postData = $.getFormData(typeInfo) + "&mtagType.forumCode=" + $("hdnForumCode").value;
    if (srcElement.value == l.command.save) {
        postUrl = $.url.root + "/tag/new-tag-type.json";
    } else {
        postUrl = $.url.root + "/tag/update-tag-type.json";
        postData += "&mtagType.tagTypeId=" + $("hdnTypeId").value;
    }
    if (v.getValidateResult(typeInfo, false)) {
        ajax.json(postUrl, postData, callback);
    }
}
function cancelUpdateTagType() {
    $("txtTypeName").value = "";
    $("txtOrderNo").value = "";
    $("hdnTypeId").value = "";
    $("btnSaveType").value = l.command.save;
    $("btnCancelUpdateType").style.display = "none";
}

function cancelUpdateTag() {
    $("hdnTagId").value = "";
    $("hdnStatus").value = "";
    $("txtTagName").value = "";
    $("btnSaveTag").value = l.command.save;
    $("btnCancelUpdateTag").style.display = "none";
    $setChecked("backgroundColor", "0");
    $setChecked("frontColor", "0");
    $("ddlFontSize").value = "0";
}
// 保存标签事件
function saveTag(srcElement) {
    var postUrl = null;
    var tagFormat = [];
    var frontColor = $("checkedValue.frontColor");
    var backgroundColor = $("checkedValue.backgroundColor");
    var fontSize = $("ddlFontSize").value;
    // color: #ca151d; background: black; font-size: 200pt;
    if (frontColor != '0') {
        tagFormat.push('frontColor:"{0}"'.format(frontColor.s));
    }
    if (backgroundColor != "0") {
        tagFormat.push('backgroundColor:"{0}"'.format(backgroundColor.s));
    }
    if (fontSize != '0') {
        tagFormat.push('fontSize:"{0}"'.format(fontSize));
    }

    var postData = "mtag.tagName=" + $("txtTagName").value + "&mtag.forumCode="
        + $("hdnForumCode").value;

    if (tagFormat.length > 0) {
        tagFormat = "{" + tagFormat.join(',') + "}";
        postData += "&mtag.format=" + tagFormat;
    }

    if (srcElement.value == l.command.save) {
        postUrl = $.url.root + "/tag/new-tag.json";
    } else {
        postUrl = $.url.root + "/tag/update-tag.json";
        postData += "&mtag.tagId=" + $("hdnTagId").value + "&mtag.status="
        + $("hdnStatus").value;
    }
    if (v.getValidateResult(tagInfo, false)) {
        ajax.json(postUrl, postData, callback);
    }
}
document.onclick = function () {
    tagMenuInType.hidden();
    tagTypeMenu.hidden();
    tagMenu.hidden();
    forumTree.clearFloatFrame();
};
function getStyle(tagFormat) {
    var tagStyle = [];

    if ($.isNullOrEmpty(tagFormat)) {
        return "";
    }
    else {
        var tagJson = tagFormat.decodeHtml().json();
        // color: #ca151d; background: black; font-size: 200pt;
        if (!$.isNullOrEmpty(tagJson.frontColor)) {
            tagStyle.push("color:{0}".format(tagJson.frontColor));
        }
        if (!$.isNullOrEmpty(tagJson.backgroundColor)) {
            tagStyle.push("background-color:{0}".format(tagJson.backgroundColor));
        }
        if (!$.isNullOrEmpty(tagJson.fontSize)) {
            tagStyle.push("font-size:{0}".format(tagJson.fontSize));
        }
        return 'style="{0}"'.format(tagStyle.join(";"));
    }
}
function getTagFormatHTML(tagList) {
    if (!tagList) {
        return null;
    }
    var tagHTML = [];
    for (var j = 0; j < tagList.length; j++) {
        tagHTML
            .push(('<span tagId="{0}" status="{1}"  class="{2}" onmouseover="$.event(event).cancelBubble();{3}.show(this);"' + getStyle(tagList[j].format) + '>{4}</span>')
                .format(
                tagList[j].tagId,
                tagList[j].status,
                tagList[j].status == 1 ? "tag"
                    : "disable-tag",
                tagMenu.obj,
                tagList[j].tagName));
    }
    return tagHTML;
}
function search() {
    var pageIndex = 1;
    if ($("currentPageIndex") != null) {
        pageIndex = $("currentPageIndex").value.trim();
    }
    var postString = "currentPageIndex=" + pageIndex +

        "&mtag.tagName=" + $("txtSearchTagName").value +

        "&mtag.isAudit=" + $("sltAuditing").value +

        "&mtag.status=" + $("sltStatus").value +

        "&mtag.typeCount=" + $("sltTypeStatus").value +

        "&orderField=" + $("sltOrderField").value;
    ajax.json($.url.root + "/tag/search.json", postString,
        function (result) {
            var tagList = result.value;
            var tagHTML = getTagFormatHTML(tagList);
            if (tagHTML != null) {
                $("divTagWithoutTypeList").innerHTML = tagHTML
                    .join("") + result.pager.replace(/<br\/>/g, "\r\n");
            }
            else {
                $("divTagWithoutTypeList").innerHTML = "NO TAGS";
            }
        });
}