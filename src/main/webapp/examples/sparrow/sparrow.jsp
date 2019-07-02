<%@ page contentType="text/html;charset=UTF-8" language="java" %>
<%@taglib uri="http://www.sparrowzoo.com/ui" prefix="j" %>
<%@taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c" %>
<!doctype html>
<html lang="en">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Sparrow 框架静态成员</title>
    <jsp:include page="/examples/head.jsp"/>
    <script language="JavaScript" type="text/javascript">
        require(['sparrow', 'domReady'], function ($, dom) {
            var end = (new Date("2099/12/31 23:59:59")).valueOf();
            $.countDown(end, new Date().valueOf(), $("txtTimer"));

            $("#spanDate").html($.getBeforeTime("2019/07/01 00:00:00"));
        });
    </script>
</head>

<body>

<div id="layout">
    <jsp:include page="/examples/menu.jsp"/>

    <div id="main">
        <div class="header">
            <h1>Sparrow Static</h1>
            <h2>sparrow.js</h2>
        </div>

        <div class="content">
            <label>倒计时 距 2099/12/31 23:59:59 还有</label><input type="text" id="txtTimer" class="input"/><br/>

            <label>距 2019/07/01 00:00:00已过去</label><span id="spanDate"></span><br/>


            <input class="button" type="button" value="设置cookie"
                   onclick="$.browser.setCookie('userId2','admin1');"><label>browser.setCookie('userId2','admin1');</label><br/>
            <input class="button" type="button" value="读cookie"
                   onclick="alert($.browser.getCookie('userId2'));"><label>browser.getCookie('userId2')</label><br/>

        </div>
    </div>

</div>
</div>
</body>
</html>