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
  }, //内部业务使用
  json: function (url, data, callback, srcElement, token) {
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
          $.message("json parse error " + responseText);
          return;
        }
        if (result.code === $.ajax.SUCCESS) {
          if (callback) {
            callback(result);
          } else {
            $.message(result.message, $.ajax.srcElement);
          }
        } else {
          $.message(result.message, $.ajax.srcElement);
        }
      },
      data,
      srcElement,
      token
    );
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
