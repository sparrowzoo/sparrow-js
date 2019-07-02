<%@ page contentType="text/html;charset=UTF-8" language="java" %>
<%@taglib uri="http://www.sparrowzoo.com/ui" prefix="j" %>
<%@taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c" %>
<!doctype html>
<html lang="en">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>JSON VIEW &ndash; Sparrow JS Framework</title>
    <jsp:include page="/examples/head.jsp"/>

    <script type="text/javascript">
        require(['sparrow','domReady!'], function ($,dom) {
            var originalJson = {"name": "sparrow js by harry", "sex": "男", "age": "25","a":{"b":{"c":{"d":"1"}}}};

            //(3)将格式化好后的json写入页面中
            document.getElementById("jsonview").innerHTML = '<pre>' +$.format(originalJson) + '<pre/>';

        });
    </script>
</head>

<body>

<div id="layout">
    <jsp:include page="${root_path}/examples/menu.jsp"/>
    <div id="main">
        <div class="header">
            <h1>JSON 格式化视图</h1>
            <h2>json viewer</h2>
        </div>

        <div id="jsonview" class="content">

        </div>

    </div>
</div>
</body>
</html>