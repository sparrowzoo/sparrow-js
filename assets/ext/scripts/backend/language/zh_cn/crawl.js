lang = {
	message: {
		edit: "编  辑",
		del: "删  除",
		update: "更  新",
		submit: "提  交",
		noSelectRecord: "请选择配置",
		enable: "您确认启用该配置吗？",
		disable: "您确认禁用该配置吗?",
		error: "网络繁忙，请稍侯再试。"
	}
};

crawlInfo = {
	txtUrl : {
		ctrlId : 'txtUrl',
		errorCtrlId : 'errorUrl',
		prompt : '请输入根URL',
		nullError : '根URL不允许为空'
	},
	txtForumCode : {
		ctrlId : 'txtForumCode',
		errorCtrlId : 'errorForumCode',
		prompt : '请输入所属版块',
		nullError : '所属版块不允许为空'
	},
	txtUrlRegex : {
		ctrlId : 'txtUrlRegex',
		errorCtrlId : 'errorUrlRegex',
		prompt : '请输入URL正则',
		nullError : 'URL正则不允许为空'
	},
	txtWebsitCode : {
		ctrlId : 'txtWebsitCode',
		errorCtrlId : 'errorWebsitCode',
		prompt : '请输入网站',
		nullError : '网站不允许为空'
	},
	txtTitleRegex : {
		ctrlId : 'txtTitleRegex',
		errorCtrlId : 'errorTitleRegex',
		prompt : '请输入标题正则',
		allowNull:true
	},
	txtTitleSuffix : {
		ctrlId : 'txtTitleSuffix',
		errorCtrlId : 'errorTitleSuffix',
		prompt : '请输入标题截取后缀',
		nullError : '标题截取后缀不允许为空'
	},
	txtContentRegex : {
		ctrlId : 'txtContentRegex',
		errorCtrlId : 'errorContentRegex',
		prompt : '请输入内容正则',
		nullError : '内容正则不允许为空'
	},
	txtMaxRecord : {
		ctrlId : 'txtMaxRecord',
		errorCtrlId : 'errorMaxRecord',
		prompt : '请输入数字 ',
		defaultValue : "-1",
		digitalError : '只允许输入数字'
	},
	txtDealType : {
		ctrlId : 'txtDealType',
		errorCtrlId : 'errorDealType',
		prompt : '请输入抓取处理类型(0:直接发布,1:进入队列,2:索引)',
		nullError : '请输入抓取处理类型(0:直接发布,1:进入队列,2:索引)',
		options : new Array(0,1,2),
		defaultValue:0
	},
	txtCharset : {
		ctrlId : 'txtCharset',
		errorCtrlId : 'errorCharset',
		prompt : '请按指定选项输入[UTF-8,GB2312]',
		options : new Array('UTF-8', 'GB2312'),
		defaultValue : "UTF-8"
	},
	txtStatus : {
		ctrlId : 'txtStatus',
		errorCtrlId : 'errorStatus',
		prompt : '请按指定选项输入[0:无效,1有效]',
		options : new Array(0, 1),
		defaultValue : "1"
	},
	btnCrawlId : {},
	btnCrawlId : {}
};