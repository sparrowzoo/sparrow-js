String.prototype.trim = function () {
    return this.replace(/(^\s*)|(\s*$)/g, "");
};
String.prototype.ltrim = function () {
    return this.replace(/(^\s*)/g, "");
};
String.prototype.rtrim = function () {
    return this.replace(/(\s*$)/g, "");
};
// 如果为""或者是''则返回为null 所以在调用之前要做了null判断
String.prototype.json = function () {
    if (this === "" || this === "''") {
        return null;
    }
    if (this.indexOf("error|") === -1) {
        try {
            var json = this;
            json = json.decodeSplitKey();
            return eval("("
                + json.replace(/\r\n/g, "<br/>").replace(/\n/g, "<br/>")
                + ")");
        } catch (err) {
            return null;
        }
    }
};

String.prototype.firstCharToAscii = function () {
    return this.charCodeAt(0);
};
String.prototype.leftAlignWithChar = function (c, length) {
    length = length ? length : 3;
    c = c ? c : '0';
    if (this.length >= length) {
        return;
    }
    var charArray = [];
    var charCount = length - this.length;
    for (var i = 0; i < charCount; i++) {
        charArray.push(c);
    }
    return charArray.join("") + this;
};
String.prototype.getCountByChar = function (c) {
    return this.split(c).length - 1;
};
String.prototype.getByteLength = function () {
    return this.replace(/[^\x00-\xff]/g, "**").length;
};
String.prototype.subString = function (len, hasDot) {
    var newLength = 0;
    var newStr = "";
    var chineseRegex = /[^\x00-\xff]/g;
    var singleChar = "";
    var strLength = this.replace(chineseRegex, "**").length;
    var i;
    for (i = 0; i < strLength; i += 1) {
        singleChar = this.charAt(i).toString();
        if (singleChar.match(chineseRegex)) {
            newLength += 2;
        } else {
            newLength += 1;
        }
        if (newLength > len) {
            break;
        }
        newStr += singleChar;
    }
    if (hasDot && strLength > len) {
        newStr += "..";
    }
    return newStr;
};
/*
 * String.prototype.encodeSplitKey = function() { var str = this; str =
 * str.replace(/#/g, "#limit"); str = str.replace(/:/g, "#colon#"); str =
 * str.replace(/,/g, "#dot#"); str = str.replace(/"/g, "#ref#"); return str; };
 */
String.prototype.decodeSplitKey = function () {
    var str = this;
    str = str.replace(/#colon#/g, ":");
    str = str.replace(/#dot#/g, ",");
    str = str.replace(/#ref#/g, "\\\"");
    str = str.replace(/#limit/g, "#");
    return str;
};
String.prototype.decodeHtml = function () {
    var html = this;
    html = html.replace(/&amp;/g, "&");
    html = html.replace(/&lt;/g, "<");
    html = html.replace(/&gt;/g, ">");
    html = html.replace(/&quot;/g, "\"");
    html = html.replace(/&nbsp;/g, " ");
    return html;
};

// 字符格式化方法
String.prototype.format = function () {
    var newStr = this;
    var reg = null;
    for (var i = 0; i < arguments.length; i++) {
        reg = new RegExp('\\{' + i + '\\}', 'gm');
        newStr = newStr.replace(reg, $.isNullOrEmpty(arguments[i]) ? "-" : arguments[i]);
    }
    return newStr;
};
// 过滤闭合的html标签
String.prototype.filterHTML = function () {
    var newString = this;
    while (newString.search(/<([a-z0-9]*?).*?>([\s\S]*?)<\/\1>/gi) > -1) {
        newString = newString.replace(/<([a-z0-9]*?).*?>([\s\S]*?)<\/\1>/gi,
            "$2");
    }
    if (newString.search(/<input.*>/)) {
        newString = newString.replace(/<input.*>/gi, "");
    }

    if (newString.search(/<(script).*?>.*?<\/\1>/)) {
        newString = newString.replace(/<(script).*?>.*?<\/\1>/gi, "");
    }
    if (newString.search(/<script.*>/)) {
        newString = newString.replace(/<script.*>/gi, "");
    }
    return newString;
};

String.prototype.firstCharUpperCase = function () {
    return this.substr(0, 1).toUpperCase() + this.substr(1);
};

String.prototype.join = function (str) {
    if (!$.isNullOrEmpty(str)) {
        return this + str;
    }
    return this + "";
};

Array.prototype.clear = function () {
    for (var i = 0; i < this.length; i += 1) {
        this.pop();
    }
};
Array.prototype.indexOf = function (val) {
    for (var i = 0; i < this.length; i++) {
        if (this[i] === val) {
            return i;
        }
    }
    return -1;
};
Array.prototype.remove = function (val) {
    var index = this.indexOf(val);
    if (index > -1) {
        this.splice(index, 1);
    }
};
//For CommonJS and CommonJS-like
// CMD:Common Module Definition
//Asynchronous Modules Definition
//http://wiki.commonjs.org/wiki/Modules/AsynchronousDefinition
//http://www.commonjs.org/
(function (global, factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        module.exports = global.document ?
            factory(global, true) :
            function (w) {
                if (!w.document) {
                    throw new Error("jQuery requires a window with a document");
                }
                return factory(w);
            };
    } else {
        factory(global);
    }
}(typeof window !== "undefined" ? window : this, function (window, noGlobal) {
/**
 * @return {null}
 * name.
 * #id  id
 * &name address equal name
 * <tag tag name 
 * !son dot below
 * $for ---for 4
 * *checked_value * equal multi
 * +//new create
 */
var Sparrow = function (selector) {
    var args = Array.prototype.slice.call(arguments, 0);
    if (selector == null || typeof (selector) === "undefined") {
        return null;
    }
    if (typeof(selector) === "function") {
        //call不为数组
        //apply 的参数为数组
        //Array.prototype.slice 将arguments 转化成数组
        return selector.apply(selector, args.slice(1));
    }
    //jsonp./system/cms/jsonp.jsp.id.http://www.baidu.com
    if (args[0] === "jsonp") {
        var script = document.createElement("script");
        script.type = "text/javascript";
        script.language = "javascript";
        script.src = args[1];
        script.id = args[2];
        var oldScript = document.getElementById(script.id);
        if (oldScript != null) {
            document.head.removeChild(oldScript);
        }
        document.head.appendChild(script);
        return;
    }

    var sparrow_id = selector;
    if (typeof (selector) === "object") {
        sparrow_id = "#" + selector.id;
    }
    var parent = args[1];
    var doc = args.length === 3 ? args[2] : document;
    if (parent != null && typeof(parent) === "object") {
        if (parent.id != null && typeof(parent.id) !== "undefined") {
            parent.id = "sparrow_" + $.random();
        }
        sparrow_id += parent.id;
    }
    if ($.global(sparrow_id)) {
        return $.global(sparrow_id);
    }
    if (typeof (selector) !== "object" &&
        selector.indexOf("#") === -1
        &&selector.indexOf("!") === -1
        &&selector.indexOf("$") === -1
        &&selector.indexOf("&") === -1
        &&selector.indexOf("*") === -1
        &&selector.indexOf("-") === -1
        &&selector.indexOf("+") === -1) {
        return doc.getElementById(selector);
    }
    if (window === this)
        return new Sparrow(selector, parent, doc);
    var doms = [];
    this.selector = selector;
    this.doc = doc;
    if (typeof (selector) === "object") {
        doms[0] = selector;
        if (!selector.id) {
            selector.id = "sparrow_" + $.random();
        }
        this.selector = "#" + selector.id;
        sparrow_id = this.selector;
    } else if (typeof selector==='string') {
        var switch_char=selector.substring(0,1);
        selector=selector.substring(0,1);
        var selectorArray = selector.split(".");
        switch (switch_char) {
            case "#"://id
                doms[0] = doc.getElementById(selector);
                break;
            case "<": //tag
                doms = doc.getElementsByTagName(selector);
                break;
            case "&": //name
                doms = doc.getElementsByName(selector);
                break;
            case "+":
                //+input.id.parentId.type
                //+input&button.id.parentId.type
                doms[0] = doc.createElement(selectorArray[0]);
                if (selectorArray.length >= 2) {
                    doms[0].id = selectorArray[1];
                } else {
                    doms[0].id = "sparrow_" + $.random();
                }
                this.selector = "#." + selectorArray[1];
                sparrow_id = this.selector;
                if (selectorArray.length >= 3) {
                    if (selectorArray[2] === "doc") {
                        this.doc.body.appendChild(doms[0]);
                    } else {
                        this.doc.getElementById(selectorArray[2]).appendChild(
                            doms[0]);
                    }
                }
                break;
            case "!":
                var childs = [];
                if (!parent) {
                    parent = $(selectorArray[1]);
                }
                var allChilds = parent.getElementsByTagName(selectorArray[0]);
                if (selectorArray[0] === "li") {
                    parent = allChilds[0].parentNode;
                }
                this.s = parent;
                if (!parent.id) {
                    parent.id = "sparrow_" + $.random();
                }
                for (var i = 0; i < allChilds.length; i ++) {
                    if (allChilds[i].parentNode === parent) {
                        childs[childs.length] = allChilds[i];
                    }
                }
                doms = childs;
                break;
            case "$": //for 4
                var labelList = doc.getElementsByTagName("label");
                var forId = selector;
                for (var i = 0; i < labelList.length; i ++) {
                    if (labelList[i].attributes["for"].value === forId) {
                        doms[0] = labelList[i];
                        break;
                    }
                }
                break;
            case "*":
                var selectedTag = [];
                var tagArray = doc.getElementsByName(selectorArray[0]);
                var attribute = null;
                if (selectorArray.length > 1) {
                    attribute = selectorArray[1];
                }
                // 获取当前已经选中的标签
                for (var i = 0; i < tagArray.length; i++) {
                    if (tagArray[i].checked) {
                        if (attribute) {
                            selectedTag[selectedTag.length] = (tagArray[i].attributes[attribute].value);
                        } else {
                            selectedTag[selectedTag.length] = (tagArray[i].value);
                        }
                    }
                }
                doms = selectedTag;
                break;
        }
    }
    if (selector) {
        var arr = [];
        for (var i = 0; i < doms.length; i++) {
            arr.push(doms[i]);
        }
        this.length = 0;
        if (doms.length > 0) {
            if (!this.s) {
                this.s = doms[0];
            }
            if (this.s && this.s.id) {
                $.global(sparrow_id, this);
            }
        }
        [].push.apply(this, arr);
    }
    this.interval = [];
    return this;
};

window.$ = window.Sparrow = Sparrow;
Sparrow.browser = {
    url: {
        manage: "default.jsp",
        logout_url: "/user/logout.json"
    },
    cookie: {
        permission: "permission",
        call_back_url: "call_back_url",
        website_name: "website_name",
        themes: "sparrow.themes",
        // 配置cookie的域并非cookie的key
        root_domain: $(function () {
            return window.location.host.substr(window.location.host.indexOf('.'));
        }),
        domain: window.location.host
    },
    ie: $(function () {
        return navigator.userAgent.search(/MSIE/img) != -1;
    }),
    opera: $(function () {
        return navigator.userAgent.search(/Opera/img) != -1;
    }),
    firefox: $(function () {
        return navigator.userAgent.search(/Firefox/img) != -1;
    }),
    google: $(function () {
        return navigator.userAgent.search(/Chrome/img) != -1;
    }),
    version: $(function () {
        if (navigator.userAgent.search(/MSIE/img) != -1) {
            navigator.userAgent.match(/MSIE\b\s*([0-9\.0-9]+);/img);
            return RegExp.$1;
        } else if (navigator.userAgent.search(/Opera/img) != -1) {
            navigator.userAgent.match(/Version\/([0-9\.]+)/img);
            return RegExp.$1;
        } else if (navigator.userAgent.search(/Firefox/img) != -1) {
            navigator.userAgent.match(/Firefox\/([0-9\.]+)/img);
            return RegExp.$1;
        } else if (navigator.userAgent.search(/Chrome/img) != -1) {
            navigator.userAgent.search(/Chrome\/([0-9\.]+)/img);
            return RegExp.$1;
        }
    }),
    addFavorite: function (url, title) {
        if (document.all) {
            window.external.AddFavorite(url, title);
        } else if (window.sidebar) {
            window.sidebar.addPanel(title, url, "");
        } else {
            alert("对不起，您的浏览器不支持此操作!\n请您使用菜单栏或Ctrl+D收藏本站。");
        }
    },
    setHome: function (anchorLabel, url) {
        try {
            anchorLabel.style.behavior = 'url(#default#homepage)';
            anchorLabel.setHomePage(url);
        } catch (e) {
            if (window.netscape) {
                try {
                    netscape.security.PrivilegeManager
                        .enablePrivilege("UniversalXPConnect");
                    var prefs = Components.classes['@mozilla.org/preferences-service;1']
                        .getService(Components.interfaces.nsIPrefBranch);
                    prefs.setCharPref('browser.startup.homepage', url);
                } catch (e) {
                    alert('抱歉！您的浏览器不支持直接设为首页。请在浏览器地址栏输入“about:config”并回车然后将[signed.applets.codebase_principal_support]设置为“true”，点击“加入收藏”后忽略安全提示，即可设置成功。');
                }
            }
        }
    },
    copy: function (text, msg) {
        if (!msg) {
            msg = "成功复制！可以通过ctrl+v进行粘贴操作！";
        }
        try {
            if (window.clipboardData) {
                window.clipboardData.setData("Text", text);
                alert(msg);
            } else {
                try {
                    netscape.security.PrivilegeManager
                        .enablePrivilege("UniversalXPConnect");
                } catch (e) {
                    alert("您的浏览器设置为不允许复制！\n如果需要此操作，请在浏览器地址栏输入'about:config'并回车\n然后将'signed.applets.codebase_principal_support'设置为'true',再重试复制操作!");
                    return false;
                }
                var clip = Components.classes['@mozilla.org/widget/clipboard;1']
                    .createInstance(Components.interfaces.nsIClipboard);
                if (!clip)
                    return;
                var trans = Components.classes['@mozilla.org/widget/transferable;1']
                    .createInstance(Components.interfaces.nsITransferable);
                if (!trans) {
                    return;
                }
                trans.addDataFlavor('text/unicode');
                var supportsString = Components.classes["@mozilla.org/supports-string;1"]
                    .createInstance(Components.interfaces.nsISupportsString);
                supportsString.data = text;
                trans.setTransferData("text/unicode", supportsString, text
                    .getByteLength());
                var clipid = Components.interfaces.nsIClipboard;
                if (!clip)
                    return false;
                clip.setData(trans, null, clipid.kGlobalClipboard);
                alert(msg);
            }
        } catch (e) {
            alert("对不起！您的浏览器不支持该功能");
        }
    },

    setCookie: function (cookieName, cookieValue, expireseconds, domain, path,
                         secure) {
        var expires = null;
        if (expireseconds !== 0 && expireseconds) {
            expires = new Date();
            expires.setTime(expires.getTime() + expireseconds * 1000);
        }
        document.cookie = (encodeURIComponent(cookieName) + '='
            + encodeURIComponent(cookieValue)
            + (expires ? '; expires=' + expires.toGMTString() : '')
            + '; path=' + (path ? path : '/') + '; domain='
            + (domain ? domain : this.cookie.root_domain) + (secure ? '; secure' : ''));
    },
    getCookie: function (cookieName) {
        var cookieValue = null;
        var posName = document.cookie.indexOf(escape(cookieName) + '=');
        if (posName !== -1) {
            var posValue = posName + (escape(cookieName) + '=').length;
            var endPos = document.cookie.indexOf(';', posValue);
            if (endPos !== -1)
                cookieValue = decodeURIComponent(document.cookie.substring(
                    posValue, endPos));
            else
                cookieValue = decodeURIComponent(document.cookie
                    .substring(posValue));
        }
        if (cookieValue == null || typeof (cookieValue) === "undefined"
            || cookieValue === "undefined") {
            return null;
        }
        return cookieValue;
    },
    // 根据按下控件的对象获取要执行的按钮事件
    // auguments=window.dialogArguments子页获取参数
    showModalDialog: function (width, height, url, callback, args) {
        var result;
        url = $.randomUrl(url);
        if ($.browser.ie) {
            result = window.showModalDialog(url, args, "dialogHeight:{0}px; dialogWidth:{1}px; status:no; help:no; scroll:auto".format(height, width));
        } else {
            result = window.open(url, args, "height={0}, width={1},toolbar= no, menubar=no, scrollbars=auto, resizable=no, location=no, status=no,top=100,left=300".format(height, width));
        }
        if (result) {
            callback(result);
        }
    },
    /*{url:'',height:1px;width:1px,target:'_blank'}*/
    window: function (config) {
        var url = $.randomUrl(config.url);
        if (!config.win) {
            config.win = window;
        }
        var target = config.target ? config.target : "_blank";
        var parameters = null;
        if ($.isNullOrEmpty(config.width)) {
            parameters = "height={0}px,width={1}px,toolbar= no, menubar=no, scrollbars=auto, resizable=no, location=no, status=no,top=100,left=300".format(config.height, config.width);
        }
        config.win.open(url, target, parameters);
    },
    close: function () {
        window.opener = null;
        window.open('about:blank', '_self');
        window.close();
    },
    getUrlWithoutParameter: function (url) {
        var currentLocation = url ? url : window.location.href;
        var locationIndex = currentLocation.indexOf('?');
        if (locationIndex < 0) {
            locationIndex = currentLocation.indexOf("#");
        }
        if (locationIndex > -1) {
            currentLocation = currentLocation.substring(0, locationIndex);
        }
        return currentLocation;
    },
    getUserId: function () {
        var permission = $.browser.getCookie(this.cookie.permission);
        if (permission == null) {
            return 0;
        }
        return permission.split('&')[0].substring("id=".length);
    },
    getUserName: function () {
        var permission = $.browser.getCookie(this.cookie.permission);
        if (permission == null) {
            return null;
        }
        return permission.split('&')[1].substring("name=".length);
    },
    isLogin: function () {
        var userId = $.browser.getUserId();
        return !(userId == null || userId === 0 || userId === "0" || userId === "null"
            || userId === "");
    },
    logout: function (domain, logoutUrl, defaultUrl) {
        if ($.isNullOrEmpty(logoutUrl)) {
            logoutUrl = this.url.logout_url;
        }
        if ($.isNullOrEmpty(defaultUrl)) {
            defaultUrl = this.url.manage;
        }
        ajax.json($.url.root + logoutUrl, null, function (result) {
            var permissionKey = result.value;
            if ($.isNullOrEmpty(permissionKey)) {
                permissionKey = $.browser.cookie.permission;
            }
            // 注销成功后回调
            $.browser.setCookie(permissionKey, "0", -1, domain);
            if (($.url.root + "/") === window.parent.location.href || window.parent.location.href.indexOf(defaultUrl) !== -1) {
                window.parent.location.href = $.url.root;
            } else {
                window.location.href = window.location.href;
            }
        }, true);

    },
    /***************************************************************************
     * 取窗口可视范围的高度
     **************************************************************************/
    getClientHeight: function () {
        return (document.body.clientHeight && document.documentElement.clientHeight) ? Math
                .min(document.body.clientHeight,
                    document.documentElement.clientHeight)
            : Math.max(document.body.clientHeight,
                document.documentElement.clientHeight);
    },
    /***************************************************************************
     * 取文档内容实际高度
     **************************************************************************/
    getScrollHeight: function () {
        return Math.max(document.body.scrollHeight,
            document.documentElement.scrollHeight);
    },
    hyperClick: function (srcElement, message) {
        if (srcElement.href === "javascript:void(0);") {
            $.alert(message, "sad");
            return false;
        } else {
            return true;
        }
    }
};
Sparrow.container = {};
Sparrow.global = function (key, obj) {
    if (typeof(obj) === "undefined") {
        return this.container[key];
    }
    this.container[key] = obj;
};
/* document.ready(function()) */
(function () {
    var ie = !!(window.attachEvent && !window.opera);
    var wk = /webkit\/(\d+)/i.test(navigator.userAgent) && (RegExp.$1 < 525);
    var fn = [];
    var run = function () {
        for (var i = 0; i < fn.length; i++)
            fn[i]();
    };
    document.ready = function (f) {
        if (!ie && !wk && document.addEventListener) {
            return document.addEventListener('DOMContentLoaded', f, false);
        }
        if (fn.push(f) > 1)
            return;
        if (ie) {
            (function () {
                try {
                    document.documentElement.doScroll('left');
                    run();
                } catch (err) {
                    //当前函数本身再次执行
                    setTimeout(arguments.callee, 0);
                }
            })();
        } else if (wk) {
            var t = null;
            t = setInterval(function () {
                if (/^(loaded|complete)$/.test(document.readyState))
                    clearInterval(t), run();
            }, 0);
        }
    };
})();
Sparrow.url = {
    root: $(function () {
        pathName = window.location.pathname === "/" ? ""
            : ("/" + window.location.pathname.split('/')[1]);
        return window.location.protocol + "//" + window.location.host;
        //+ (false ? pathName : "");
    }),
    resource: $(function (path) {
        var scripts = document.scripts;
        var sparrowPath = ["/scripts/sparrow.js", "/scripts/sparrow-min.js", "/scripts-all/sparrow.js"];
        if (path) {
            sparrowPath.push(path);
        }
        var r = null;
        for (var i in scripts) {
            var brk = false;
            sparrowPath.forEach(function (path) {
                var startIndex = scripts[i].src.indexOf(path);
                if (startIndex > -1) {
                    r = scripts[i].src.substring(0, startIndex);
                    brk = true;
                }
            });
            if (brk) {
                break;
            }
        }
        return r;
    }),
    name: $.browser.cookie.domain.split('.')[0]
};
Sparrow.website = {
    name: $.browser.getCookie($.browser.cookie.website_name),
    themes: $(function () {
        var themes = $.browser.getCookie($.browser.cookie.themes);
        if (themes == null) {
            themes = "themes_default";
        }
        return themes;
    })
};
Sparrow.css = {
    menu: {
        frame: "background:#ffffff;position:absolute;z-index:1000;border:#ccc 1px solid;width:{0}px;height:auto;left:{1}px;top:{2}px;display:none",
        ul: "width:{0}px;height:auto;overflow:hidden;list-style:none;margin:0px;padding:0px;text-align:left",
        li: "width:{0}px;overflow:hidden;line-height:20px;margin:0px;border-bottom:#ccc 1px dotted;cursor:pointer;"
    }
};
Sparrow.SIDE = "SIDE";
Sparrow.HORIZONTAL = "HORIZONTAL";
Sparrow.VERTICAL = "VERTICAL";
Sparrow.DEFAULT_AVATOR_URL = $.url.resource + "/" + $.url.name
    + "/images/user.png";
Sparrow.DEFAULT_FORUM_ICO_URL= $.url.resource + "/" + $.url.name/**/
    + "/images/forum.gif";
Sparrow.ajax = {
    _objPool: [],
    referWindow: window,
    url: null,
    srcElement: null,
    OK: 'OK',
    FAIL: 'FAIL',
    EXIST: 'EXIST',
    _getInstance: function () {
        for (var i = 0; i < this._objPool.length; i += 1) {
            if (this._objPool[i].readyState === 0
                || this._objPool[i].readyState === 4) {
                return this._objPool[i];
            }
        }
        this._objPool[this._objPool.length] = this._createObj();
        return this._objPool[this._objPool.length - 1];
    },
    _createObj: function () {
        var http_request = null;
        if (window.XMLHttpRequest) {
            http_request = new XMLHttpRequest();
            if (http_request.overrideMimeType) {
                http_request.overrideMimeType("text/xml");
            }
        } else {
            if (window.ActiveXObject) {
                try {
                    http_request = new ActiveXObject("Msxml2.XMLHTTP");
                } catch (e) {
                    try {
                        http_request = new ActiveXObject("Microsoft.XMLHTTP");
                    } catch (e) {
                    }
                }
            }
        }
        if (http_request === null) {
            window.alert("浏览器不支持AJAX,请设置浏览器安全级别或更新浏览器");
        }
        return http_request;
    },
    _callback:function (xmlHttpRequest) {
        var result = xmlHttpRequest.responseText.json();
        if (result == null) {
            $.message("json parse error " + xmlHttpRequest.responseText);
            return;
        }
        if (result.code === ajax.FAIL) {
            $.message(result.error);
        }
    },
    gourl: function (url) {
        ajax.referWindow.location.href = url;
    },
    req: function (getOrPost, url, responsef, isay, postStr, srcElement) {
        if (url.indexOf("http://") === -1) {
            url = $.url.root + url;
        }
        var objXMLHttp = this._getInstance();
        if (srcElement) {
            this.srcElement = srcElement;
        }
        //https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Statements/with
        //with (objXMLHttp) {
        try {
            if ($.isNullOrEmpty(isay)) {
                isay = true;
            }
            open(getOrPost, url, isay);
            objXMLHttp.setRequestHeader("pragma", "no-cache");
            objXMLHttp.setRequestHeader("cache-control", "no-cache");

            if (getOrPost === "GET") {
                send(null);
            } else {
                if (postStr != null) {
                    //warn: Parameters: Character decoding failed
                    postStr = postStr.replace(/%/g, '%25');
                    objXMLHttp
                        .setRequestHeader("Content-Type",
                            "application/x-www-form-urlencoded;charset=utf-8");
                }
                send(postStr);
            }
            onreadystatechange = function () {
                // alert("状态信息"+objXMLHttp.readyState);
                if (objXMLHttp.readyState == 4) {
                    // alert("结果状态"+objXMLHttp.status);
                    if (objXMLHttp.status == 200) {
                        if (objXMLHttp.responseText.indexOf("login:false") != -1) {
                            alert("login false");
                            var config = objXMLHttp.responseText.json();
                            if (config.inFrame) {
                                //window.parent.location.href = config.url;
                            }
                            else {
                                $.window(config);
                            }
                        } else if (objXMLHttp.responseText
                            .indexOf("Access Denied") != -1) {
                            if (!l.message.accessDenied)
                                l.message.accessDenied = "Access Denied";
                            $.alert(l.message.accessDenied, "sad");
                        } else if (responsef) {
                            responsef(objXMLHttp);
                        }
                    } else {
                        if (objXMLHttp.status == 404) {
                            alert("资源未找到");//
                        } else {
                            if (objXMLHttp.status == 500) {
                                alert("服务器错误");//
                            } else {
                                if (objXMLHttp.status == 12031) {
                                    alert("服务器未启动");//
                                } else {
                                    alert(objXMLHttp.status + ":未知错误");
                                }
                            }
                        }
                    }
                }
            };
        } catch (e) {
            alert(e);
        }
    },
    json: function (url, data, callback, srcElement) {
        ajax.req("POST", url,
            function (xmlHttpRequest) {
                var result = xmlHttpRequest.responseText.json();
                if (result == null) {
                    $.message("json parse error " + xmlHttpRequest.responseText);
                    return;
                }

                if (result.code === ajax.OK) {
                    if (callback) {
                        callback(result);
                    }
                }
                else {
                    $.message(result.error);
                }
            }, true, data, srcElement);
    },
    get: function (url) {
        ajax.req("GET", url, ajax._callback, true);
    },
    post: function (url, data) {
        ajax.req("POST", url,ajax._callback, true, data);
    }
};
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
        if (v.background_color != false) {
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
     /*action=$(#.object)*/
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
        } else {
            if (action !== false) {
                if (typeof(action) === "string" || typeof(action) === "undefined") {
                    $.submit(action);
                }
                else if (typeof(action) === "function") {
                    action(this);
                }
                else if (typeof(action) === "object" && action.s.type === "hidden") {
                    var actionUrl = action.attr("new");
                    if (!$.isNullOrEmpty(action.s.value)) {
                        actionUrl = action.attr("update");
                    }
                    $.submit(actionUrl);
                }
            }
            return true;
        }
    }
};
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
/*
     * 日期2009 08 09 作者:张立志 邮箱:zh_harry@163.com QQ: 492006183 IE6 ie7 遨游 火狐下测试通过
     * 功能说明:系统提示对话框 参数： msg：提示信息 isone:是否为根目录 type:提示类型 title:标题
     * sparrow.themes:全局变量设置前台皮肤图片 returnCallBack:关闭后事件 例子: win.isInFrame=false;
     */
Sparrow.win = {
    config: {
        isInFrame: false,
        showHead: true,
        titleHeight: 45,
        currentWindow: window,
        bgsound: $.url.resource + "/media/sound.wav",
        titleImg: $.url.resource + "/images/" + $.website.themes + "/panel.gif",
        closeBtnImg: $.url.resource + "/images/" + $.website.themes
            + "/panel.gif",
        OKBtnImg: $.url.resource + "/images/" + $.website.themes + "/panel.gif",
        smileImg: $.url.resource + "/images/" + $.website.themes + "/smile.gif",
        sadImg: $.url.resource + "/images/" + $.website.themes + "/sad.gif",
        lockImg: $.url.resource + "/images/" + $.website.themes + "/lock.gif",
        waitImg: $.url.resource + "/images/" + $.website.themes + "/loading.gif",
        askImg: $.url.resource + "/images/" + $.website.themes + "/smile.gif",
        tagArray: ["select", "object"],
        jalert: {
            height: "auto",
            width: "250px",
            closeCallBack: function () {
            }
        },
        dialog: {
            // 用来保存box对话框中的选择项
            descContainer: null
        }
    },
    getWindow: function () {
        return (this.config.isInFrame ? window.parent : window);
    },
    getScrollTop: function () {
        return this.getWindow().pageYOffset
            || this.getWindow().document.documentElement.scrollTop
            || this.getWindow().document.body.scrollTop;
    },
    /*
     * getScrollTop : function() { return document.documentElement &&
     * document.documentElement.scrollTop ? document.documentElement.scrollTop :
     * document.body.scrollTop; },
     */
    addSound: function () {
        // 背景音乐
        var sound = $("+bgsound.sound.doc", null, this.getWindow().document);
        sound.s.src = this.config.bgsound;
    },
    addBackDiv: function () {
        var backDiv = $("+div.backDiv.doc", null, this.getWindow().document);
        var documentHeight = Math.max(
            this.getWindow().document.body.scrollHeight,
            this.getWindow().document.documentElement.scrollHeight);
        backDiv.s.zIndex = 1000;
        backDiv.opacity(80);
        backDiv.s.style.position = "absolute";
        backDiv.s.style.width = backDiv.doc.body.offsetWidth + "px";
        backDiv.s.style.height = documentHeight + "px";
        backDiv.s.style.left = "0px";
        backDiv.s.style.top = "0px";
        backDiv.s.style.backgroundColor = "#000000";
    },
    // 固定格式对话框主体结构
    addMsgDialog: function (width, height) {
        if (!width) {
            width = this.config.jalert.width;
        }
        if (!height) {
            height = this.config.jalert.height;
        }
        var dialog = $("+div.dialog.doc", null, this.getWindow().document);
        dialog.s.zIndex = 1001;
        dialog.s.style.cssText = "position:absolute;border:#ccc 3px solid;text-align:center;font-size:10pt;background:#fff;";
        dialog.s.style.width = width;
        dialog.s.style.height = height;
    },
    // 自定义对话框主体结构 url
    addPanel: function (url) {
        var panel = $("+div.dialog.doc", null, this.getWindow().document);
        panel.s.zIndex = 1001;
        panel.s.style.cssText = "position:absolute;text-align:center;font-size: 10pt;background:white;";
        if (this.config.showHead != false) {
            this.addTitle();
        }

        this.addRightClose();
        var frame = $("+iframe.panel.dialog", null, panel.doc);
        frame.s.setAttribute("frameborder", "0", 0);
        frame.s.scrolling = "no";
        frame.s.src = url;
        frame
            .loadComplete(function (element) {
                var width = parseInt(
                    element.contentWindow.document.body.style.width, 10);
                var height = parseInt(
                    element.contentWindow.document.body.style.height,
                    10);
                frame.s.style.width = (width - 4) + "px";
                frame.s.style.height = (height
                    - (win.config.showHead ? win.config.titleHeight : 0) - 5)
                    + "px";
                panel.s.style.width = width + "px";
                panel.s.style.height = height + "px";
                $("#dialog", null, panel.doc).center();
                if (win.config.showHead != false) {
                    $("#divleft", null, panel.doc).s.innerHTML = element.contentWindow.document.title;
                }
            });
    },
    // 加标题
    addTitle: function (title) {
        if (this.config.showHead != false) {
            var divtitle = $("+div.divtitle.dialog", null,
                this.getWindow().document);
            divtitle.s.style.cssText = "cursor:move;width:100%;height:"
                + this.config.titleHeight + "px;background-repeat:repeat;";
            divtitle.s.innerHTML = "";
            divtitle.s.style.backgroundImage = "url(" + this.config.titleImg
                + ")";
            // 真正的标题文本
            var divleft = $("+div.divleft.divtitle", null,
                this.getWindow().document);
            // divleft.unselectable = "on";

            divleft.s.className = "drag-pp";
            divleft.s.onmousedown = function (e) {
                $.event(e).drags();
            };
            divleft.s.onmouseup = function (e) {
                $.event(e).move_end();
            };
            divleft.s.style.cssText = "float:left;width:85%;height:{0}px;line-height:{0}px;color:white;text-align:left;padding:2px;font-size:10pt;font-weight: bold;"
                .format(this.config.titleHeight - 5);
            divleft.s.innerHTML = title ? title : $.website.name + "提醒您:";
        }
    },
    // 标题右上角关闭按钮
    addRightClose: function () {
        // 关闭按钮
        if (this.config.showHead) {
            var divright = $("+div.divright.divtitle", null, this
                .getWindow().document);
            divright.s.style.cssText = "float:right;width:20px;line-height:"
                + this.config.titleHeight
                + "px;color:white;text-align:right;font-size:13pt;cursor:pointer;";
            divright.s.innerHTML = "\xd7";
            divright.s.onclick = function () {
                $.win.closeClick();
            };
        }
    },
    // 内容下方的ok按钮
    addOK: function () {
        var btnOK = $("+input.btnOK.dialog", null, this.getWindow().document);
        btnOK.s.id = "btnOK";
        btnOK.s.type = "button";
        btnOK.s.style.cssText = "cursor:pointer;width:80px;height:30px;color:black;";
        btnOK.s.style.backgroundImage = "url(" + this.config.OKBtnImg + ")";
        btnOK.s.value = "\u786e\u5b9a";
        btnOK.s.onclick = function () {
            $.win.okClick();
        };
    },
    // 内容下方的取消按钮
    addClose: function () {
        var btnclose = $("+input.btnclose.dialog", null, this.getWindow().document);
        btnclose.attr("type", "button");
        btnclose.s.style.cssText = "cursor:pointer;width:80px;height:30px;c"
            + "olor:black;";
        btnclose.s.style.backgroundImage = "url(" + this.config.closeBtnImg + ")";
        btnclose.s.value = "\u5173  \u95ed";
        btnclose.s.onclick = function () {
            $.win.closeClick();
        };
    },
    // 内容正文
    addMsgContent: function () {
        var divcontent = $("+div.divcontent.dialog", null, this.getWindow().document);
        var dialog = $("#dialog", null, this.getWindow().document);
        var height = (parseInt(dialog.s.style.height, 10) - this.config.titleHeight - 50) + "px";
        divcontent.s.style.cssText = "width:100%;text-align:left;text-indent:20px;height:" + height;
    },
    okClick: function () {
    },
    closeClick: function () {
        $
            .showOrHiddenTag(this.config.tagArray, true,
                this.getWindow().document);
        $("#dialog", null, this.getWindow().document).remove();
        $("#backDiv", null, this.getWindow().document).remove();
        $("#sound", null, this.getWindow().document).remove();
        $.win.config.currentWindow.focus();
        if ($.win.config.jalert.closeCallBack) {
            $.win.config.jalert.closeCallBack();
            $.win.config.jalert.closeCallBack = null;
        }
        $.win.ok = void (0);
    }
};
//{msg:'',type:'sad',title:'',url:'',wait_message:''}
Sparrow.alert = function (msg, type, title, url, wait_message) {
    var config = {};
    if (typeof(msg) == "object") {
        config = msg;
        msg = config.msg.decodeSplitKey();
        type = config.type;
        title = config.title.decodeSplitKey();
        if (config.url) {
            url = config.url.decodeSplitKey();
        }
        if (config.wait_message) {
            wait_message = config.wait_message.decodeSplitKey();
        }
    }
    $.win.addSound();
    // 设置背景控件为false
    $.showOrHiddenTag($.win.config.tagArray, false, $.win.getWindow().document);
    // 背景层
    $.win.addBackDiv();
    // 对话框主体
    $.win.addMsgDialog();
    // 标题
    $.win.addTitle(title);
    // 内容
    $.win.addMsgContent();
    /*-----------以上部分全部一致---------------*/
    var typeimg = null;
    switch (type) {
        case "smile":
            $.win.addRightClose();
            $.win.addClose();
            typeimg = $.win.config.smileImg;
            break;
        case "sad":
            $.win.addRightClose();
            $.win.addClose();
            typeimg = $.win.config.sadImg;
            break;
        case "lock":
            typeimg = $.win.config.lockImg;
            break;
        case "wait":
            typeimg = $.win.config.waitImg;
            break;
        case "ask":
            $.win.addRightClose();
            $.win.addOK();
            $.win.addClose();
            typeimg = $.win.config.askImg;
            break;
        case undefined:
            $.win.addRightClose();
            $.win.addClose();
            break;
    }
    var content = "";
    if (typeimg) {
        content = "<br/>"
            + "<img align=\"absMiddle\" src='" + typeimg + "'/>&nbsp;&nbsp;";
    }
    if (msg) {
        content += msg;
        if (!$.isNullOrEmpty(url)) {
            //<br/><span id="timer">5</span>秒以后将自动跳转,或者<a href="{0}" target="_self">直接点击这里跳转</a>
            content += wait_message.format(url);
        }
        $("#divcontent", null, $.win.getWindow().document).s.innerHTML = content;
        $.waitRedirect("timer");
    }

    $.showOrHiddenTag("select", true, $.win.getWindow().document
        .getElementById("divcontent"));

    var dialog = $("#dialog", null, $.win.getWindow().document);// 设置浮动窗口位置
    dialog.center();
};
// config={url:'',showHead:true,srcElement:id,cache:true}宽高取自页面的宽高
Sparrow.window = function (config) {
    if (!config) {
        config = {};
    }
    if (!$.isNullOrEmpty(config.showHead)) {
        $.win.config.showHead = config.showHead;
    }
    if (!$.isNullOrEmpty(config.inFrame)) {
        $.win.config.isInFrame = config.inFrame;
    }
    // 如果本页中存在div对话框。则先将对话框删除
    url = config.url;
    $.win.closeClick();
    if (config.cache != false) {
        url = $.randomUrl(url);
    }
    if (url.indexOf("http://") < 0) {
        url = $.url.root + url;
    }
    $.showOrHiddenTag($.win.config.tagArray, false, $.win.getWindow().document);
    if (config.srcElement) {
        if (config.srcElement.indexOf('#.') < 0) {
            config.srcElement = "#." + config.srcElement;
        }
        $.win.config.toTopHeight = $(config.srcElement).getAbsoluteTop() - height / 2;
    }
    // 背景层
    $.win.addBackDiv();
    $.win.addPanel(url);
};
// Register as a named AMD module
if (typeof define === "function" && define.amd) {
    define("sparrow", [], function () {
        return Sparrow;
    });
}
/* {width:1,height:2,title:'',content:'',initialize:function(){}} */
Sparrow.dialog = function (config) {
    if (!config) {
        config = {};
    }
    // 设置背景控件为false
    $.showOrHiddenTag($.win.config.tagArray, false, $.win.getWindow().document);
    // 背景层
    $.win.addBackDiv();
    // 对话框主体
    $.win.addMsgDialog(config.width, config.height);
    // 标题
    $.win.addTitle(config.title);
    // 内容
    $.win.addMsgContent();
    $.win.addOK();
    $.win.addClose();
    if (config.content) {
        $("#divcontent", null, $.win.getWindow().document).s.innerHTML = config.content;
    }
    if (config.initialize) {
        config.initialize($("divcontent"));
    }
    $("#dialog", null, $.win.getWindow().document).center();
};
Sparrow.file = {
    // 是否显示上传进度
    showStatus: false,
    // 等待
    wit: null,
    // 客 户端文件名
    clientFileName: null,
    // 上传框架id
    uploadFrameId: null,
    // -1:单个文件上传 (单文件上传不提交)
    // 1:多个文件 （上传完毕后上传下一个文件) 0：多文件上传完毕 （提交表单)
    multiFile: -1,
    // 上传回调函数
    uploadCallBack: function (fileInfo, clientFileName, editor) {
        console.info(fileInfo);
        console.info(clientFileName);
    },
    // 如果图片很小，不会通过getStatus方法，则在回调时主动清除上传状态
    clearStatus: function () {
        if (this.showStatus) {
            document.body.removeChild($('divStatus'));
        }
        window.clearInterval(this.wit);
    },
    // 文件序列号
    fileSerialNumber: null,
    // 文件上传前的验证方法由 input file 的onchange响应
    // file控件的onchange方法
    // file.uploadClick(this,pathKey);
    // upload frame的id与key要保持一致
    validateUploadFile: function (f, key) {
        if (file.checkFileType(file.getFileName(f.value), ["jpg",
            "jpeg", "gif", "png"], "errorImgForumIco")) {
            file.uploadClick(false, "", key);
        }
    },
    // 文件上传成功后的重置方法
    // 因为文件上传完毕之后需要重置上传序列号。所以一定要手动设置该方法
    reset: function () {
        var uploadFrame = $(this.uploadFrameId);
        var tempSrc = uploadFrame.src;
        uploadFrame.src = "about:blank";
        uploadFrame.src = tempSrc;
    },
    // 获取上传的input type="file"控件
    getUploadFile: function () {
        return (this.uploadFrameId ? $(this.uploadFrameId) : $("fileUpload")).contentWindow.document.getElementById("file_upload");
    },
    // 获取文件序列号
    getFileSerialNumber: function () {
        return this.fileSerialNumber;
    },
    setFileSerialNumber: function (serialNumber) {
        this.fileSerialNumber = serialNumber;
    },
    // 获取文件的全路径文件名?
    getFullPath: function (obj) {
        if (obj) {
            if ($.browser.ie) {
                obj.select();
                var txt = document.frames[0].document.selection.createRange().text;
                document.frames[0].document.selection.empty();
                return txt;
            } else if ($.browser.firefox) {
                if (obj.files) {
                    return obj.files.item(0).getAsDataURL();
                }
                return obj.value;
            }
            return obj.value;
        }
    },
    // 获文件扩展名
    getExtension: function (fileName) {
        fileName = $.browser.getUrlWithoutParameter(fileName);
        return fileName.substring(fileName.lastIndexOf("."))
            .toLocaleLowerCase();
    },
    // 获取文件名
    getFileName: function (fileName) {
        fileName = $.browser.getUrlWithoutParameter(fileName);
        if (fileName.indexOf("\\") != -1) {
            return fileName.substring(fileName.lastIndexOf("\\") + 1);
        } else if (fileName.indexOf('/') != -1) {
            return fileName.substring(fileName.lastIndexOf("/") + 1);
        } else {
            return fileName;
        }
    },
    // 验证文件类型
    checkFileType: function (fileName, righty_type, errorCtrl) {
        var fileExtension = this.getExtension(fileName);
        var result = false;
        for (var i = 0; i < righty_type.length; i += 1) {
            if (righty_type[i].toLocaleLowerCase() == fileExtension
                || '.' + righty_type[i].toLocaleLowerCase() == fileExtension) {
                result = true;
                break;
            }
        }
        if (result) {
            if ($(errorCtrl) != null) {
                $(errorCtrl).className = "prompt";
                $(errorCtrl).innerHTML = "";
            }
        } else {
            if ($(errorCtrl) != null) {
                $(errorCtrl).className = "error";
                $(errorCtrl).innerHTML = "!只支持:" + righty_type + "格式";
            }
            $.message("文件格式不正确，只支持以下格式:\n" + righty_type);
        }
        return result;
    },
    // 如果editor为null则表示非编辑器控件
    // 只有回调时oldFileUrl才有意义，如果没有回调方法则此参数可为null
    uploadClick: function (showState, oldFileUrl, uploadingFrameId, editor,
                           srcElement) {
        this.showStatus = showState;
        // 如果显示状态并且状态控件已经显示则说明已经有文件正在上传中...
        if (showState != false && $("divStatus")) {
            $.alert(this.clientFileName + "正在上传中,请稍侯...", "sad");
            return false;
        }
        // 设置正在上传的文件控件ID
        this.uploadFrameId = uploadingFrameId;
        // 如果没有选择上传文件
        if (this.getUploadFile(uploadingFrameId).value == "") {
            var fileInfo = "{fileName:'"
                + (oldFileUrl && oldFileUrl != 'undefined' ? oldFileUrl
                    : "") + "'}";
            // 上传事件回调函数 具体处理方式在uploadCallBack中进行操作
            file.uploadCallBack(fileInfo.json(), "");
            // 自动批量上传不是用事件触发的,所以srcElement可能为null
            if (srcElement)
                $.message("请选择上传文件!", srcElement);
            return false;
        }
        // 客户端文件名
        this.clientFileName = this.getUploadFile().value;
        // 设置上传框架
        var uploadFrame = uploadingFrameId ? $(uploadingFrameId)
            : $("fileUpload");
        // 设置当前文件的序列号
        this.setFileSerialNumber(uploadFrame.contentWindow.document
            .getElementById("fileInfo").value.split('|')[1]);
        // 如果要显示状态
        if (showState != false) {
            // 如果状态控件不存在则创建
            if (!$("divStatus")) {
                var sparrowUploadFrame = $(uploadFrame);
                var divStatus = $("new.div");
                divStatus.s.id = "divStatus";
                divStatus.s.style.cssText = "width:260px;height:100px;position:absolute;color:#ffffff;background:#000000;font-size:10pt;border:#ccc 1px solid;text-align:left;";
                divStatus.s.innerHTML = "服务器正在加载文件信息...";
                document.body.appendChild(divStatus.s);
                divStatus.s.style.top = (sparrowUploadFrame
                        .getAbsoluteTop() - 10)
                    + "px";
                divStatus.s.style.left = (sparrowUploadFrame
                        .getAbsoluteLeft())
                    + "px";
                divStatus.opacity(90);
            }
            // 设置状态跟踪
            if (typeof (editor) == "undefined") {
                // 非编辑器控件
                this.wit = window.setInterval("file.getStatus(" + showState
                    + ")", 1000);
            } else {
                this.wit = window.setInterval("file.getStatus(" + showState
                    + "," + editor.obj + ")", 1000);
            }
        }
        // 提交
        uploadFrame.contentWindow.document.forms[0].submit();
    },
    getStatus: function (showState, editor) {
        // 根据当前文件的序列号,实时获取当前文件的上传状态
        ajax
            .req(
                "GET",
                $.url.root + "/FileUpload?fileSerialNumber="
                + this.getFileSerialNumber() + "&t="
                + Math.random(),
                function (xmlHttpRequest) {
                    if (xmlHttpRequest.responseText) {
                        // 未加载完即获取则继续loading
                        if (xmlHttpRequest.responseText
                            .indexOf("loading") == 0) {
                            return;
                        }
                        var statusJson = xmlHttpRequest.responseText
                            .json();
                        if (!$.isNullOrEmpty(statusJson.uploadingError)) {
                            $.alert(statusJson.uploadingError, "sad");
                            $.file.clearStatus();
                            return;
                        }
                        // 正常显示状态
                        var statusString = [];
                        var status = Math
                                .ceil(parseFloat(statusJson.readedFileLength)
                                    / parseFloat(statusJson.contentLength)
                                    * 1000000)
                            / 10000 + "%";
                        statusString
                            .push("正在上传文件<br/><span class='highlight'>《"
                                + $.file
                                    .getFileName(file.clientFileName)
                                + "》</span><br/>");
                        statusString.push("文件大小:"
                            + statusJson.contentLengthStr
                            + "<br/>");
                        statusString.push("上传大小:"
                            + statusJson.readedFileLengthStr
                            + "<br/>");
                        statusString.push("上传进度:" + status);
                        // 上传完毕
                        if (statusJson.contentLength <= statusJson.readedFileLength) {
                            if ($.file.uploadCallBack) {
                                // 回调上传完毕后要执行的函数
                                $.file
                                    .uploadCallBack(
                                        statusJson,
                                        $.file.clientFileName,
                                        editor);
                            }
                            $.file.clearStatus();
                        }
                    }
                }, "true");
    },
    initCoverImageEvent: function (coverKey) {
        if (!coverKey) coverKey = "Cover";
        $.file.validateUploadFile = function (f, key) {
            if ($.file.checkFileType($.file.getFileName(f.value), ["jpg", "jpeg",
                "gif", "png"], "error" + coverKey)) {
                $.file.uploadCallBack = function (fileInfo, clientFileName) {
                    if (fileInfo.fileName) {
                        var suffix = coverKey;
                        if (typeof(coverKey) == "object") {
                            suffix = coverKey[key];
                        }
                        $("div" + suffix).innerHTML = "<a href='" + fileInfo.fileName + "' target='_blank'><img src='" + fileInfo.fileName
                            + "'/></a>";
                        $("hdn" + suffix).value = fileInfo.fileName;
                        $("error" + suffix).className = "prompt";
                        $("error" + suffix).innerHTML = "";
                    }
                };
                $.file.uploadClick(false, '', key);
            }
        };
    }
};
Sparrow.event = function (src) {
    if (!(this instanceof Sparrow.event)) {
        return new Sparrow.event(src);
    }
    if (src) {
        this.originalEvent = src;
        this.type = src.type;
        this.e = window.event || this.originalEvent;
        this.srcElement = this.e.srcElement || this.e.target;
        this.toElement = this.e.toElement || this.e.relatedTarget;
    }
};

Sparrow.event.prototype = {
    dragapproved: false,
    srcElement: null,
    eventX: null,
    eventY: null,
    srcLeftPos: null,
    srcRightPos: null,
    cancelBubble: function () {
        window.event ? window.event.cancelBubble = true : this.e.stopPropagation();
    },
    preventDefault: function () {
        if (this.e.preventDefault) {
            this.e.preventDefault();
        }
        if (window.event) window.event.returnValue = false;
    },
    getAbsoluteTop: function () {
        return this.e.pageY ? this.e.pageY
            : (this.clientY ? (this.clientY + (document.documentElement.scrollTop ? document.documentElement.scrollTop
                : document.body.scrollTop))
                : null);
    },
    getAbsoluteLeft: function () {
        return this.pageX ? this.pageX
            : (this.clientX ? (this.clientX + (document.documentElement.scrollLeft ? document.documentElement.scrollLeft
                : document.body.scrollLeft))
                : null);
    },
    move: function () {
        if (this.dragapproved && this.srcElement != null) {
            this.srcElement.style.left = this.srcLeftPos + this.clientX
                - this.eventX;
            this.srcElement.style.top = this.srcRightPos + this.clientY
                - this.eventY;
        } else {
            return true;
        }
    },
    move_end: function () {
        this.dragapproved = false;
        this.srcElement.onmousemove = null;
    },
    drags: function () {
        try {
            if (this.srcElement.className.indexOf("drag") != -1) {
                if (this.srcElement.className == "drag-p") {
                    this.srcElement = this.srcElement.parentNode;
                } else if (this.srcElement.className == "drag-pp") {
                    this.srcElement = this.srcElement.parentNode.parentNode;
                } else {
                    this.srcElement = null;
                }
                var sparrowElement = $(this.srcElement);
                this.dragapproved = true;
                this.srcLeftPos = sparrowElement.getAbsoluteLeft();
                this.srcRightPos = sparrowElement.getAbsoluteTop();
                this.eventX = e.clientX;
                this.eventY = e.clientY;
                this.srcElement.onmousemove = this.move;
            } else {
                this.srcElement = null;
                this.dragapproved = false;
                this.srcElement.onmousemove = null;
            }
        } catch (err) {
        }
    }
};
Sparrow.prototype.mousewheel = function (handle) {
    var eventArray = ('onwheel' in document || document.documentMode >= 9) ?
        ['wheel'] : ['mousewheel', 'DomMouseScroll', 'MozMousePixelScroll'], slice = Array.prototype.slice,
        lowestDelta;
    var innerHandle = function (event) {
        if (!handle) {
            return;
        }
        event = $.event(event),
            args = slice.call(arguments, 1),
            delta = 0,
            deltaX = 0,
            deltaY = 0,
            absDelta = 0;
        event.preventDefault();
        // Old school scrollwheel delta
        if ('detail' in event.e) {
            deltaY = event.e.detail * -1;
        }
        if ('wheelDelta' in event.e) {
            deltaY = event.e.wheelDelta;
        }
        if ('wheelDeltaY' in event.e) {
            deltaY = event.e.wheelDeltaY;
        }
        if ('wheelDeltaX' in event.e) {
            deltaX = event.e.wheelDeltaX * -1;
        }

        // Firefox < 17 horizontal scrolling related to DOMMouseScroll event
        if ('axis' in event.e && event.e.axis === event.e.HORIZONTAL_AXIS) {
            deltaX = deltaY * -1;
            deltaY = 0;
        }

        // Set delta to be deltaY or deltaX if deltaY is 0 for backwards compatabilitiy
        delta = deltaY === 0 ? deltaX : deltaY;

        // New school wheel delta (wheel event)
        if ('deltaY' in event.e) {
            deltaY = event.e.deltaY * -1;
            delta = deltaY;
        }
        if ('deltaX' in event.e) {
            deltaX = event.e.deltaX;
            if (deltaY === 0) {
                delta = deltaX * -1;
            }
        }

        // No change actually happened, no reason to go any further
        if (deltaY === 0 && deltaX === 0) {
            return;
        }

        // Need to convert lines and pages to pixels if we aren't already in pixels
        // There are three delta modes:
        //   * deltaMode 0 is by pixels, nothing to do
        //   * deltaMode 1 is by lines
        //   * deltaMode 2 is by pages

        // Store lowest absolute delta to normalize the delta values
        absDelta = Math.max(Math.abs(deltaY), Math.abs(deltaX));

        if (!lowestDelta || absDelta < lowestDelta) {
            lowestDelta = absDelta;

            // Adjust older deltas if necessary
            if (absDelta % 120 === 0) {
                lowestDelta /= 40;
            }
        }

        // Adjust older deltas if necessary
        if (absDelta % 120 === 0) {
            // Divide all the things by 40!
            delta /= 40;
            deltaX /= 40;
            deltaY /= 40;
        }

        // Get a whole, normalized value for the deltas
        delta = Math[delta >= 1 ? 'floor' : 'ceil'](delta / lowestDelta);
        deltaX = Math[deltaX >= 1 ? 'floor' : 'ceil'](deltaX / lowestDelta);
        deltaY = Math[deltaY >= 1 ? 'floor' : 'ceil'](deltaY / lowestDelta);

        // Add information to the event object
        event.e.deltaX = deltaX;
        event.e.deltaY = deltaY;
        event.e.deltaFactor = lowestDelta;

        // Go ahead and set deltaMode to 0 since we converted to pixels
        // Although this is a little odd since we overwrite the deltaX/Y
        // properties with normalized deltas.
        event.e.deltaMode = 0;
        // Add event and delta to the front of the arguments
        args.unshift(event.e, delta, deltaX, deltaY);
        handle(args);
    };
    if (this.s.addEventListener) {
        for (var i = eventArray.length; i;) {
            this.s.addEventListener(eventArray[--i], innerHandle, false);
        }
        return;
    }
    this.s.onmousewheel = innerHandle;
};
/*--------------------------select 控件相关---------------------------------------------*/
Sparrow.prototype.addItem = function (text, value) {
    if (this.s.tagName.toUpperCase() !== "SELECT") {
        return;
    }
    if ($.isNullOrEmpty(value)) {
        value = text;
    }
    var newoption = new Option(text, value);
    if (!this.existItem(newoption))
        this.s.options.add(newoption);
};
Sparrow.prototype.existItem = function (srcOption) {
    var flag = false;
    for (var j = 0; j < this.s.options.length; j++) {
        if (srcOption.value === this.s.options[j].value)
            flag = true;
    }
    return flag;
};
Sparrow.prototype.addItemToSelect = function (descSelect) {
    var sparrowDescSelect = $(descSelect);
    for (var i = 0; i < this.s.options.length; i += 1) {
        if (srcSelect.options[i].selected) {
            var value = this.s.options[i].value;
            var text = this.s.options[i].innerHTML;
            var newoption = new Option(text, value);
            if (!sparrowDescSelect.existItem(this.s.options[i]))
                descSelect.options.add(newoption);
        }
    }
};
Sparrow.prototype.addAllItemToSelect = function (descSelect) {
    var sparrowDescSelect = $(descSelect);
    for (var i = 0; i < srcSelect.options.length; i += 1) {
        var text = srcSelect.options[i].innerHTML;
        var value = srcSelect.options[i].value;
        var newoption = new Option(text, value);
        if (!sparrowDescSelect.existItem(srcSelect.options[i]))
            descSelect.options.add(newoption);
    }
};
Sparrow.prototype.removeItem = function (isSubFirst) {
    if (typeof (srcSelect) === "string") {
        srcSelect = $(srcSelect);
    }
    var hasSelected = false;
    for (var i = this.s.options.length - 1; i >= 0; i -= 1) {
        if (this.s.options[i].selected) {
            this.s.options.remove(i);
            hasSelected = true;
        }
    }
    if (isSubFirst !== false) {
        if (hasSelected === false) {
            this.s.options.remove(0);
        }
    }
};
Sparrow.prototype.removeAll = function () {
    for (var i = this.s.options.length - 1; i >= 0; i -= 1) {
        this.s.options.remove(i);
    }
};
Sparrow.prototype.upDown = function (direction) {
    if (this.s.selectedIndex < 0)
        return;
    if (direction < 0) {
        if (this.s.selectedIndex == 0)
            return;
    } else {
        if (this.s.selectedIndex == this.s.options.length - 1)
            return;
    }
    var srcOption = this.s.options[this.s.selectedIndex];
    var toOption = this.s.options[this.s.selectedIndex + direction];
    var text = srcOption.text;
    var value = srcOption.value;
    srcOption.text = toOption.text;
    srcOption.value = toOption.value;
    toOption.text = text;
    toOption.value = value;
    this.s.selectedIndex += direction;
};
Sparrow.prototype.selectAll = function () {
    for (var i = 0; i < this.s.options.length; i++) {
        this.s.options[i].selected = true;
    }
};
Sparrow.prototype.addJson = function (json, k, v) {
    if (typeof(json) === "string") {
        json = json.json();
    }
    if (json != null && json.length > 0) {
        for (var j in json) {
            this.addItem(json[j][v], json[j][k]);
        }
        return true;
    }
};
Sparrow.message = function (content, srcElement) {
    var id = "div_sparrow_msg";
    var divmsg = $(id);
    if (divmsg) {
        divmsg.parentNode.removeChild(divmsg);
    }
    divmsg = $("new.div." + id);
    divmsg.s.style.cssText = "position:absolute;background-color:#cccccc;width:auto;padding:10px;text-align:left;";
    divmsg.s.innerHTML = content;
    divmsg.opacity(0);
    document.body.appendChild(divmsg.s);
    // 如果有事件源传递过来说明需要在事件触发源处显示提示信息
    if (srcElement) {
        var sparrowElement = $(srcElement);
        divmsg.s.style.top = sparrowElement.getAbsoluteTop()
            - divmsg.s.offsetHeight + "px";
        divmsg.s.style.left = sparrowElement.getAbsoluteLeft()
            - (divmsg.s.offsetWidth - srcElement.offsetWidth) / 2 + "px";
    } else {
        divmsg.center();
    }
    divmsg.move_end = function () {
        this.s.parentNode.removeChild(this.s);
    };
    divmsg.animation("{opacity:100}", 30);
};
Sparrow.prototype.move = function (s) {
    var status = s.json();
    var _move = function (sparrowElement, start, end, percent, change) {
        if (!$.isNullOrEmpty(end)) {
            var distance = (parseInt(end, 10) - parseInt(start, 10));
            var speed = distance * percent;
            if (percent > 1) {
                speed = distance > 0 ? percent : -percent;
                if (Math.abs(distance) <= 1) {
                    sparrowElement.css(change, status.start, false);
                    return false;
                }
            } else {
                speed = distance * percent;
            }
            if (typeof (change) === "function") {
                change(sparrowElement.s, speed);
            } else {
                sparrowElement.css(change, speed, true);
            }
            if (Math.abs(distance) <= 1) {
                return true;
            }
        }
        return false;
    };
    var percent = status.percent;
    if (!percent) {
        percent = 0.05;
    }
    var end = _move(this, this.s.style.width, status.width, percent, "width");
    if (!end) {
        end = _move(this, this.s.style.height, status.height, percent, "height");
    }
    if (!end) {
        end = _move(this, this.s.style.left, status.left, percent, "left");
    }
    if (!end) {
        end = _move(this, this.s.style.top, status.top, percent, "top");
    }
    if (!end) {
        end = _move(this, this.opacity(), status.opacity, percent, "opacity");
    }
    if (end) {
        if (!$.isNullOrEmpty(status.width)) {
            this.s.style.width = status.width;
        }
        if (!$.isNullOrEmpty(status.height)) {
            this.s.style.height = status.height;
        }
        if (!$.isNullOrEmpty(status.left)) {
            this.s.style.left = status.left;
        }
        if (!$.isNullOrEmpty(status.top)) {
            this.s.style.top = status.top;
        }
        if (!$.isNullOrEmpty(status.opacity)) {
            this.opacity(status.opacity);
        }
        if (parseInt(status.height, 10) == 0) {
            this.s.style.display = "none";
        }
        this.stop();
        this.move_end();
        this.move_end = function () {
        };
    }
};
Sparrow.prototype.move_end = function () {
};


Sparrow.prototype.stop = function () {
    window.clearInterval(this.interval.pop());
};
Sparrow.prototype.animation = function (s, period) {
    if (!period) {
        period = 30;
    }
    this.s.style.display = "block";
    this.stop();
    var command = "$('" + this.selector + "').move(\"" + s + "\");";
    this.interval.push(window.setInterval(command, period));
};



Sparrow.prototype.interlace = function (targetArray) {
    if (!targetArray) {
        targetArray = ["{width:'0px',height:'0px'}",
            "{top:'0px',height:'{0}',width:'{1}',left:'0px'}".format(this.s.style.height, this.s.style.width),
            "{width:'{0}',height:'{1}'}".format(this.s.style.width, this.s.style.height),
            "{top:'{0}',height:'0px',width:'0px',left:'{1}'}".format(this.s.style.height, this.s.style.width)];
    }
    $("!.div." + this.selector.split(".")[1]).each(function (i) {
        this.style.position = "absolute";
        if (i == 0) {
            this.style.width = this.parentNode.style.width;
            this.style.height = this.parentNode.style.height;
        } else {
            this.style.width = "0px";
            this.style.height = "0px";
            this.style.display = "none";
            this.style.left = this.parentNode.style.width;
            this.style.top = this.parentNode.style.height;
        }
    });
    this.s.style.position = "relative";
    this.s.style.overflow = "hidden";
    this.s.onmouseover = function () {
        $("!div." + this.id).each(function (i) {
            $(this).animation(targetArray[i], 1);
        });
    };
    this.s.onmouseout = function () {
        $("!.div." + this.id).each(function (i) {
            $(this).animation(targetArray[i + 2], 1);
        });
    };
};

Sparrow.prototype.show = function () {
    // 设置超出隐藏
    this.s.style.overflow = "hidden";
    // 如果默认是不显示或者第二次高度为0
    if (this.s.style.display == "none"
        || this.s.style.height == "0") {
        // 记录当前被控控件的高度
        if (this.height == undefined) {
            this.s.style.display = "block";
            this.height = this.s.offsetHeight + "px";
            this.s.style.height = "0";
        }
        this.animation("{height:'" + this.height + "'}", 5);
    }
};
Sparrow.prototype.hidden = function () {
    if (this.s) {
        if (this.height == undefined) {
            this.height = this.s.offsetHeight + "px";
            this.s.style.height = this.height;
        }
        if (this.s.offsetHeight > 0) {
            this.animation("{height:'0px'}", 5);
        }
    }
};
Sparrow.prototype.showHidden = function (descElement, config, all) {
    if (!descElement) {
        descElement = $(this.s.id + "_controlled");
    }
    if (!config) {
        config = {
            showText: 'show',
            hiddenText: 'hidden',
            showIco: '',
            hiddenIco: ''
        };
    }
    if (!all) {
        all = {
            show: true,
            hidden: true
        };
    }
    // 设置超出隐藏
    descElement.style.overflow = "hidden";
    // 如果默认是不显示或者第二次高度为0
    if (descElement.style.display == "none"
        || descElement.style.height == "0") {
        if (all.show) {
            // 记录当前被控控件的高度
            if (this.s.tagName.toUpperCase() == "IMG") {
                this.s.src = config.hiddenIco;
                this.s.alt = config.hiddenText;
            } else {
                this.s.innerHTML = config.hiddenText;
            }
            $(descElement).show();
        }
    } else {
        if (all.hidden) {
            $(descElement).hidden();
            if (this.s.tagName == "img") {
                this.s.src = config.showIco;
                this.s.alt = config.showText;
            } else {
                this.s.innerHTML = config.showText;
            }
        }
    }
};

Sparrow.showOrHiddenTag = function (tagArray, show, doc) {
    if (!doc) {
        doc = document;
    }
    for (var i = 0; i < tagArray.length; i++) {
        var tagName = tagArray[i];
        var tags = $("<" + tagName, null, doc);
        tags.each(function () {
            this.zIndex = -1;
            if (!show) {
                this.style.visibility = "hidden";
            } else {
                this.style.visibility = "visible";
            }
        });
    }
};

Sparrow.prototype.marque = function (direction, step, period, deviation) {
    var status = null;
    this.s.parentNode.style.position = "relative";
    this.s.style.position = "absolute";
    var containerHeight = this.s.parentNode.offsetHeight;
    var contentHeight = this.s.offsetHeight;
    switch (direction) {
        case 0:
            if (contentHeight <= containerHeight)
                return;
            this.s.innerHTML += this.s.innerHTML;
            var top = -contentHeight + "px";
            if (!deviation) {
                deviation = -3;
            }
            status = "{top:'" + top + "',start:" + deviation + ",percent:" + step
                + "}";
            break;
    }
    this.animation(status, period);
};
Sparrow.prototype.progressbar = function (callback, config) {
    var bar = $("new.div");
    document.body.appendChild(bar.s);
    if (config.style) {
        bar.s.style.cssText = config.style;
    }
    var progress = $("new.div");
    bar.s.appendChild(progress.s);
    if (config.progressStyle) {
        progress.s.style.cssText = config.progressStyle;
    }
    progress.s.style.width = "0px";
    progress.it = window.setInterval(function () {
        callback(progress);
    }, 100);
    progress.end = function () {
        window.clearInterval(progress.it);
    };
    progress.remove = function () {
        document.body.removeChild(progress.s.parentNode);
    };

};
return Sparrow;
}));
/*
 * 垂直菜单 menu 与child的对应关系是以 menu.id+_child=child.id 对应
 * 水平菜单 用索引对应 因为html 结构决定
 * position[child.id]=child.position(height etc...)
 * */
function Menu(obj, position) {
    this.config = // 菜单显示需要的常量配置
    {
        current_menu: null,
        left_limit: -1,
        period: 3,
        frameDiv: null, // 菜单提示框的DIV
        srcElement: null, // 事件源控件保存选中的提示结果
        width: 300, // 提示框显示宽度
        position: {},//高度
        container: null, // 菜单显示的窗口
        parent: null, // 父菜单
        menu: [],
        list: [],//水平菜单的列表 与menu 一一 对应
        childs: [],//快捷菜单隐藏时使用
        brothers: []// 兄弟节点
    };
    this.obj = obj;
    //obj为leftMenu 则id默认为divLeftMenu
    //for different obj in container
    this.id = "div" + this.obj.firstCharUpperCase();
    this.position = position ? position : "SIDE";// 位置默认右上角
    $.global(obj, this);
}
Menu.prototype.side = function () {
    this.config.frameDiv = $("new.div").s;
    this.config.frameDiv.onmouseover = function (e) {
        $.event(e).cancelBubble();
    };
    document.body.appendChild(this.config.frameDiv);
    this.config.frameDiv.style.cssText = $.css.menu.frame.format(
        this.config.width, 0, 0);
    var menuHTML = [];
    menuHTML.push('<ul style="{0}">'.format($.css.menu.ul
        .format(this.config.width - 2)));
    for (var i = 0; i < this.config.menu.length; i++) {
        menuHTML
            .push('<li style="{0}" {3}><a href="javascript:void(0);" onclick="{1}.itemClick({2});"  style="width:{4}px;display:inline-block;cursor:pointer"><span style="float:left">{5}</span><span  style="float:right;">{6}</span></a></li>'
                .format(
                    $.css.menu.li.format(this.config.width),
                    this.obj,
                    i,
                    this.config.menu[i].more ? 'onmouseover="{0}.itemMore(this,{1});"'
                        .format(this.obj, i)
                        : '', this.config.width,
                    this.config.menu[i].text,
                    this.config.menu[i].more ? ">>" : ""));
    }
    menuHTML.push('</ul>');
    this.config.frameDiv.innerHTML = menuHTML.join("");
};
Menu.prototype.vertical = function () {
    if (!$(this.id)) {
        return;
    }
    var item = $("son.div." + this.id);
    var obj = this.obj;
    item
        .each(function (i) {
            var menu = $.global(obj);
            var item_link = $("son.a", this)[0];
            item_link.id = menu.id + "_" + menu.position + "_menu_" + i;
            var child = $("son.ul", this)[0];
            if (child) {
                child.id = item_link.id + "_child";
                menu.config.position[child.id] = child.offsetHeight;
                child.style.display = "none";
                child.style.height = "0px";
                $(child).bind("onmouseover", function (e) {
                    $.event(e).cancelBubble();
                });

                $(item_link)
                    .bind(
                        "onmouseover",
                        function (e) {
                            $.event(e).cancelBubble();
                            var child = $("#." + this.id + "_child");
                            var current_menu = null;
                            if (menu.config.current_menu != null) {
                                if (child === menu.config.current_menu) {
                                    return;
                                }
                                current_menu = menu.config.current_menu;
                                current_menu.stop();
                            }
                            menu.config.current_menu = child;
                            child.s.style.display = "block";
                            child.move_end = function () {
                                if (current_menu != null) {
                                    current_menu.animation("{height:'0px'}", menu.config.period);
                                }
                            };
                            child
                                .animation(
                                    "{height:'"
                                    + menu.config.position[child.s.id]
                                    + "px'}",
                                    menu.config.period);
                        });
            }
        });
};
Menu.prototype.dispose = function () {
    if (this.config.frameDiv) {
        document.body.removeChild(this.config.frameDiv);
    }
};
Menu.prototype.hidden = function () {
    if (this.position === $.SIDE) {
        if (this.config.frameDiv) {
            this.config.frameDiv.style.display = "none";
            // 隐藏其子菜单
            for (var i = 0; i < this.config.childs.length; i++) {
                this.config.childs[i].hidden();
            }
        }
    }
    else if (this.position === $.HORIZONTAL) {
        var menu = this;
        if (this.config.current_menu != null) {
            $(this.config.current_menu.parentNode).stop();
            $(this.config.current_menu.parentNode).move_end = function () {
                menu.config.current_menu = null;
            };
            $(this.config.current_menu.parentNode).animation("{height:'0px'}",
                this.config.period);
        }
    }
};

Menu.prototype.show = function (srcElement, parentMenu) {
    this.config.parent = parentMenu;
    this.config.srcElement = srcElement;
    var scrollTop = 0;
    if (this.config.container)
        scrollTop = this.config.container.scrollTop;
    var left = $(this.config.srcElement).getAbsoluteLeft();
    if (this.config.position === this.SIDE) {
        left += this.config.srcElement.offsetWidth;
    }
    var top = $(this.config.srcElement).getAbsoluteTop()
        - scrollTop;
    this.config.frameDiv.style.left = left + "px";
    this.config.frameDiv.style.top = (top - 2) + "px";
    this.config.frameDiv.style.display = "block";
    // 显示菜单同时隐藏子菜单
    for (var i = 0; i < this.config.childs.length; i++) {
        this.config.childs[i].hidden();
    }
    // 隐藏兄弟菜单
    for (var i = 0; i < this.config.brothers.length; i++) {
        this.config.brothers[i].hidden();
    }
};
Menu.prototype.itemClick = function (index) {
    alert("click:" + this.config.menu[index].text);
};
Menu.prototype.itemMore = function (srcElement, index) {
    alert("more:" + this.config.menu[index].text);
};
Menu.prototype.horizontal=function () {
    if (!$(this.id)) {
        return;
    }
    var div = $("son.div." + this.id);
    //初始化菜单
    this.config.menu = $("son.li", div[0]);
    //初始化菜单对应的列表
    this.config.list = $("son.ul", div[1]);
    this.config.left_limit = $("#." + this.id).getAbsoluteLeft();
    if (this.config.position["height"] == null) {
        this.config.position["height"] = 30;
    }
    var menu = $.global(this.obj);
    $(document)
        .bind("onmouseover", function () {
            menu.hidden(this);
        });
    this.config.menu
        .each(function (i) {
            this.id = menu.obj + "_" + menu.position + "_menu_" + i;
            //初始化list的位置和事件
            var list = $(menu.config.list[i]);
            list.s.style.cssText = "height:{0}px;overflow:hidden;width:{1}px;".format(list.s.offsetHeight, (list.s.offsetWidth+10));//加2误差
            list.s.id = this.id + "_child";
            list.bind("onmouseover", function (e) {
                $.event(e).cancelBubble();
            });

            //初始化当前菜单的事件
            $(this)
                .bind(
                    "onmouseover",
                    function (e) {
                        e = $.event(e);
                        e.cancelBubble();
                        if (e.srcElement.tagName !== "LI") {
                            return;
                        }
                        var list = $(e.srcElement.id + "_child");
                        if (menu.config.current_menu != null) {
                            if (list === menu.config.current_menu) {
                                return;
                            }
                            $(menu.config.current_menu).stop();
                        }
                        menu.config.current_menu = list;
                        list.parentNode.style.height = "0";
                        var top = ($(menu.id).offsetTop - $.win.getScrollTop());
                        if (top <= 0) {
                            top = 0;
                        }
                        list.parentNode.style.top = (top + menu.config.menu[0].offsetHeight - 8) + "px";
                        if (list.getElementsByTagName("li").length > 0) {
                            //显示当前list 并且隐藏其他列表
                            menu.config.list.each(function () {
                                this.style.display = "none";
                            });
                            list.style.display = "block";
                            var left = parseInt(e.srcElement.offsetLeft, 10)
                                - (parseInt(list.style.width, 10) - e.srcElement.offsetWidth) / 2;
                            if (left < menu.config.left_limit) {
                                left = menu.config.left_limit;
                            }
                            list.style.marginLeft = left + 'px';
                            $(list.parentNode).stop();
                            $(list.parentNode)
                                .animation(
                                    "{height:'"
                                    + menu.config.position["height"]
                                    + "px'}",
                                    menu.config.period);
                        }
                    });
        });
};
Menu.prototype.init = function () {
    if (this.position === $.SIDE) {
        this.side();
    }
    else if (this.position === $.VERTICAL) {
        this.vertical();
    }
    else if (this.position === $.HORIZONTAL) {
       this.horizontal();
    }
};