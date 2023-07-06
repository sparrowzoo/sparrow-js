var threadEditor = new SparrowEditor("threadEditor");
document.ready(function() {
	forumTree.config.floatTreeId = "divForumList";
	forumTree.config.descHiddenId = "hdnForumCode";
	forumTree.config.descTextBoxId = "hyperForumName";
	forumTree.initForum("loadOption=child|001");
	win.config.box.descContainer ="txtTagList";
	win.config.isInFrame = false;
	threadEditor.config.tool.adjust.adjustable = false;
	threadEditor.config.tool.convertHTML.isConvert = true;
	threadEditor.initialize("divEditor");
	threadEditor.attach.setParentObject(threadEditor);
	// 手动设置附件内容ID
	threadEditor.config.attach.fileInfoId = "hdnFileInfo";
	threadEditor.attach.validate = function() {
		$("hdnContent").value = threadEditor.getEditorContent();
		$("hdnTags").value = $("txtTagList").value.replace(/，/g,',');
		return v.getValidateResult(threadInfo);
	};
});
// 默认登录成功后的回调函数
function loginCallBack(args) {
	// 刷新当前页面
	publish_click();
}
function publish_click() {
	$("hdnParameter").value = "pass";
	$("btnSubmit").disabled = true;
	threadEditor.attach.submit();
}
function noPass_click() {
	$("hdnParameter").value = "no_pass";
	$("btnNoPass").disabled = true;
	$.submit();
}
function delete_click() {
	$("hdnParameter").value = "delete";
	$("btnDelete").disabled = true;
	$.submit();
}
// 保证document点击能够清除编辑器下拉控件
$(document).bind("onclick", function() {
	forumTree.clearFloatFrame();
});
