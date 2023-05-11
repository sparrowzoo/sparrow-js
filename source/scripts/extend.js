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
