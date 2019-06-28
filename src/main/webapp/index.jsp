<%@ page contentType="text/html;charset=UTF-8" language="java" %>
<%@taglib uri="http://www.sparrowzoo.com/ui" prefix="j" %>

<!doctype html>
<html lang="en">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="description"
          content="A layout example with a side menu that hides on mobile, just like the Pure website.">
    <title>Sparrow Example &ndash; Sparrow JS Framework</title>

    <jsp:include page="${root_path}/examples/head.jsp"/>
    <j:style href="$resource/assets/styles/modal.css"/>
</head>
<body>


<div id="layout">
    <jsp:include page="${root_path}/examples/menu.jsp"/>
    <div id="main">
        <div class="header">
            <h1>sparrow js</h1>
            <h2>sparrow js demo</h2>
        </div>

        <div class="content">
            welcome to sparrow js framework
        </div>
    </div>


</div>
</body>
</html>