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
        } 
            return true;
    }
};