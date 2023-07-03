<%@ page contentType="text/html;charset=UTF-8" language="java" %>
<%@taglib uri="http://www.sparrowzoo.com/ui" prefix="j" %>
<%@taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c" %>
<!doctype html>
<html lang="en">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Sparrow 简单移动动画 &ndash; Sparrow JS Framework</title>
    <jsp:include page="/template/examples/head.jsp"/>
    <link rel="stylesheet" type="text/css" href="http://r.sparrowzoo.net/ext/sparrowzoo/styles/avatar.css"/>
    <script language="JavaScript" type="text/javascript">
        require(['sparrow', 'domReady!'], function ($, dom) {
            var currentImage = $("imgPreviewAvatar");
            new $.ImageCopper(
                currentImage,
                {
                    lockRate: true,
                    left: 75,
                    top: 75,
                },
                function (x, y, w, h) {
                    document.getElementById("divResult").innerHTML = "top:" + x + "left:" + y + ",width:" + w + ",height:" + h;
                }
            );
        });
    </script>
</head>

<body>

<div id="layout">
    <jsp:include page="/template/examples/menu.jsp"/>
    <div id="main">
        <div class="header">
            <h1>渐变动画</h1>
            <h2></h2>
        </div>

        <div class="content">

            <div class="avatar-content">
                <div class="current-avatar">
                    <img th:src="${resource}+'/images/user.gif'" id="imgCurrentAvatar"/>
                </div>

                <div class="local-upload">
                    <img width="300px" height="300px" id="imgPreviewAvatar"
                         src="http://r.sparrowzoo.net/images/img.png"/> <br/>
                </div>
                <div class="local-file">
                    <iframe class="file-frame" name="fileUpload" id="fileUpload"
                            frameborder="0" src="http://upload.sparrowzoo.com/file-upload?path-key=avatar"></iframe>
                    <span>支持.jpg|.jpeg|.png</span>
                </div>
                <div class="buttons_group">
                    <div id="divResult"></div>
                    <input type="button" value="保存" id="btnUploadAvatar" class="button"/>
                    <input type="button" onclick="parent.win.closeClick();" class="button" value="关闭"/>
                </div>
            </div>
        </div>
    </div>
</div>
</body>
</html>
