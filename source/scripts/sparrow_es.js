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
  if (this === "" || this === "''" || this.length === 0) {
    return null;
  }
  if (this.indexOf("error|") !== -1) {
    console.log(this);
  }
  try {
    var json = this;
    json = json.decodeSplitKey();
    return eval(
      "(" + json.replace(/\r\n/g, "<br/>").replace(/\n/g, "<br/>") + ")"
    );
  } catch (err) {
    return console.log(err);
  }
};
String.prototype.firstCharToAscii = function () {
  return this.charCodeAt(0);
};
String.prototype.leftAlignWithChar = function (c, length) {
  length = length ? length : 3;
  c = c ? c : "0";
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
  str = str.replace(/#ref#/g, '\\"');
  str = str.replace(/#limit/g, "#");
  return str;
};
String.prototype.decodeHtml = function () {
  var html = this;
  html = html.replace(/&amp;/g, "&");
  html = html.replace(/&lt;/g, "<");
  html = html.replace(/&gt;/g, ">");
  html = html.replace(/&quot;/g, '"');
  html = html.replace(/&nbsp;/g, " ");
  return html;
};
// 字符格式化方法
String.prototype.format = function () {
  var newStr = this;
  if (arguments.length >= 1 && typeof arguments[0] === "object") {
    var re = /#{(.*?)}/gi;
    var r = null;
    while ((r = re.exec(this))) {
      var placeHolder = r[0];
      var property = r[1];
      var value = arguments[0].value(property);
      if (arguments.length > 1) {
        for (var i = 1; i < arguments.length; i++) {
          value = arguments[i].value(property);
          if (value) {
            break;
          }
        }
      }
      newStr = newStr.replace(
        placeHolder,
        $.isNullOrEmpty(value) ? "-" : value
      );
    }
    return newStr;
  }
  var reg = null;
  for (var i = 0; i < arguments.length; i++) {
    reg = new RegExp("\\{" + i + "\\}", "gm");
    newStr = newStr.replace(
      reg,
      $.isNullOrEmpty(arguments[i]) ? "-" : arguments[i]
    );
  }
  return newStr;
};
// 过滤闭合的html标签
String.prototype.filterHTML = function () {
  var newString = this;
  while (newString.search(/<([a-z0-9]*?).*?>([\s\S]*?)<\/\1>/gi) > -1) {
    newString = newString.replace(/<([a-z0-9]*?).*?>([\s\S]*?)<\/\1>/gi, "$2");
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
String.prototype.toArrayBuffer = function () {
  var bytes = [];
  var len, c;
  len = this.length;
  for (var i = 0; i < len; i++) {
    c = this.charCodeAt(i);
    if (c >= 0x010000 && c <= 0x10ffff) {
      bytes.push(((c >> 18) & 0x07) | 0xf0);
      bytes.push(((c >> 12) & 0x3f) | 0x80);
      bytes.push(((c >> 6) & 0x3f) | 0x80);
      bytes.push((c & 0x3f) | 0x80);
    } else if (c >= 0x000800 && c <= 0x00ffff) {
      bytes.push(((c >> 12) & 0x0f) | 0xe0);
      bytes.push(((c >> 6) & 0x3f) | 0x80);
      bytes.push((c & 0x3f) | 0x80);
    } else if (c >= 0x000080 && c <= 0x0007ff) {
      bytes.push(((c >> 6) & 0x1f) | 0xc0);
      bytes.push((c & 0x3f) | 0x80);
    } else {
      bytes.push(c & 0xff);
    }
  }
  var array = new Int8Array(bytes.length);
  for (var i in bytes) {
    array[i] = bytes[i];
  }
  return array;
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
Array.prototype.toUint8Array = function () {
  var bytes = this;
  var array = new Uint8Array(bytes.length);
  for (var i = 0; i < array.length; i++) {
    array[i] = bytes[i];
  }
  return array;
};
// If Push and pop is not implemented by the browser
if (!Array.prototype.push) {
  Array.prototype.push = function array_push() {
    for (var i = 0; i < arguments.length; i++) this[this.length] = arguments[i];
    return this.length;
  };
}
if (!Array.prototype.pop) {
  Array.prototype.pop = function array_pop() {
    lastElement = this[this.length - 1];
    this.length = Math.max(this.length - 1, 0);
    return lastElement;
  };
}
Uint8Array.prototype.toString = function () {
  /**
   * https://www.javascripture.com/DataView
   * DataViews allow heterogeneous access to data stored in an ArrayBuffer. Values can be read and stored at any byte offset without alignment constraints.
   * @type {DataView}
   */
  var dataView = new DataView(this.buffer);
  var ints = new Uint8Array(this.buffer.byteLength);
  for (var i = 0; i < ints.length; i++) {
    ints[i] = dataView.getUint8(i);
  }
  var str = "",
    _arr = ints;
  for (var i = 0; i < _arr.length; i++) {
    var one = _arr[i].toString(2),
      v = one.match(/^1+?(?=0)/);
    if (v && one.length === 8) {
      var bytesLength = v[0].length;
      var store = _arr[i].toString(2).slice(7 - bytesLength);
      for (var st = 1; st < bytesLength; st++) {
        store += _arr[st + i].toString(2).slice(2);
      }
      str += String.fromCharCode(parseInt(store, 2));
      i += bytesLength - 1;
    } else {
      str += String.fromCharCode(_arr[i]);
    }
  }
  return str;
};
//小端模式
//number 要转换的整形数值
//length 要转成什么byte数组，规定数组的长度
//如uint16，则length=2表示两个字节，转成的byte数组长度是length=2
//如uint32，则length=2表示两个字节，转成的byte数组长度是length=4
Number.prototype.toBytes = function () {
  length = 4;
  //只支持32位以下数字，32位以上会有精度问题
  var number = this;
  var bytes = [];
  var i = length;
  do {
    //console.log(number.toString(2));
    bytes[--i] = number & 255;
    number = number >> 8;
  } while (i);
  return bytes;
};
// new Date().format("yyyy-MM-dd hh:mm:ss");
Date.prototype.format = function (fmt) {
  var o = {
    "M+": this.getMonth() + 1, //月份
    "d+": this.getDate(), //日
    "h+": this.getHours(), //小时
    "m+": this.getMinutes(), //分
    "s+": this.getSeconds(), //秒
    "q+": Math.floor((this.getMonth() + 3) / 3), //季度
    S: this.getMilliseconds(), //毫秒
  };
  if (/(y+)/.test(fmt))
    fmt = fmt.replace(
      RegExp.$1,
      (this.getFullYear() + "").substr(4 - RegExp.$1.length)
    );
  for (var k in o)
    if (new RegExp("(" + k + ")").test(fmt))
      fmt = fmt.replace(
        RegExp.$1,
        RegExp.$1.length == 1 ? o[k] : ("00" + o[k]).substr(("" + o[k]).length)
      );
  return fmt;
};

/**
 * @return
 *
 * # id  id
 * & name address equal name
 * ^ tag tag name
 * ! son dot below
 * $ for ---for 4
 * * checked_value * equal multi
 * + new create
 * ...
 */
var Sparrow = function (selector, parent, doc, cache, sparrowContainerKey) {
    if (window === this||!(this instanceof Sparrow)) {
        //Array.prototype.slice 将arguments 转化成数组
        var args = Array.prototype.slice.call(arguments, 0);
        if (!selector) {
            return null;
        }
        //execute method and return result for constant
        /**
         * root_domain: $(function () {
            return window.location.host.substr(window.location.host.indexOf('.'));
        })
         */
        if (typeof (selector) === "function") {
            //call不为数组
            //apply 的参数为数组
            //Array.prototype.slice 将arguments 转化成数组
            return selector.apply(selector, args.slice(1));
        }

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
            return null;
        }

        sparrowContainerKey = selector;
        if (typeof (selector) === "object") {
            sparrowContainerKey = "#" + selector.id;
        }

        parent = null;
        doc = document;
        cache = true;
        //selector, parent, doc, cache, sparrowContainerKey
        if (args.length >= 2) {
            //selector,cache
            if (typeof args[1] == "boolean") {
                cache = args[1];
            } else {
                //selector,parent
                parent = args[1];
            }
            if (args.length >= 3) {
                //selector,parent,cache
                if (typeof args[2] == "boolean") {
                    cache = args[2];
                } else {
                    //select,parent doc
                    doc = args[2];
                }
            }
            //selector,parent,doc,cache
            if (args.length === 4) {
                cache = args[3];
            }
        }

        if (parent != null && typeof (parent) === "object") {
            if (!parent.id) {
                parent.id = "sparrow_" + $.random();
            }
            sparrowContainerKey += "_" + parent.id;
        }
        if ($.global(sparrowContainerKey)) {
            return $.global(sparrowContainerKey);
        }
        var beginSelector = ["#", "!", "$", "&", "*", "+", "^"];
        //$("btnButtonId") .... equal document.getElementById("btnButtonId");
        if (typeof (selector) !== "object" && beginSelector.indexOf(selector.substring(0, 1)) == -1) {
            //btnButtonId
            return doc.getElementById(selector);
        }
        return new Sparrow(selector, parent, doc, cache, sparrowContainerKey);
    }
    var elements = [];
    this.selector = selector;
    this.doc = doc;
    if (typeof (selector) === "object") {
        elements[0] = selector;
        if (!selector.id) {
            selector.id = "sparrow_" + $.random();
        }
        this.selector = "#" + selector.id;
        sparrowContainerKey = this.selector;
    } else if (typeof selector === 'string') {
        //["#", "!", "$", "&", "*", "+", "^"]
        var switch_char = selector.substring(0, 1);
        selector = selector.substring(1);
        var selectorArray = selector.split(".");
        var i = 0;
        switch (switch_char) {
            case "#"://id
                elements[0] = doc.getElementById(selector);
                break;
            case "^": //tag
                elements = doc.getElementsByTagName(selector);
                break;
            case "&": //name
                elements = doc.getElementsByName(selector);
                break;
            case "+":
                //+html-label.id.parentId.type
                elements[0] = doc.createElement(selectorArray[0]);
                if (selectorArray.length >= 2) {
                    elements[0].id = selectorArray[1];
                } else {
                    elements[0].id = "sparrow_" + $.random();
                }
                this.selector = "#" + selectorArray[1];
                sparrowContainerKey = this.selector;
                if (selectorArray.length >= 3) {
                    if (selectorArray[2] === "doc") {
                        this.doc.body.appendChild(elements[0]);
                    } else {
                        this.doc.getElementById(selectorArray[2]).appendChild(
                            elements[0]);
                    }
                }
                if (selectorArray.length >= 4) {
                    elements[0].type = selectorArray[3];
                }
                break;
            case "!":
                //!html-label.parentId"
                var childs = [];
                if (!parent) {
                    parent = $(selectorArray[1]);
                }
                var children = parent.getElementsByTagName(selectorArray[0]);
                if (selectorArray[0] === "li") {
                    parent = children[0].parentNode;
                }
                this.s = parent;
                if (!parent.id) {
                    parent.id = "sparrow_" + $.random();
                }
                for (i = 0; i < children.length; i++) {
                    if (children[i].parentNode === parent) {
                        childs[childs.length] = children[i];
                    }
                }
                elements = childs;
                break;
            case "$": //for 4
                var labelList = doc.getElementsByTagName("label");
                for (i = 0; i < labelList.length; i++) {
                    if (labelList[i].attributes["for"].value === selector) {
                        elements[0] = labelList[i];
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
                for (i = 0; i < tagArray.length; i++) {
                    if (tagArray[i].checked) {
                        if (attribute) {
                            selectedTag[selectedTag.length] = (tagArray[i].attributes[attribute].value);
                        } else {
                            selectedTag[selectedTag.length] = (tagArray[i].value);
                        }
                    }
                }
                elements = selectedTag;
                break;
        }
    }
    if (selector) {
        this.length = 0;
        if (elements.length > 0) {
            if (!this.s) {
                this.s = elements[0];
            }
            if (this.s && this.s.id && cache) {
                $.global(sparrowContainerKey, this);
            }
        }
        [].push.apply(this, elements);
    }
    this.interval = [];
    return this;
};
window.$ = window.Sparrow = Sparrow;

Sparrow.browser = {
  focus: false,
  url: {
    manage: "default.jsp",
    logout_url: "/user/logout.json",
  },
  cookie: {
    permission: "PERMISSION",
    call_back_url: "call_back_url",
    website_name: "website_name",
    themes: "sparrow.themes",
    // 配置cookie的域并非cookie的key
    root_domain: $(function () {
      return window.location.host.substr(window.location.host.indexOf(".") + 1);
    }),
    domain: window.location.host,
  },
  ie: $(function () {
    return navigator.userAgent.search(/MSIE/gim) !== -1;
  }),
  opera: $(function () {
    return navigator.userAgent.search(/Opera/gim) !== -1;
  }),
  firefox: $(function () {
    return navigator.userAgent.search(/Firefox/gim) !== -1;
  }),
  google: $(function () {
    return navigator.userAgent.search(/Chrome/gim) !== -1;
  }),
  version: $(function () {
    if (navigator.userAgent.search(/MSIE/gim) !== -1) {
      navigator.userAgent.match(/MSIE\b\s*([0-9\.0-9]+);/gim);
      return RegExp.$1;
    }
    if (navigator.userAgent.search(/Opera/gim) !== -1) {
      navigator.userAgent.match(/Version\/([0-9\.]+)/gim);
      return RegExp.$1;
    }
    if (navigator.userAgent.search(/Firefox/gim) !== -1) {
      navigator.userAgent.match(/Firefox\/([0-9\.]+)/gim);
      return RegExp.$1;
    }
    if (navigator.userAgent.search(/Chrome/gim) !== -1) {
      navigator.userAgent.search(/Chrome\/([0-9\.]+)/gim);
      return RegExp.$1;
    }
  }),
  addFavorite: function (url, title) {
    if (document.all) {
      window.external.AddFavorite(url, title);
    } else if (window.sidebar) {
      window.sidebar.addPanel(title, url, "");
    } else {
      alert(
        "对不起，您的浏览器不支持此操作!\n请您使用菜单栏或Ctrl+D收藏本站。"
      );
    }
  },
  setHome: function (anchorLabel, url) {
    try {
      anchorLabel.style.behavior = "url(#default#homepage)";
      anchorLabel.setHomePage(url);
    } catch (e) {
      if (window.netscape) {
        try {
          netscape.security.PrivilegeManager.enablePrivilege(
            "UniversalXPConnect"
          );
          var prefs = Components.classes[
            "@mozilla.org/preferences-service;1"
          ].getService(Components.interfaces.nsIPrefBranch);
          prefs.setCharPref("browser.startup.homepage", url);
        } catch (e) {
          alert(
            "抱歉！您的浏览器不支持直接设为首页。请在浏览器地址栏输入“about:config”并回车然后将[signed.applets.codebase_principal_support]设置为“true”，点击“加入收藏”后忽略安全提示，即可设置成功。"
          );
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
        return;
      }
      try {
        netscape.security.PrivilegeManager.enablePrivilege(
          "UniversalXPConnect"
        );
      } catch (e) {
        alert(
          "您的浏览器设置为不允许复制！\n如果需要此操作，请在浏览器地址栏输入'about:config'并回车\n然后将'signed.applets.codebase_principal_support'设置为'true',再重试复制操作!"
        );
        return false;
      }
      var clip = Components.classes[
        "@mozilla.org/widget/clipboard;1"
      ].createInstance(Components.interfaces.nsIClipboard);
      if (!clip) return;
      var trans = Components.classes[
        "@mozilla.org/widget/transferable;1"
      ].createInstance(Components.interfaces.nsITransferable);
      if (!trans) {
        return;
      }
      trans.addDataFlavor("text/unicode");
      var supportsString = Components.classes[
        "@mozilla.org/supports-string;1"
      ].createInstance(Components.interfaces.nsISupportsString);
      supportsString.data = text;
      trans.setTransferData(
        "text/unicode",
        supportsString,
        text.getByteLength()
      );
      var clipid = Components.interfaces.nsIClipboard;
      if (!clip) return false;
      clip.setData(trans, null, clipid.kGlobalClipboard);
      alert(msg);
    } catch (e) {
      alert("对不起！您的浏览器不支持该功能");
    }
  },

  setCookie: function (
    cookieName,
    cookieValue,
    expireseconds,
    domain,
    path,
    secure
  ) {
    var expires = null;
    if (expireseconds !== 0 && expireseconds) {
      expires = new Date();
      expires.setTime(expires.getTime() + expireseconds * 1000);
    }
    document.cookie =
      encodeURIComponent(cookieName) +
      "=" +
      encodeURIComponent(cookieValue) +
      (expires ? "; expires=" + expires.toGMTString() : "") +
      "; path=" +
      (path ? path : "/") +
      "; domain=" +
      (domain ? domain : this.cookie.root_domain) +
      (secure ? "; secure" : "");
  },
  getCookie: function (cookieName) {
    var cookieValue = null;
    var posName = document.cookie.indexOf(escape(cookieName) + "=");
    if (posName !== -1) {
      var posValue = posName + (escape(cookieName) + "=").length;
      var endPos = document.cookie.indexOf(";", posValue);
      if (endPos !== -1)
        cookieValue = decodeURIComponent(
          document.cookie.substring(posValue, endPos)
        );
      else
        cookieValue = decodeURIComponent(document.cookie.substring(posValue));
    }
    if (
      cookieValue == null ||
      typeof cookieValue === "undefined" ||
      cookieValue === "undefined"
    ) {
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
      result = window.showModalDialog(
        url,
        args,
        "dialogHeight:{0}px; dialogWidth:{1}px; status:no; help:no; scroll:auto".format(
          height,
          width
        )
      );
    } else {
      result = window.open(
        url,
        args,
        "height={0}, width={1},toolbar= no, menubar=no, scrollbars=auto, resizable=no, location=no, status=no,top=100,left=300".format(
          height,
          width
        )
      );
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
      parameters =
        "height={0}px,width={1}px,toolbar= no, menubar=no, scrollbars=auto, resizable=no, location=no, status=no,top=100,left=300".format(
          config.height,
          config.width
        );
    }
    config.win.open(url, target, parameters);
  },
  close: function () {
    window.opener = null;
    window.open("about:blank", "_self");
    window.close();
  },
  getUrlWithoutParameter: function (url) {
    var currentLocation = url ? url : window.location.href;
    var locationIndex = currentLocation.indexOf("?");
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
    return permission.split("&")[0].substring("id=".length);
  },
  getUserName: function () {
    var permission = $.browser.getCookie(this.cookie.permission);
    if (permission == null) {
      return null;
    }
    return permission.split("&")[1].substring("name=".length);
  },
  isLogin: function () {
    var userId = $.browser.getUserId();
    return !(
      userId == null ||
      userId === 0 ||
      userId === "0" ||
      userId === "null" ||
      userId === ""
    );
  },
  logout: function (domain, logoutUrl, defaultUrl) {
    if ($.isNullOrEmpty(logoutUrl)) {
      logoutUrl = this.url.logout_url;
    }
    if ($.isNullOrEmpty(defaultUrl)) {
      defaultUrl = this.url.manage;
    }
    $.ajax.json(
      $.url.root + logoutUrl,
      function (result) {
        var permissionKey = result.value;
        if ($.isNullOrEmpty(permissionKey)) {
          permissionKey = $.browser.cookie.permission;
        }
        // 注销成功后回调
        $.browser.setCookie(permissionKey, "0", -1, domain);
        if (
          $.url.root + "/" === window.parent.location.href ||
          window.parent.location.href.indexOf(defaultUrl) !== -1
        ) {
          window.parent.location.href = $.url.root;
        } else {
          window.location.href = window.location.href;
        }
      },
      true
    );
  },
  /***************************************************************************
   * 取窗口可视范围的高度
   **************************************************************************/
  getClientHeight: function () {
    return document.body.clientHeight && document.documentElement.clientHeight
      ? Math.min(
          document.body.clientHeight,
          document.documentElement.clientHeight
        )
      : Math.max(
          document.body.clientHeight,
          document.documentElement.clientHeight
        );
  },
  /***************************************************************************
   * 取文档内容实际高度
   **************************************************************************/
  getScrollHeight: function () {
    return Math.max(
      document.body.scrollHeight,
      document.documentElement.scrollHeight
    );
  },
  linkClick: function (condition, message) {
    if (typeof condition === "boolean") {
      if (!condition) {
        $.alert(message, "sad");
        return false;
      }
      return true;
    }
    //非field.value==1 则为this对象
    if (condition.href === "javascript:void(0);") {
      $.alert(message, "sad");
      return false;
    }
    return true;
  },
  monitorFocus: function () {
    window.onfocus = function () {
      console.log("window.onfocus");
      Sparrow.browser.focus = true;
    };
    window.onclick = function () {
      console.log("window.onclick");
      Sparrow.browser.focus = true;
    };
    window.onblur = function () {
      console.log("window.onblur");

      Sparrow.browser.focus = false;
    };
  },
};

Sparrow.container = {};
Sparrow.global = function (key, obj) {
    if (typeof(obj) === "undefined") {
        return this.container[key];
    }
    this.container[key] = obj;
};
Sparrow.remove=function (key) {
  delete this.container[key];
};
Sparrow.url = {
  root: $(function () {
    var pathName =
      window.location.pathname === "/"
        ? ""
        : "/" + window.location.pathname.split("/")[1];
    return window.location.protocol + "//" + window.location.host + "";
  }),
  _resource: function (path) {
    var scripts = document.scripts;
    var sparrowPath = [
      "/scripts/sparrow.js",
      "/scripts/sparrow-min.js",
      "/scripts-dev/sparrow.js",
    ];
    if (path) {
      sparrowPath = [path];
    }
    if (scripts == null || scripts.length === 0) {
      return null;
    }
    var r = null;
    for (var i = 0; i < scripts.length; i++) {
      var brk = false;
      sparrowPath.forEach(function () {
        for (var j = 0; j < sparrowPath.length; j++) {
          var p = sparrowPath[j];
          var startIndex = scripts[i].src.indexOf(p);
          if (startIndex > -1) {
            r = scripts[i].src.substring(0, startIndex);
            brk = true;
          }
        }
      });
      if (brk) {
        break;
      }
    }
    return r;
  },
  name: $.browser.cookie.domain.split(".")[0],
};
Sparrow.url.resource = $.url._resource();
Sparrow.url.passport = $(function () {
  return "http://passport." + $.browser.cookie.root_domain;
});
Sparrow.website = {
  name: $.browser.getCookie($.browser.cookie.website_name),
  themes: $(function () {
    var themes = $.browser.getCookie($.browser.cookie.themes);
    if (themes == null) {
      themes = "themes_default";
    }
    return themes;
  }),
};
Sparrow.css = {
  menu: {
    frame:
      "background:#ffffff;position:absolute;z-index:1000;border:#ccc 1px solid;width:{0}px;height:auto;left:{1}px;top:{2}px;display:none",
    ul: "width:{0}px;height:auto;overflow:hidden;list-style:none;margin:0px;padding:0px;text-align:left",
    li: "width:{0}px;overflow:hidden;line-height:20px;margin:0px;border-bottom:#ccc 1px dotted;cursor:pointer;",
  },
};
Sparrow.SIDE = "SIDE";
Sparrow.HORIZONTAL = "HORIZONTAL";
Sparrow.VERTICAL = "VERTICAL";
Sparrow.DEFAULT_AVATOR_URL = $.url.resource + "/images/user.png";
Sparrow.DEFAULT_RESOURCE_ICO_URL = $.url.resource + "/images/menu.png";

// Sparrow.indexedDB = {
//     config: {
//         name: 'Sparrow',
//         version: "1.0",
//         tableNames: [{"name":"t1","key":"id"}]
//     }
// };
Sparrow.indexedDB = function (config) {
    //当前浏览器是否支持indexedDB
    this.support = window.indexedDB;
    //数据库实例
    this.instance = null;
    //数据库名称
    this.name = config.name;
    //数据库相关配置
    this.config = config;

    this.userId=localStorage.getItem("userId");
    //是否初始化成功
    this.initSuccess = false;

    //自定义数据库初始化方法
    this.$initDB=null
};
Sparrow.indexedDB.prototype = {
    init: async function () {
        if (!this.support) {
            return this.support;
        }
        this.request = window.indexedDB.open(this.name+this.userId, this.config.version);
        return await new Promise((resolve, reject) => {
            this.request.onsuccess = async (event) => {
                //数据库实例
                this.instance = event.target.result;
                console.log('数据库连接成功');
                var result = await this.flush();
                console.log('数据库flush结果', result);
                if (result) {
                    this.initSuccess = true;
                    console.log('数据库flush成功');
                    if (this.$dbInit) {
                       await this.$dbInit();
                    }
                    resolve(this.instance);
                } else {
                    reject('数据库连接失败');
                }
            };
            this.request.onupgradeneeded = async (event) => {
                console.log('首次创建数据库');
                this.instance = event.target.result;
                this._initTables();
                if (this.$dbInit) {
                    await this.$dbInit();
                }
                this.initSuccess = true;
                resolve(this.instance);
            };
            this.request.onerror = (e) => {
                console.log('数据库发生错误', e);
                reject('连接indexedDB出错');
            };
        });
    },
    _createTable: function (tableName, key) {
        this.instance.createObjectStore(tableName, {keyPath: key});
    },
    _initTables: function () {
        this.config.tableNames.forEach((tableName) => {
            this._createTable(tableName.name, tableName.key);
        });
    },
    _getTableInstance: function (tableName) {
        return this.instance
            .transaction(tableName, 'readwrite')
            .objectStore(tableName);
    },
    put: async function (tableName, item) {
        if (!this.support) {
            return this.support;
        }
        if (!this.initSuccess) {
            await this.init();
        }
        return await new Promise((resolve, reject) => {
            const request = this._getTableInstance(tableName)
                .put(item);
            request.onsuccess = (event) => {
                console.log("put success: TABLE-NAME" + tableName + " item " + item);
                resolve(event.target.result);
            };
            request.fail = (event) => {
                reject(event.target.result);
            };
        });
    },
    get: async function (tableName, key) {
        if (!this.support) {
            return this.support;
        }
        if (!this.initSuccess) {
            await this.init();
        }
        return await new Promise((resolve, reject) => {
            console.log("GET tableName " + tableName + ", get key:" + key);
            const request = this._getTableInstance(tableName)
                .get(key);
            request.onsuccess = (event) => {
                resolve(event.target.result);
            };
            request.fail = (event) => {
                reject(event.target.result);
            };
        });
    },
    delete: async function (tableName, key) {
        if (!this.support) {
            return this.support;
        }
        if (!this.initSuccess) {
            await this.init();
        }
        return await new Promise((resolve, reject) => {
            const request = this._getTableInstance(tableName)
                .delete(key);
            request.onsuccess = () => {
                console.log("delete success: TABLE-NAME" + tableName + " ,key " + key)
                resolve("tableName " + tableName + " ,key " + key);
            };
            request.fail = (event) => {
                reject(event);
            };
        });
    },
    clear: async function (tableName) {
        if (!this.support) {
            return this.support;
        }
        //await 必须在async函数中使用
        return await new Promise((resolve, reject) => {
            const request = this._getTableInstance(tableName)
                .clear();
            request.onsuccess = (event) => {
                console.log("clear success: TABLE-NAME", tableName)
                resolve(event.target.result);
            };
            request.fail = (event) => {
                reject(event.target.result);
            };
        });
    },
    flush: async function () {
        if (!this.support) {
            return this.support;
        }
        //await 多个 需要Promise 封装

        for (var i = 0; i < this.config.tableNames.length; i++) {
            var tableName = this.config.tableNames[i].name;
            //这里只有一个await 不起作用
            await this.clear(tableName).then(() => {
                console.log("clear success: TABLE-NAME", tableName);
            }).catch(e => {
                console.log(e);
            });
        }
        console.log("flush all table success");
        return true;
    },
    getAll: async function (tableName) {
        if (!this.support) {
            return this.support;
        }
        if (!this.initSuccess) {
            await this.init();
        }
        return await new Promise((resolve, reject) => {
            const request = this._getTableInstance(tableName)
                .getAll();
            request.onsuccess = (event) => {
                console.log("getAll success: TABLE-NAME", tableName);
                resolve(event.target.result);
            };
            request.fail = (event) => {
                reject(event.target.result);
            };
        });
    },
    getAllKeys: async function (tableName) {
        if (!this.support) {
            return this.support;
        }
        if (!this.initSuccess) {
            await this.init();
        }
        return await new Promise((resolve, reject) => {
            const request = this._getTableInstance(tableName)
                .getAllKeys();
            request.onsuccess = (event) => {
                console.log("getAllKeys success: TABLE-NAME:", tableName + " ,keys:", event.target.result);
                resolve(event.target.result);
            };
            request.fail = (event) => {
                reject(event.target.result);
            };
        });
    },
    count: async function (tableName) {
        if (!this.support) {
            return this.support;
        }
        if (!this.initSuccess) {
            await this.init();
        }
        return await new Promise((resolve, reject) => {
            const request = this._getTableInstance(tableName)
                .count();
            request.onsuccess = (event) => {
                console.log("count success: TABLE-NAME", tableName);
                resolve(event.target.result);
            };
            request.fail = (event) => {
                reject(event.target.result);
            };
        });
    },
    openCursor: async function (tableName) {
        if (!this.support) {
            return this.support;
        }
        if (!this.initSuccess) {
            await this.init();
        }
        return await new Promise((resolve, reject) => {
            const request = this._getTableInstance(tableName)
                .openCursor();
            request.onsuccess = (event) => {
                console.log("openCursor success: TABLE-NAME.", tableName);
                resolve(event.target.result);
            };
            request.fail = (event) => {
                reject(event.target.result);
            };
        });
    },
    openKeyCursor: async function (tableName) {
        if (!this.support) {
            return this.support;
        }
        if (!this.initSuccess) {
            await this.init();
        }
        return await new Promise((resolve, reject) => {
            const request = this._getTableInstance(tableName)
                .openKeyCursor();
            request.onsuccess = (event) => {
                console.log("openKeyCursor success:TABLE-NAME", tableName);
                resolve(event.target.result);
            };
            request.fail = (event) => {
                reject(event.target.result);
            };
        });
    }
};

Sparrow.ajax = {
  tokenConfig: {},
  _objPool: [],
  referWindow: window,
  url: null,
  srcElement: null,
  SUCCESS: "0",
  _bindReadyStateChange: function (objXMLHttp, callback) {
    objXMLHttp.onreadystatechange = function () {
      if (objXMLHttp.readyState !== 4) {
        return;
      }
      if (objXMLHttp.status === 200) {
        if (objXMLHttp.responseText.indexOf('"login":false') !== -1) {
          console.log("login false");
          var config = objXMLHttp.responseText.json();
          document.domain = $.browser.cookie.root_domain;
          if (config.inFrame) {
            window.parent.location.href = config.url;
          } else {
            $.window(config);
          }
          return;
        }
        if (objXMLHttp.responseText.indexOf("Access Denied") !== -1) {
          if (!lang.message.accessDenied)
            lang.message.accessDenied = "Access Denied";
          $.alert(lang.message.accessDenied, "sad");
          return;
        }
        if (callback) {
          callback(objXMLHttp.responseText);
          return;
        }
      }
      if (objXMLHttp.status === 404) {
        console.log("资源未找到");
        return;
      }
      if (objXMLHttp.status === 500) {
        console.log("服务器错误"); //
        return;
      }
      if (objXMLHttp.status === 12031) {
        console.log("服务器未启动"); //
        return;
      }
      console.log(objXMLHttp.status + ":未知错误");
    };
  },
  _getInstance: function () {
    for (var i = 0; i < this._objPool.length; i += 1) {
      if (
        this._objPool[i].readyState === 0 ||
        this._objPool[i].readyState === 4
      ) {
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
      return http_request;
    }
    if (window.ActiveXObject) {
      try {
        http_request = new ActiveXObject("Msxml2.XMLHTTP");
      } catch (e) {
        try {
          http_request = new ActiveXObject("Microsoft.XMLHTTP");
        } catch (e) {}
      }
    } else {
      console.log("浏览器不支持AJAX,请设置浏览器安全级别或更新浏览器");
    }
    return http_request;
  },
  _callback: function (responseText) {
    var result = responseText.json();
    if (result == null) {
      $.message("json parse error " + responseText);
      return;
    }
    if (result.code !== this.ajax.SUCCESS) {
      $.message(result.message);
    }
  },
  gourl: function (url) {
    this.ajax.referWindow.location.href = url;
  },
  _findToken: function (url) {
    var token = null;
    for (var baseUrl in this.tokenConfig) {
      if (url.indexOf(baseUrl) === 0) {
        token = this.tokenConfig[baseUrl];
        break;
      }
    }
    return token;
  },
  req: function (getOrPost, url, callback, postStr, srcElement) {
    if (url.indexOf("http://") === -1) {
      url = $.url.root + url;
    }

    var objXMLHttp = this._getInstance();
    if (objXMLHttp != null) {
      this._bindReadyStateChange(objXMLHttp, callback);
    }
    if (srcElement) {
      this.srcElement = srcElement;
    }
    //https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Statements/with
    //with (objXMLHttp) {
    try {
      objXMLHttp.open(getOrPost, url, true);
      objXMLHttp.setRequestHeader("ajax", "true");
      objXMLHttp.setRequestHeader("pragma", "no-cache");
      objXMLHttp.setRequestHeader("cache-control", "no-cache");
      var token = this._findToken(url);
      if (token) {
        for (var key in token) {
          objXMLHttp.setRequestHeader(key, token[key]());
        }
      }
      if (getOrPost === "GET") {
        objXMLHttp.send(null);
        return;
      }
      //warn: Parameters: Character decoding failed
      if (typeof postStr === "object") {
        objXMLHttp.setRequestHeader("Content-Type", "application/json");
        objXMLHttp.send(JSON.stringify(postStr));
        return;
      }
      if (!postStr) {
        objXMLHttp.send();
        return;
      }
      postStr = postStr.replace(/%/g, "%25");
      objXMLHttp.setRequestHeader(
        "Content-Type",
        "application/x-www-form-urlencoded;charset=utf-8"
      );
      objXMLHttp.send(postStr);
    } catch (e) {
      console.log(e);
    }
  },
  get: function (url, callback) {
    callback = callback ? callback : $.ajax._callback;
    $.ajax.req("GET", url, callback, null, null);
  },
  post: function (url, data, callback) {
    callback = callback ? callback : $.ajax._callback;
    $.ajax.req("POST", url, callback, data, null);
  },
};
var tokenConfig = {};
tokenConfig[$.url.root] = {
  "login-token": function () {
    return Sparrow.browser.getCookie("PERMISSION");
  },
};
Sparrow.ajax.tokenConfig = tokenConfig;

Sparrow.http = {
  post: function (url, data, callback, srcElement) {
    if (typeof data === "function") {
      callback = data;
      data = null;
    }
    $.ajax.req(
      "POST",
      url,
      function (responseText) {
        var result = responseText.json();
        if (result == null) {
          Sparrow.message("json parse error " + responseText);
          return;
        }
        if (result.code != Sparrow.ajax.SUCCESS) {
          $.message(result.message, Sparrow.ajax.srcElement);
          return;
        }
        if (callback) {
          callback(result);
          return;
        }
        Sparrow.message(result.message, Sparrow.ajax.srcElement);
      },
      data,
      srcElement
    );
  },
  get: function (url, callback) {
    Sparrow.ajax.get(url, function (responseText) {
      var result = responseText.json();
      if (result == null) {
        Sparrow.message("json parse error " + responseText);
        return;
      }
      if (result.code != Sparrow.ajax.SUCCESS) {
        Sparrow.message(result.message, Sparrow.ajax.srcElement);
        return;
      }
      if (callback) {
        callback(result);
        return;
      }
      Sparrow.message(result.message, Sparrow.ajax.srcElement);
    });
  },
  syncPost: function (url, data, successCode) {
    return new Promise((resolve, reject) => {
      Sparrow.ajax.post(url, data, function (responseText) {
        var result = responseText.json();
        if (result == null) {
          reject(responseText);
          return;
        }
        if (!successCode) {
          successCode = $.ajax.SUCCESS;
        }
        if (result.code != successCode) {
          reject(result);
          return;
        }
        resolve(result);
      });
    });
  },
  syncGet: function (url, successCode) {
    return new Promise((resolve, reject) => {
      Sparrow.ajax.get(url, function (responseText) {
        var result = responseText.json();
        if (result == null) {
          reject(responseText);
          return;
        }
        if (!successCode) {
          successCode = $.ajax.SUCCESS;
        }
        if (result.code != successCode) {
          reject(result);
          return;
        }
        resolve(result);
      });
    });
  },
};

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
        if (typeof (parentLevel) == "undefined") {
            parentLevel = 1;
        }
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
        if (!validate.allowNull&&srcElement.value.search(/^[\u4e00-\u9fa5]+/) === -1) {
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
    },
    init:function (config){
        for (var o in config) {
           var ctrl=$("#"+o);
           var validation=config[o];
           var event= validation.event;
           ctrl.bind("onfocus",function (){
                $.v.showMessage(config,this);
           });
           switch (event){
               case "UserNameRuleValidator":
                   ctrl.bind("onblur",function (){
                       $.v.isUserNameRule(config,this)
                   });
                   break;
               case "AllowOptionsValidator":
                   ctrl.bind("onblur",function (){
                       $.v.isNull(config,this);
                   });
                   break;
               case "DigitalValidator":
                   ctrl.bind("onblur",function (){
                       $.v.isDigital(config,this);
                   });
                   break;
               case "EmailValidator":
                   ctrl.bind("onblur",function (){
                       $.v.isEmail(config,this);
                   });
                   break;
               case "NullValidator":
                   ctrl.bind("onblur",function (){
                       $.v.isNull(config,this);
                   });
                   break;
               case "EqualValidator":
                   ctrl.bind("onblur",function (){
                       $.v.isEqual(config,this);
                   });
                   break;
               case "IdCardValidator":
                   ctrl.bind("onblur",function (){
                       $.v.isIdCard(config,this);
                   });
                   break;
               case "MobileValidator":
                   ctrl.bind("onblur",function (){
                       $.v.isMobile(config,this);
                   });
                   break;
               case "TelValidator":
                   ctrl.bind("onblur",function (){
                       $.v.isTel(config,this);
                   });
                   break;
               case "ChineseCharactersValidator":
                   ctrl.bind("onblur",function (){
                       $.v.isChineseCharacters(config,this);
                   });
                   break;
               case "AllowInputCharLengthValidator":
                   var innerInfo=validation
                   $("#"+innerInfo.maxCharLengthControlId).html(innerInfo.maxAllowCharLength);
                   ctrl.bind("onblur",function (){
                       $.v.allowInputOption(config,this);
                   });

                   ctrl.bind("onkeyup",function (){
                       $.v.updateTxtCount(this,innerInfo.allowCharLengthShowControlId,500);
                   });
           }
        }
    }
};
Sparrow.page = {
	toTargetPage: function (pageCount, pageFormat, srcElement) {
		var consumerPageIndex = parseInt($('consumerPageIndex').value);
		var currentPageIndex = parseInt($('spanCurrentPageIndex').innerHTML
			.trim());
		if (consumerPageIndex <= 0 || consumerPageIndex > pageCount) {
			$.message('超出页码范围', srcElement);
			return;
		}
		if (consumerPageIndex === currentPageIndex) {
			$.message('当前页即是目标页', srcElement);
			return;
		}
		window.location.href = pageFormat.replace("$pageIndex", consumerPageIndex);
	},
	consumerAction: null,
	submit: function (pageIndex, formIndex) {
		$("currentPageIndex").value = pageIndex;
		window.location.href = "#top";
		if (this.consumerAction != null) {
			this.consumerAction(pageIndex);
			return;
		}
		$.submit(null, formIndex);
	},
	next: function () {
		var elementArray = $("divPage").getElementsByTagName("a");
		var nextLink = null;
		for (var i = 0; i < elementArray.length; i++) {
			if (elementArray[i].innerHTML === "下一页") {
				nextLink = elementArray[i].href;
				break;
			}
		}
		if ($.isNullOrEmpty(nextLink)) {
			alert("亲，您已经翻到最后了哟");
			return
		}
		window.location.href = nextLink;
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
Sparrow.jsonKeys = function (json) {
    var jsonKeyArray = [];
    if (!json) {
        return jsonKeyArray;
    }
    //{}.prototype会多一个this该方法本身
    //区分数组和json
    if (typeof (json.length) === "undefined") {
        for (var key in json) {
            jsonKeyArray.push(key);
        }
        return jsonKeyArray;
    }
    return json;
};
Sparrow.clearForm = function (validateJson) {
    var inputArray = $.jsonKeys(validateJson);
    for (var i = 0; i < inputArray.length; i++) {
        var input = $(inputArray[i]);
        if (input == null) {
            console.log(inputArray[i] + " not exist!")
            continue;
        }
        var defaultValue = "";
        if (validateJson[inputArray[i]]) defaultValue = validateJson[inputArray[i]].defaultValue;
        input.value = $.toString("", defaultValue);
    }
};
Sparrow.getFormData = function (inputIdArray) {
    //{}.prototype会多一个this该方法本身
    var data = [];
    var inputArray = $.jsonKeys(inputIdArray);
    for (var i = 0; i < inputArray.length; i++) {
        var input = $(inputArray[i]);
        if (input == null) {
            console.log(inputArray[i] + " not exist!")
            continue;
        }
        if (!$.isNullOrEmpty(input.name)) {
            var value = input.value;
            //todo 加判断其他控件
            data.push(input.name + "=" + value);
        }
    }
    return data.join("&");
};
Sparrow.waitRedirect = function (timerId, period) {
    var queryString = $("#hdnQueryString").value();
    var timer = $("#" + timerId);
    if (timer == null || timer.s == null) return;
    if (!period) period = 1000;
    var interval = window.setInterval(function () {
        var time = parseInt(timer.html(), 10);
        if (time-- === 0) {
            window.location.target = "_self";
            window.location.href = queryString;
            window.clearInterval(interval);
        } else {
            timer.html(time);
        }
    }, period);
};
Sparrow.format = function (txt, compress) {
    /* 格式化JSON源码(对象转换为JSON文本) */
    var indentChar = '    ';

    if (typeof txt === 'string' && /^\s*$/.test(txt)) {
        alert('数据为空,无法格式化! ');
        return;
    }
    var data = null;
    if (typeof txt === 'object') {
        data = txt;
    } else {
        try {
            data = eval('(' + txt + ')');
        } catch (e) {
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

Sparrow.prototype.format = function (html, args) {
    if (!this.s) {
        return;
    }
    if ($(html) != null) {
        html = $("#" + html).html();
    }
    this.s.innerHTML = html.format(args);
};

Sparrow.prototype.value = function (value) {
    if (!this.s) {
        return;
    }
    if (value === undefined || value === null) {
        return this.s.value;
    }
    this.s.value = value;
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
Sparrow.prototype.source = function () {
    return this.s;
};

Sparrow.prototype.class = function (className) {
    if (className) {
        this.s.className = className;
        return;
    }
    return this.s.className;
};

Sparrow.prototype.css = function (attribute, value, add) {
    if (Math.abs(value) < 1) {
        value = value < 0 ? -1 : 1;
    }

    if (attribute === "opacity") {
        value = Math.ceil(value);
        if (add) {
            value = parseInt(this.opacity(), 10) + value;
        }
        this.opacity(value);
    } else {
        var command = null;
        if (add) {
            command = 'var o=parseInt($("' + this.s.id + '").style.'
                + attribute + ',10);';
            command += '$("' + this.s.id + '").style.' + attribute
                + '=(o+' + value + ')+"px";';
        } else {
            command = '$("' + this.s.id + '").style.' + attribute + '="' + value + '"';
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
    var weight = this.s.offsetWidth;
    if (!left) {
        left = this.getAbsoluteLeft();
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
    this.s.style.width = weight + "px";
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
        if (e.keyCode !== 13) {
            return;
        }
        if (typeof (handle) === "string") {
            $(handle).onclick(e);
            return;
        }
        handle();
    };
};
var _hmt = _hmt || [];
(function () {
    var hm = document.createElement("script");
    hm.src = "https://hm.baidu.com/hm.js?11daae2d559a82e0e8bd4872ad217164";
    var s = document.getElementsByTagName("script")[0];
    s.parentNode.insertBefore(hm, s);
})();

/*---------------------------------------------JGridView全选和单选---------------------------------------------*/
Sparrow.gridView = {
    keyType: "int",// string
    id: "grvManageList",
    resultCtrlId: "hdnGridResult",
    getTable: function () {
        return $(this.id);
    },
    init: function () {
        var hdnGridResult = $("#" + this.resultCtrlId);
        if (hdnGridResult == null) {
            return;
        }
        if (!$.isNullOrEmpty(hdnGridResult.attr("gridViewId"))) {
            this.id = hdnGridResult.attr("gridViewId");
        }
        if (!$.isNullOrEmpty(hdnGridResult.attr("keyType"))) {
            this.keyType = hdnGridResult.attr("keyType");
        }
    },
    getCellIndex: function (checkBox) {
        return checkBox.parentNode.cellIndex;
    },
    allCheckClick: function (allCheckBox) {
        var checkBoxList = $("&" + this.id);
        for (var i = 0; i < checkBoxList.length; i += 1) {
            var checkBox = checkBoxList[i];
            checkBox.checked = allCheckBox.checked;
        }
    },
    recordCheckClick: function (checkBox, allCheckBox) {
        if (checkBox.checked === false) {
            $(allCheckBox).checked = false;
            return;
        }
        var isAllCheck = true;
        var checkBoxList = $("&" + this.id);
        for (var i = 0; i < checkBoxList.length; i++) {
            if (checkBoxList[i].checked === false) {
                isAllCheck = false;
            }
        }
        if (isAllCheck) {
            $(allCheckBox).checked = true;
        }
    },
    mustSelect: function (confirmMessage) {
        var selectedId = [];
        // var gridViewRowCount=this.getTable().rows.length;
        var checkBoxList = $("&" + this.id);
        var selectId = null;
        for (var i = 0; i < checkBoxList.length; i += 1) {
            var checkBox = checkBoxList[i];
            if (checkBox.tagName.toLowerCase() === "input"
                && checkBox.checked) {
                selectId = checkBox.id;
                if (this.keyType === "string") {
                    selectedId.push("'" + selectId + "'");
                } else {
                    selectedId.push(selectId);
                }
            }
        }
        if (selectedId.length === 0) {
            if (lang.message.noSelectRecord) {
                $.message(lang.message.noSelectRecord);
            } else {
                $.message("please define 'lang.message.noSelectRecord'!");
            }
            return false;
        }
        if (selectedId.length === 1) {
            selectedId.pop();
            selectedId.push(selectId);
        }
        if (!confirmMessage) {
            return selectedId;
        }
        if (window.confirm(confirmMessage)) {
            return selectedId;
        }
        return false;
    },
    onlyCheckedOne: function (confirmMessage) {
        var checkCount = 0;
        var selectedId= null;
        var checkBoxList = $("name." + this.id);
        for (var i = 1; i < checkBoxList.length; i++) {
            var checkBox = checkBoxList[i];
            if (checkBox.checked) {
                checkCount += 1;
                selectedId = checkBox.id;
            }
        }

        if (checkCount === 0) {
            if (lang.message.noSelectRecord) {
                $.message(lang.message.noSelectRecord);
            } else {
                $.message("please define lang.message.noSelectRecord!");
            }
            return false;
        }
        if (checkCount !== 1) {
            if (lang.message.onlySelectOneRecord) {
                $.message(lang.message.onlySelectOneRecord);
            } else {
                $.message("please define lang.message.onlySelectOneRecord");
            }
            return false;
        }
        if (window.confirm(confirmMessage)) {
            return selectedId;
        }
        return true;
    },
    submit: function (postUrl, confirmMessage, isOnlyOne) {
        var result = isOnlyOne ? this.onlyCheckedOne(confirmMessage) : this
            .mustSelect(confirmMessage);
        if (!result) {
            return;
        }
        $(this.resultCtrlId).value = result;
        if (postUrl === "return") {
            return true;
        }
        $.submit(postUrl);
    }
};
Sparrow.table = function (id) {
    if (!(this instanceof Sparrow.table)) {
        return new Sparrow.table(src);
    }
    // Event object
    if (id) {
        this.id = id;
        this.t = $(id);
        this.body = t.getElementsByTagName("tbody")[0];
        this.tr = [];
    }
};
Sparrow.table.prototype = {
    _initCell: function (cell, i, j) {
        cell.style.cssText = this.tr[i].td[j].cssText;
        cell.className = this.tr[i].td[j].className;
        cell.align = this.tr[i].td[j].align;
        cell.innerHTML = this.tr[i].td[j].innerHTML;
        if (this.tr[i].td[j].colspan) {
            cell.setAttribute("colspan", this.tr[i].td[j].colspan);
        }
    },
    _initRow: function (row, i) {
        row.style.cssText = table.tr[i].cssText;
        if (table.tr[i].className && table.tr[i].className !== "") {
            row.className = table.tr[i].className;
        }
        for (var j = 0; j < this.tr[i].td.length; j++) {
            var cell = row.insertCell(-1);
            this._initCell(cell, i, j);
        }
    },
    init: function () {
        for (var i = 0; i < this.tr.length; i++) {
            this.body.appendChild(this._initRow(i));
        }
        $(this.containerId).appendChild(this.t);
    },
    appendRow: function () {
        for (var i = 0; i < this.tr.length; i++) {
            var row = this.body.insertRow(-1);
            this._initRow(row, i);
        }
    },
    insertRow: function (rowIndex) {
        for (var i = 0; i < this.tr.length; i++) {
            var row = this.body.insertRow(rowIndex);
            this._initRow(row, i);
        }
    },
    updateRow: function (rowIndex) {
        for (var i = 0; i < this.tr[0].td.length; i++) {
            if (this.tr[0].td[i].innerHTML) {
                this.body.rows[rowIndex].cells[i].innerHTML = this.tr[0].td[i].innerHTML;
            }
        }
    },
    removeRow: function (rowIndex) {
        this.body.deleteRow(rowIndex);
    }
};
//document.domain=$.browser.cookie.root_domain; 解决跨域
Sparrow.file = {
  // 是否显示上传进度
  isShowProgress: true,
  // 等待
  wit: null,
  // 客户端文件名
  clientFileName: null,
  // 上传框架id editorId.path-key 非editor id为null e.g null.forum 表示path-key为forum 的无editor 上传组件
  uploadFrameId: null,
  /**
   * 第一次加载的默认方法
   * @param progress UploadingProgress 当前上传进度
   * @param editor 当前富文本编辑器
   * @param size 后台的FileConfig 可以读到图片的尺寸
   */
  uploadCallBack: function (progress, editor, size) {
    console.info(progress);
    console.info(size);
    this.clearStatus();
  },
  // 如果图片很小，不会通过getStatus方法，则在回调时主动清除上传状态
  clearStatus: function () {
    window.clearInterval(this.wit);
    window.setTimeout(function () {
      var divStatus = $("divStatus");
      if ($.file.isShowProgress && divStatus != null) {
        document.body.removeChild(divStatus);
      }
    }, 1000);
  },
  // 文件序列号
  fileSerialNumber: null,
  /**
   *    文件上传前的验证方法由 input file 的onchange响应
   *    file控件的onchange方法
   *    file.uploadDelegate(this,pathKey);
   *    upload frame的id与editorId_pathKey要保持一致
   *    path key 对应后台配置的上传策略
   * @param f 当前input type=file 组件
   * @param key 当前文件上传 pathKey 由后台配置
   * @param editor 当前富文件编辑器
   */
  validateUploadFile: function (srcElement, key, editor) {
    var clientFileName = $.file.getFileName(srcElement.value);
    $.file.clientFileName = clientFileName;
    var validFileType = ["jpg", "jpeg", "gif", "png"];
    var validResult = $.file.checkFileType(
      clientFileName,
      validFileType,
      "errorImgForumIco"
    );
    if (!validResult) {
      return;
    }
    $.file.uploadDelegate(key, editor);
  },
  callbackValidate: function (uploadProgress) {
    if ($.isNullOrEmpty(uploadProgress.error)) {
      return true;
    }
    $.alert(uploadProgress.error, "sad", "上传出错");
    window.location.href = window.location.href;
  },
  // 文件上传成功后的重置方法
  // 因为文件上传完毕之后需要重置上传序列号。所以一定要手动设置该方法
  reset: function () {
    var uploadFrame = $(this.uploadFrameId);
    var tempSrc = uploadFrame.src;
    uploadFrame.src = "about:blank";
    uploadFrame.src = tempSrc;
  },
  getUploadFrame: function () {
    return this.uploadFrameId ? $(this.uploadFrameId) : $("fileUpload");
  },
  // 获取上传的input type="file"控件
  getUploadFile: function (frame) {
    if (!frame) {
      frame = this.getUploadFrame();
    }
    return frame.contentWindow.document.getElementById("file_upload");
  },
  getUploadFileInfo: function (frame) {
    if (!frame) {
      frame = this.getUploadFrame();
    }
    return frame.contentWindow.document.getElementById("fileInfo");
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
    if (!obj) {
      return "";
    }
    if ($.browser.ie) {
      obj.select();
      var txt = document.frames[0].document.selection.createRange().text;
      document.frames[0].document.selection.empty();
      return txt;
    }
    if ($.browser.firefox) {
      if (obj.files) {
        return obj.files.item(0).getAsDataURL();
      }
      return obj.value;
    }
    return obj.value;
  },
  // 获文件扩展名
  getExtension: function (fileName) {
    fileName = $.browser.getUrlWithoutParameter(fileName);
    return fileName.substring(fileName.lastIndexOf(".")).toLocaleLowerCase();
  },
  // 获取文件名
  getFileName: function (fileName) {
    fileName = $.browser.getUrlWithoutParameter(fileName);
    if (fileName.indexOf("\\") !== -1) {
      return fileName.substring(fileName.lastIndexOf("\\") + 1);
    }
    if (fileName.indexOf("/") !== -1) {
      return fileName.substring(fileName.lastIndexOf("/") + 1);
    }
    return fileName;
  },
  // 验证文件类型
  checkFileType: function (fileName, rightExtension, errorCtrl) {
    //这里封装跨域可以复用，因为
    var fileExtension = this.getExtension(fileName);
    var result = false;
    for (var i = 0; i < rightExtension.length; i += 1) {
      var extension = rightExtension[i].toLocaleLowerCase();
      var extensionWithDot = "." + rightExtension[i].toLocaleLowerCase();
      if (extension === fileExtension || extensionWithDot === fileExtension) {
        result = true;
        break;
      }
    }
    if (result) {
      $.v.ok(errorCtrl);
      return result;
    }
    var errorLabel = $("#" + errorCtrl);
    if (errorLabel != null && errorLabel.source() != null) {
      errorLabel.class("error");
      errorLabel.html("!只支持:" + rightExtension + "格式");
    }
    $.message("文件格式不正确，只支持以下格式:\n" + rightExtension);
    return result;
  },
  // 如果editor为null则表示非编辑器控件
  uploadDelegate: function (key, editor, srcElement) {
    // 如果显示状态并且状态控件已经显示则说明已经有文件正在上传中...
    if (this.isShowProgress !== false && $("divStatus")) {
      $.alert(this.clientFileName + "正在上传中,请稍侯...", "sad");
      return false;
    }
    this.uploadFrameId = (editor ? editor.obj : "null") + "." + key;
    var uploadFrame = $(this.uploadFrameId);
    var fileInfo = this.getUploadFileInfo(uploadFrame).value;
    var fileInfoArray = fileInfo.split(".");
    // 设置当前文件的序列号
    this.setFileSerialNumber(fileInfoArray[2]);
    // 如果要显示状态
    if ($.file.isShowProgress !== false) {
      // 如果状态控件不存在则创建
      if (!$("divStatus")) {
        var sparrowUploadFrame = $(uploadFrame);
        var divStatus = $("+div");
        divStatus.s.id = "divStatus";
        divStatus.s.style.cssText =
          "width:260px;height:100px;position:absolute;color:#ffffff;background:#000000;font-size:10pt;border:#ccc 1px solid;text-align:left;";
        divStatus.html("服务器正在加载文件信息...");
        document.body.appendChild(divStatus.s);
        divStatus.s.style.top = sparrowUploadFrame.getAbsoluteTop() - 10 + "px";
        divStatus.s.style.left = sparrowUploadFrame.getAbsoluteLeft() + "px";
        divStatus.opacity(90);
      }
      // 设置状态跟踪
      if (typeof editor === "undefined" || editor === null) {
        // 非编辑器控件
        this.wit = window.setInterval(function () {
          $.file.getStatus();
        }, 1000);
      } else {
        this.wit = window.setInterval(function () {
          $.file.getStatus();
        }, 1000);
      }
    }
    // 提交
    uploadFrame.contentWindow.document.forms[0].submit();
  },
  //只负责显示进度
  progressCallback: function (uploadProgress) {
    if (uploadProgress == null) {
      return;
    }
    if (uploadProgress.status === "loading") {
      return;
    }

    if (!this.callbackValidate(uploadProgress)) {
      return;
    }
    // 正常显示状态
    var statusString = [];
    var status =
      Math.ceil(
        (parseFloat(uploadProgress.readLength) /
          parseFloat(uploadProgress.contentLength)) *
          1000000
      ) /
        10000 +
      "%";

    statusString.push(
      "正在上传文件<br/><span class='highlight'>《" +
        $.file.getFileName($.file.clientFileName) +
        "》</span><br/>"
    );
    statusString.push(
      "文件大小:" + uploadProgress.humanReadableContentLength + "<br/>"
    );
    statusString.push(
      "上传大小:" + uploadProgress.humanReadableReadLength + "<br/>"
    );
    statusString.push("上传进度:" + status);
    $("#divStatus", false).html(statusString.toString());
    if (status === "100%") {
      $.file.clearStatus();
    }
  },
  getStatus: function () {
    // 根据当前文件的序列号,实时获取当前文件的上传状态
    $(
      "jsonp",
      $.url.upload +
        "/file-upload?file-serial-number=" +
        this.getFileSerialNumber() +
        "&t=" +
        Math.random() +
        "&callback=progressCallback",
      "uploadProgress"
    );
  },
  /**
   * @param key path-key
   * @param pathKeySuffixPair {path-key:suffix}
   */
  initImageUploadEvent: function (key, pathKeySuffixPair) {
    if (!$.url.upload) {
      console.error(
        "please config $.url.upload the default config is $.url.root [" +
          $.url.root +
          "]"
      );
      $.url.upload = $.url.root;
    }
    var fileFrame = $("null." + key);
    if (fileFrame == null) {
      return;
    }
    document.domain = $.browser.cookie.root_domain;
    if (!pathKeySuffixPair) pathKeySuffixPair = "Cover";
    fileFrame.src =
      $.url.upload + "/file-upload?path-key=" + key + "&t=" + Math.random();
    $.file.validateUploadFile = function (f, key, editor) {
      $.file.clientFileName = f.value;

      var suffix = pathKeySuffixPair;
      if (typeof pathKeySuffixPair === "object") {
        suffix = pathKeySuffixPair[key];
      }
      if (
        !$.file.checkFileType(
          $.file.getFileName(f.value),
          ["jpg", "jpeg", "gif", "png"],
          "error" + suffix
        )
      ) {
        return;
      }
      $.file.uploadCallBack = function (uploadingProgress) {
        $.file.clearStatus();
        if (!uploadingProgress.fileUrl) {
          return;
        }
        var divContainer = $("#div" + suffix);
        if (divContainer != null) {
          divContainer.html(
            "<a href='" +
              uploadingProgress.fileUrl +
              "' target='_blank'><img src='" +
              uploadingProgress.fileUrl +
              "'/></a>"
          );
        }
        var imgPreview = $("img" + suffix);
        if (imgPreview != null) {
          imgPreview.src = uploadingProgress.fileUrl;
        }
        var hdnWebUrl = $("#hdn" + suffix);
        if (hdnWebUrl != null) {
          hdnWebUrl.value(uploadingProgress.fileUrl);
        }
        if ($.file.imagePreviewCallback) {
          $.file.imagePreviewCallback(uploadingProgress.fileUrl);
        }
        var errorPrompt = $("#error" + suffix);
        if (errorPrompt != null && errorPrompt.s != null) {
          errorPrompt.class("prompt");
          errorPrompt.html("");
        }
      };
      $.file.uploadDelegate(key, editor);
    };
  },
};

Sparrow.event = function (e) {
  if (!(this instanceof Sparrow.event)) {
    return new Sparrow.event(e);
  }
  if (e) {
    this.originalEvent = e;
    this.type = e.type;
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
    window.event
      ? (window.event.cancelBubble = true)
      : this.e.stopPropagation();
  },
  preventDefault: function () {
    if (this.e.preventDefault) {
      this.e.preventDefault();
    }
    if (window.event) window.event.returnValue = false;
  },
  getAbsoluteTop: function () {
    return this.e.pageY
      ? this.e.pageY
      : this.e.clientY
      ? this.e.clientY +
        (document.documentElement.scrollTop
          ? document.documentElement.scrollTop
          : document.body.scrollTop)
      : null;
  },
  getAbsoluteLeft: function () {
    return this.e.pageX
      ? this.e.pageX
      : this.e.clientX
      ? this.e.clientX +
        (document.documentElement.scrollLeft
          ? document.documentElement.scrollLeft
          : document.body.scrollLeft)
      : null;
  },
  move: function () {
    if (this.dragapproved && this.srcElement != null) {
      this.srcElement.style.left = this.srcLeftPos + this.clientX - this.eventX;
      this.srcElement.style.top = this.srcRightPos + this.clientY - this.eventY;
      return;
    }
    return true;
  },
  move_end: function () {
    this.dragapproved = false;
    this.srcElement.onmousemove = null;
  },
  drags: function () {
    try {
      if (this.srcElement.className.indexOf("drag") !== -1) {
        if (this.srcElement.className === "drag-p") {
          this.srcElement = this.srcElement.parentNode;
        } else if (this.srcElement.className === "drag-pp") {
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
    } catch (err) {}
  },
};

Sparrow.prototype.progressbar = function (callback, config) {
    var bar = $("+div");
    document.body.appendChild(bar.s);
    if (config.style) {
        bar.s.style.cssText = config.style;
    }
    var progress = $("+div");
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
Sparrow.treeNode = function (id,
                             pid,
                             name,
                             url,
                             title,
                             target,
                             childCount,
                             showCtrl,
                             businessEntity,
                             icon) {

    this.id = id;
    this.pid = pid;
    this.name = name;
    this.url = url;
    this.title = title;
    this.target = target;
    this.showCtrl = showCtrl ? showCtrl : true;
    this.businessEntity = businessEntity;
    this.childCount = childCount ? childCount : 0;
    this.icon = icon;
    this.iconOpen = icon;
    this._isOpened = false;
    this._isSelected = false;
    this._lastOfSameLevel = false;
    this._addressIndex = 0;
    this._parentNode;
    //延迟加载时，由后台提供
    this._hasChild = childCount > 0;
};


Sparrow.tree = function (objName, parentName) {
    this.config = {
        target: "_self",
        useFolderLinks: true,//是否显示文件夹
        useSelection: true,//是否支持选中
        useCookies: true,//是否支持cookie 记忆
        useLines: true,//是否使用链接线
        useIcons: true,//是否使用icon 图标
        useRootIcon: true, //是否显示root 图标
        usePlusMinusIcons: true,//是否使用+-号图标
        //class name 包含tree-id
        useTreeIdInNodeClass: false,
        useLevelInNodeClass: false,
        useRadio: false,
        useCheckbox: false,//是否显示复选框
        treeNodeClass: null,//节点class
        //根据旧权构建
        reBuildTree: null,//是否支持旧树重建
        //重新查库构建
        loadFloatTree: null,//是否支持浮动树构建
        floatTreeId: null,//浮动树id
        descHiddenId: null,//选中后ID显示对象
        descTextBoxId: null,//选中后文本显示对象
        validate: null,//自定义验证事件
        validateConfig: null,//自定义验证config
        isdelay: false,
        isclientDelay: false,
        closeSameLevel: false,//自动关闭同级节点
        inOrder: false,//
        showRootIco: true,//是否显示根icon
        showOrder: false,//是否显示排序
        orderURL: null,//排序url
        treeFrameId: null,//树显示的div
        loadingString: "londing .....",
        imageDir: $.url.resource + "/images/treeimg",
        // prompt:"1系统菜单 2系统页面 3控件"
        RESOURCE_TYPE: {
            "1": "[系统菜单]",
            "2": "[系统页面]",
            "3": "[控件事件]"
        }
    };
    this.icon = {
        root: this.config.imageDir + '/base.gif',
        folder: this.config.imageDir + '/folder.gif',
        folderOpen: this.config.imageDir + '/folderopen.gif',
        node: this.config.imageDir + '/page.gif',
        nolineNode: this.config.imageDir + '/nolinepage.gif',
        empty: this.config.imageDir + '/empty.gif',
        line: this.config.imageDir + '/line.gif',
        join: this.config.imageDir + '/join.gif',
        joinBottom: this.config.imageDir + '/joinbottom.gif',
        plus: this.config.imageDir + '/plus.gif',
        plusBottom: this.config.imageDir + '/plusbottom.gif',
        minus: this.config.imageDir + '/minus.gif',
        minusBottom: this.config.imageDir + '/minusbottom.gif',
        nlPlus: this.config.imageDir + '/nolines_plus.gif',
        nlMinus: this.config.imageDir + '/nolines_minus.gif'
    };
    this.interval = null;
    this.currentSelectId = {};
    this.floatTreeFrameId = null;// read only
    this.obj = objName;
    this.parentName = parentName;
    this.fullObjName = parentName ? (parentName + "." + objName) : objName;
    this.aNodes = [];
    this.aIndent = [];
    this.root = new Sparrow.treeNode(-1);
    this.selectedNodeIndex = null;
    this.selectedFound = false;
    this.completed = false;
};
Sparrow.tree.prototype = {
    resetIcon: function () {
        this.icon.root = this.config.imageDir + '/base.gif';
        this.icon.nolineroot = this.config.imageDir + '/nolinebase.gif';
        this.icon.folder = this.config.imageDir + '/folder.gif';
        this.icon.folderOpen = this.config.imageDir + '/folderopen.gif';
        this.icon.node = this.config.imageDir + '/page.gif';
        this.icon.nolineNode = this.config.imageDir + '/nolinepage.gif';
        this.icon.empty = this.config.imageDir + '/empty.gif';
        this.icon.line = this.config.imageDir + '/line.gif';
        this.icon.join = this.config.imageDir + '/join.gif';
        this.icon.joinBottom = this.config.imageDir + '/joinbottom.gif';
        this.icon.plus = this.config.imageDir + '/plus.gif';
        this.icon.plusBottom = this.config.imageDir + '/plusbottom.gif';
        this.icon.minus = this.config.imageDir + '/minus.gif';
        this.icon.minusBottom = this.config.imageDir + '/minusbottom.gif';
        this.icon.nlPlus = this.config.imageDir + '/nolines_plus.gif';
        this.icon.nlMinus = this.config.imageDir + '/nolines_minus.gif';
    },
    addBusinessEntity: function (id, pid, name, url, title, businessEntity) {
        this.aNodes[this.aNodes.length] = new Sparrow.treeNode(id, pid, name, url, title,
            "_self", undefined, true, businessEntity);
    },
    add: function (id, pid, name, url, title, target, childCount,
                   showCtrl, businessEntity, icon) {
        this.aNodes[this.aNodes.length] = new Sparrow.treeNode(id, pid, name, url, title,
            target, childCount, showCtrl, businessEntity, icon);
    },
    openAll: function () {
        this.oAll(true);
    },
    closeAll: function () {
        this.oAll(false);
    },
    toString: function () {
        var str = '<div class="sparrow-tree">';
        if (document.getElementById) {
            if (this.config.useCookies) {
                this.selectedNodeIndex = this.getSelectedAi();
            }
            str += this.addNode(this.root);
        } else {
            str += 'Browser not supported.</div>';
        }
        if (!this.selectedFound) {
            this.selectedNodeIndex = null;
        }
        this.completed = true;
        return str;
    },
    deleteClick: function () {
        alert('deleteClick not defined!');
    },
    removeNode: function (currentNode) {
        if (!currentNode) {
            currentNode = this.aNodes[this.getSelectedAi()];
        }
        this.aNodes.splice(currentNode._addressIndex, 1);
        this.clearSelectedNode();
        $(this.config.treeFrameId).innerHTML = this.toString();
        this.clearFloatFrame();
    },
    appendNode: function (newNode) {
        this.aNodes.push(newNode);
        $(this.config.treeFrameId).innerHTML = this.toString();
    },
    updateNode: function (newNode, currentNode) {
        if (!currentNode) {
            currentNode = this.aNodes[this.getSelectedAi()];
        }
        if (currentNode.pid !== newNode.pid) {
            this.removeNode(currentNode);
            this.appendNode(newNode);
        } else {
            this.aNodes[this.getSelectedAi()] = newNode;
        }
        $(this.config.treeFrameId).innerHTML = this.toString();
    },
    showOrder: function (e) {
        if (!this.config.showOrder) {
            return;
        }
        var orderDiv = $("orderDiv");
        if (orderDiv) {
            document.body.removeChild(orderDiv);
        }
        var srcObject = $.event(e).srcElement;
        //remove old label,because it's in container cache !!important
        //$.remove("#"+srcObject.id);
        var sparrowElement = $(srcObject, false);
        var addressIndex = srcObject.id.substring(this.obj.length + 1);
        var currentNode = this.aNodes[addressIndex];
        if (currentNode.pid === -1) {
            this.clearFloatFrame();
            return;
        }

        orderDiv = $("+div.orderDiv");
        document.body.appendChild(orderDiv.s);
        orderDiv.class("pure-menu pure-order-menu");
        orderDiv.css("position", "absolute");
        orderDiv.html(('<span class="pure-menu-heading pure-menu-link pure-order-menu-heading" onclick="{0}.delete_click({1});{0}.clearFloatFrame();" >删除</span>'
            + '<ul class="pure-menu-list">'
            + '<li class="pure-menu-item"><a href="#" class="pure-menu-link">当前第<span id="currentOrderNo"></span>位</a></li>'
            + '<li class="pure-menu-item pure-menu-has-children">'
            + '<a  id="hyperJump" class="pure-menu-link">你可以跳转至</a>'
            + ' <ul id="ulChildrenList" class="pure-menu-children"></ul></li></ul>').format(this.fullObjName, addressIndex));

        orderDiv.bind("onclick", function (e) {
            $.event(e).cancelBubble();
        });
        $("#hyperJump", false).bind("onmouseover", function () {
            $("#ulChildrenList", false).css("display", "block");
        });
        orderDiv.css("left", (sparrowElement.getAbsoluteLeft() + srcObject.offsetWidth) + "px");
        orderDiv.css("top", (sparrowElement.getAbsoluteTop() + srcObject.offsetHeight) + "px");

        var pNode = currentNode._parentNode;
        var index = 0;
        var currentIndex = 0;
        var listHTML = "";
        for (var i = 0; i < this.aNodes.length; i++) {
            if (this.aNodes[i].pid !== pNode.id) {
                continue;
            }
            if (this.aNodes[i].id === currentNode.id) {
                currentIndex = ++index;
                continue;
            }
            index++;
            listHTML += '<li class="pure-menu-item" onclick="{0}.order({1},{2})"><a href="#" class="pure-menu-link">第<span>{2}</span>位</a></li>'.format(this.fullObjName, addressIndex, index);
            if (this.aNodes[i]._lastOfSameLevel) {
                break;
            }
        }
        //without cache
        $("#ulChildrenList", false).html(listHTML);
        $("#currentOrderNo", false).html(currentIndex);
    },
    order: function (srcAddressIndex, sort) {
        var srcNode = this.aNodes[srcAddressIndex];
        var data = "id=" + srcNode.id + "&target=" + sort;
        var tree = this;
        var nodes = this.aNodes;
        $.ajax.json(this.config.orderURL, data, function (json) {
            srcNode = nodes[srcAddressIndex];
            var destNode = null;
            var srcParentNode = srcNode._parentNode;
            var childNo = 0;
            var destIndex = 0;
            //find dest node
            for (var i = 0; i < nodes.length; i++) {
                if (nodes[i].pid !== srcParentNode.id) {
                    continue;
                }
                childNo++;
                if (childNo === sort) {
                    destIndex = i;
                    destNode = nodes[i];
                    break;
                }
            }
            //delete src index
            nodes.splice(srcAddressIndex, 1);
            //insert new at dest insert
            nodes.splice(destIndex, 0, srcNode);
            $("#" + tree.config.treeFrameId).html(tree);
            tree.clearFloatFrame();
        });
    }, addNode: function (pNode) {
        var str = '';
        var n = 0;
        //如果数据有序，则不需要从头遍历
        if (this.config.inOrder) {
            n = pNode._addressIndex;
        }
        for (n; n < this.aNodes.length; n++) {
            var cn = this.aNodes[n];
            if (!cn || cn.pid !== pNode.id) {
                continue;
            }
            cn._parentNode = pNode;
            pNode.childCount++;
            cn._addressIndex = n;
            this.setCS(cn);
            if (!cn.target && this.config.target) {
                cn.target = this.config.target;
            }
            if (cn._hasChild && !cn._io && this.config.useCookies) {
                cn._isOpened = this.isOpen(cn.id);
            }
            if (!this.config.useFolderLinks && cn._hasChild) {
                cn.url = null;
            }
            if (this.config.useSelection && cn.id === this.getSelectedId()) {
                cn._isSelected = true;
                this.selectedNodeIndex = n;
                this.selectedFound = true;
            }
            // 因node中调用addNode()函数则为递归。
            if (this.config.showRootIco) {
                str += this.node(cn, n);
            } else {
                this.node(cn, n);
            }
            // 如果当前节点是当前父节点的最后一个儿子节点则退出遁环
            if (cn._lastOfSameLevel)
                break;
        }
        return str;
    }, select: function (srcElement, className) {
        if (this.current != null) {
            this.current.className = $(this.current).attr("old");
        }
        $(srcElement).attr("old", srcElement.className);
        srcElement.className = "iTreeNodeSelect" + className;
        this.current = srcElement;
    }, node: function (node, nodeId) {
        // 获得缩进字符串
        var classNum = "";
        if (this.config.treeNodeClass) {
            classNum += this.config.treeNodeClass;
        } else if (this.config.useTreeIdInNodeClass) {
            classNum += this.obj.substring(0, 1).toUpperCase()
                + this.obj.substring(1);
        }
        if (this.config.useLevelInNodeClass) {
            classNum += (this.aIndent.length > 1 ? 3 : (this.aIndent.length + 1));
        }
        var str = '<div onclick="' + this.fullObjName + '.select(this,\'' + classNum + '\');"';
        if (this.config.useRootIcon || node.pid !== this.root.id) {
            str += ' class="iTreeNode' + classNum + '"';
        }
        str += 'id="node' + this.obj + nodeId + '"  >' + this.indent(node, nodeId);
        if (this.config.useIcons) {
            if (this.config.useLines) {
                node.icon = (this.root.id === node.pid) ? this.icon.root
                    : ((node._hasChild) ? this.icon.folder : this.icon.node);
                node.iconOpen = (this.root.id === node.pid) ? this.icon.root
                    : (node._hasChild) ? this.icon.folderOpen : this.icon.node;
            } else if (!node.icon) {
                node.iconOpen = node.icon = node._hasChild ? this.icon.nolinefolder
                    : this.icon.nolinenode;
            }
            if (this.config.useRootIcon || node.pid !== this.root.id) {
                str += '<img '
                    + (this.config.showOrder ? ' onmouseover="' + this.fullObjName
                        + '.showOrder(event)"' : '') + ' id="i' + this.obj
                    + nodeId + '" src="'
                    + ((node._isOpened) ? node.iconOpen : node.icon)
                    + '" alt="" align="absMiddle"/>';
            }
            if ((node.showCtrl && node.pid !== -1)
                || (node.pid === -1 && this.userRootIcon === true)) {
                if (this.config.useRadio) {
                    str += '<input style="line-height:15px;height:15px;border:0;" type="radio" name="iTreerdb" id="r{1}{0}" onclick="{1}.getRadioSelected({0});{1}.s({0});" value="{2}"/>'.format(nodeId, this.fullObjName, node.id);
                }
                if (this.config.useCheckbox === true) {
                    str += '<input style="line-height:15px;height:15px;border:0;" type="checkbox" name="iTreecbx" id="c{1}{0}" onclick="{1}.selectCheckbox({0});" value="{2}"/>'.format(nodeId, this.fullObjName, node.id);
                }
            }
        }
        if (node.url) {
            str += '<a ondblclick="javascript:'
                + this.fullObjName
                + '.dbs('
                + nodeId
                + ');" id="s'
                + this.obj
                + nodeId
                + '" class="'
                + ((this.config.useSelection) ? ((node._isSelected ? 'nodeSel'
                    : 'node')) : 'node') + '" href="' + node.url + '"';

            if (node.title) {
                str += ' title="' + node.title + '"';
            }
            if (node.target) {
                str += ' target="' + node.target + '"';
            }

            if (this.config.useSelection
                && ((node._hasChild && this.config.useFolderLinks) || !node._hasChild)) {
                str += ' onclick="javascript: ' + this.fullObjName + '.s(' + nodeId + ');';
            }
            str += (this.config.usePlusMinusIcons ? ''
                : (node._hasChild && node._parentNode.id !== -1 ? (this.fullObjName
                    + '.o(' + nodeId + ')') : ''))
                + '">';
        } else if ((!this.config.useFolderLinks || !node.url) && node._hasChild
            && node.pid !== this.root.id) {
            str += '<a href="javascript: ' + this.fullObjName + '.o(' + nodeId
                + ');" class="node">';
        }

        str += '<span id="ntext' + this.obj + nodeId + '">' + node.name + '</span>';

        if (node.url
            || ((!this.config.useFolderLinks || !node.url) && node._hasChild)) {
            str += '</a>';
        }
        str += '</div>';
        if (node._hasChild) {
            str += '<div id="d'
                + this.obj
                + nodeId
                + '" class="clip" style="display:'
                + ((this.root.id === node.pid || node._isOpened) ? 'block'
                    : 'none') + ';">';
            // 如果不是动态加载
            if (!this.config.isdelay && !this.config.isclientDelay) {
                str += this.addNode(node);
            }
                // 延迟加载子节点(前一条件针对打开的所有非顶级节点，后一条件针对根节点)
            // 是否打开在缓存中取
            else if ((node._isOpened && node.pid != -1) || (node.pid == -1)) {
                str += this.addNode(node);
            }
            str += '</div>';
        }
        this.aIndent.pop();
        return str;
    },

// 生成缩进图片
    indent: function (node, nodeId) {
        var str = '';
        if (this.root.id === node.pid) {
            return str;
        }
        for (var n = 0; n < this.aIndent.length; n++) {
            str += '<img src="'
                + ((this.aIndent[n] === 1 && this.config.useLines) ? this.icon.line
                    : this.icon.empty) + '" alt="" />';
        }
        // 因为是递归填加节点，所以用堆栈。先将节点的缩进状态压入栈，等节点填加完成后再弹出栈。
        // 所以当树的层次为多层时，栈中也同样有相同层次的状态信息。如果为是普通节点则画|如果是同父节点的最小兄弟节点则画空格
        node._lastOfSameLevel ? this.aIndent.push(0) : this.aIndent.push(1);
        if (!this.config.usePlusMinusIcons) {
            str += '<img style="width:0;height:0;" id="j' + this.obj
                + nodeId + '"/>';
            return str;
        }

        if (node._hasChild) {
            str += '<a href="javascript: ' + this.fullObjName + '.o(' + nodeId
                + ');"><img id="j' + this.obj + nodeId + '" src="';
            if (!this.config.useLines) {
                str += (node._isOpened) ? this.icon.nlMinus
                    : this.icon.nlPlus;
            } else {
                str += ((node._isOpened) ? ((node._lastOfSameLevel && this.config.useLines) ? this.icon.minusBottom
                    : this.icon.minus)
                    : ((node._lastOfSameLevel && this.config.useLines) ? this.icon.plusBottom
                        : this.icon.plus));
            }
            str += '"/></a>';
            return str;
        }
        str += '<img id="j'
            + this.obj
            + nodeId
            + '" src="'
            + ((this.config.useLines) ? ((node._lastOfSameLevel) ? this.icon.joinBottom
                : this.icon.join)
                : this.icon.empty) + '" alt="" />';
        return str;
    },
// 设置当前节点状态_hc和ls
    setCS: function (node) {
        var lastId = null;
        node._hasChild = false;
        node._lastOfSameLevel = false;
        for (var n = 0; n < this.aNodes.length; n++) {
            // 如果不是动态的则判断是否有子节点,如果是延迟加载由后台提供s
            if (this.config.isdelay === false) {
                if (this.aNodes[n] != null && this.aNodes[n].pid == node.id) {
                    node._hasChild = true;
                }
            }
            if (this.aNodes[n] != null && this.aNodes[n].pid == node.pid)
                lastId = this.aNodes[n].id;
        }
        if (lastId === node.id) {
            node._lastOfSameLevel = true;
        }
    },
    getAllNameOfNode: function (cn, splitChar) {
        if (!cn) {
            cn = this.aNodes[this.getSelectedAi()];
        }
        var nameArray = [];
        while (cn.id !== -1 && !$.isNullOrEmpty(cn.name)) {
            if (cn.name.indexOf(':') !== -1) {
                nameArray.push(cn.name.split(':')[1]);
            } else {
                nameArray.push(cn.name);
            }
            if (cn._parentNode) {
                cn = cn._parentNode;// 如果cn_p存在，即是静加载因为是动态加载只有addNode后才有该节点信息
            } else {
                cn = this.aNodes[this.getAiById(cn.pid)];
            }
        }
        splitChar = splitChar ? splitChar : "  ";
        nameArray.reverse();
        return nameArray.join(splitChar);
    },
// 获取当前选中的节点地址索引只有一个
    getSelectedAi: function () {
        return this.getAiById(this.getSelectedId());
    },
// 获取当前选中的节点ID只有一个
    getSelectedId: function () {
        var sn;
        if (this.config.useCookies === true) {
            sn = this.getCookie('currentSelect' + this.obj);
        } else {
            sn = this.currentSelectId["currentSelect" + this.obj];
        }
        return (sn) ? sn : null;
    },
// 清除当前选中节点
    clearSelectedNode: function () {
        var now = new Date();
        var yesterday = new Date(now.getTime() - 1000 * 60 * 60 * 24);
        this.setCookie('cs' + this.obj, 'cookieValue', yesterday);
        this.currentSelectId["currentSelect" + this.obj] = null;
    },
// 设置当前选中的节点
    setCurrentSelectNode: function (cn) {
        if (this.config.useCookies) {
            this.setCookie('currentSelect' + this.obj, cn.id);
        } else {
            this.currentSelectId["currentSelect" + this.obj] = cn.id;
        }
    },
// 选择事件
    s: function (id) {
        if (!this.config.useSelection) {
            return;
        }
        var cn = this.aNodes[id];
        if (cn._hasChild && !this.config.useFolderLinks) {
            return;
        }
        if (this.selectedNodeIndex !== id) {
            if (this.selectedNodeIndex || this.selectedNodeIndex === 0) {
                // 将之前的选中节点置为普通结点状态
                eOld = document.getElementById("s" + this.obj
                    + this.selectedNodeIndex);
                this.aNodes[this.selectedNodeIndex]._isSelected = false;

                if (eOld) {
                    eOld.className = "node";
                }
            }
            eNew = document.getElementById("s" + this.obj + id);
            eNew.className = "nodeSel";
            this.selectedNodeIndex = id;
            cn._isSelected = true;
            this.setCurrentSelectNode(cn);
        }
        if (document.getElementById("r" + this.obj + id)) {
            document.getElementById("r" + this.obj + id).checked = true;
            this.getRadioSelected(id);
        }
        if (document.getElementById("c" + this.obj + id)) {
            var currentcbk = document.getElementById("c" + this.obj + id);
            currentcbk.checked = !currentcbk.checked;
            this.selectCheckbox(id);
        }
        if (this.config.closeSameLevel)
            this.closeLevel(cn);
    },
    /**
     * 把折叠状态节点的子节点加载到子节点面板中<br>
     *
     * @param node
     *            节点对象;
     */
    delayOpen: function (node) {
        var currentTree = this;
        var cn = node;
        var id = node._addressIndex;
        // 延迟加载折叠状态节点的子节点
        if (cn._isOpened) {
            return true;
        }
        // 获取展示子节点的div
        var childrenDIV = document.getElementById('d' + this.obj + id);
        // 该结点从未展开过
        if (childrenDIV != null && childrenDIV.innerHTML == "") {
            var postStr = "ay=true&nodeId=" + cn.id;
            if ($("exceptid").value) {
                postStr += "&exceptid=" + $("exceptid").value;
            }
            $.ajax.json(this.config.ajaxURL, postStr,
                function (result) {
                    alert(result);
                    // alert(xmlHttpRequest.responseText);
                    var nodeListJson = xmlHttpRequest.responseText
                        .json();
                    openNodeCallBack(nodeListJson);
                    // 将从当前节点到次级根节点之前所有父节点是否是同级节点的最后一个的标志压栈
                    var nodeTemp = cn;
                    var indentArray = [];
                    // 循环到次级根节点之前
                    while (nodeTemp.pid != -1) {
                        indentArray[indentArray.length] = (nodeTemp._lastOfSameLevel) ? 0
                            : 1;
                        nodeTemp = nodeTemp._parentNode;
                    }
                    // 反向压栈
                    for (var i = indentArray.length - 1; i >= 0; i--) {
                        currentTree.aIndent
                            .push(indentArray[i]);
                    }
                    // 初始化下下级所有结点，并得到所有下一级子节点的html字符串，并将一层孩子写入到页面中
                    childrenDIV.innerHTML = currentTree
                        .addNode(cn);
                    // 清除临时深度
                    for (var i = 0; i < indentArray.length; i++) {
                        currentTree.aIndent.pop();
                    }
                });
        }
    },
    clientDelayOpen: function (node, isFresh) {
        var cn = node;
        var id = node._addressIndex;
        var needLoad = cn._isOpened == false || isFresh;
        // 延迟加载折叠状态节点的子节点
        if (!needLoad) {
            return;
        }
        // 获取展示子节点的div
        var childrenDIV = document.getElementById('d' + this.obj + id);

        // 该结点从未展开过
        if (childrenDIV != null && childrenDIV.innerHTML == "" || isFresh) {
            // 将从当前节点到次级根节点之前所有父节点是否是同级节点的最后一个的标志压栈
            var nodeTemp = cn;
            var indentArray = [];

            // 循环到次级根节点之前
            while (nodeTemp._parentNode.id != this.root.id) {
                indentArray[indentArray.length] = (nodeTemp._lastOfSameLevel) ? 0
                    : 1;
                nodeTemp = nodeTemp._parentNode;
            }
            // 反向压栈
            for (var i = indentArray.length - 1; i >= 0; i--) {
                this.aIndent.push(indentArray[i]);
            }
            // 初始化下下级所有结点，并得到所有下一级子节点的html字符串，并将一层孩子写入到页面中
            childrenDIV.innerHTML = this.addNode(cn);

            // 清除临时深度
            for (var i = 0; i < indentArray.length; i++) {
                this.aIndent.pop();
            }
        }
    },
// 当含有子节点的父节点打开
    o: function (id) {
        var cn = this.aNodes[id];
        if (this.config.isdelay) {
            this.delayOpen(cn);
        }
        if (this.config.isclientDelay) {
            this.clientDelayOpen(cn);
        }
        this.nodeStatus(!cn._isOpened, id, cn._lastOfSameLevel);

        cn._isOpened = !cn._isOpened;

        if (this.config.closeSameLevel)
            this.closeLevel(cn);
        if (this.config.useCookies)
            this.updateCookie();
    },
    oAll: function (status) {
        for (var n = 0; n < this.aNodes.length; n++) {
            if (this.aNodes[n] != null && this.aNodes[n]._hasChild
                && this.aNodes[n].pid != this.root.id) {
                this.nodeStatus(status, n, this.aNodes[n]._lastOfSameLevel);
                this.aNodes[n]._isOpened = status;
            }
        }
        if (this.config.useCookies)
            this.updateCookie();
    },
    getAiById: function (id) {
        for (var n = 0; n < this.aNodes.length; n++) {
            if (this.aNodes[n] != null && this.aNodes[n].id == id) {
                return n;
            }
        }
        return null;
    },
// openTo打开到某某节点(只支持静态)
    openTo: function (nId, isAi) {
        if (!isAi) {
            nId = this.getAiById(nId);
        }
        if (nId === null) {
            return;
        }
        var cn = this.aNodes[nId];
        if (this.config.delay) {
            var openNodeArray = [];
            while (cn._parentNode.pid != -1) {
                openNodeArray.push(cn);
                cn = cn._parentNode;
            }
            return;
        }
        if (cn.pid == this.root.id || !cn._parentNode) {
            return;
        }
        cn._isOpened = true;
        if (this.completed && cn._hasChild) {
            this.nodeStatus(true, cn._addressIndex, cn._lastOfSameLevel);
        }
        this.openTo(cn._parentNode._addressIndex, true);
    },
// 相同父节点中的所有子节点中，关闭除node节点之外的所有兄弟节点
    closeLevel: function (node) {
        for (var n = 0; n < this.aNodes.length; n++) {
            if (this.aNodes[n] != null && this.aNodes[n].pid == node.pid
                && this.aNodes[n].id != node.id && this.aNodes[n]._hasChild) {
                this.nodeStatus(false, n, this.aNodes[n]._lastOfSameLevel);
                this.aNodes[n]._isOpened = false;
                this.closeAllChildren(this.aNodes[n]);
            }
        }
    },
// 关闭当前node节点的所有子节点
    closeAllChildren: function (node) {
        for (var n = 0; n < this.aNodes.length; n++) {
            if (this.aNodes[n] != null && this.aNodes[n].pid == node.id
                && this.aNodes[n]._hasChild) {
                if (this.aNodes[n]._isOpened)
                    this.nodeStatus(false, n, this.aNodes[n]._lastOfSameLevel);
                this.aNodes[n]._isOpened = false;
                this.closeAllChildren(this.aNodes[n]);
            }
        }
    },
// 设置当前节点状态
// status是否打开
// id当前节点地址索引
// bottom是否为相同父节点的最后一个子节点
    nodeStatus: function (isOpen, nodeIndex, isLastNodeOfSameLevel) {
        eDiv = document.getElementById('d' + this.obj + nodeIndex);
        eJoin = document.getElementById('j' + this.obj + nodeIndex);
        if (this.config.usePlusMinusIcons) {
            eIcon = document.getElementById('i' + this.obj + nodeIndex);
            if (this.config.useIcons) {
                eIcon.src = ((isOpen) ? this.aNodes[nodeIndex].iconOpen
                    : this.aNodes[nodeIndex].icon);
            }
            eJoin.src = (this.config.useLines) ?
                ((isOpen) ? ((isLastNodeOfSameLevel) ? this.icon.minusBottom
                    : this.icon.minus)
                    : ((isLastNodeOfSameLevel) ? this.icon.plusBottom
                        : this.icon.plus)) :

                ((isOpen) ? this.icon.nlMinus : this.icon.nlPlus);
        } else {
            eJoin.src = this.icon.empty;
        }
        eDiv.style.display = (isOpen) ? 'block' : 'none';
    },
    clearCookie: function () {
        var now = new Date();
        var yesterday = new Date(now.getTime() - 1000 * 60 * 60 * 24);
        this.setCookie('co' + this.obj, 'cookieValue', yesterday);
        this.setCookie('cs' + this.obj, 'cookieValue', yesterday);
    },
    setCookie: function (cookieName, cookieValue, expires, path,
                         domain, secure) {
        document.cookie =
            escape(cookieName) + '=' + escape(cookieValue)
            + (expires ? '; expires=' + expires.toGMTString() : '')
            + (path ? '; path=' + path : '')
            + (domain ? '; domain=' + domain : '')
            + (secure ? '; secure' : '');
    },
// iTree有两个cookieName
// 1、co当前打开的currentOpen
// 2、cs当前选择的currentSelected
    getCookie: function (cookieName) {
        var cookieValue = '';
        var posName = document.cookie.indexOf(escape(cookieName) + '=');
        if (posName != -1) {
            var posValue = posName + (escape(cookieName) + '=').length;
            var endPos = document.cookie.indexOf(';', posValue);
            if (endPos != -1)
                cookieValue = unescape(document.cookie.substring(posValue, endPos));
            else
                cookieValue = unescape(document.cookie.substring(posValue));
        }
        return (cookieValue);
    },
    updateCookie: function () {
        var str = '';
        for (var n = 0; n < this.aNodes.length; n++) {
            if (this.aNodes[n] != null && this.aNodes[n]._isOpened
                && this.aNodes[n].pid != this.root.id) {
                if (str)
                    str += '.';
                str += this.aNodes[n].id;
            }
        }
        this.setCookie('currentOpen' + this.obj, str);
    },

// [Cookie] Checks if a node id is in a cookie
// 判断节点是否为打开状态
    isOpen: function (id) {
        var aOpen = this.getCookie('currentOpen' + this.obj).split('.');
        for (var n = 0; n < aOpen.length; n++)
            if (aOpen[n] == id) {
                return true;
            }
        return false;
    },
    getAllId: function () {
        var idArray = [];
        for (var i = 0; i < this.aNodes.length; i++) {
            idArray.push(this.aNodes[i].id);
        }
        return idArray;
    },
    getAllParentNode: function () {
        var cn = this.aNodes[this.getSelectedAi()];
        var parentNodeIdArray = [];
        if (cn) {
            while (cn.id != -1) {
                parentNodeIdArray.push(cn.id);
                cn = cn._parentNode;
            }
        } else {
            parentNodeIdArray.push(0);
        }
        return parentNodeIdArray;
    },
    selectChilds: function (parentIds, currentSelected, length) {
        pids = [];
        for (var n = 0; n < length; n++) {
            if (parentIds.indexOf(this.aNodes[n].pid) != -1) {
                if (this.aNodes[n].showCtrl != false) {
                    document.getElementById("c" + this.obj + n).checked = currentSelected;
                    pids.push(this.aNodes[n].id);
                }
            }
        }
        if (pids.length != 0) {
            this.selectChilds(pids, currentSelected, length);
        }
    },
    getRadioSelected: function () {
        return null;
    },
    selectCheckbox: function (nodeId) {
        var node = this.aNodes[nodeId];
        var currentSelected = null;
        if (node.selectChild == undefined || node.selectChild == true) {
            currentSelected = document.getElementById("c" + this.obj + nodeId).checked;
            if (currentSelected) {
                var cn = node;
                var c;
                while (cn.id != -1) {
                    c = document.getElementById("c" + this.obj + cn._addressIndex);
                    if (c)
                        c.checked = true;
                    cn = cn._parentNode;
                }
            }
            var len = this.aNodes.length;
            var parentIds = [];
            for (var n = 0; n < len; n++) {
                if ((n != nodeId)
                    && (this.aNodes[n] != null && this.aNodes[n].pid == node.id)) {
                    if (this.aNodes[n].showCtrl != false) {
                        document.getElementById("c" + this.obj + n).checked = currentSelected;
                        parentIds.push(this.aNodes[n].id);
                    }
                }
            }
            if (parentIds.length != 0) {
                this.selectChilds(parentIds, currentSelected, len);
            }
        }

        if (this.checkBoxClick) {
            this.checkBoxClick(node.id, currentSelected);
        }
    },
// 字符串格式1,2,3
// Array
    setChecked: function (checkedId) {
        if (typeof (checkedId) == "string") {
            checkedId = checkedId.split(",");
        }
        var checkBoxList = document.getElementsByName("iTreecbx");
        for (var n = 0; n < checkBoxList.length; n++) {
            var currentId= parseInt(checkBoxList[n].value,10)
            if (checkedId.indexOf(currentId) !== -1) {
                checkBoxList[n].checked = true;
            }
        }
    },
    getAllCheckedTitle: function () {
        var nodes = [];
        var checkBoxList = document.getElementsByName("iTreecbx");
        for (var i = 0; i < checkBoxList.length; i++) {
            if (checkBoxList[i].checked === true) {
                arrayIndex = checkBoxList[i].id.replace('c' + this.obj, '');
                nodes.push(this.aNodes[arrayIndex].title);
            }
        }
        return nodes;
    },
    getAllChecked: function () {
        var nodes = [];
        var checkBoxList = document.getElementsByName("iTreecbx");
        for (var i = 0; i < checkBoxList.length; i++) {
            if (checkBoxList[i].checked === true) {
                arrayIndex = checkBoxList[i].id.replace('c' + this.obj, '');
                nodes.push(this.aNodes[arrayIndex]);
            }
        }
        return nodes;
    },
    getAllCheckedId: function () {
        var nodes = [];
        var checkBoxList = document.getElementsByName("iTreecbx");
        for (var i = 0; i < checkBoxList.length; i++) {
            if (checkBoxList[i].checked === true) {
                nodes.push(checkBoxList[i].value);
            }
        }
        return nodes.join();
    },
    show: function (e, width, maxHeight) {
        if (this.floatTreeFrameId) {
            return;
        }
        // 根据主树重建用户选择树，未访问数据库
        if (this.config.reBuildTree)
            this.config.reBuildTree();
        // 通过方法loadFloatTree方法建新树
        if ($(this.config.floatTreeId).innerHTML.trim() == ""
            && typeof (this.config.loadFloatTree) != "undefined") {
            this.config.loadFloatTree();
        }
        var srcObject = $.event(e).srcElement;
        var sparrowElement = $(srcObject);
        var HTMLObject = document.createElement("DIV");
        HTMLObject.id = this.config.floatTreeId + "Frame";
        HTMLObject.style.cssText = "position:absolute;width:"
            + width
            + "px;height:0px;border:#ccc 1px solid;background:#ffffff; padding:1px;text-align:left;overflow:auto;";
        HTMLObject.innerHTML = this.config.loadingString;
        document.body.appendChild(HTMLObject);
        HTMLObject.onclick = function (e) {
            $.event(e).cancelBubble();
        };
        HTMLObject.style.left = (sparrowElement.getAbsoluteLeft() + 1)
            + "px";
        HTMLObject.style.top = (sparrowElement.getAbsoluteTop() + srcObject.offsetHeight)
            + "px";
        this.interval = window.setInterval(this.fullObjName + ".intervalShow("
            + maxHeight + ")", 10);
    },
    intervalShow: function (maxHeight) {
        var FrameId = this.config.floatTreeId + "Frame";
        // var divWidth=parseInt($(FrameId).style.width.replace("px",""));
        var divHeight = $(FrameId).clientHeight + 15;
        if (divHeight >= maxHeight) {
            this.floatTreeFrameId = FrameId;
            if ($(this.config.floatTreeId)
                && $(this.config.floatTreeId).innerHTML != "") {
                var treeDiv = $(this.config.floatTreeId);
                $(FrameId).innerHTML = "";
                treeDiv.style.display = "block";
                $(FrameId).appendChild(treeDiv);
                window.clearInterval(this.interval);
            }
        } else {
            $(FrameId).style.height = (divHeight) + "px";
        }
    },
    clearFloatFrame: function () {
        if (this.floatTreeFrameId) {
            var TreeFrame = $(this.floatTreeFrameId);
            // reBuildTree is a function to build floatTree from loaded tree
            if (!this.config.reBuildTree) {
                var tree = $(this.config.floatTreeId);
                tree.style.display = "none";
                document.body.appendChild(tree);
            }
            document.body.removeChild(TreeFrame);
            this.floatTreeFrameId = null;
            window.clearInterval(this.interval);
        }
        if ($("orderDiv")) {
            document.body.removeChild($("orderDiv"));
        }
    },
    //定义 config.loadFloatTree  树初始化方法
    initResourceTree: function (resourcePrefix, ajaxUrl) {
        if (!ajaxUrl) ajaxUrl = $.url.root + "/resource/load-all";
        var treeObject = this;
        this.config.loadFloatTree = function () {
            $.ajax.json(ajaxUrl, resourcePrefix, function (result) {
                var jsonList = result.data || result.message;
                treeObject.aNodes = [];
                treeObject.resetIcon();
                treeObject.config.usePlusMinusIcons = false;
                treeObject.config.useRootIcon = false;
                treeObject.add(jsonList[0].parentId, -1, "");
                treeObject.resetIcon();
                for (var i = 0; i < jsonList.length; i++) {
                    if ($.isNullOrEmpty(jsonList[i].icoUrl)) {
                        jsonList[i].icoUrl = $.DEFAULT_RESOURCE_ICO_URL;
                    }
                    treeObject.add(jsonList[i].id,
                        jsonList[i].parentId,
                        jsonList[i].name,
                        "javascript:" + treeObject.fullObjName
                        + ".codeNodeClick(" + (i + 1) + ");",
                        jsonList[i].name,
                        undefined,
                        undefined,
                        undefined,
                        jsonList[i],
                        jsonList[i].icoUrl);
                }
                $(treeObject.config.floatTreeId).innerHTML = treeObject;
            });
        };
    },
    // 定义this.config.loadFloatTree 码表初始化方法
    initCodeTooltip: function (codePrefix, ajaxUrl) {
        var htmlEvents = ("$('#'+{0}.config.descTextBoxId).bind('onchange',function(){" +
            "if($({0}.config.descTextBoxId).value==''){" +
            "$({0}.config.descHiddenId).value='';" +
            "if(typeof({0}.config.valueTextBoxId)!='undefined')" +
            "{$({0}.config.valueTextBoxId).value='';$({0}.config.valueTextBoxId).readOnly='readonly';}}});").format(this.fullObjName);
        eval(htmlEvents);
        var treeObject = this;
        if ($(treeObject.config.floatTreeId) == null) {
            var floatTree = $("+div").s;
            floatTree.id = treeObject.config.floatTreeId;
            floatTree.className = "floatTree";
            document.body.appendChild(floatTree);
        }
        if (!ajaxUrl) {
            ajaxUrl = $.url.root + "/code/load";
        }
        this.dbs = function (nodeIndex) {
            var businessEntity = this.aNodes[nodeIndex].businessEntity;
            if (this.config.descHiddenId != null) {
                $(this.config.descHiddenId).value = businessEntity.id;
            }
            if (this.config.descTextBoxId != null) {
                var descCtrl = $(this.config.descTextBoxId);
                if (descCtrl.type === "text") {
                    descCtrl.value = this.getAllNameOfNode(this.aNodes[nodeIndex], "/");
                } else {
                    descCtrl.innerHTML = this.getAllNameOfNode(this.aNodes[nodeIndex], "/");
                }
            }
            if (this.config.valueTextBoxId != null) {
                $(this.config.valueTextBoxId).value = businessEntity.value;
            }
            if (this.codeNodeCallBack) {
                this.codeNodeCallBack(this.aNodes[nodeIndex]);
            }
            this.clearFloatFrame();
            if (this.config.validate) {
                this.config.validate();
            } else if (this.config.validateConfig) {
                $.v.isNull(this.config.validateConfig, descCtrl);
            }
        };
        treeObject.config.loadFloatTree = function () {
            $.ajax.json(ajaxUrl, "prefix=" + codePrefix, function (result) {
                var jsonList = result.data || result.message;
                treeObject.aNodes = [];
                treeObject.resetIcon();
                treeObject.config.usePlusMinusIcons = false;
                treeObject.config.useRootIcon = false;
                treeObject.add(jsonList[0].parentId, -1, "");
                for (var i = 0; i < jsonList.length; i++) {
                    treeObject.add(jsonList[i].id,
                        jsonList[i].parentId, jsonList[i].name,
                        "javascript:" + treeObject.fullObjName
                        + ".codeNodeClick(" + (i + 1) + ");",
                        jsonList[i].code + "|" + jsonList[i].name,
                        undefined, undefined, undefined, jsonList[i]);
                }
                $(treeObject.config.floatTreeId).innerHTML = treeObject;
            });
        };
    },
    //codeNodeClick--> dbs -->codeNodeCallBack
    codeNodeClick: function (nodeIndex) {
        if (this.aNodes[nodeIndex].childCount === 0) {
            this.dbs(nodeIndex);
        }
    }
};
Sparrow.dispatcher = {
    builder: {
        id: "id",//控件标签 id
        delegate: "delegate",//事件委托
        api: "api",//ajax请求的api
        strategy: "strategy",//策略 控件的 value
        eventName: "eventName"//事件的名称 默认为onclick
    },
    commandAdapter: {},
    ctrlIdEventMap: {},
    eventRegistry: [],
    /**
     *
     * @param eventConfig
     * {
                id: "btn1",//控件标签 id
                delegate: function (e, srcElement) {
                    alert(srcElement.value);
                    srcElement.value = "update";
                },//事件委托
                //api: "api",//ajax请求的api
                strategy: "insert",//策略对应控件的Value
                eventName:"onclick"
       }
     */
    register: function (eventConfig) {
        this.eventRegistry.push(eventConfig);
    },
    dispatcher: function (e, srcElement) {
        //btnInsert+"新增"
        //btnInsert+"更新"
        var commandKey = srcElement.id + "_" + srcElement.value;
        var builder = this.commandAdapter[commandKey];

        var delegate = null;
        if (builder != null) {
            delegate = builder.delegate;
        }
        if (delegate == null) {
            builder = this.commandAdapter[srcElement.id];
            if (builder != null) {
                delegate = builder.delegate;
            }
        }

        if (builder == null || delegate == null) {
            return
        }
        if (builder.api) {
            $.ajax.json(builder.api, builder.parameter, delegate, srcElement);
            return;
        }
        delegate(e, srcElement);
    },
    bind: function () {
        for (var i = 0; i < this.eventRegistry.length; i++) {
            var builder = this.eventRegistry[i];
            var strategy = builder.strategy;
            var eventName = builder.eventName;
            var commandKey = builder.id + (strategy ? "_" + strategy : "");
            this.commandAdapter[commandKey] = builder;
            this.ctrlIdEventMap[builder.id] = eventName ? eventName : "onclick";
        }
        for (ctrlId in this.ctrlIdEventMap) {
            //bind(event,function(e){});
            $("#" + ctrlId).bind(this.ctrlIdEventMap[ctrlId], function (e) {
                Sparrow.dispatcher.dispatcher(e, $.event(e).srcElement)
            });
        }
    }
};
Sparrow.user = {
  authorMap: null,
  author: null,
  login: {
    dialog: function (nsOfCallBack, args) {
      var url =
        $.url.passport +
        "/login-dialog?register=false&callback-ns=" +
        nsOfCallBack;
      if (!$.isNullOrEmpty(args)) {
        url += "&parameter=" + args;
      }
      document.domain = $.browser.cookie.root_domain;
      $.window({ url: url, showHead: false });
    },
    ns_callback: {
      publish: "thread.publish",
      attention: "user.attention",
      cancel_attention: "user.attention.cancel",
      comment: "thread.comment",
      upload: "upload",
      like_thread: "thread.like",
    },
  },
  getZone: function (userId) {
    return $.url.root + "/zone-" + userId;
  },
  getAvatar: function (avatar) {
    return avatar ? avatar : $.DEFAULT_AVATOR_URL;
  },
  // 是否有编辑权限
  editable: function (authorId) {
    var currentUserId = $.browser.getUserId();
    if (currentUserId <= 0) {
      return false;
    }
    return authorId === currentUserId;
  },
  initLoginBar: function () {
    if (!$("divAccount")) {
      return;
    }
    if ($.browser.isLogin()) {
      $("divAccount").style.display = "block";
      $("divLogin").style.display = "none";
      var hyperUser = $("hyperUser");
      $(hyperUser).html($.browser.getUserName());
      hyperUser.title = $.browser.getUserName();
      hyperUser.href = $.user.getZone($.browser.getUserId());
      return;
    }
    $("divAccount").style.display = "none";
    $("divLogin").style.display = "block";
  },
  // 游客的鼠标悬停头象效果
  popup: function (srcElement, userId) {
    var userInfo =
      this.authorMap == null ? this.author : this.authorMap[userId];
    var divUserInfo = $("divUserInfo");
    if (divUserInfo == null) {
      divUserInfo = $("+div.divUserInfo");
      divUserInfo.s.style.cssText =
        "border: #ccc 1px solid; position: absolute; width:300px; height:120px; background: #ffffff;overflow: hidden;";
      divUserInfo.s.onmouseover = function (e) {
        console.log("user info  mouse over ...");
        $.event(e).cancelBubble();
      };
      document.body.appendChild(divUserInfo.s);
    }
    $("divUserInfo").style.top = $(srcElement).getAbsoluteTop() - 2 + "px";
    $("divUserInfo").style.left = $(srcElement).getAbsoluteLeft() - 2 + "px";

    var POPUP_HTML = [];
    POPUP_HTML.push(
      '<table style="border: 0;background:#fff;" cellpadding="0" cellspacing="0">'
    );
    POPUP_HTML.push("<tr>");
    POPUP_HTML.push('<td style="border: 0; width:60px;" valign="top">');
    POPUP_HTML.push(
      '<a href="{0}" target="_blank"><img style="width:50px; height: 50px; border: 2px #EDEDED solid;" src="{1}" /></a>'.format(
        this.getZone(userInfo.id),
        this.getAvatar(userInfo.avatar)
      )
    );
    POPUP_HTML.push("</td>");
    POPUP_HTML.push(
      '<td style="border: 0; width: 240px; line-height: 25px;text-align:left;">'
    );
    POPUP_HTML.push(
      '昵称:<a href="{2}" target="_blank"><span>{0}</span></a>{1}<br />'.format(
        userInfo.name,
        "attention",
        this.getZone(userInfo.id)
      )
    );
    POPUP_HTML.push("性别:<span>{0}</span><br />".format(userInfo.gender));
    if (userInfo.createTime) {
      POPUP_HTML.push(
        "注册日期:<span>{0}</span><br />".format(userInfo.createTime)
      );
    }

    if (userInfo.lastLoginTime) {
      POPUP_HTML.push(
        "最后登陆:<span>{0}</span><br />".format(userInfo.lastLoginTime)
      );
    }
    if (!$.isNullOrEmpty(userInfo.status)) {
      POPUP_HTML.push("状态：<span>{0}</span><br />".format(userInfo.status));
    }

    // if (userInfo.extend && userInfo.extend.COUNT) {
    //     POPUP_HTML.push('COUNT：<span>{0}</span><br />'.format(userInfo.extend.COUNT));
    // }
    $("divUserInfo").innerHTML = POPUP_HTML.join("");
    $("#divUserInfo").show();

    // 鼠标离开头象效果
    document.onmouseover = function (e) {
      $("#divUserInfo").hidden();
    };
  },
  json: function (json) {
    var jsonHidden = $(json);
    if (jsonHidden != null) {
      json = jsonHidden.value.json();
    }
    return json;
  },
  initAuthor: function (json) {
    this.author = this.json(json);
  },
  initAuthorMap: function (json) {
    this.authorMap = this.json(json);
  },
  attention: function () {
    return false;
    /**
         * // 是否关注过
         var attention = "";
         if (userInfo.extend.ATTENTION_RELATION != "NONE") {
                    // 当前用户是游客或者未关注该用户
                    if (!$.browser.isLogin()
                        || userInfo.extend.ATTENTION_RELATION == "NULL" || userInfo.extend.ATTENTION_RELATION == "FANS") {
                        // 需要登录后关注
                        attention = '<a target="_self" onclick="attention(\''
                            + userId
                            + '\',this);"'
                            + 'href="javascript:void(0);">关注</a>';
                    } else {
                        // 我关注过该用户
                        if (userInfo.extend.ATTENTION_RELATION == "ATTENTION" || userInfo.extend.ATTENTION_RELATION == "EACH_OTHER_ATTENTION") {
                            attention = '<a target="_self" onclick="cancelattention(\''
                                + userId
                                + '\',this);"'
                                + 'href="javascript:void(0);">取消关注</a>';
                        }
                    }
                    userInfo.extend.ATTENTION_RELATION = attention;
                }
         else {
                    userInfo.extend.ATTENTION_RELATION = ""
                }
         */
  },
  getToken: function () {
    //url 优先
    var token = Sparrow.request("token");
    if (!Sparrow.isNullOrEmpty(token)) {
      return token;
    }
    token = localStorage.getItem("token");
    if (!Sparrow.isNullOrEmpty(token)) {
      return token;
    }
    token = Sparrow.browser.getCookie(Sparrow.browser.cookie.permission);
    if (token != null) {
      return token;
    }
  },
};

/* 第三方分享实现 */
Sparrow.share = {
    config: {
        icon: $.url.resource + '/images/share.png',
        share: [
            // 无appkey但有websit配置
            {
                url: 'http://sns.qzone.qq.com/cgi-bin/qzshare/cgi_qzshare_onekey?style=202&width=80&height=31&showcount=1&url={0}&title={1}&pics={2}&desc={3}&summary={4}&site='
                + encodeURIComponent($.browser.getCookie($.browser.cookie.website_name))
                + '&otype=share',
                position: {
                    left: 160,
                    top: 0
                },
                title: "分享到QQ空间"
            },
            {
                url: 'http://service.weibo.com/share/share.php?appkey=318168823&url={0}&title={1}&pic={2}&ralateUid=3199233727',
                position: {
                    left: 0,
                    top: 0
                },
                title: "分享到新浪微博"
            }]
    },
    init: function () {
        var shareArray = document.getElementsByName("share");
        var shareTemplateArray = [];
        for (var j = 0; j < this.config.share.length; j++) {
            shareTemplateArray
                .push('<a target="_blank" style="height:32px;width:32px;display:inline-block;background:url({0}) {1}px {2}px;" title="{3}" href="{4}"></a>'
                    .format(this.config.icon,
                        this.config.share[j].position.left,
                        this.config.share[j].position.top,
                        this.config.share[j].title,
                        this.config.share[j].url));
        }
        shareTemplate = shareTemplateArray.join("");
        for (var i = shareArray.length - 1; i >= 0; i--) {
            var shareData = shareArray[i].value.json();
            shareArray[i].parentNode.innerHTML = shareTemplate.format(encodeURIComponent(shareData.url),
                encodeURIComponent(shareData.title),
                encodeURIComponent(shareData.pic),
                encodeURIComponent(shareData.comment),
                encodeURIComponent(shareData.summary));
        }
    }
};
Sparrow.webSocket = function (url, token) {
  this.url = url;
  // websocket 连接的 token
  this.token = token;
  // 接收到信息后需要执行的事件
  this.onMsgCallback = null;
  // 心跳间隔时间
  this.heartTime = 1000;
  // 心跳超时时间
  this.heartTimeout = 3000;
  // 重连时间 0.5s
  this.reconnectTime = 1000;

  this.heartTimer = null;

  this.ws = null;

  this.lastHeartTime = 0;

  this.reconnectionTimer = null;

  this.reconnectionCallback = null;

  this.userId = null;

  this.statusBarId;
};

Sparrow.webSocket.prototype.connect = function (resolve, reject) {
  try {
    if ("WebSocket" in window) {
      this.ws = new WebSocket(this.url, [this.token]);
      //resolve 或者reject 必须，如果未执行，会导致后续代码不执行
      this._onOpen();
      this._onMsg(resolve, reject);
      this._onClose(reject);
      this._onError(reject);
    }
  } catch (e) {
    console.log("链接失败，直接重连", e);
    this.reconnectWebSocket();
  }
};

Sparrow.webSocket.prototype.close = function () {
  // 关闭连接
  this.ws.close();
};

Sparrow.webSocket.prototype.showPingStatus = function (status) {
  var statusBar = $("#" + this.statusBarId);
  if (statusBar.s != null) {
    $("#" + this.statusBarId).html(status);
  }
};
Sparrow.webSocket.prototype.reconnectWebSocket = function () {
  //停止心跳
  this.closeHeartBeat();
  //关闭现有链接
  this.close();
  //发起重连
  this.reconnectionTimer = setInterval(() => {
    if (this.reconnectionCallback) {
      this.reconnectionCallback();
    }
    console.log("心跳超时，retry ????" + this.reconnectionTimer);
  }, 1000);
};

Sparrow.webSocket.prototype._onOpen = function () {
  this.ws.onopen = (e) => {
    console.log("连接成功" + e);
    this.showPingStatus("连接成功...");
    this.closeHeartBeat();
    // 启动心跳
    this.startHeartBeat();
  };
};

Sparrow.webSocket.prototype._onMsg = function (resolve) {
  this.ws.onmessage = (e) => {
    // 加个判断,如果是PONG，说明当前是后端返回的心跳包 停止下面的代码执行
    if (typeof e.data === "string") {
      if (e.data === "PONG") {
        this.lastHeartTime = new Date().getTime();
        this.showPingStatus(
          "健康<span style='color:red'>" +
            new Date().format("hh:mm:ss") +
            "</span>"
        );
        return;
      }

      if (e.data === "offline") {
        this.lastHeartTime = new Date().getTime();
        if (this.onMsgCallback) {
          this.onMsgCallback({ offline: true });
        }
        return;
      }

      var userIndex = e.data.indexOf("USER.");
      if (userIndex > -1) {
        this.userInfo = e.data.substring(5);
        resolve(this.userInfo);
        return;
      }
    }
    this.onMsgCallback(e.data);
  };
};

Sparrow.webSocket.prototype._onClose = function (reject) {
  this.ws.onclose = (e) => {
    if (e.wasClean) {
      console.log("干净的关闭 重连");
      this.reconnectWebSocket();
    } else {
      // 异常关闭 需要发起重连
      console.log("异常关闭 重连");
      this.reconnectWebSocket();
    }
    reject(e);
  };
};

Sparrow.webSocket.prototype._onError = function (reject) {
  this.onerror = (e) => {
    // 如果出现连接、处理、接收、发送数据失败的时候触发onerror事件
    console.log("连接出错" + e);
    this.showPingStatus("on error 重连");
    this.reconnectWebSocket();
    reject(e);
  };
};

// 心跳机制 --启动心跳
Sparrow.webSocket.prototype.startHeartBeat = function () {
  this.lastHeartTime = new Date().getTime();
  this.heartTimer = setInterval(() => {
    var heartDiff = new Date().getTime() - this.lastHeartTime;
    // 如果超过两个周期未拿到心跳，说明超时
    if (heartDiff > this.heartTimeout) {
      console.log("超时重连 heart diff {}", heartDiff);
      this.reconnectWebSocket();
    }
    // 开启一个心跳
    try {
      this.ws.send("PING");
    } catch (e) {
      console.log("heart beat error:" + e);
    }
  }, this.heartTime);
};

// 关闭心跳
Sparrow.webSocket.prototype.closeHeartBeat = function () {
  clearTimeout(this.heartTimer);
};

Sparrow.webSocket.prototype.clearReconnectionTimer = function () {
  clearTimeout(this.reconnectionTimer);
};
//发送消息
Sparrow.webSocket.prototype.sendMessage = function (data) {
  // 发送到服务器
  this.ws.send(data.toBytes());
};

export  {Sparrow}
