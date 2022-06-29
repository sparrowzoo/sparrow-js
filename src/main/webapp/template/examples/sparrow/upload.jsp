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
    <j:script src="$resource/scripts/require.js"/>
    <script type="text/javascript">
        requirejs.config({
            baseUrl: "/assets/scripts-dev",
            paths: {
                // Sparrow: 'sparrow'
            }
        });
        require(['src/main/webapp/template/examples/sparrow/sparrow', 'domReady!'], function ($, dom) {
            $.file.validateUploadFile=function (f, key) {
                if ($.file.checkFileType($.file.getFileName(f.value), ["jpg",
                            "jpeg", "gif", "png","zip"], "errorImgForumIco")) {
                    $.file.uploadDelegate(true, key,null);
                }
            }
            $.url.upload="http://upload.sparrowzoo.com";
            document.domain=$.browser.cookie.root_domain;
            $("#null_forum").attr("src",$.url.upload+"/file-upload?path-key=forum");
        });
    </script>
</head>
<body>
resource :${resource}
<div id="imgForumIco"></div>
null_forum -->uploadDelegate(true, key,null)
<iframe id="null_forum" class="file-frame" frameborder="0"
        src=""></iframe>
</body>
</html>


