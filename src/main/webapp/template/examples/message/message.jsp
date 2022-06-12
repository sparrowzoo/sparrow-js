<%@ page contentType="text/html;charset=UTF-8" language="java" %>
<%@taglib uri="http://www.sparrowzoo.com/ui" prefix="j" %>
<%@taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c" %>
<!doctype html>
<html lang="en">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Sparrow 动画 &ndash; Sparrow JS Framework</title>
    <jsp:include page="/template/examples/head.jsp"/>
    <j:style href="$resource/styles/sparrow.css"/>
    <script type="application/javascript">
        $.win.okClick = function () {
            alert("OK");
            win.closeClick();
        }
    </script>
</head>

<body>

<div id="layout">
    <jsp:include page="/template/examples/menu.jsp"/>
    <div id="main">
        <div class="header">
            <h1> 对话框效果</h1>
        </div>


        <div class="content">

            <input type="button" value="屏幕中心显示message" onclick="$.message('test')"/>
            <br/>
            <br/>
            <br/><br/><br/><br/><br/><br/>
            <input type="button" value="当前控件上方显示message" onclick="$.message('test',this)"/>

        </div>

    </div>
</div>
</body>
</html>
