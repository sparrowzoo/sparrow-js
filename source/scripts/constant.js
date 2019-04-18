Sparrow.url = {
    root: $(function () {
        pathName = window.location.pathname === "/" ? ""
            : ("/" + window.location.pathname.split('/')[1]);
        return window.location.protocol + "//" + window.location.host;
        //+ (false ? pathName : "");
    }),
    resource: $(function (path) {
        var scripts = document.scripts;
        var sparrowPath = ["/scripts/sparrow.js", "/scripts/sparrow-min.js", "/scripts/sparrow-all.js"];
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