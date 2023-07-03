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
    <!--test document ready-->
    <script language="JavaScript" type="text/javascript">
        require(['sparrow','domReady'], function ($, dom) {
            console.log("requirejs require ready");
            console.log("requirejs dom ready -"+dom);
            console.log("requirejs helle {0}".format(" sparrow !"));
        });
        window.onload=function (ev) { console.log("window onload")}

        // document.ready(function () {
        //     console.log("requirejs document ready");
        // });

    </script>
</head>

<body>

<div id="layout">
    <jsp:include page="${root_path}/template/examples/menu.jsp"/>

    <div id="main">
        <div class="header">
            <h1>Requirejs domReady</h1>
            <h2>https://requirejs.org/docs/download.html#domReady</h2>
        </div>

        <div class="content">
            <img src="23423" alt="测试超时"><br/>
            <img src="/timeout?seconds=2" alt="测试超时"><br/>
            <img src="/timeout?seconds=3" alt="测试超时"><br/>
            <img src="/timeout?seconds=4" alt="测试超时"><br/>

            <img src="/error?t=1" alt="测试超时"><br/>
            <img src="/error?t=2" alt="测试超时"><br/>
            <img src="/error?t=3" alt="测试超时"><br/>


            <img src="http://passport.sparrowzoo.com/error?t=1" alt="测试超时"><br/>
            <img src="http://passport.sparrowzoo.com/error?t=2" alt="测试超时"><br/>
            <img src="http://passport.sparrowzoo.com/error?t=3" alt="测试超时"><br/>
            <img src="http://passport.sparrowzoo.com/error?t=4" alt="测试超时"><br/>
            <img src="http://passport.sparrowzoo.com/error?t=5" alt="测试超时"><br/>

            <ul>
            <li>jquery document ready vs requirejs domready<br/>https://stackoverflow.com/questions/15332628/requirejs-domready-plugin-vs-jquery-document-ready</li>
           <li>
               npmjs<br/>
            https://www.npmjs.com/package/requirejs-domready  <br/>"requirejs-domready": "^2.0.3"
           </li>
            </ul>
        </div>

    </div>
</div>
</body>
</html>