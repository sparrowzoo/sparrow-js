<%@ page contentType="text/html;charset=UTF-8" language="java" %>
<%@taglib uri="http://www.sparrowzoo.com/ui" prefix="j" %>

<!doctype html>
<html lang="en">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>高性能、零依赖的Java前后端全栈框架,麻雀虽小，但五脏俱全 &ndash; Sparrow Framework</title>
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
            <h2>Github</h2>
            <ul>
                <li>
                    git clone <a href="https://github.com/sparrowzoo/sparrow-js">https://github.com/sparrowzoo/sparrow-js</a>
                </li>
                <li>
                    git clone <a href="https://github.com/sparrowzoo/sparrow-shell">https://github.com/sparrowzoo/sparrow-shell</a>
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
                    node
                    https://nodejs.org/en/download
                </li>
                <li>
                    gulp
                    https://www.gulpjs.com.cn/docs/getting-started
                </li>
            </ul>
            <h2>Build</h2>
            <ul>

                <li>
                    <H4>java</H4>
                    cd ${workspace}/sparrow-shell/sparrow-bom<br/>
                    mvn clean install -Dmaven.test.skip<br/>
                    cd ${workspace}/sparrow-shell<br/>
                    mvn clean install -Dmaven.test.skip<br/>
                </li>
                <li>
                    <h4>JS</h4>
                    cd ${workspace}/sparrow-js<br/>
                    gulp dev (开发版) <br/>
                    gulp (release版)<br/>
                </li>
            </ul>
        </div>
    </div>
</div>
</body>
</html>