<%@ page contentType="text/html;charset=UTF-8" language="java" %>
<%@taglib uri="http://www.sparrowzoo.com/ui" prefix="j" %>

<!doctype html>
<html lang="en">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>从零开始的轻量级js框架,麻雀虽小，但五脏俱全 &ndash; Sparrow JS Framework</title>
    <jsp:include page="/template/examples/head.jsp"/>
    <j:style href="$resource/styles/modal.css"/>
</head>
<body>


<div id="layout">
    <jsp:include page="/template/examples/menu.jsp"/>
    <div id="main">
        <div class="header">
            <h1>sparrow js</h1>
            <h2>sparrow js demo</h2>
        </div>

        <div class="content">
            welcome to sparrow js framework

            <h3>github</h3>
            <ul>
                <li>
                    git clone <a href="https://github.com/sparrowzoo/sparrow-js">https://github.com/sparrowzoo/sparrow-js</a>
                </li>
                <li>
                    git clone markdown:<a href="https://github.com/sparrowzoo/sparrow-markdown">https://github.com/sparrowzoo/sparrow-markdown</a>
                    依赖sparrow java 框架,可参见 <a href="https://github.com/sparrowzoo/sparrow-shell">https://github.com/sparrowzoo/sparrow-shell</a>
                </li>
                <li>
                    cd ${workspace}/sparrow-js
                </li>
                <li>npm install</li>
                <li>
                    gulp dev (开发版) OR gulp (release版)
                </li>
            </ul>
        </div>
    </div>
</div>
</body>
</html>