var tokenConfig = {};
tokenConfig[$.url.root] = {
  "login-token": function () {
    return $.browser.getCookie("PERMISSION");
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
          $.message("json parse error " + responseText);
          return;
        }
        if (result.code != $.ajax.SUCCESS) {
          $.message(result.message, $.ajax.srcElement);
          return;
        }
        if (callback) {
          callback(result.data);
          return;
        }
        $.message(result.message, $.ajax.srcElement);
      },
      data,
      srcElement
    );
  },
  get: function (url, callback) {
    Sparrow.ajax.get(url, function (responseText) {
      var result = responseText.json();
      if (result == null) {
        $.message("json parse error " + responseText);
        return;
      }
      if (result.code != $.ajax.SUCCESS) {
        $.message(result.message, $.ajax.srcElement);
        return;
      }
      if (callback) {
        callback(result.data);
        return;
      }
      $.message(result.message, $.ajax.srcElement);
    });
  },
};
