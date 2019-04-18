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
    <title>Sparrow 动画 &ndash; Sparrow JS Framework</title>
    <jsp:include page="${root_path}/examples/head.jsp"/>
</head>

<body>

<div id="layout">
    <jsp:include page="${root_path}/examples/menu.jsp"/>
    <div id="main">
        <div class="header">
            <h1> 进度条...</h1>
        </div>


        <div class="content">
            <input style="background: yellowgreen;height: 50px;width: 200px;" type="button" onclick="progress();"
                   value="点击我可以显示哟~~"/>
        </div>

    </div>
</div>
<script type="application/javascript">
    function progress() {
        $(this).progressbar(
            function (progress) {

                if (parseInt(progress.s.style.width, 10) >= 100) {
                    progress.s.style.width = "100%";
                    progress.s.innerHTML = "100%";
                    progress.end();
                    window.setTimeout(progress.remove, 5000);
                } else {
                    progress.s.style.width = (parseInt(progress.s.style.width, 10) + Math
                            .floor(Math.random() * 3))
                        + "%";
                    progress.s.innerHTML = progress.s.style.width;
                }
            }, {
                style: 'width:1000px;height:30px;border:#ccc 1px solid;',
                progressStyle: 'background:#ccc;height:30px;'
            });
    }
</script>
</body>

</html>