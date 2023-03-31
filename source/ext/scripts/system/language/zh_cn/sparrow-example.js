lang = {
        message: {
        delete: "用户删除后将无法恢复，您确认要删除吗?",
        update: "用户更新成功",
        noSelectRecord: "请选择用户",
        enable: "您确认启用该用户吗？",
        disable: "您确认禁用该用户吗?",
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
        };sparrowExampleInfo={txtUserName:{
"errorCtrlId" : 'errorUserName',
"lengthError" : '用户名至少6位',
"nameRuleError" : '请输入6-20个字符(字母、数字或下划线)推荐字母+数字组合的用户名。',
"setError" : '用户名已被注册,请您换一个用户名。',
"minLength" : 6,
"parentLevel" : 1,
"prompt" : '请输入6-20个字符(字母、数字或下划线)推荐字母+数字组合的用户名。',
"nullError" : '请输入6-20个字符的用户名',
"maxLength" : 20,
"event" : 'UserNameRuleValidator'
}
,Status:{
"errorCtrlId" : 'errorStatus',
"options" : [1,2,3],
"event" : 'AllowOptionsValidator',
"defaultValue" : '1'
}
,txtAge:{
"errorCtrlId" : 'errorAge',
"minValue" : 1,
"digitalError" : '年龄必须>0并且<100',
"maxValue" : 100,
"allowNull" : true,
"prompt" : '请输入年龄',
"nullError" : '不允许为空',
"event" : 'DigitalValidator',
"defaultValue" : -2147483648
}
,txtEmail:{
"errorCtrlId" : 'errorEmail',
"lengthError" : '邮箱长度必须>=10 并且<255',
"emailError" : '邮箱格式输入错误',
"setError" : '邮箱已存在',
"minLength" : 10,
"allowNull" : false,
"parentLevel" : 1,
"prompt" : '请输入邮箱',
"nullError" : '请输入您注册的电子邮箱。',
"maxLength" : 255,
"event" : 'EmailValidator'
}
,txtPassword:{
"errorCtrlId" : 'errorPassword',
"lengthError" : '密码要求6-20位字符',
"minLength" : 6,
"allowNull" : false,
"prompt" : '请输入密码',
"nullError" : '用户密码不允许为空',
"maxLength" : 20,
"event" : 'NullValidator'
}
,txtConfirmPassword:{
"errorCtrlId" : 'errorConfirmPassword',
"lengthError" : '密码长度必须>=6 并且小于30',
"otherCtrlId" : 'txtPassword',
"noEqualError" : '两次密码输入不一致',
"minLength" : 6,
"parentLevel" : 1,
"prompt" : '请输入确认密码',
"nullError" : '确认密码不能为空',
"maxLength" : 30,
"event" : 'EqualValidator'
}
,txtIdCard:{
"errorCtrlId" : 'errorIdCard',
"lengthError" : '请输入18位身份证号码',
"minLength" : 18,
"idCardError" : '身份证号码输入有误',
"allowNull" : true,
"parentLevel" : 1,
"prompt" : '请输入身份证号码',
"nullError" : '身份证号码不允许为空',
"maxLength" : 18,
"event" : 'IdCardValidator'
}
,txtMobile:{
"errorCtrlId" : 'errorMobile',
"lengthError" : '请输入11位手机号码',
"mobileError" : '手机号码输入有误 例：13588888888',
"minLength" : 11,
"allowNull" : false,
"parentLevel" : 1,
"prompt" : '请输入手机号码',
"nullError" : '手机号码不允许为空',
"maxLength" : 11,
"event" : 'MobileValidator'
}
,txtTel:{
"errorCtrlId" : 'errorTel',
"lengthError" : '电话号码长度在7-12位之间',
"telError" : '电话号码输入有误 例：010-88888888',
"minLength" : 7,
"allowNull" : false,
"parentLevel" : 1,
"prompt" : '请输入电话号码',
"nullError" : '电话号码为必填项。',
"maxLength" : 12,
"event" : 'TelValidator'
}
,txtName:{
"errorCtrlId" : 'errorName',
"lengthError" : '请输入1~100个汉字',
"chineseCharactersError" : '请输入中文',
"prompt" : '请输入汉字',
"nullError" : '请输入真实姓名',
"maxLength" : 100,
"minLength" : 1,
"event" : 'ChineseCharactersValidator'
}
,txtRemark:{
"errorCtrlId" : 'errorRemark',
"allowCharLengthShowControlId" : 'spanAllowCharLength',
"allowNull" : true,
"prompt" : '',
"maxAllowCharLength" : 512,
"maxCharLengthControlId" : 'spanMaxCharLength',
"event" : 'AllowInputCharLengthValidator'
}
}