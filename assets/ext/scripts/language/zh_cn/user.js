var loginInfo = {
  txtUserName: {
    errorCtrlId: "errorUserName",
    prompt: "请输入您的用户名或Email.",
    nullError: "请输入您的用户名或Email.",
    parentLevel: 1,
  },
  txtPassword: {
    errorCtrlId: "errorPassword",
    prompt: "请输入密码。",
    nullError: "请输入密码。",
    parentLevel: 1,
  },
  txtValidateCode: {
    errorCtrlId: "errorValidateCode",
    prompt: "请输入验证码",
    nullError: "请输入验证码",
    parentLevel: 1,
  },
};

var password = {
  txtOldPassword: {
    errorCtrlId: "errorOldPassword",
    prompt: "请输入您的原始密码",
    nullError: "请输入您的原始密码",
    minLength: 6,
    maxLength: 16,
    lengthError: "密码至少6位",
    setError: "原始密码输入错误",
    isExist: false,
    parentLevel: 0,
  },
  txtPassword: {
    errorCtrlId: "errorPassword",
    prompt: "6-16个字符,建议使用字母加数字或符号的组合密码。",
    nullError: "请输入密码。",
    minLength: 6,
    maxLength: 16,
    lengthError: "密码至少6位",
    parentLevel: 0,
  },
  txtConfirmPassword: {
    errorCtrlId: "errorConfirmPassword",
    prompt: "请再次输入密码。",
    nullError: "请再次输入密码。",
    otherCtrlId: "txtPassword",
    noEqualError: "两次密码输入不一致。",
    parentLevel: 0,
  },

  txtUserLoginName: {
    errorCtrlId: "errorUserLoginName",
    prompt: "请输入您的注册帐号",
    nullError: "请输入您的注册帐号",
  },
};

var findPassword = {
  txtValidateEmail: {
    errorCtrlId: "errorValidateEmail",
    prompt: "请输入您的注册邮箱",
    nullError: "请输入您的注册邮箱",
    emailError: "电子邮箱格式输入有误。",
    parentLevel: 0,
  },
};

var regInfo = {
  txtEmail: {
    errorCtrlId: "errorEmail",
    prompt:
      '输入您的E-MAIL,方便您日后找回密码。没有电子邮箱?推荐使用<a target="_blank" unselectable="on" style="color:#ff9900;" href="http://reg.email.163.com/mailregAll/reg0.jsp?from=' +
      $.url.root +
      '">网易</a>邮箱。',
    nullError: "请输入您注册的电子邮箱。",
    emailError: "电子邮箱格式输入有误。",
    minLength: 6,
    maxLength: 200,
    lengthError: "电子邮件长度在6-200位之间",
    setError:
      '电子邮箱已存在,请换用其它电子邮件。没有电子邮箱?推荐使用<a target="_blank" unselectable="on" href="http://reg.email.163.com/mailregAll/reg0.jsp?from=' +
      $.url.root +
      '">网易</a>邮箱。',
    isExist: false,
    parentLevel: 1,
  },
  txtRegUserName: {
    errorCtrlId: "errorRegUserName",
    prompt: "请输入6-20个字符(字母、数字或下划线)推荐字母+数字组合的用户名。",
    nullError: "请输入您注册的用户名。",
    minLength: 6,
    maxLength: 20,
    nameRuleError:
      "请输入6-20个字符(字母、数字或下划线)推荐字母+数字组合的用户名。",
    lengthError: "用户名至少6位。",
    setError: "用户名已被注册,请您换一个用户名。",
    parentLevel: 1,
  },
  txtRegPassword: {
    errorCtrlId: "errorRegPassword",
    prompt: "请输入6-16个字符,建议使用字母加数字或符号的组合密码。",
    nullError: "请输入密码",
    minLength: 6,
    maxLength: 16,
    lengthError: "密码至少6位",
    parentLevel: 1,
  },
  txtConfirmPassword: {
    errorCtrlId: "errorConfirmPassword",
    prompt: "请再次输入密码。",
    nullError: "请再次输入密码。",
    otherCtrlId: "txtRegPassword",
    noEqualError: "两次密码输入不一致。",
    parentLevel: 1,
  },
  txtRegValidateCode: {
    errorCtrlId: "errorRegValidateCode",
    prompt: "请输入验证码",
    nullError: "请输入验证码",
    parentLevel: 1,
  },
};
var profileInfo = {
  txtUserName: {
    errorCtrlId: "errorUserName",
    prompt: "请输入用户昵称",
    nullError: "请输入用户昵称",
  },
  txtRemark: {
    errorCtrlId: "errorRemark",
    prompt: "请输入个人简介",
    lengthError: "个人简介不得超过500个字符。",
    spanTxtCount: "spanTxtCount",
    allowNull: true,
  },
  txtPersonalSignature: {
    errorCtrlId: "errorRemark",
    prompt: "请输入个性签名",
    lengthError: "个性签名不得超过500个字符。",
    spanTxtCount: "spanPersonalSignatureTxtCount",
    allowNull: true,
  },
};
