lang = {
	message: {
		delete: "用户组删除后将无法恢复，您确认要删除吗?",
		deleteFile: "确定后此用户组将被彻底删除，您确认要继续本次操作吗？",
		update: "用户组更新成功",
		noSelectRecord: "请选择用户组",
		enable: "您确认启用该用户组吗？",
		disable: "您确认禁用该用户组吗?",
		error: "网络繁忙，请稍侯再试。",
		resourceName: "资源版块",
		accessDenied:"访问被拒绝",
		setPrivilegeSuccessMessage : "恭喜：组[{0}]权限设置成功!"
	},
	command:{
        return:"返回",
		save:"提交",
		add:"新建",
		enable:"启用",
		disable:"禁用",
		delete:"删除"
	}
};
var groupInfo = {
	txtGroupName : {
		errorCtrlId : 'errorGroupName',
		prompt : '请输入20位以下组名称',
		nullError : '组名称为必添项。',
		minLength : 1,
		maxLength : 20,
		lengthError : '组名称长度不得多于20。'
	},
	txtParentGroupId : {
		errorCtrlId : 'errorParentGroupId',
		prompt : '所属组不能为空',
		defaultValue : 0
	},
	txtGroupCent : {
		errorCtrlId : 'errorGroupCent',
		prompt : 'input cent。',
		defaultValue : 0
	},
	txtState : {
		errorCtrlId : 'errorState',
		prompt : '请输入状态码0：无效 1有效',
		options :[1, 0]
	},
	txtMaxAllowCount : {
		errorCtrlId : 'errorMaxAllowCount',
		prompt : '请输入最大允许用户数 默认为0：不限,最大用户数在100之内',
		lengthError : '宽度限提提示文字。',
		digitalError:'最大用户数在100之内',
		minValue : 0,
		maxValue : 100,
		defaultValue : 0
	},
	txtGroupType : {
		errorCtrlId : 'errorGroupType',
		prompt : '请选择组类别',
		nullError : '组类型为必添项。'
	},
	txtGroupLevel : {
		errorCtrlId : 'errorGroupLevel',
		prompt : '请选择组级别',
		nullError : '组级别为必添项。'
	},
	txtRemark : {
		errorCtrlId : 'errorRemark',
		prompt : '请输入该组的描述信息',
		lengthError : '描述信息不得超过500个字符。',
		spanTxtCount : 'spanTxtCount',
		allowNull : true
	}
};
