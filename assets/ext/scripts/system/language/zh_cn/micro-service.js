lang = {
	message: {
		delete: "微服务删除后将无法恢复，您确认要删除吗?",
		update: "微服务更新成功",
		noSelectRecord: "请选择微服务",
		enable: "您确认启用该微服务吗？",
		disable: "您确认禁用该微服务吗?",
		error: "网络繁忙，请稍侯再试。",
		accessDenied:"访问被拒绝",
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



var microServiceInfo = {
	txtMicroServiceName : {
		errorCtrlId : 'errorMicroServiceName',
		prompt : '请输入20位以下微服务名称',
		nullError : '微服务名称为必添项。',
		minLength : 1,
		maxLength : 20,
		lengthError : '微服务名称长度不得多于20。'
	},
	txtMicroServiceUrl : {
		errorCtrlId : 'errorMicroServiceUrl',
        prompt : '请输入微服务url',
        nullError : '微服务url不允许为空。',
        minLength : 1,
        maxLength : 256,
        lengthError : '微服务url长度不得多于256。'
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
	},
	txtAppName: {
            errorCtrlId: "errorAppName",
            prompt: "请选择所属应用",
            nullError: "请选择所属应用"
    },
    hdnAppId:{}
};
