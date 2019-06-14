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
    <title>Sparrow DatePicker &ndash; Sparrow JS Framework</title>
    <jsp:include page="${root_path}/examples/head.jsp"/>

    <script type="text/javascript">
        var editor = new SparrowEditor("editor");
        var editor2 = new SparrowEditor("editor2");
        window.onload = function () {
            editor.config.tool.adjust.adjustable = true;
            editor2.config.style = "simple";


            editor.initialize("divEditor");

            editor.attach.validate = function () {
                $("hdnContent").value = editor.getEditorContent();
                return true;
            };
            editor.attach.setParentObject(editor);
            editor2.initialize("divEditor2");




        }
        function showOuterHTML() {
            alert(editor.getEditorContent());
        }
    </script>
</head>

<body>

<div id="layout">
    <jsp:include page="${root_path}/examples/menu.jsp"/>
    <div id="main">
        <div class="header">
            <h1>日期控件</h1>
            <h2>windows 日期选择控件</h2>
        </div>

        <div class="content">
            <input id="txtTitle" type="text"/>

            <input id="hdnContent" type="text">
            <input id="btnShowOuterHTML" type="button" value="显示内容"
                   onclick="showOuterHTML();"/>

            <div id="divEditor"
                 style="width: 700px; height: 400px; border: #ccc 1px solid;"></div>
            <div id="divEditor2"
                 style="width:500px; height:300px; border: #ccc 1px solid;"></div>

        </div>

    </div>
</div>
</body>
</html>
