<%@ page contentType="text/html;charset=UTF-8" language="java" %>
<%@taglib uri="http://www.sparrowzoo.com/ui" prefix="j" %>
<%@taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c" %>
<!doctype html>
<html lang="en">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
     <title>Sparrow 选择器 &ndash; Sparrow JS Framework</title>
    <jsp:include page="/examples/head.jsp"/>
</head>

<body>

<div id="layout">
    <jsp:include page="/examples/menu.jsp"/>
    <div id="main">
        <div class="header">
            <h1>SELECTOR</h1>
            <h2>Sparrow 选择器</h2>
        </div>

        <div class="content">
            selector 的第一个字符代码选择的类别
               <ul id="container">
                   <li>
                       原生标签对象 无选择符 $('html label id')
                       <input type="button" id="btnId" onclick="alert($('btnId').value)" value="点我输出我的value"/>
                   </li>

                   <li>
                       Sparrow标签对象 选择符 # 代表id $('#html label id')
                       <input type="button" id="sparrowId" onclick="alert($('#sparrowId').value())" value="点我输出我的value"/>
                   </li>

                   <li>
                       Sparrow标签对象 选择符 & 代表name $('&html label name') 助记 &在计算机中表示引用或地址
                       <input type="button" name="sparrowName"  onclick="alert($('&sparrowName').value())" value="点我输出我的value"/>
                   </li>

                   <li>
                       Sparrow标签对象 选择符 ^ 代表name $('^html label') 助记^表示标签起始标记&lt; 为避免与html冲突 所以用^
                       <input type="button" name="sparrowName"  onclick="alert($('^input')[0].value)" value="点我输出我的value"/>
                   </li>

                   <li>
                       Sparrow标签对象 选择符 $ 获取当前控件的for 标签  $('$html label') 助记$表示数字4的上档键，4英文发音for
                       <input type="text" value="我有标签" id="txtFor"><label id="lblFor" for="txtFor">我是标签的内容</label>
                       <input type="button" name="sparrowName"  onclick="alert($('$txtFor').html())" value="点我输出文本控件的for 标签内容"/>
                   </li>
               </ul>
        </div>
    </div>
</div>
</body>
</html>