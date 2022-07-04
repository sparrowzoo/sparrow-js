<%@ page language="java" pageEncoding="UTF-8" %>
<%@taglib uri="http://www.sparrowzoo.com/ui" prefix="j" %>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c" %>
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html>
<head>
    <title>upload demo-${website_name}</title>
    <meta http-equiv="pragma" content="no-cache"/>
    <meta http-equiv="cache-control" content="no-cache"/>
    <meta http-equiv="expires" content="0"/>
    <j:style href="$resource/styles/sparrow.css"/>
    <j:script src="$resource/scripts/require.js"/>
    <j:style href="$resource/styles/pure-css/pure.css"/>
    <!--[if lte IE 8]>
    <j:style href="$resource/styles/layouts-old-ie.css"/>
    <![endif]-->
    <script type="text/javascript">

        requirejs.config({
            baseUrl: "${resource}/scripts",
            paths: {
                menu: '${resource}/scripts/system/menu'
            }
        });
        require(['sparrow', 'domReady!'], function ($, dom) {
            $.file.validateUploadFile = function (f, key) {
                if ($.file.checkFileType($.file.getFileName(f.value), [".jpg",
                    ".jpeg", ".gif", ".png", ".zip"], "errorImgForumIco")) {
                    $.file.uploadCallBack = function (uploadProgress) {
                        $.file.clearStatus();
                        if (!$.file.callbackValidate(uploadProgress)) {
                            return;
                        }
                        $("#divGroupIco").html("<img src='{0}'/>".format(uploadProgress.fileUrl));
                    };

                    $.file.uploadDelegate(true, key, null);
                }
            }
            $.url.upload = "http://upload.sparrowzoo.com";
            document.domain = $.browser.cookie.root_domain;
            $("#null.forum").attr("src", "http://upload.sparrowzoo.com/file-upload?path-key=forum&amp;t=" + $.random());

            $("#null.group").attr("src", "http://upload.sparrowzoo.com/file-upload?path-key=group&amp;t=" + $.random());

            $("#null.forum_cover").attr("src", "http://upload.sparrowzoo.com/file-upload?path-key=forum_cover&amp;t=" + $.random());

        });
    </script>
</head>
<body>
resource :${resource}
<div id="imgForumIco"></div>
<H2>forum</H2>
<iframe id="null.forum" class="file-frame" frameborder="0"
        src=""></iframe>
<h2>forum_cover</h2>
<iframe id="null.forum_cover" class="file-frame" frameborder="0"
        src=""></iframe>
<h2>Group ICON</h2>
<div id="divGroupIco"></div>
<iframe id="null.group" class="file-frame" frameborder="0"
        src=""></iframe>
</body>
</html>


