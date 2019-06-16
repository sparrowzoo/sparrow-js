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
</head>

<body>

<div id="layout">
    <jsp:include page="${root_path}/examples/menu.jsp"/>
    <div id="main">
        <div class="header">
            <h1> interlace 动画</h1>
        </div>


        <div class="content">
             <pre>
     $("#divContainer").interlace();
    $("#divContainer2").interlace();
</pre>
            <div id="divContainer"
                 style="background: #000; width: 200px; height: 200px; position: relative;">
                <div style="background: yellow;">container 1 yellow</div>
                <div style="background: red;">container 1 red</div>
            </div>


            <div id="divContainer2"
                 style="background: #000; width: 200px; height: 200px; position: relative;">
                <div style="background: yellow;">container 2 yellow</div>
                <div style="background: red;">container 2 red</div>
            </div>
        </div>

    </div>
</div>
<script type="application/javascript">
    $("#divContainer").interlace();
    $("#divContainer2").interlace();
</script>
</body>
</html>