<%@ page contentType="text/html;charset=UTF-8" language="java" %>
<%@taglib uri="http://www.sparrowzoo.com/ui" prefix="j" %>
<%@taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c" %>
<!doctype html>
<html lang="en">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>JSON 在线格式化 &ndash; Sparrow JS Framework</title>
    <jsp:include page="/template/examples/head.jsp"/>

    <script type="text/javascript">
        require(['sparrow','domReady!'], function ($, dom) {
            $("#jsonview").html($.format($("#txtContent").value().json()));
            $("#btnFormat").bind("onclick",function () {
                $("#jsonview").html($.format($("#txtContent").value().json()));
            });
        });
    </script>
</head>

<body>

<div id="layout">
    <jsp:include page="/template/examples/menu.jsp"/>
    <div id="main">
        <div class="header">
            <h1>JSON 在线格式化</h1>
        </div>


        <div style="max-width: 100%;" class="content">
            <input id="btnFormat" class="pure-button pure-button-primary" type="button" value="格式化"/>
            <div style="width: 100%;" class="pure-g">
                <textarea id="txtContent" style="max-height: 100%;height:800px;"
                          class="pure-u-11-24">{"name": "sparrow js by harry", "sex": "男", "age": "25","a":{"b":{"c":{"d":"1"}}}}</textarea>
                <textarea id="jsonview" style="max-height: 100%;height:800px;overflow: scroll;"
                          class="pure-u-12-24"></textarea>
            </div>
        </div>
    </div>
</div>
</body>
</html>