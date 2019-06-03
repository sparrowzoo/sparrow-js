/*------------------------------------validate 表单验证------------------------------------------------*/
/*
 * ctrlId
 *
 * errorCtrlId
 *
 * prompt
 *
 * nullError
 *
 * emailError
 *
 * lengthError
 *
 * dateError
 */
Sparrow.v = {
    background_color: '#fff',
    empty_string: '',
    index: null,
    right_message: '<img src="' + $.url.resource + '/images/' + $.website.themes
        + '/succeed.gif"/>',
    reset: function () {
        v.index = null;
    },
    getErrorLabel: function (validate) {
        return validate.errorCtrlId ? $(validate.errorCtrlId.join(v.index)) : null;
    },
    getInput: function (validate) {
        return validate.ctrlId ? $(validate.ctrlId.join(v.index)) : null;
    },
    //click blur 替换成initPlaceholder
    initPlaceholder: function (json) {
        for (var o in json) {
            var property = json[o];
            var ctrl = this.getInput(property);
            if (ctrl != null && ctrl.type == "text") {
                ctrl.placeholder = property.prompt;
            }
        }
    },
    // 设置当前控件的父控件背景
    _setBackground: function (validate, color) {
        if (v.background_color == false) {
            return;
        }
        if (!color) color = v.background_color;
        var parentLevel = validate.parentLevel;
        if (typeof (parentLevel) == "undefined")
            parentLevel = 1;
        if (parentLevel > 0) {
            var background = this.getInput(validate);
            if (background == null) return;
            try {
                while (background.tagName.toUpperCase() != "TR" && background.className != "line" && background.className != "validate") {
                    background = background.parentNode;
                }
                background.style.background = color;
            } catch (err) {
            }
            var errorCtrl = this.getErrorLabel(validate);
            if (errorCtrl != null) errorCtrl.className = "front";
        }
    },
    showMessage: function (validate) {
        var errorCtrl = this.getErrorLabel(validate);
        if (errorCtrl) {
            errorCtrl.className = "prompt";
            errorCtrl.innerHTML = validate.prompt;
        }
        this._setBackground(validate);
    },
    ok: function (validate) {
        var errorLabel = this.getErrorLabel(validate);
        if (errorLabel) {
            errorLabel.innerHTML = this.right_message;
            errorLabel.className = "prompt";
        }
        this._setBackground(validate, "#ffffff");
        var ctrl = this.getInput(validate);
        if (ctrl) {
            ctrl.style.backgroundColor = "#ffffff";
            if (ctrl.value == "" && validate.defaultValue)
                ctrl.value = validate.defaultValue;
        }
        return true;
    },
    fail: function (validate, errorInfo) {
        if (!errorInfo) {
            errorInfo = validate.setError
        }
        var errorCtrl = this.getErrorLabel(validate);
        if (errorCtrl) {
            errorCtrl.innerHTML = "!" + errorInfo;
            errorCtrl.className = "error";
        }
        return "!" + errorInfo;
    },
    _validate: function (validate) {
        this._setBackground(validate, "#ffffff");
        var ctrl = this.getInput(validate);
        var ctrlValue = ctrl.value.trim();
        var errorCtrl = this.getErrorLabel(validate);
        var length = (ctrl.tagName.toUpperCase() == "SELECT" && ctrl.multiple == true) ? ctrl.options.length
            : ctrlValue.getByteLength();
        //允许空
        if (length == 0 && validate.allowNull) {
            return this.ok(validate);
        }
        //空但有默认值
        if (length == 0 && validate.defaultValue != undefined) {
            ctrl.value = validate.defaultValue;
            return this.ok(validate);
        }
        //不允许为空
        if (length == 0 && !validate.allowNull) {
            return this.fail(validate, validate.nullError);
        }
        // 长度不合法
        if ((validate.maxLength
            && length > validate.maxLength) || (validate.minLength
            && length < validate.minLength)) {
            return this.fail(validate, validate.lengthError);
        }

        //ajax 错误未修改
        if (errorCtrl && errorCtrl.className == "error" && errorCtrl.innerHTML == ("!" + validate.setError)) {
            return this.fail(validate);
        }
        return true;
    },
    isUserNameRule: function (validate) {
        var result = this._validate(validate);
        if (result != true) {
            return result;
        }
        if (this.getInput(validate).value.search(/^[a-zA-Z0-9_]{6,20}$/) == -1) {
            return this.fail(validate, validate.nameRuleError);
        }
        return this.ok(validate);
    },
    isEmail: function (validate) {
        var result = this._validate(validate);
        if (result != true) {
            return result;
        }
        if (this.getInput(validate).value.search(/\w+([-+.']\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*/) == -1) {
            return this.fail(validate, validate.emailError);
        }
        return this.ok(validate);
    },
    isTel: function (validate) {
        var result = this._validate(validate);
        if (result != true) {
            return result;
        }
        if (this.getInput(validate).value
            .search(/^(0[0-9]{2,3}\-)?([2-9][0-9]{6,7})+(\-[0-9]{1,4})?$/) == -1) {
            return this.fail(validate, validate.telError);
        }
        return this.ok(validate);
    },
    isMobile: function (validate) {
        validate.minLength = 11;
        validate.maxLength = 11;
        var result = this._validate(validate);
        if (result != true) {
            return result;
        }
        if (this.getInput(validate).value.search(/^1[\d]{10}$/) == -1) {
            return this.fail(validate, validate.mobileError);
        }
        return this.ok(validate);
    },
    isIdCard: function (validate) {
        var result = this._validate(validate);
        if (result != true) {
            return result;
        }
        if (this.getInput(validate).value
            .search(/^([1-9]([0-9]{16}|[0-9]{13})([0-9]|x|X))$/) == -1) {
            return this.fail(validate, validate.idCardError);
        }
        return this.ok(validate);
    },
    isNull: function (validate) {
        var result = this._validate(validate);
        if (result != true) {
            return result;
        }
        return this.ok(validate);
    },
    isWord: function (validate) {
        var result = this._validate(validate);
        if (result !== true) {
            return result;
        }
        if (this.getInput(validate).value.search(/^[\u4e00-\u9fa5]$/) == -1) {
            return this.fail(validate, validate.wordError);
        }
        return this.ok(validate);
    },
    isEqual: function (validate) {
        var result = this._validate(validate);
        if (result != true) {
            return result;
        }
        if (this.getInput(validate).value != $(validate.otherCtrlId.join(v.index)).value.trim()) {
            return this.fail(validate, validate.noEqualError);
        }
        return this.ok(validate);
    },
    allowInputOption: function (validate) {
        var ctrl = this.getInput(validate);
        if (!validate.defaultValue) {
            validate.defaultValue = validate.options[0];
        }
        for (var i = 0; i < validate.options.length; i += 1) {
            if (ctrl.value === validate.options[i]) {
                break;
            }
        }
        if (i === validate.options.length) {
            ctrl.value = validate.defaultValue;
        }
        this.ok(validate);
    },
    isDigital: function (validate) {
        var ctrlValue = this.getInput(validate).value;
        var result = this._validate(validate);
        if (result !== true) {
            return result;
        }
        if (isNaN(ctrlValue)) {
            return this.fail(validate, validate.digitalError);
        }
        var floatValue = parseFloat(ctrlValue);
        //最小值 定义
        var defMin = (validate.minValue || validate.minValue === 0);
        //最大值 定义
        var defMax = (validate.maxValue || validate.maxValue === 0);
        if ((defMin && floatValue < validate.minValue) || (defMax && floatValue > validate.maxValue)) {
            return this.fail(validate, validate.digitalError);
        }
        this.ok(validate);
    },
    isImgSize: function (srcElement, defaultValue) {
        var size = srcElement.value.split('*');
        if (size.length === 2) {
            if (size[0].search(/^[0-9]+.?[0-9]$/) == -1
                || size[1].search(/^[0-9]+.?[0-9]$/) == -1) {
                srcElement.value = defaultValue;
            }
        } else {
            srcElement.value = defaultValue;
        }
    },
    isFileLength: function (srcElement, defaultValue) {
        if (srcElement.value.toUpperCase().indexOf("M") != -1) {
            if (srcElement.value.toUpperCase().split('M')[0]
                .search(/^[0-9]+.?[0-9]$/) != -1) {
                srcElement.value = srcElement.value.toUpperCase().split('M')[0] + "MB";
            } else {
                srcElement.value = defaultValue;
            }
        } else if (srcElement.value.toUpperCase().indexOf("K") != -1) {
            if (srcElement.value.toUpperCase().split('K')[0]
                .search(/^[0-9]+.?[0-9]$/) != -1) {
                srcElement.value = srcElement.value.toUpperCase().split('K')[0] + "KB";
            }
            srcElement.value = defaultValue;
        } else {
            srcElement.value = defaultValue;
        }
    },
    updateTxtCount: function (srcElement, showCtrl, maxLength, e) {
        var ctrl = $(showCtrl);
        e = e || window.event;
        if (e.keyCode < 37 || e.keyCode > 40) {
            var length = srcElement.value.getByteLength();
            var allowInputLength = maxLength - length;
            if (allowInputLength <= 0) {
                ctrl.innerHTML = 0;
                srcElement.value = srcElement.value.subString(maxLength, false);
            } else {
                ctrl.innerHTML = allowInputLength;
            }
        }
    },
    /* 获取验证信息*/
    /*action=false则不提交*/
    /*action=update.do 指定提交*/
    /*action=function(){}*
     /*action=$(#object)*/
    /*action默认为提交*/
    getValidateResult: function (json, action) {
        var wrongInfo = [];
        for (var o in json) {
            var property = json[o];
            if (!property) {
                continue;
            }
            var error = null;
            var ctrl = this.getInput(property);
            if (!ctrl) {
                continue;
            }
            //已输入过 则一定会会error message
            var errorCtrl = this.getErrorLabel(property);
            //可能无error ctrl
            if (errorCtrl) {
                if (errorCtrl.className === "error") {
                    error = errorCtrl.innerHTML;
                }
            }
            //未输入过 则判断null
            if ($.isNullOrEmpty(error)) {
                error = v.isNull(property);
            }
            //无onblur  此情况无ajax请求
            if (v.validate) {
                error = v.validate();
            }
            if (error != true && !$.isNullOrEmpty(error)) {
                wrongInfo.push(error);
            }
        }
        if (wrongInfo.length > 0) {
            $.message(wrongInfo.join("<br/>"));
            return false;
        }
        if (action !== false) {
            if (typeof(action) === "string" || typeof(action) === "undefined") {
                $.submit(action);
            }
            else if (typeof(action) === "function") {
                action(this);
            }
            else if (typeof(action) === "object" && action.s.type === "hidden") {
                var actionUrl = action.attr("new");
                if (!$.isNullOrEmpty(action.value())) {
                    actionUrl = action.attr("update");
                }
                $.submit(actionUrl);
            }
        }
        return true;
    }
};