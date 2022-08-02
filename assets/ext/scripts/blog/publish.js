var threadEditor = new SparrowEditor("threadEditor");
var forumTree =null;

document.ready(function () {
    v.background_color=false;
    forumTree = new iTree("forumTree");
    forumTree.config.floatTreeId = "divForumList";
    forumTree.config.descHiddenId = "hdnForumCode";
    forumTree.config.descTextBoxId = "hyperForumName";
    forumTree.initForum("loadOption=child|001");
    $.user.initLoginBar();
    v.initPlaceholder(threadInfo);
    // 保证document点击能够清除编辑器下拉控件
    $(document).bind("onclick", function () {
        forumTree.clearFloatFrame();
    });
    //win.config.box.descContainer = $("divTag");
    threadEditor.config.tool.adjust.adjustable = false;
    threadEditor.config.tool.convertHTML.isConvert = false;
    threadEditor.config.tool.height =80;
    //threadEditor.config.style = "thread";
    threadEditor.initialize("divEditor");
    threadEditor.attach.setParentObject(threadEditor);
    // 手动设置附件内容ID
    threadEditor.config.attach.fileInfoId = "hdnFileInfo";
    threadEditor.attach.validate = function () {
        //SparrowEditor.js中设置
         //$("hdnContent").value = threadEditor.getEditorContent().filterHTML();
        // $("hdnTags").value = $checkedValue("select_tag").join(",");
        //先将标签注释掉
        v.isNull(threadInfo.hdnContent);
        if (!browser.isLogin()) {
            $.user.login.dialog($.user.login.option.publish);
            return false;
        } else {
            $("btnSubmit").disabled = true;
            threadInfo.hdnTags=null;
            return v.getValidateResult(threadInfo,false);
        }
    };
    threadEditor.initImageUploadEvent();
    Sparrow.thread.login_callback=function(){
        threadEditor.attach.submit();
    };
});