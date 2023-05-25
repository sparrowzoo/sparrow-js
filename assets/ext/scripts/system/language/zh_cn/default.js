lang = {
	message: {
		delete: "{entity_name}删除后将无法恢复，您确认要删除吗?",
		deleteFile: "确定后此{entity_name}将被彻底删除，您确认要继续本次操作吗？",
		update: "{entity_name}更新成功",
		noSelectRecord: "请选择{entity_name}",
		enable: "您确认启用该{entity_name}吗？",
		disable: "您确认禁用该{entity_name}吗?",
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


var $entityInfo = {
	txtName : {
		errorCtrlId : 'errorName',
		prompt : '请输入20位以下名称',
		nullError : '名称为必添项。',
		minLength : 1,
		maxLength : 20,
		lengthError : '名称长度不得多于20。'
	},
	txtParentGroupId : {
		errorCtrlId : 'errorParentGroupId',
		prompt : '所属组不能为空',
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
	txtOldPassword: {
            errorCtrlId: 'errorOldPassword',
            prompt: '请输入您的原始密码',
            nullError: '请输入您的原始密码',
            minLength: 6,
            maxLength: 16,
            lengthError: '密码至少6位',
            setError: '原始密码输入错误',
            isExist: false,
            parentLevel:0
        },
        txtPassword: {
            errorCtrlId: 'errorPassword',
            prompt: '6-16个字符,建议使用字母加数字或符号的组合密码。',
            nullError: '请输入密码。',
            minLength: 6,
            maxLength: 16,
            lengthError: '密码至少6位',
            parentLevel:0
        },
        txtConfirmPassword: {
            errorCtrlId: 'errorConfirmPassword',
            prompt: '请再次输入密码。',
            nullError: '请再次输入密码。',
            otherCtrlId: 'txtPassword',
            noEqualError: '两次密码输入不一致。',
            parentLevel:0
        },
	txtGroupType : {
		errorCtrlId : 'errorGroupType',
		prompt : '请选择组类别',
		nullError : '组类型为必添项。'
	},
	txtRemark : {
		errorCtrlId : 'errorRemark',
		prompt : '请输入该组的描述信息',
		lengthError : '描述信息不得超过500个字符。',
		spanTxtCount : 'spanTxtCount',
		allowNull : true
	}
};