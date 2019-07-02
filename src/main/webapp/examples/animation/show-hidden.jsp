<%@ page contentType="text/html;charset=UTF-8" language="java" %>
<%@taglib uri="http://www.sparrowzoo.com/ui" prefix="j" %>
<%@taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c" %>
<!doctype html>
<html lang="en">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
     <title>Sparrow 显示隐藏 &ndash; Sparrow JS Framework</title>
    <jsp:include page="/examples/head.jsp"/>
</head>

<body>

<div id="layout">
    <jsp:include page="${root_path}/examples/menu.jsp"/>
    <div id="main">
        <div class="header">
            <h1> 显示隐藏 动画</h1>
            <h2>_controlled为默认控制后缀</h2>
        </div>


        <div class="content">
             <pre>

            $(this).showHidden($('hyperShowHidden_controlled'));<br/>
            $(this).showHidden($('hyperShowHidden'));<br/>
</pre>


            <a style="background:yellowgreen;width: 100px;height: 30px;" onclick="$(this).showHidden();" id="hyperShowHidden">点我演示一下</a>

            <div id="hyperShowHidden_controlled">
                内容展示内容展示内容展示内容展示内容展示内容展示内容展示内容展示内容展示<br/>
                内容展示内容展示内容展示内容展示内容展示内容展示内容展示内容展示内容展示<br/>
                内容展示内容展示内容展示内容展示内容展示内容展示内容展示内容展示内容展示<br/>
                内容展示内容展示内容展示内容展示内容展示内容展示内容展示内容展示内容展示<br/>
                内容展示内容展示内容展示内容展示内容展示内容展示内容展示内容展示内容展示<br/>
                内容展示内容展示内容展示内容展示内容展示内容展示内容展示内容展示内容展示<br/>
                内容展示内容展示内容展示内容展示内容展示内容展示内容展示内容展示内容展示<br/>
                内容展示内容展示内容展示内容展示内容展示内容展示内容展示内容展示内容展示<br/>
                内容展示内容展示内容展示内容展示内容展示内容展示内容展示内容展示内容展示<br/>
                内容展示内容展示内容展示内容展示内容展示内容展示内容展示内容展示内容展示<br/>
            </div>


        </div>

    </div>
</div>
</body>
</html>