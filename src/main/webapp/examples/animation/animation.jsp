<%@ page contentType="text/html;charset=UTF-8" language="java" %>
<%@taglib uri="http://www.sparrowzoo.com/ui" prefix="j" %>
<%@taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c" %>
<!doctype html>
<html lang="en">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="description"
          content="A layout example with a side menu that hides on mobile, just like the Pure website.">
    <title>Sparrow 动画 &ndash; Sparrow JS Framework</title>
    <jsp:include page="${root_path}/examples/head.jsp"/>
    <script language="JavaScript" type="text/javascript">
        require(['Sparrow'], function ($) {
            alert( "helle {0}".format("zhangsan"));
            document.ready(function () {
                new Menu("verticalMenu", $.VERTICAL).init();
            });
        });
    </script>
</head>

<body>

<div id="layout">
    <jsp:include page="${root_path}/examples/menu.jsp"/>
    <div id="main">
        <div class="header">
            <h1>渐变动画</h1>
            <h2>从坐标{a1,b1}到{a2,b2} size {width1,height1} 变到 {width2,height2}</h2>
        </div>

        <div class="content">

        </div>
        <div id="white"
             style="background: yellowgreen; display: none; position: absolute; width: 50px; height: 50px; left: 200px; top: 80px;">
        </div>
    </div>
</div>
</body>
</html>