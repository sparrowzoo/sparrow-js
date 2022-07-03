var loginInfo = {
    txtUserName: {
        errorCtrlId: 'errorUserName',
        prompt: '请输入您的用户名或email.',
        nullError: '请输入您的用户名或email.',
        parentLevel:1
    },
    txtPassword: {
        errorCtrlId: 'errorPassword',
        prompt: '请输入密码。',
        nullError: '请输入密码。',
        parentLevel:1
    },
    txtValidateCode: {
        errorCtrlId: 'errorValidateCode',
        prompt: '请输入验证码',
        nullError: '请输入验证码',
        parentLevel:1
    }
};
var password = {
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

    txtUserLoginName: {
        errorCtrlId: 'errorUserLoginName',
        prompt: '请输入您的注册帐号',
        nullError: '请输入您的注册帐号'
    }
};

var findPassword={
    txtValidateEmail: {
        errorCtrlId: 'errorValidateEmail',
        prompt: '请输入您的注册邮箱',
        nullError: '请输入您的注册邮箱',
        emailError: '电子邮箱格式输入有误。',
        parentLevel: 0
    }
};
var regInfo = {
    txtEmail: {
        errorCtrlId: 'errorEmail',
        prompt: '输入您的E-MAIL,方便您日后找回密码。没有电子邮箱?推荐使用<a target=\"_blank\" unselectable=\"on\" style="color:#ff9900;" href="http://reg.email.163.com/mailregAll/reg0.jsp?from='+$.url.root+'">网易</a>邮箱。',
        nullError: '请输入您注册的电子邮箱。',
        emailError: '电子邮箱格式输入有误。',
        minLength: 6,
        maxLength: 200,
        lengthError: '电子邮件长度在6-200位之间',
        setError: '电子邮箱已存在,请换用其它电子邮件。没有电子邮箱?推荐使用<a target=\"_blank\" unselectable=\"on\" href="http://reg.email.163.com/mailregAll/reg0.jsp?from='+$.url.root+'">网易</a>邮箱。',
        isExist: false,
        parentLevel:1
    },
    txtRegUserName: {
        errorCtrlId: 'errorRegUserName',
        prompt: '请输入6-20个字符(字母、数字或下划线)推荐字母+数字组合的用户名。',
        nullError: '请输入您注册的用户名。',
        minLength: 6,
        maxLength: 20,
        nameRuleError: '请输入6-20个字符(字母、数字或下划线)推荐字母+数字组合的用户名。',
        lengthError: '用户名至少6位。',
        setError: '用户名已被注册,请您换一个用户名。',
        parentLevel:1
    },
    txtRegPassword: {
        errorCtrlId: 'errorRegPassword',
        prompt: '请输入6-16个字符,建议使用字母加数字或符号的组合密码。',
        nullError: '请输入密码',
        minLength: 6,
        maxLength: 16,
        lengthError: '密码至少6位',
        parentLevel:1
    },
    txtConfirmPassword: {
        errorCtrlId: 'errorConfirmPassword',
        prompt: '请再次输入密码。',
        nullError: '请再次输入密码。',
        otherCtrlId: 'txtRegPassword',
        noEqualError: '两次密码输入不一致。',
        parentLevel:1
    },
    txtRegValidateCode: {
        errorCtrlId: 'errorRegValidateCode',
        prompt: '请输入验证码',
        nullError: '请输入验证码',
        parentLevel:1
    }
};
var userInfo = {
    txtUserName: {
        errorCtrlId: "errorUserName",
        prompt: "请输入用户昵称",
        nullError: "请输入用户昵称"
    },
    txtRemark: {
        errorCtrlId: 'errorRemark',
        prompt: '请输入个人简介',
        lengthError: '个人简介不得超过500个字符。',
        spanTxtCount: 'spanTxtCount',
        allowNull: true
    },
    txtPersonalSignature: {
        errorCtrlId: 'errorRemark',
        prompt: '请输入个性签名',
        lengthError: '个性签名不得超过500个字符。',
        spanTxtCount: 'spanPersonalSignatureTxtCount',
        allowNull: true
    },
    txtQQ: {
        errorCtrlId: "errorQQ",
        prompt: "请输入QQ号码",
        lengthError: "请输入5-12位QQ号码",
        minLength: 5,
        maxLength: 13,
        digitalError: "必须输入数字",
        allowNull: true
    },
    txtMSN: {
        errorCtrlId: "errorMSN",
        prompt: "请输入MSN号码",
        emailError: '电子邮件格式输入有误。',
        minLength: 6,
        maxLength: 200,
        lengthError: '电子邮件长度在6-200位之间',
        allowNull: true
    },
    txtTel: {
        errorCtrlId: "errorTel",
        prompt: "请输入电话号码",
        telError: '电话号码输入有误。',
        mobileError: '请输入11位手机号码',
        lengthError: '请输入11位手机号码',
        allowNull: true
    }
};
educationInfo = {
    txtSchoolName: {
        errorCtrlId: 'errorSchoolName',
        prompt: '请输入学校名称',
        nullError: '学校名称为必添项'
    },
    txtStepName: {
        errorCtrlId: 'errorStep',
        prompt: '请选择教育层次',
        nullError: '教育层次为必添项'
    },
    txtStartTime: {
        errorCtrlId: 'errorStartTime',
        prompt: '请输入入学日期',
        nullError: '入学日期为必添项'
    },
    txtEndTime: {
        errorCtrlId: 'errorEndTime',
        prompt: '请输入毕业时间',
        nullError: '毕业时间为必添项'
    }
};
workInfo = {
    txtUnitName: {
        errorCtrlId: 'errorUnitName',
        prompt: '请输入单位名称',
        nullError: '单位名称为必添项'
    },
    txtWorkPlace: {
        errorCtrlId: 'errorWorkPlace',
        prompt: '请输入工作单位所在地',
        nullError: '工作单位所在地为必添项'
    },
    txtStartTime: {
        errorCtrlId: 'errorStartTime',
        prompt: '请输入入职日期',
        nullError: '入职日期为必添项'
    },
    txtEndTime: {
        errorCtrlId: 'errorEndTime',
        prompt: '请输入离职日期',
        nullError: '离职为必添项'
    }
};
var lang = {
        message: {
            work: {
                add: "新增工作经历",
                edit: "编辑工作经历",
                new_success: "恭喜!工作经历新增成功",
                update_success: "恭喜!工作经历更新成功",
                delete_success: "您的工作经验删除成功",
                delete_confirm:"工作经验删除将无法恢复，您确认要删除吗？"
            },
            education: {
                add: "新增教育经历",
                edit: "编辑教育经历",
                new_success: "恭喜!教育经历新增成功",
                update_success: "恭喜!教育经历更新成功",
                delete_success: "您的教育经历删除成功",
                delete_confirm:"教育经历删除将无法恢复，您确认要删除吗？"
            },
            edit_ok: "用户信息更新成功",
            sendPassword: "验证邮件已发送！请查收",
            email_no_config: "系统暂未配置您的邮箱登陆页,请手动进入邮箱进行验证",
            title: "温馨提示：",
            del: "用户被彻底删除后将无法恢复，您确认要删除吗?",
            man: "男",
            woman: "女",
            error: "网络繁忙，请稍侯再试。",
            deleteFile: "确定后此用户组将被彻底删除，您确认要继续本次操作吗？",
            update: "用户更新成功",
            noSelectRecord: "请选择用户",
            enable: "您确认启用该用户吗？",
            disable: "您确认禁用该用户吗?"
        },
        command: {
            enable: "启用",
            disable: "禁用",
            del: "删除",
            edit: "编辑",
            update: "更新",
            save: "保存"
        }
    };
