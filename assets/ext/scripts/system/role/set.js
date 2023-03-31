//设置用户组
function ok() {
	//设置是否在框架内提示
	win.config.isInFrame = false;
	//设置对话框确定事件
	win.config.jalert.closeCallBack = function() {
		var roleList = $("name.roleList");
		var groupNameList =[];
		for ( var i = 0; i < roleList.length; i++) {
			if (roleList[i].checked) {
				groupNameList.push($("for."+roleList[i].id).s.innerHTML);
			}
		}
		var groupNameRowIndex = 
			parent.$($("hdnUserId").value).parentNode.parentNode.rowIndex;
		parent.$("grvAdministratorList").rows[groupNameRowIndex].cells[9].innerHTML =
			groupNameList.join(";");
		parent.win.closeClick();
	};
	$.alert("设置成功", "smile");
}