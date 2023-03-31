var markdownThreadController = {
    api: {
        publish: "/blog/publish.do",
        load_children_forum: "/forum/children.json"
    },
    forumTree: null,
    load: function (blogForumCode) {
        $.v.background_color = false;
        if ($.user && $.user.initLoginBar) {
            $.user.initLoginBar();
        }
        $.v.initPlaceholder(threadInfo);
        // 保证document点击能够清除编辑器下拉控件
        $(document).bind("onclick", function () {
            forumTree.clearFloatFrame();
        });

        forumTree = new $.tree("forumTree");
        forumTree.config.floatTreeId = "divForumList";
        forumTree.config.descHiddenId = "hdnForumCode";
        forumTree.config.descTextBoxId = "txtForumName";
        forumTree.initResourceTree("parentCode="+blogForumCode,markdownThreadController.api.load_children_forum);

        $("#txtForumName").bind("onclick",function (event) {
            forumTree.show(event,200,250);
        });
        $("#btnSubmit").bind("onclick", this.publish);
    },
    publish: function () {
        $.v.getValidateResult(threadInfo);
    }
};

define("markdownThread", [], function () {
    return markdownThreadController;
});