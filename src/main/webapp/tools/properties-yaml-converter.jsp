<%@ page contentType="text/html;charset=UTF-8" language="java" %>
<%@taglib uri="http://www.sparrowzoo.com/ui" prefix="j" %>
<!doctype html>
<html lang="en">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>spring properties yaml 在线转换器 Sparrow JS Framework</title>
    <jsp:include page="../examples/head.jsp"/>

    <script type="text/javascript">
        function properties2Yaml() {
            $.ajax.req("POST", "${root_path}" + "/to-yaml.json", function (responseText) {
                var json = responseText.json();
                if (json.code === 0) {
                    $("#divPreview").html(json.data);
                }
            }, "content=" + $("#txtContent").value().replace(/&/g, "%26"));
        }

        function yaml2Properties(){
            $.ajax.req("POST", "${root_path}" + "/to-properties.json", function (responseText) {
                var json = responseText.json();
                if (json.code === 0) {
                    $("#divPreview").html(json.data);
                }
            }, "content=" + $("#txtContent").value().replace(/&/g, "%26"));
        }

        document.ready(function () {
            new $.menu("verticalMenu", $.VERTICAL, "menuLink").init();
            previewRequest();
            //textarea支持tab缩进
            $("#txtContent").bind(
                'onkeydown',
                function (e) {
                    if (e.keyCode !== 9) {
                        return;
                    }
                    e.preventDefault();
                    var indent = '    ';
                    var start = this.selectionStart;
                    var end = this.selectionEnd;
                    var selected = window.getSelection().toString();
                    selected = indent + selected.replace(/\n/g, '\n' + indent);
                    this.value = this.value.substring(0, start) + selected
                        + this.value.substring(end);
                    this.setSelectionRange(start + indent.length, start
                        + selected.length);
                })
        });
    </script>
</head>
<body>


<div id="layout">
    <jsp:include page="../examples/menu.jsp"/>
    <div id="main">
        <div class="header">
            <h1>spring properties yaml 在线转换器</h1>
        </div>

        <div style="max-width: 100%;" class="content">
            <input onclick="properties2Yaml();" class="pure-button pure-button-primary" type="button" value="spring properties 转 yaml"/>

            <input onclick="yaml2Properties();" class="pure-button pure-button-primary" type="button" value="spring yaml 转 properties"/>

            <div style="width: 100%;" class="pure-g">
                <textarea id="txtContent" style="max-height: 100%;height:800px;"
                          class="pure-u-11-24"></textarea>
                <textarea id="divPreview" style="max-height: 100%;height:800px;overflow: scroll;"
                          class="pure-u-12-24"></textarea>
            </div>
        </div>
    </div>
</div>
</body>
</html>