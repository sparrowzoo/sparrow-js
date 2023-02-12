/*------------------------------------validate 表单验证------------------------------------------------*/
/*
 * key ==ctrlId
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
 *
        prompt: '请输入您的原始密码',
        minLength: 6,
        maxLength: 16,
        lengthError: '密码至少6位',
        setError: '原始密码输入错误',
        isExist: false,
        parentLevel:0
 */
Sparrow.v = {
    background_color: '#fff',
    empty_string: '',
    //字段的索引
    index: null,
    right_message: '<img alt="" src="' + $.url.resource + '/images/' + $.website.themes
        + '/succeed.gif"/>',
    reset: function () {
        $.v.index = null;
    },
    getErrorLabel: function (validate) {
        return validate.errorCtrlId ? $(validate.errorCtrlId.join($.v.index)) : null;
    },
    //click blur 替换成initPlaceholder
    initPlaceholder: function (json) {
        for (var o in json) {
            var property = json[o];
            var ctrl = $(o);
            if (ctrl != null && ctrl.type === "text") {
                ctrl.placeholder = property.prompt;
            }
        }
    },
    // 设置当前控件的父控件背景
    _setBackground: function (validate, color,srcElement) {
        if(!srcElement){
            return;
        }
        if ($.v.background_color === false) {
            return;
        }
        if (!color) color = $.v.background_color;
        var parentLevel = validate.parentLevel;
        if (typeof (parentLevel) == "undefined")
            parentLevel = 1;
        if (parentLevel > 0) {
            var background = srcElement;
            if (background == null) return;
            try {
                while (background.tagName.toUpperCase() !== "TR" && background.className !== "line" && background.className !== "validate") {
                    background = background.parentNode;
                }
                background.style.background = color;
            } catch (err) {
            }
            var errorCtrl = this.getErrorLabel(validate);
            if (errorCtrl != null) errorCtrl.className = "front";
        }
    },
    showMessage: function (validate,srcElement) {
        validate=validate[srcElement.id];
        var errorCtrl = this.getErrorLabel(validate);
        if (errorCtrl) {
            errorCtrl.className = "prompt";
            errorCtrl.innerHTML = validate.prompt;
        }
        this._setBackground(validate);
    },
    ok: function (validate,srcElement) {
        var errorLabel = this.getErrorLabel(validate);
        if (errorLabel) {
            errorLabel.innerHTML = this.right_message;
            errorLabel.className = "prompt";
        }
        this._setBackground(validate, "#ffffff",srcElement);
        if (srcElement) {
            srcElement.style.backgroundColor = "#ffffff";
            if (srcElement.value === "" && validate.defaultValue)
                srcElement.value = validate.defaultValue;
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
    _validate: function (validate,srcElement) {
        this._setBackground(validate, "#ffffff",srcElement);
        var srcElementValue = srcElement.value.trim();
        var errorCtrl = this.getErrorLabel(validate);
        var length = (srcElement.tagName.toUpperCase() === "SELECT" && srcElement.multiple === true) ? srcElement.options.length
            : srcElementValue.getByteLength();
        //允许空
        if (length === 0 && validate.allowNull) {
            return this.ok(validate);
        }
        //空但有默认值
        if (length === 0 && validate.defaultValue !== undefined) {
            srcElement.value = validate.defaultValue;
            return this.ok(validate);
        }
        //不允许为空
        if (length === 0 && !validate.allowNull) {
            return this.fail(validate, validate.nullError);
        }
        // 长度不合法
        if ((validate.maxLength
            && length > validate.maxLength) || (validate.minLength
            && length < validate.minLength)) {
            return this.fail(validate, validate.lengthError);
        }

        //ajax 错误未修改
        if (errorCtrl && errorCtrl.className === "error" && errorCtrl.innerHTML === ("!" + validate.setError)) {
            return this.fail(validate);
        }
        return true;
    },
    isUserNameRule: function (validate,srcElement) {
        validate=validate[srcElement.id];
        var result = this._validate(validate,srcElement);
        if (result !== true) {
            return result;
        }
        if (srcElement.value.search(/^[a-zA-Z0-9_]{6,20}$/) === -1) {
            return this.fail(validate, validate.nameRuleError);
        }
        return this.ok(validate,srcElement);
    },
    isEmail: function (validate,srcElement) {
        validate=validate[srcElement.id];
        var result = this._validate(validate,srcElement);
        if (result !== true) {
            return result;
        }
        if (srcElement.value.search(/\w+([-+.']\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*/) === -1) {
            return this.fail(validate, validate.emailError);
        }
        return this.ok(validate,srcElement);
    },
    isTel: function (validate,srcElement) {
        validate=validate[srcElement.id];
        var result = this._validate(validate,srcElement);
        if (result !== true) {
            return result;
        }
        if (srcElement.value
            .search(/^(0[0-9]{2,3}\-)?([2-9][0-9]{6,7})+(\-[0-9]{1,4})?$/) === -1) {
            return this.fail(validate, validate.telError);
        }
        return this.ok(validate,srcElement);
    },
    isMobile: function (validate,srcElement) {
        validate=validate[srcElement.id];
        validate.minLength = 11;
        validate.maxLength = 11;
        var result = this._validate(validate,srcElement);
        if (result !== true) {
            return result;
        }
        if (srcElement.value.search(/^1[\d]{10}$/) === -1) {
            return this.fail(validate, validate.mobileError);
        }
        return this.ok(validate,srcElement);
    },
    isIdCard: function (validate,srcElement) {
        validate=validate[srcElement.id];
        var result = this._validate(validate,srcElement);
        if (result !== true) {
            return result;
        }
        if (srcElement.value
            .search(/^([1-9]([0-9]{16}|[0-9]{13})([0-9]|x|X))$/) === -1) {
            return this.fail(validate, validate.idCardError);
        }
        return this.ok(validate,srcElement);
    },
    isNull: function (validate,srcElement) {
        validate=validate[srcElement.id];
        var result = this._validate(validate,srcElement);
        if (result !== true) {
            return result;
        }
        return this.ok(validate,srcElement);
    },
    isChineseCharacters: function (validate,srcElement) {
        validate=validate[srcElement.id];
        var result = this._validate(validate,srcElement);
        if (result !== true) {
            return result;
        }
        if (srcElement.value.search(/^[\u4e00-\u9fa5]$/) === -1) {
            return this.fail(validate, validate.chineseCharactersError);
        }
        return this.ok(validate,srcElement);
    },
    isEqual: function (validate,srcElement) {
        validate=validate[srcElement.id];
        var result = this._validate(validate,srcElement);
        if (result !== true) {
            return result;
        }
        if (srcElement.value !== $(validate.otherCtrlId.join($.v.index)).value.trim()) {
            return this.fail(validate, validate.noEqualError);
        }
        return this.ok(validate,srcElement);
    },
    allowInputOption: function (validate,srcElement) {
        validate=validate[srcElement.id];
        if (!validate.defaultValue) {
            validate.defaultValue = validate.options[0];
        }
        for (var i = 0; i < validate.options.length; i ++) {
            if (srcElement.value == validate.options[i]) {
                break;
            }
        }
        if (i == validate.options.length) {
            srcElement.value = validate.defaultValue;
        }
        this.ok(validate,srcElement);
    },
    isDigital: function (validate,srcElement) {
        validate=validate[srcElement.id];
        var srcElementValue =srcElement.value;
        var result = this._validate(validate,srcElement);
        if (result !== true) {
            return result;
        }
        if (isNaN(srcElementValue)) {
            return this.fail(validate, validate.digitalError);
        }
        var floatValue = parseFloat(srcElementValue);
        //最小值 定义
        var defMin = (validate.minValue || validate.minValue === 0);
        //最大值 定义
        var defMax = (validate.maxValue || validate.maxValue === 0);
        if ((defMin && floatValue < validate.minValue) || (defMax && floatValue > validate.maxValue)) {
            return this.fail(validate, validate.digitalError);
        }
        this.ok(validate,srcElement);
    },
    isImgSize: function (srcElement, defaultValue) {
        var size = srcElement.value.split('*');
        if (size.length === 2) {
            if (size[0].search(/^[0-9]+.?[0-9]$/) === -1
                || size[1].search(/^[0-9]+.?[0-9]$/) === -1) {
                srcElement.value = defaultValue;
            }
        } else {
            srcElement.value = defaultValue;
        }
    },
    isFileLength: function (srcElement, defaultValue) {
        if (srcElement.value.toUpperCase().indexOf("M") !== -1) {
            if (srcElement.value.toUpperCase().split('M')[0]
                .search(/^[0-9]+.?[0-9]$/) !== -1) {
                srcElement.value = srcElement.value.toUpperCase().split('M')[0] + "MB";
            } else {
                srcElement.value = defaultValue;
            }
            return;
        }
        if (srcElement.value.toUpperCase().indexOf("K") !== -1) {
            if (srcElement.value.toUpperCase().split('K')[0]
                .search(/^[0-9]+.?[0-9]$/) !== -1) {
                srcElement.value = srcElement.value.toUpperCase().split('K')[0] + "KB";
            }
            else{
                srcElement.value = defaultValue;
            }
            return;
        }
        srcElement.value = defaultValue;
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
            if(typeof(property)!=="object"){
                continue;
            }
            var error = null;
            var ctrl = $(o);
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
                error = $.v.isNull(json,ctrl);
            }
            //无onblur  此情况无ajax请求
            if ($.v.validate) {
                error = $.v.validate();
            }
            if (error !== true && !$.isNullOrEmpty(error)) {
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