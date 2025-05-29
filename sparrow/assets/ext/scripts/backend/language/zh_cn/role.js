lang = {
	message: {
		delete: "角色删除后将无法恢复，您确认要删除吗?",
		update: "角色更新成功",
		noSelectRecord: "请选择角色",
		enable: "您确认启用该角色吗？",
		disable: "您确认禁用该角色吗?",
		error: "网络繁忙，请稍侯再试。",
		accessDenied:"访问被拒绝",
		setPrivilegeSuccessMessage : "恭喜：角色[{0}]权限设置成功!"
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
var roleInfo = {
	txtRoleName : {
		ctrlId : 'txtRoleName',
		errorCtrlId : 'errorRoleName',
		prompt : '请输入20位以下角色名称',
		nullError : '角色名称为必添项。',
		minLength : 1,
		maxLength : 20,
		lengthError : '角色名称长度不得多于20。'
	},
	txtRoleCode : {
		ctrlId : 'txtRoleCode',
		errorCtrlId : 'errorRoleCode',
		prompt : '请输入20位以下角色编码',
		nullError : '角色编码为必添项。',
		minLength : 1,
		maxLength : 10,
		lengthError : '角色编码长度不得多于10'
	},
	txtState : {
		errorCtrlId : 'errorState',
		prompt : '请输入状态码0：无效 1有效',
		options :[1, 0],
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
	txtRemark : {
		errorCtrlId : 'errorRemark',
		prompt : '请输入该组的描述信息',
		lengthError : '描述信息不得超过500个字符。',
		spanTxtCount : 'spanTxtCount',
		allowNull : true
	}
};
