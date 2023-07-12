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
