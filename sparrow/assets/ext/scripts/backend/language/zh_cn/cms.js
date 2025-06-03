//该js文件取消 为节省js链接数
lang = {
	message:{
		del: "内容删除后将无法恢复，您确认要删除吗?",
		publish: "信息发布后会发布到互联网，您将无法再进行编辑，确定无误并继续操作吗？",
		noSelectRecord: "请选择要操作的信息内容",
		onlySelectOneRecord: "只能选择一条信息!",
		enable: "您确认恢复该信息吗？",
		disable: "您确认禁用该信息吗?",
		error: "网络繁忙，请稍侯再试。",
		accessDenied:"访问被拒绝"
	},
	command:{
		save:"保存"
	}
};

var cmsInfor = {
	txtTitle : {
		ctrlId : 'txtTitle',
		errorCtrlId : 'errorTitle',
		prompt : '请输入文章标题',
		nullError : '文章标题为必填项',
		minLength : 1,
		maxLength : 200,
		lengthError : '文章标题不超过200个字符'
	},
	txtHyperLink : {
		ctrlId : 'txtHyperLink',
		errorCtrlId : 'errorHyperLink',
		prompt : '请输入文章链接',
		minLength : 0,
		maxLength : 500,
		lengthError : '文章链接不超过500个字符',
		allowNull:true
	},
	txtBrief : {
		ctrlId : 'txtBrief',
		errorCtrlId : 'errorBrief',
		prompt : '请输入文章摘要',
		minLength : 0,
		maxLength : 400,
		lengthError : '文章摘要不超过400个字符',
		spanTxtCount : 'spanTxtCount',
		allowNull:true
	},
	txtForumName : {
		ctrlId : 'txtForumName',
		errorCtrlId : 'errorForumName',
		prompt : '请选择内容版块',
		nullError : '请选择内容版块'
	},
	txtContent : {
		ctrlId : 'hdnContent',
		errorCtrlId : 'errorContent',
		nullError : '请输入文章正文'
	},
	txtRemark : {
		ctrlId : 'txtRemark',
		errorCtrlId : 'errorRemark',
		prompt : '请输入备注',
		allowNull:true,
        spanTxtCount:'spanRemarkTxtCount',
        minLength : 0,
        maxLength : 400,
        lengthError : '备注不超过400个字符',
	},
	txtOrderNo:{
		ctrlId:'txtOrderNo',
		errorCtrlId:'errorOrderNo',
		prompt : '请输入排序号',
		nullError:'请输入序号',
		digitalError:'请输入数字',
		lessMin:'排序号必须>0',
		minValue : 1,
		defaultValue :1
	}
};
