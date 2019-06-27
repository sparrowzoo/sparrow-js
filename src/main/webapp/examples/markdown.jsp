<%@ page contentType="text/html;charset=UTF-8" language="java" %>
<%@taglib uri="http://www.sparrowzoo.com/ui" prefix="j" %>
<!doctype html>
<html lang="en">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="description"
          content="A layout example with a side menu that hides on mobile, just like the Pure website.">
    <title>Sparrow Markdown &ndash; Sparrow JS Framework</title>
    <jsp:include page="head.jsp"/>

    <script type="text/javascript">
        var lastPressTime=new Date().getTime();
        var lastContext=null;
        function preview() {
            lastPressTime=new Date().getTime();
        }
        window.setInterval(function () {
            var currentTime=new Date().getTime();
            if(currentTime-lastPressTime>1000&&lastContext!==$("#divPreview").html()){
                previewRequest();
            }
        },1000);
        function previewRequest() {
            $.ajax.json("${root_path}"+"/preview.json","markdown="+$("divContent").innerText,function(json){
                $("#divPreview").html(json.data.html);
                lastContext=$("#divPreview").html()
            });
        }
    </script>
</head>
<body>


<div id="layout">
    <jsp:include page="menu.jsp"/>
    <div id="main">
        <div class="header">
            <h1>Page Title</h1>
            <h2>A subtitle for your page goes here</h2>
        </div>

        <div style="max-width: 100%;" class="content">
            <div style="width: 100%;" class="pure-g">
                <div id="divContent" onkeyup="preview(this);" style="max-height: 100%;height:800px;" class="pure-u-1-2"
                     contenteditable="true"></div>
                <div id="divPreview" style="max-height: 100%;height:800px;" class="pure-u-1-2"></div>
            </div>
        </div>
    </div>
</div>
</body>
</html>