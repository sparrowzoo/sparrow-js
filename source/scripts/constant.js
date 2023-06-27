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
