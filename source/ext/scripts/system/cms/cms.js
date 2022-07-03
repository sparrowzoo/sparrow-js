var cmsController = {
    api: {
        save_media: "/cms/save-media.do",
        save_standard: "/cms/save-standard.do",
        load_children_forum: "/resource/children.json"
    },
    cmsEditor: null,
    forumTree: null,
    initEditor: function () {
        if ($("divEditor") == null) {
            return;
        }
        this.cmsEditor = new $.editor("cmsEditor", "cmsController");
        var cmsEditor = this.cmsEditor;
        //先配置再初始化
        cmsEditor.config.tool.height = 69;
        cmsEditor.config.tool.adjust.adjustable = true;
        cmsEditor.config.tool.convertHTML.isConvert = true;
        // 设置附件的父控件
        cmsEditor.attach.setParentObject(cmsEditor);
        cmsEditor.config.attach.fileInfoId = "hdnFileInfo";
        // cmsEditor.config.attach.key=$("hdnPathKey").value;
        // 编辑器上传的图片全部为cms作为key
        cmsEditor.config.attach.key = "cms";
        // 不显示图片信息
        cmsEditor.config.attach.showImageInfo = false;
        cmsEditor.initialize("divEditor");
        cmsEditor.initImageUploadEvent();
    },
    initForums:function(parentForum){
        if($("divForumList")==null){
            return;
        }
        $("#btnMove").bind("onclick", function (e) {
            forumTree.show(e, 300, 400);
        });
        document.onclick = function () {
            forumTree.clearFloatFrame();
        };
        this.forumTree = new $.tree("forumTree", "cmsController");
        var forumTree = this.forumTree;
        forumTree.config.floatTreeId = "divForumList";
        forumTree.codeNodeCallBack = function () {
            var cn = cmsController.forumTree.aNodes[cmsController.forumTree.getSelectedAi()];
            var forumCode = cn.businessEntity.code;
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
        forumTree.initResourceTree("parentCode=" + parentForum, cmsController.api.load_children_forum);
    },
    bindForumNameEvent:function(){
        var txtForumName = $("#txtForumName");
        if(txtForumName.s==null){
            return;
        }
        txtForumName.bind("onfocus", function (e) {
            $.v.showMessage(cmsInfor, this);
            cmsController.forumTree.show(e, 200, 300);
        });
        txtForumName.bind("onblur", function () {
            $.v.isNull(cmsInfor, this);
        });
    },
    load: function (upload_path, path_key, parentForum) {
        $.gridView.id = "grvCms";
        $.gridView.resultCtrlId = "hdnGridResult";
        this.initEditor();
        this.initForums(parentForum);
        //this.bindForumNameEvent();
        $.dispatcher.eventRegistry = [
            {
                id: "btnSubmit",
                delegate: function () {
                    if (cmsController.cmsEditor != null) {
                        cmsController.cmsEditor.config.attach.actionUrl = cmsController.api.save_standard;
                        cmsController.cmsEditor.attach.submit(cmsInfor);
                        return;
                    }
                    $.v.getValidateResult(cmsInfor, function () {
                        $.submit(cmsController.api.save_media);
                    });
                }
                // strategy: lang.command.save
            }
        ];
        $.dispatcher.bind();
        $.file.initImageUploadEvent(upload_path, path_key);
    }
};
define("cms", [], function () {
    return cmsController;
});