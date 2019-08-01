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
    if (this.indexOf("error|") !== -1) {
        console.log(this);
    }
    try {
        var json = this;
        json = json.decodeSplitKey();
        return eval("("
            + json.replace(/\r\n/g, "<br/>").replace(/\n/g, "<br/>")
            + ")");
    } catch (err) {
        return console.log(err);
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

// If Push and pop is not implemented by the browser

if (!Array.prototype.push) {
    Array.prototype.push = function array_push() {
        for (var i = 0; i < arguments.length; i++)
            this[this.length] = arguments[i];
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