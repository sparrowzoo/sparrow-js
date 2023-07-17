lang = {
        message: {
        delete: "内容删除后将无法恢复，您确认要删除吗?",
        update: "内容更新成功",
        noSelectRecord: "请选择内容",
        enable: "您确认启用该内容吗？",
        disable: "您确认禁用该内容吗?",
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
        };contentInfo={txtCategoryId:{
"errorCtrlId" : 'errorCategoryId',
"lengthError" : '',
"minLength" : 1,
"allowNull" : false,
"prompt" : '请选择内容品类',
"nullError" : '内容品类为必填项',
"maxLength" : 20,
"event" : 'NullValidator'
}
,txtEditor:{
"errorCtrlId" : 'errorEditor',
"lengthError" : '',
"minLength" : 1,
"allowNull" : false,
"prompt" : '请选择编辑器',
"nullError" : '编辑器为必选项',
"maxLength" : 20,
"event" : 'NullValidator'
}
,txtTitle:{
"errorCtrlId" : 'errorTitle',
"lengthError" : '文章标题必须在于10个字符，并且小于200字符',
"minLength" : 10,
"allowNull" : false,
"prompt" : '请输入文章标题',
"nullError" : '文章标题为必填项',
"maxLength" : 200,
"event" : 'NullValidator'
}
,txtBrief:{
"errorCtrlId" : 'errorBrief',
"lengthError" : '文章摘要必须在于50个字符，并且小于500字符',
"minLength" : 50,
"allowNull" : false,
"prompt" : '请输入文章摘要',
"nullError" : '文章标题为必填项',
"maxLength" : 500,
"event" : 'NullValidator'
}
,Status:{
"errorCtrlId" : 'errorStatus',
"options" : [1,2],
"event" : 'AllowOptionsValidator',
"defaultValue" : '1'
}
}