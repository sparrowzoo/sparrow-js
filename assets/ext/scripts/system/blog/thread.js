var threadController = {
    api: {
        load_children_forum: "/resource/children.json"
    },
    forumTree: null,
    load: function (parentForum) {
        $.gridView.id = "grvThreadList";
        $.gridView.resultCtrlId = "hdnThreadId";

        this.forumTree = new $.tree("forumTree", "threadController");
        var forumTree = this.forumTree;
        forumTree.config.floatTreeId = "divForumList";
        forumTree.codeNodeCallBack = function () {
            var cn = threadController.forumTree.aNodes[threadController.forumTree.getSelectedAi()];
            var forumCode=cn.businessEntity.code;
            if (window.confirm("帖子将被移至【" + cn.name + "】,确认迁移吗?")) {
                $.ajax.json($.url.root + "/thread/transform.json", "forumCode=" + forumCode + "&threadIds="
                    + $($.gridView.resultCtrlId).value, function (result) {
                    $.alert("帖子被成功迁移至【" + cn.name + "】", "smile");
                    $.win.config.jalert.closeCallBack = function () {
                        window.location.href = window.location.href;
                    };
                });
            }
        }
        forumTree.initResourceTree("parentCode=" + parentForum, threadController.api.load_children_forum);

        $("#btnMove").bind("onclick", function (e) {
            forumTree.show(e, 300, 400);
        });
        document.onclick = function () {
            threadController.forumTree.clearFloatFrame();
        };
    }
};

define("thread", [], function () {
    return threadController;
});