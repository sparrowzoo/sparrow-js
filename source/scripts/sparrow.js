Sparrow.random = function () {
    return (Math.random() + "").substring(2);
};
Sparrow.randomUrl = function (url) {
    if (url.indexOf("t=") !== -1) {
        url = url.substr(0, url.indexOf("t=") - 1);
    }
    if (url.indexOf("?") !== -1) {
        url += "&t=" + Math.random();
    } else {
        url += "?t=" + Math.random();
    }
    return url;
};

Sparrow.request = function (name) {
    var reg = new RegExp("(^|\\?|&)" + name + "=([^&]*)(\\s|&|$)", "i");
    if (reg.test(location.href)) {
        return unescape(RegExp.$2.replace(/\+/g, " "));
    }
    return "";
};

Sparrow.isNullOrEmpty = function (sourceString) {
    return (sourceString == null || typeof (sourceString) === "undefined"
        || (typeof (sourceString) === "string" && (sourceString.trim() === "" || sourceString.trim() === "null")))
};
Sparrow.toString = function (sourceString, defaultValue) {
    if (!defaultValue) {
        defaultValue = "";
    }
    if ($.isNullOrEmpty(sourceString)) {
        return defaultValue;
    }
    return sourceString;
};

Sparrow.countDown = function (end, current, element) {
    var t = end - current;
    var count = {};
    var d = Math.floor(t / 1000 / 60 / 60 / 24);
    var h = Math.floor(t / 1000 / 60 / 60 % 24);
    var m = Math.floor(t / 1000 / 60 % 60);
    var s = Math.floor(t / 1000 % 60);
    element.value =
        (d > 0 ? (d + "天") : '') +
        (h > 0 ? (h + "时") : '') +
        (m > 0 ? (m + "分") : '') +
        (s < 0 ? 0 : s) + "秒";
    var call = arguments.callee;
    if (d > 0 || h > 0 || m > 0 || s > 0) {
        setTimeout(function () {
            call(end, current + 1000, element)
        }, 1000);
    }
};
// 获取**时间格式
Sparrow.getBeforeTime = function (updateTime) {
    updateTime = (new Date(updateTime)).valueOf();
    var currentTime = new Date().valueOf();
    var beforeDateConfig = [{
        name: "秒",
        split: 60
    }, {
        name: "分钟",
        split: 60
    }, {
        name: "小时",
        split: 24
    }, {
        name: "天",
        split: 30
    }, {
        name: "月",
        split: 12
    }, {
        name: "年",
        split: 100
    }];
    return $(function (timeSplit, depth) {
        if (timeSplit / beforeDateConfig[depth].split < 1) {
            // 本地时间与服务器时间不一致导致出现负数
            return (parseInt(timeSplit) < 0 ? 1 : parseInt(timeSplit))
                + beforeDateConfig[depth].name;
        } else {
            return arguments.callee(timeSplit / beforeDateConfig[depth].split,
                ++depth);
        }
    }, (currentTime - updateTime) / 1000, 0);
};
Sparrow.submit = function (action, formIndex) {
    formIndex = formIndex ? formIndex : 0;
    if (action) {
        document.forms[formIndex].action = action;
    }
    document.forms[formIndex].submit();
};

Sparrow.getFormCtrl = function (inputIdArray) {
    var inputArray = [];
    if (!inputIdArray) {
        return inputArray;
    }
    //{}.prototype会多一个this该方法本身
    //区分数组和json
    if (typeof(inputIdArray.length) === "undefined") {
        for (var o in inputIdArray) {
            inputArray.push(inputIdArray[o].ctrlId);
        }
        return inputArray;
    }
    return inputIdArray;
};
Sparrow.clearForm = function (validateJson) {
    var inputArray = $.getFormCtrl(validateJson);
    for (var i = 0; i < inputArray.length; i++) {
        var input = $(inputArray[i]);
        var defaultValue = "";
        if (validateJson[inputArray[i]]) defaultValue = validateJson[inputArray[i]].defaultValue;
        input.value = $.toString("", defaultValue);
    }
};
Sparrow.getFormData = function (inputIdArray) {
    //{}.prototype会多一个this该方法本身
    var data = [];
    var inputArray = $.getFormCtrl(inputIdArray);
    for (var i = 0; i < inputArray.length; i++) {
        var input = $(inputArray[i]);
        if (!$.isNullOrEmpty(input.name)) {
            var value = input.value;
            //todo 加判断其他控件
            data.push(input.name + "=" + value);
        }
    }
    return data.join("&");
};
Sparrow.waitRedirect = function (timerId, period) {
    var timer = $("#." + timerId);
    if (timer == null || timer.s == null) return;
    if (!period) period = 1000;
    var interval = window.setInterval(function () {
        var time = parseInt(timer.s.innerHTML, 10);
        if (time-- === 0) {
            window.location.target = "_self";
            window.location.href = timer.attr("url");
            window.clearInterval(interval);
        }
        else {
            timer.s.innerHTML = time;
        }
    }, period);
};
Sparrow.format = function (txt, compress) {
    /* 格式化JSON源码(对象转换为JSON文本) */
    var indentChar = '    ';
    
    if (typeof txt=='string'&&/^\s*$/.test(txt)) {
        alert('数据为空,无法格式化! ');
        return;
    }
    var data=null;
    if(typeof txt=='object') {
        data = txt;
    }
    else {
        try {
            data = eval('(' + txt + ')');
        }
        catch (e) {
            alert('数据源语法错误,格式化失败! 错误信息: ' + e.description, 'err');
            return;
        }
    }
    var draw = [], last = false, This = this, line = compress ? '' : '\n', nodeCount = 0, maxDepth = 0;

    var notify = function (name, value, isLast, indent/*缩进*/, formObj) {
        nodeCount++;
        /*节点计数*/
        for (var i = 0, tab = ''; i < indent; i++) tab += indentChar;
        /* 缩进HTML */
        tab = compress ? '' : tab;
        /*压缩模式忽略缩进*/
        maxDepth = ++indent;
        /*缩进递增并记录*/
        if (value && value.constructor === Array) {/*处理数组*/
            draw.push(tab + (formObj ? ('"' + name + '":') : '') + '[' + line);
            /*缩进'[' 然后换行*/
            for (var i = 0; i < value.length; i++)
                notify(i, value[i], i === value.length - 1, indent, false);
            draw.push(tab + ']' + (isLast ? line : (',' + line)));
            /*缩进']'换行,若非尾元素则添加逗号*/
        } else if (value && typeof value === 'object') {/*处理对象*/
            draw.push(tab + (formObj ? ('"' + name + '":') : '') + '{' + line);
            /*缩进'{' 然后换行*/
            var len = 0, i = 0;
            for (var key in value) len++;
            for (var key in value) notify(key, value[key], ++i === len, indent, true);
            draw.push(tab + '}' + (isLast ? line : (',' + line)));
            /*缩进'}'换行,若非尾元素则添加逗号*/
        } else {
            if (typeof value === 'string') value = '"' + value + '"';
            draw.push(tab + (formObj ? ('"' + name + '":') : '') + value + (isLast ? '' : ',') + line);
        }
    };
    var isLast = true, indent = 0;
    notify('', data, isLast, indent, false);
    return draw.join('');
};
//取得指定对象的指定方法,并传递Window.Event事件参数. 必须以obj和method形式传递
Sparrow.bind = function (obj, m, args) {
    return function (e) {
        if (m.indexOf("|") > -1) {
            var MethodArray = m.split("|");
            for (var x = 0; x < MethodArray.length; x++) {
                args ? obj[MethodArray[x]](args, e) : obj[MethodArray[x]](e);
            }
        } else {
            args ? obj[m](args, e) : obj[m](e);
        }
    }
};


// 插件扩展1)each
Sparrow.prototype.each = function (method) {
    for (var i = 0, l = this.length; i < l; i++) {
        //在method中this即为 this[i]
        method.call(this[i], i, this);
    }
};
Sparrow.prototype.attr = function (property, value) {
    if (!this.s) {
        return
    }
    if (!$.isNullOrEmpty(value)) {
        this.s.setAttribute(property, value);
        return;
    }

    var v = this.s.attributes[property];
    if (v) {
        return v.value;
    }
    return this.s.getAttribute(property);
};

Sparrow.prototype.html = function (value) {
    if (!this.s) {
        return;
    }
    if (!$.isNullOrEmpty(value)) {
        this.s.innerHTML = value;
        return;
    }
    return this.s.innerHTML;
};

Sparrow.prototype.value = function (value) {
    if (!this.s) {
        return;
    }
    if (!$.isNullOrEmpty(value)) {
        this.s.value = value;
        return;
    }
    return this.s.value;
};


Sparrow.prototype.check = function (value) {
    for (var i = 0; i < this.length; i++) {
        if (this[i].value === value) {
            this[i].checked = "checked";
            break;
        }
    }
};
Sparrow.prototype.opacity = function (n) {
    if (n >= 0) {
        // ie<10
        this.s.style.filter = 'alpha(opacity=' + n + ')';
        // ie=10 firefox ...
        this.s.style.opacity = n / 100;
        this.s.setAttribute("opacity", n);
        return;
    }
    var opacity = this.s.attributes["opacity"];
    if (!opacity) {
        return 100;
    } else {
        return opacity.value;
    }
};

// 要附加事件的控件
// 事件全名onclick
// 事件委托方法
Sparrow.prototype.bind = function (eventName, eventHandle) {
    if (!this.s) return;
    if (this.s.attachEvent) {
        this.s.attachEvent(eventName, eventHandle);
        return;
    }
    this.s.addEventListener(eventName.substring(2), eventHandle, false);
};
Sparrow.prototype.getAbsoluteTop = function () {
    var ctrl = this.s;
    var srcObj = typeof (ctrl) === "string" ? $(ctrl) : ctrl;
    var returnValue = srcObj.offsetTop;
    while ((srcObj = srcObj.offsetParent) != null) {
        returnValue += srcObj.offsetTop;
    }
    return returnValue;
};
Sparrow.prototype.getAbsoluteLeft = function () {
    var ctrl = this.s;
    var srcObj = typeof (ctrl) === "string" ? $(ctrl) : ctrl;
    var returnValue = srcObj.offsetLeft;
    while ((srcObj = srcObj.offsetParent) != null) {
        returnValue += srcObj.offsetLeft;
    }
    return returnValue;
};


Sparrow.prototype.css = function (attribute, value, add) {
    if (Math.abs(value) < 1) {
        value = value < 0 ? -1 : 1;
    }
    value = Math.ceil(value);
    if (attribute === "opacity") {
        if (add) {
            value = parseInt(this.opacity(), 10) + value;
        }
        this.opacity(value);
    } else {
        var command = null;
        if (add) {
            command = 'var o=parseInt($("' + this.selector + '").s.style.'
                + attribute + ',10);';
            command += '$("' + this.selector + '").s.style.' + attribute
                + '=(o+' + value + ')+"px";';
        } else {
            command = '$("' + this.selector + '").s.style.' + attribute + '='
                + value + '+"px";';
        }
        eval(command);
    }
    return this;
};
Sparrow.prototype.change_check_box_class = function (checked, index, key, split) {
    var className = this.s.className;
    if (!split) {
        split = "_";
    }
    var classNameArray = className.split(split);
    if (!key) {
        key = "check";
    }
    if (!index) {
        index = classNameArray.length;
    }
    if (checked) {
        if (className.indexOf(key) < 0) {
            classNameArray.splice(index, 0, key);
            this.s.className = classNameArray.join(split);
        }
    } else {
        if (className.indexOf(key) >= 0) {
            classNameArray.splice(index, 1);
            this.s.className = classNameArray.join(split);
        }
    }
    classNameArray.splice(index, classNameArray.length - index + 1);
    return classNameArray.join(class_split);
};


Sparrow.prototype.contains = function (htmlElement) {
    while (htmlElement != null && typeof (htmlElement.tagName) !== "undefined") {
        if (htmlElement === this.s)
            return true;
        htmlElement = htmlElement.parentNode;
    }
    return false;
};


Sparrow.prototype.remove = function () {
    if (this != null && this.s != null) {
        this.doc.body.removeChild(this.s);
        this.s = null;
    }
};
Sparrow.prototype.fix = function (top, left) {
    if (!this.s) {
        return;
    }
    if ($.browser.ie && $.browser.version === "6.0") {
        this.doc.documentElement.style.backgroundImage = "url(about:blank)";
        this.doc.documentElement.style.backgroundAttachment = "fixed";
        this.doc.body.style.backgroundImage = "url(about:blank)";
        this.doc.body.style.backgroundAttachment = "fixed";
        this.s.style.position = "absolute";
    } else {
        this.s.style.position = "fixed";
    }
    this.s.style.top = top + "px";
    this.s.style.left = left + "px";
};
Sparrow.prototype.center = function () {
    if (!this.s) {
        return;
    }
    var left = (this.doc.body.clientWidth - this.s.offsetWidth) / 2;
    var wordWindowHeight = this.doc.documentElement.clientHeight > screen.availHeight ? screen.availHeight : this.doc.documentElement.clientHeight;
    var workWindowHeight = wordWindowHeight - (41 + 120);
    var top = 64 + parseInt((workWindowHeight - this.s.offsetHeight) / 2);
    this.fix(top, left);
};
Sparrow.prototype.loadComplete = function (callback) {
    if (this.s.tagName.toUpperCase() === "IFRAME") {
        this.s.onload = function () {
            callback(this);
        };
    } else if (this.s.tagName.toUppperCase() === "IMG") {
        if ($.browser.ie) {
            this.s.onreadystatechange = function () {
                if (this.s.readyState === "complete"
                    || this.s.readyState === "loaded") {
                    callback(this);
                }
            };
            return;
        }
        this.s.onload = function () {
            if (this.s.complete === true) {
                callback(this);
            }
        };
    }
};
Sparrow.prototype.parent = function () {
    return $(this.s.parentNode);
};
Sparrow.prototype.fresh = function (url) {
    if ($.isNullOrEmpty(this.s.src)) {
        this.s.src = url;
    }
    this.s.src = $.randomUrl(this.s.src);
};


Sparrow.prototype.enter = function (handle) {
    this.s.onkeydown = function (e) {
        e = window.event || e;
        if (e.keyCode === 13) {
            if (typeof(handle) === "string") {
                $(handle).onclick();
                return;
            }
            handle();
        }
    };
};