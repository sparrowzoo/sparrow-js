var commendController = {
    commentEditor: null,
    initEditor: function () {
        var commentEditor = this.commentEditor = new $.editor("commentEditor", "commendController");
        commentEditor.config.titleCtrlId = "txtReturnTitle";
        commentEditor.config.tool.adjust.adjustable = false;
        commentEditor.config.tool.convertHTML.isConvert = false;
        commentEditor.config.style = "comment";
        commentEditor.config.tool.height = 38;
        commentEditor.initialize("divEditor");

        // 手动设置附件内容ID
        commentEditor.config.attach.fileInfoId = "hdnFileInfo";
        commentEditor.config.attach.key = "comment";
        commentEditor.config.contentCtrlId = "hdnCommentContent";
        commentEditor.attach.setParentObject(commentEditor);
        commentEditor.initImageUploadEvent();
        // 调用 编辑器提交事件
        commentEditor.attach._submit = function () {
            var data = ["hdnThreadId","hdnCommentContent"];
            $.ajax.json($.url.root
                + "/blog/comment.json", $.getFormData(data), function (result) {
                commendController.commentEditor.setEditorContent("");
                $("#divCommentList").html($("#divCommentList").html()+$("divCommentTemplate").outerHTML.format(result.data));
            });
        };
    },
    initAttach: function () {
        //初始化主帖的附件
        $.attach.config.attachJson = $("thread_attach_json").innerHTML.trim()
            .json();
        $.attach.config.contentHtml = $("thread_content").innerHTML;
        $.attach.config.descContainerId = "thread_attach";
        $.attach.init();

        // 所有帖子ID name="commentId"
        var commentIdArray = $("&commentId");
        for (var i = 0; i < commentIdArray.length; i++) {
            $.attach.config.attachJson = $("comment_attach_json_"
                + commentIdArray[i].value).innerText.json();
            $.attach.config.contentHtml = $("comment_content_"
                + commentIdArray[i].value).innerHTML;
            $.attach.config.descContainerId = "comment_attach_"
                + commentIdArray[i].value;
            $.attach.init();
        }
    },
    bindEvents: function () {
        $.dispatcher.eventRegistry = [
            {
                id: "btnSubmit",
                delegate: function () {
                    commendController.commentEditor.attach.submit(commentInfo,$.user.login.ns_callback.comment);
                }
            }
        ];
        $.dispatcher.bind();
        document.onmouseover = function (e) {
            var forum = $("&forum");
            if (forum != null) {
                for (var i = 0; i < forum.length; i++) {
                    $("div" + forum[i].value).style.display = "none";
                }
            }
        };
        Sparrow.thread.comment.loginCallback = function () {
            commendController.commentEditor.attach.submit(commentInfo);
        }
    }
}
document.ready(function () {
    $.user.initLoginBar();
    $.v.background_color = false;
    $.share.init();
    $.thread.count.init();
    $.floating.fixedAuthor();
    $.user.initAuthor("hdnAuthor");
    window.onscroll = $.floating.init;
    commendController.initEditor();
    commendController.bindEvents();
    commendController.initAttach();
});
