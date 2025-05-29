//该js文件取消 为节省js链接数
lang = {
    message: {
        del: "标签删除后将无法恢复，您确认要删除吗?",
        publish: "",
        notTyped: "操作失败！标签尚未分类",
        noSelectRecord: "请选择要操作的信息内容",
        onlySelectOneRecord: "只能选择一条信息!",
        enable: "您确认恢复该信息吗？",
        disable: "您确认禁用该信息吗?",
        noType: "未分类标签",
        error: "网络繁忙，请稍侯再试。",
        accessDenied: "访问被拒绝"
    },
    command: {
        enable: "启用",
        disable: "禁用",
        del: "删除",
        remove: "从该类别移除",
        add: "添加到",
        edit: "编辑",
        update: "更新",
        save: "保存"
    }
};
var typeInfo = {
    txtTypeName: {
        ctrlId: 'txtTypeName',
        errorCtrlId: 'errorTypeName',
        prompt: '请输入类别',
        nullError: '请输入类别',
        minLength: 2,
        maxLength: 20,
        lengthError: '20个字符以内',
        parentLevel:0
    },
    txtOrderNo: {
        ctrlId: 'txtOrderNo',
        errorCtrlId: 'errorOrderNo',
        prompt: '请输入序号',
        nullError: '请输入序号',
        digitalError: '请输入数字',
        parentLevel:0
    }
};
var tagInfo = {
    txtTagName: {
        ctrlId: 'txtTagName',
        errorCtrlId: 'errorTagName',
        prompt: '请输入标签',
        nullError: '请输入标签',
        minLength: 2,
        maxLength: 20,
        lengthError: '20个字符以内',
        parentLevel:0
    },
    txtStatus: {
        ctrlId: 'txtStatus',
        errorCtrlId: 'errorStatus',
        prompt: '请输入状态码0：无效 1有效',
        options:[0,1],
        parentLevel:0
    }
};
