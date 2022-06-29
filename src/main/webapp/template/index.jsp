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
            <h1>Sparrow</h1>
            <h2>高性能 零依赖的java WEB前后端全栈框架</h2>
        </div>

        <div class="content">
            <h2>github</h2>
            <ul>
                <li>
                    git clone <a href="https://github.com/sparrowzoo/sparrow-js">https://github.com/sparrowzoo/sparrow-js</a>
                </li>
                <li>
                    git clone markdown:<a href="https://github.com/sparrowzoo/sparrow-shell">https://github.com/sparrowzoo/sparrow-shell</a>
                    依赖sparrow java 框架,可参见 <a href="https://github.com/sparrowzoo/sparrow-shell">https://github.com/sparrowzoo/sparrow-shell</a>
                </li>
                <li>
                    cd ${workspace}/sparrow-js
                </li>
            </ul>

            <h2>JAVA环境依赖</h2>
            <ul>
                <li>
                    64bit JDK 1.8
                </li>
                <li>
                    MAVEN 3.3.9
                </li>
                <li>
                    Git
                </li>
            </ul>

            <h2>Js环境依赖</h2>
            <ul>
                <li>
                    install node
                    https://nodejs.org/en/download/
                </li>
                <li>
                    gulp install
                    https://www.gulpjs.com.cn/docs/getting-started/
                </li>
            </ul>
            <h2>Build</h2>
            <ul>
                <li>
                    js: gulp dev (开发版) OR gulp (release版)
                </li>
                <li>
                    java:mvn clean install -Dmaven.test.skip
                </li>
            </ul>
        </div>
    </div>
</div>
</body>
</html>