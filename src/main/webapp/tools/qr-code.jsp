<%@ page contentType="text/html;charset=UTF-8" language="java" %>
<%@taglib uri="http://www.sparrowzoo.com/ui" prefix="j" %>
<%@taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c" %>
<!doctype html>
<html lang="en">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>二维码 在线生成器 &ndash; Sparrow JS Framework</title>
    <jsp:include page="../examples/head.jsp"/>

    <script type="text/javascript">
        require(['sparrow', 'domReady!'], function ($, dom) {
            $("#imgQRCode").source().src=$.url.root+"/qrcode?code=http://www.sparrowzoo.net";
            $("#btnQRCode").bind("onclick", function () {
                $("#imgQRCode").source().src=$.url.root+"/qrcode?code="+$("#txtQRCode").value();
            });
        });
    </script>
</head>

<body>

<div id="layout">
    <jsp:include page="../examples/menu.jsp"/>
    <div id="main">
        <div class="header">
            <h1>二维码在线生成器</h1>
        </div>


        <div style="max-width: 100%;" class="content">
            <form class="pure-form pure-form-aligned">
                <fieldset>
                    <div class="pure-control-group">
                        <label for="txtQRCode">二维码字符</label>
                        <input id="txtQRCode" type="text" placeholder="输入二维码字符">
                    </div>

                    <div class="pure-controls">
                        <input id="btnQRCode" class="pure-button pure-button-primary" type="button" value="生成二维码"/>
                    </div>

                    <div class="pure-controls">
                        <img id="imgQRCode"/>
                    </div>
                </fieldset>
            </form>
        </div>
    </div>
</div>
</body>
</html>