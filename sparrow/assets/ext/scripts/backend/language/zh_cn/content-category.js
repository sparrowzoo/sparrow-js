lang = {
        message: {
        delete: "内容品类删除后将无法恢复，您确认要删除吗?",
        update: "内容品类更新成功",
        noSelectRecord: "请选择内容品类",
        enable: "您确认启用该内容品类吗？",
        disable: "您确认禁用该内容品类吗?",
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
        };contentCategoryInfo={txtParentId:{
"errorCtrlId" : 'errorParentId',
"lengthError" : '',
"minLength" : 1,
"allowNull" : false,
"prompt" : '请选择你品类',
"nullError" : '父品类为必选项',
"maxLength" : 20,
"event" : 'NullValidator'
}
,txtName:{
"errorCtrlId" : 'errorName',
"lengthError" : '',
"minLength" : 1,
"allowNull" : false,
"prompt" : '请输入品类名',
"nullError" : '品类名为必填项',
"maxLength" : 20,
"event" : 'NullValidator'
}
,txtCode:{
"errorCtrlId" : 'errorCode',
"lengthError" : '',
"minLength" : 1,
"allowNull" : false,
"prompt" : '请输入品类编码',
"nullError" : '品类编码为必填项',
"maxLength" : 20,
"event" : 'NullValidator'
}
,txtSort:{
"errorCtrlId" : 'errorSort',
"lengthError" : '',
"minLength" : 1,
"allowNull" : false,
"prompt" : '请输入排序号',
"nullError" : '品类序号为必填项',
"maxLength" : 20,
"event" : 'NullValidator'
}
,Status:{
"errorCtrlId" : 'errorStatus',
"options" : [1,2],
"event" : 'AllowOptionsValidator',
"defaultValue" : '1'
}
}