<%@ page contentType="text/html;charset=UTF-8" language="java" %>
<%@taglib uri="http://www.sparrowzoo.com/ui" prefix="j" %>
<%@taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c" %>
<!doctype html>
<html lang="en">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Linux 命令行在线格式化 &ndash; Sparrow JS Framework</title>
    <jsp:include page="../examples/head.jsp"/>

    <script type="text/javascript">
        require(['sparrow', 'domReady!'], function ($, dom) {
            $("#btnFormat").bind("onclick", function () {

                $.ajax.req("POST", "${root_path}" + "/commend-line-format.json", function (responseText) {
                    var json = responseText.json();
                    if (json.code === 0) {
                        $("#divFormatCommandLine").html(json.data);
                    }
                }, "content=" + $("#txtRecommend").value().replace(/&/g, "%26"));
            });
            $("#btnFormat").source().click();
        });
    </script>
</head>

<body>

<div id="layout">
    <jsp:include page="../examples/menu.jsp"/>
    <div id="main">
        <div class="header">
            <h1>Linux 命令行格式化</h1>
        </div>
        <div class="content">
            <form class="pure-form pure-form-stacked">
                <fieldset>
                    <div class="pure-control-group">
                        <textarea rows="5" cols="80" id="txtRecommend" placeholder="请输入命令行执行结果">S0C    S1C    S0U    S1U      EC       EU        OC         OU       MC     MU    CCSC   CCSU   YGC     YGCT    FGC    FGCT     GCT
228864.0 177664.0  0.0   177205.7 637952.0 118761.6 2097152.0   203641.5  74368.0 72519.6 9088.0 8480.5      7    1.199   3      1.311    2.510
228864.0 177664.0  0.0   177205.7 637952.0 118761.6 2097152.0   203641.5  74368.0 72519.6 9088.0 8480.5      7    1.199   3      1.311    2.510
</textarea>
                    </div>

                    <div class="pure-control-group">
                        <input id="btnFormat" class="pure-button pure-button-primary" type="button" value="格式化"/>
                    </div>

                    <div id="divFormatCommandLine" class="pure-control-group">

                    </div>
                </fieldset>
            </form>
        </div>
    </div>
</div>
</body>
</html>