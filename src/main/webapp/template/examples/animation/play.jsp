<%@ page contentType="text/html;charset=UTF-8" language="java" %>
<%@taglib uri="http://www.sparrowzoo.com/ui" prefix="j" %>
<%@taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c" %>
<!doctype html>
<html lang="en">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Sparrow 动画 &ndash; Sparrow JS Framework</title>
    <style type="text/css">
 p{margin: 0px;}
    </style>
    <jsp:include page="/template/examples/head.jsp"/>
</head>

<body>

<div id="layout">
    <jsp:include page="/template/examples/menu.jsp"/>
    <div id="main">
        <div class="header">
            <h1>滑动动画效果</h1>
            <h2>最外层div  overflow:hidden;</h2>
        </div>

        <div class="content">
            <div style="margin: auto; background: red; border: red 1px solid; width: 240px; height: 100px; position: relative; z-index: 0; overflow: hidden;">
                <div onclick="left();"
                     style="z-index: 100; border: yellow 1px solid; width: 20px; height: 100px; position: absolute; left: 0px;">
                    向左
                </div>
                <div id="divList"
                     style="z-index: 0; background: #000; left: 20px; overflow: hidden; border: yellow 1px solid; width: 1400px; height: 100px; position: absolute;">

                    <p style="background: red; width: 200px;height:100px;float:left; margin: 0px;">1</p>

                    <p style="background: orange; width: 200px;height:100px;float:left;">2</p>

                    <p style="background: yellow; width: 200px;height:100px;float:left;">3</p>

                    <p style="background: blue; width: 200px;height:100px;float:left;">4</p>

                    <p style="background: #5cb85c; width: 200px;height:100px;float:left;">5</p>

                    <p style="background: #00c500; width: 200px;height:100px;float:left;">6</p>

                    <p style="background: #2e2e2e; width: 200px;height:100px;float:left;">7</p>
                </div>
                <div onclick="right();"
                     style="background: red; z-index: 100; border: yellow 1px solid; width: 20px; height: 100px; position: absolute; left: 220px;">
                    向右
                </div>
            </div>


        </div>
    </div>
</div>
</body>
<script type="application/javascript">

    var index = 0;
    //容器宽度
    var containerWidth = 240;
    //列表问宽度
    var listWidth = 1400;
    //控制条宽度
    var controlWidth = 20;
    //相框宽度
    var frameWidth = containerWidth - controlWidth * 2;
    //最大位置
    var maxTarget = controlWidth;
    //最小位置
    var minTarget = -(listWidth - frameWidth - controlWidth);
    var period = 1;
    function left() {
        index++;
        var targetLeft = -(frameWidth * index - controlWidth);
        if (targetLeft < minTarget) {
            targetLeft = minTarget;
            index--;
        }

        $("#divList").stop();
        $("#divList").animation("{left:'" + targetLeft + "px'}", period);
        document.title = targetLeft + "|" + index;
    }
    function right() {
        index--;
        var targetLeft = -(frameWidth * index - controlWidth);
        if (targetLeft > maxTarget) {
            targetLeft = maxTarget;
            index++;
        }

        $("#divList").stop();
        $("#divList").animation("{left:'" + targetLeft + "px'}", period);
        document.title = targetLeft + "|" + index;
    }
</script>
</html>