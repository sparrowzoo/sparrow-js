lang={
	message:{
		noSelectRecord : "请选择要操作的帖子",
		del : "帖子删除后将无法恢复，您确认要删除吗?",
		man : "男",
		woman : "女",
		error : "网络繁忙，请稍侯再试。",
		deleteFile : "您确认要删除?",
		noEditPrivilege : "您无编辑权限",
		noDeletePrivilege : "您无删除权限",
		enable : "取消屏蔽后将对所有网友公开，您确定要继续操作吗?",
		disable : "该帖子被屏蔽后将对网友不可见，您确定要继续操作吗?",
		deleteConfirm : "帖子删除后，其对应的评论将一并被删除并将无法恢复，\n您确认要继续删除吗?",
		comment: {
			deleteConfirm: "帖子删除后将无法恢复，您确认要继续删除吗?"
		}
	}
};


var freshInfo = {
	txtTitle: {
		ctrlId: "txtTitle",
		errorCtrlId: "errorTitle",
		prompt: "请在这里输入新鲜事标题",
		nullError: "请在这里输入新鲜事标题",
		parentLevel: 0
	},
	hdnContent: {
		ctrlId: "hdnContent",
		errorCtrlId: "errorContent",
		prompt: "请输入帖子正文",
		allowNull: false,
		nullError: "请输入帖子正文",
		minLength: 1,
		maxLength: 300,
		lengthError: '帖子内容不能超过300字符[150汉字]请按"清除空格"按钮',
		parentLevel: 0
	}
};
var threadInfo = {
	txtTitle : {
		ctrlId : "txtTitle",
		errorCtrlId : "errorTitle",
		prompt : "请输入标题",
		nullError : "请输入标题",
		parentLevel:0
	},
	hdnContent : {
		ctrlId : "hdnContent",
		errorCtrlId : "errorContent",
		prompt : "请输入帖子正文",
		allowNull : false,
		nullError : "请输入帖子正文",
		minLength : 1,
		maxLength : 8000,
		lengthError : '帖子内容不能超过8000字符[4000汉字]请按"清除空格"按钮',
		freshLenghtError : '内容已经超出{0}个字符,请编辑后再重新发表！',
		parentLevel:0
	},
    txtForumCode : {
		ctrlId : "txtForumCode",
		errorCtrlId : "errorForumName",
		prompt : "请选择版块",
		nullError : "请选择版块",
		parentLevel:0
	},
	/*后台审核使用*/
	txtForumName : {
		ctrlId : "txtForumCode",
		errorCtrlId : "errorForumName",
		prompt : "请选择版块",
		nullError : "请选择版块",
		parentLevel:0
	},
	hdnTags : {
		ctrlId : "hdnTags",
		errorCtrlId : "errorTags",
		prompt : "请选择标签",
		nullError : "请选择标签",
		parentLevel:0
	}
};
var commentInfo = {
    hdnCommentContent : {
		ctrlId : "hdnCommentContent",
		errorCtrlId : "errorCommentContent",
		minLength : 2,
		maxLength : 300,
		nullError : "请输入评论内容",
		lengthError : '帖子内容不能超过300字符[150汉字]请按"清除空格"按钮',
		showBackground : false
	}
};