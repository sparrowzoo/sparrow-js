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
    <j:style href="$resource/assets/styles/modal.css"/>
    <script type="application/javascript">
        $.win.okClick = function () {
            alert("OK");
            win.closeClick();
        }
    </script>
</head>

<body>

<div id="layout">
    <jsp:include page="${root_path}/examples/menu.jsp"/>
    <div id="main">
        <div class="header">
            <h1> 对话框效果</h1>
        </div>


        <div class="content">

            <input type="button" value="alert"
                   onclick="$.alert('恭喜!操作成功!','smile','title');">
            <input type="button" value="ASK"
                   onclick="$.alert('继续?','ask','title');">

            <input type="button" value="SAD"
                   onclick="$.alert('sorry!FAIL!','sad','title');">

            <input type="button" value="LOCK"
                   onclick="$.alert('sorry!lock!','lock','title');">

            <input type="button" value="WAIT"
                   onclick="$.alert('sorry!wait!','wait','title');">

            <input type="button" value="弹出windows"
                   onclick="$.window({url:'/examples/message/window.html'})">


            <input type="button" value="弹出自定义div"
                   onclick="$.dialog({content:'内容',width:'500px',height:'300px'});">


            <input type="button" value="Sparrow 扩展属性 "
                   onclick="alert($.url.root);alert($.url.resource);alert($.url.name);">

        </div>

    </div>
</div>
</body>
</html>
