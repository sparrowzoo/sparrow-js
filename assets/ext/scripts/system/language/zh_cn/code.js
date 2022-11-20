var lang = {
	command: {
		save: "保存",
		cancel: "取消",
		update: "更新",
		add: "新建",
		delete:"删除"
	},
	message: {
		save: "编码[{0}]新建成功",
		update: "编码[{0}]更新成功",
		delete_hash_child:"[{0}]下有子编码，故不能删除！",
		delete_confirm:"[{0}]删除后将无法恢复，您确认将该编码删除？",
		del:"删除成功！",
		list_url_not_set:"未设置列表链接",
		error : "网络繁忙，请稍侯再试。",
		accessDenied:"访问被拒绝",
		system_code:"系统编码"
	}
};
var codeInfo = {
	hdnParentId : {
		errorCtrlId : "errorParentName",
		prompt : "上级编码",
		nullError : "请选择上级编码"
	},
	txtCode : {
		errorCtrlId : "errorCode",
		prompt : "必须添写编码且必须继承至上级编码",
		nullError : "请输入编码"
	},
	txtSort : {
		errorCtrlId : "errorSort",
		prompt : "请输入排序号",
		nullError : "请输入排序号"
	},
	txtName : {
		errorCtrlId : "errorName",
		prompt : "名称为必填项",
		nullError : "请输入名称"
	},
    txtUrl : {
        errorCtrlId : "errorUrl",
        prompt : "url可为空",
        allowNull:true
    },
    hdnCodeLogo : {
        errorCtrlId : "errorImgCodeLogo",
        prompt : "logo可为空",
        allowNull:true
    },
	txtStatus : {
		errorCtrlId : "errorStatus",
		prompt : "0无效 1 有效",
		options :[0, 1],
		defaultValue : 1
	},
	txtValue : {
		errorCtrlId : "errorValue",
		prompt : "请输入该配置项的值",
		allowNull:true
	},
	txtRemark : {
		errorCtrlId : "errorRemark",
		prompt : "请设置该项配置说明。",
		allowNull:true
	}
};