<%@ page contentType="text/html;charset=UTF-8" language="java" %>
<%@taglib uri="http://www.sparrowzoo.com/ui" prefix="j" %>
<%@taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c" %>
<!doctype html>
<html lang="en">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Dispatcher 请求分发 Sparrow JS Framework</title>
    <jsp:include page="/examples/head.jsp"/>
    <script language="JavaScript" type="text/javascript">
        require(['sparrow', 'domReady'], function ($, dom) {
            $.dispatcher.eventRegistry = [{
                id: "btn1",//控件标签 id
                delegate: function (e, srcElement) {
                    alert(srcElement.value);
                    srcElement.value = "update";
                },//事件委托
                //api: "api",//ajax请求的api
                strategy: "insert",//策略 控件的 value
            }, {
                id: "btn1",//控件标签 id
                delegate: function (e, srcElement) {
                    alert(srcElement.value);
                    srcElement.value = "insert";
                },//事件委托
                // api: "api",//ajax请求的api
                strategy: "update",//策略 控件的 value
            }];

            $.dispatcher.register({
                id: "btn2",//控件标签 id
                delegate: function (e, srcElement) {
                    alert(srcElement.value);
                },//事件委托
                //api: "api",//ajax请求的api
            });
            $.dispatcher.bind();
        });
    </script>
</head>

<body>

<div id="layout">
    <jsp:include page="/examples/menu.jsp"/>

    <div id="main">
        <div class="header">
            <h1>Sparrow Dispatcher</h1>
            <h2>Sparrow Dispatcher Controller</h2>
        </div>

        <pre>
            require(['sparrow', 'domReady'], function ($, dom) {
            $.dispatcher.eventRegistry = [{
                id: "btn1",//控件标签 id
                delegate: function (e, srcElement) {
                    alert(srcElement.value);
                    srcElement.value = "update";
                },//事件委托
                //api: "api",//ajax请求的api
                strategy: "insert",//策略 控件的 value
            }, {
                id: "btn1",//控件标签 id
                delegate: function (e, srcElement) {
                    alert(srcElement.value);
                    srcElement.value = "insert";
                },//事件委托
                // api: "api",//ajax请求的api
                strategy: "update",//策略 控件的 value
            }];

            $.dispatcher.register({
                id: "btn2",//控件标签 id
                delegate: function (e, srcElement) {
                    alert(srcElement.value);
                },//事件委托
                //api: "api",//ajax请求的api
            });
            $.dispatcher.bind();
        });
        </pre>
        <div class="content">
            <input type="button" id="btn1" value="insert"/>
            <input type="button" id="btn2" value="delete"/>
        </div>

    </div>
</div>
</body>
</html>