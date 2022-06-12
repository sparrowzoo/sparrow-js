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
    <title>Sparrow Editor &ndash; Sparrow JS Framework</title>
    <jsp:include page="/template/examples/head.jsp"/>
    <j:style href="$resource/assets/styles/sparrow.css"/>

    <script type="text/javascript">
        var editor = null;
        var editor2 = null;

        function showOuterHTML() {
            alert(editor.getEditorContent());
        }

        require(['src/main/webapp/template/examples/sparrow/sparrow', 'domReady!'], function ($, dom) {
            $.url.upload="http://upload.sparrowzoo.com";
            editor = new Sparrow.editor("editor");
            editor.initImageUploadEvent();
            editor.config.attach.key="forum";
            editor2 = new Sparrow.editor("editor2");
            editor.config.tool.adjust.adjustable = true;
            editor2.config.style = "simple";

            editor.initialize("divEditor");
            editor.attach.validate = function () {
                $("hdnContent").value = editor.getEditorContent();
                return true;
            };
            editor.attach.setParentObject(editor);
            editor2.initialize("divEditor2");
            document.domain=$.browser.cookie.root_domain;
        });
    </script>
</head>

<body>

<div id="layout">
    <jsp:include page="/template/examples/menu.jsp"/>
    <div id="main">
        <div class="header">
            <h1>在线编辑器</h1>
            <h2>sparrow editor</h2>
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
