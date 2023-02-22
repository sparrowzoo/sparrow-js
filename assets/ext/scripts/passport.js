Sparrow.passport = {
    api: {
        login:"/shortcut-login.json",
        register:"/register/email/shortcut",
        activate:"/register/email/activate/send.json"
    },
    initTabs: function () {
        var tabs = $("#tabs");
        if (tabs == null || tabs.s == null) {
            return;
        }
        var config = {};
        if ($.request("register") == "true") {
            config = {
                index: 1
            };
            $("txtEmail").focus();
        } else {
            $("txtUserName").focus();
        }
        $("#tabs").tabs(config);
    },
    bindEvents: function () {
        $.dispatcher.eventRegistry = [
            {
                id: "btnRegister",
                delegate: $.passport.register.shortcut
            },
            {
                id: "btnLogin",
                delegate: $.passport.login.shortcut
            },
            {
                id:"btnResentActiveEmail",
                delegate: $.passport.register.activate
            }
        ];
        $.dispatcher.bind();

        $(document).enter(function () {
            var submitButton = $("divShortCutRegister").className == "block" ? $("btnRegister") : $("btnLogin");
            submitButton.onclick();
        });
    },
    init: function () {
        document.domain = $.browser.cookie.root_domain;
        $.v.background_color = false;
        this.initTabs();
        this.bindEvents();
    },
    authenticationCallback: function (result) {
        /* 密码保存天数 */
        var chkLoginDays = $("chbLoginDays");
        var days = chkLoginDays != null && chkLoginDays.checked ? parseInt(chbLoginDays.value) * 24 * 60 * 60
            : 0;
        $.browser.setCookie($.browser.cookie.permission,
            result.data.permission, days, $.browser.cookie.root_domain);
        /* 回调函数的名字空间 */
        /*thread.up,thread.down,thread.like etc...*/
        var nsOfCallback = $.request("callback-ns");
        if (!$.isNullOrEmpty(nsOfCallback)) {
            nsOfCallback = "." + nsOfCallback;
        }
        /* 回调参数 */
        var callBackParameter = $.request("parameter");
        /* 注册成功后默认登录状态 */
        //Sparrow.thread.lick.callback(args);
        eval("parent.$" + nsOfCallback + ".loginCallback('" + callBackParameter + "')");
        parent.$.win.closeClick();
    },
    register: {
        validate: {
            email: function (srcElement) {
                if ($.v.isEmail(regInfo, srcElement) != true) {
                    return
                }
                $.ajax.json($.url.root + "/user/validate-email.json", "email=" + $("#txtEmail").value(), function (result) {
                    if (result.data === false) {
                        $.v.ok(regInfo, srcElement);
                        regInfo.txtEmail.isExist = false;
                    } else {
                        regInfo.txtEmail.isExist = true;
                        $.v.fail(regInfo.txtEmail);
                    }
                });
            },
            user: function (srcElement) {
                if ($.v.isNull(regInfo, srcElement) != true) {
                    return;
                }
                if (!$.v.isUserNameRule(regInfo, srcElement)) {
                    return;
                }
                $.ajax.json($.url.root + "/user/validate-user-name.json", "userName=" + $("#txtUserName").value(), function (result) {
                    if (result.data === false) {
                        $.v.ok(regInfo.txtUserName);
                        regInfo.txtUserName.isExist = false;
                    } else {
                        regInfo.txtUserName.isExist = true;
                        $.v.fail(regInfo.txtUserName);
                    }
                });
            }
        },
        /* 注册事件 */
        shortcut: function () {
            if (!$.v.getValidateResult(regInfo, false)) {
                return false;
            }
            $.ajax.json(
                $.url.root + $.passport.api.register,
                $.getFormData(regInfo),
                $.passport.authenticationCallback);
        },
        activate:function(){
                   var email=$('#hdnEmail').value();
                   $.ajax.json($.url.passport+$.passport.api.activate,
                                  'email='+email);
        }
    },
    login: {
        /* 快捷登录事件 */
        shortcut: function () {
            /* 验证数组 */
            if (!$.v.getValidateResult(loginInfo, false)) {
                return false;
            }
            //被选中的第一个checked 值
            var loginDays = $("*loginDays").s;
            var postString = $.getFormData(loginInfo);
            if (loginDays) {
                postString += "&loginDays=" + loginDays;
            }
            $.ajax.json(
                $.url.root + $.passport.api.login,
                postString, $.passport.authenticationCallback
            );
        }
    }
};
document.ready(function () {
    $.passport.init();
});
