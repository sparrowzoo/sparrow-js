var websitCodeTree = null;
document.ready(function() {
	websitCodeTree = new iTree("websitCodeTree");
	websitCodeTree.config.floatTreeId = "divWebsitCodeTree";
	websitCodeTree.config.descTextBoxId = "txtWebsitCode";
	websitCodeTree.config.descHiddenId = "hdnWebsitCode";
	websitCodeTree.config.validateFunction = function() {
		v.isNull(crawlInfo.txtWebsitCode);
	};
	websitCodeTree.codeNodeCallBack = function(icodeEntity) {
	};
	websitCodeTree.initCodeToolip('WEBSIT-');
});