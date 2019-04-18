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
    <j:style href="$resource/assets/styles/sparrow.css"/>
</head>

<body>

<div id="layout">
    <jsp:include page="${root_path}/examples/menu.jsp"/>
    <div id="main">
        <div class="header">
            <h1> tab 页切换动画</h1>
            <h2>class="tab"为自动执行脚本 否则手动执行</h2>
        </div>


        <div class="content">
             <pre>

$("#.tabs").tabs();
</pre>


            <div id="tabs" class="tab">
                <div class="tab-title">
                    <ul>
                        <li class="select"><a href="javascript:void(0);"
                                              rev="http://www.baidu.com"><span>TAB1</span> </a></li>
                        <li class="no-select"><a rev="http://www.sohu.com"
                                                 href="javascript:void(0);"><span>TAB2</span> </a></li>
                        <li class="close"><a target="_blank" href="javascript:void(0);"
                                             onclick="parent.win.closeClick();"><span>关闭</span> </a></li>
                    </ul>
                </div>
                <div class="tab-content">
                    <div class="block">TAB1TAB1TAB1TAB1TAB1<br/>
                        TAB1TAB1TAB1TAB1TAB1<br/>
                        TAB1TAB1TAB1TAB1TAB1<br/>
                        TAB1TAB1TAB1TAB1TAB1<br/>
                        TAB1TAB1TAB1TAB1TAB1<br/>
                        TAB1TAB1TAB1TAB1TAB1<br/></div>
                    <div class="none">TAB2TAB2TAB2TAB2TAB2TAB2TAB2TAB2<br/>
                        TAB2TAB2TAB2TAB2TAB2TAB2TAB2TAB2<br/>
                        TAB2TAB2TAB2TAB2TAB2TAB2TAB2TAB2<br/>
                        TAB2TAB2TAB2TAB2TAB2TAB2TAB2TAB2<br/>TAB2TAB2TAB2TAB2TAB2TAB2TAB2TAB2<br/>TAB2TAB2TAB2TAB2TAB2TAB2TAB2TAB2<br/>TAB2TAB2TAB2TAB2TAB2TAB2TAB2TAB2<br/>TAB2TAB2TAB2TAB2TAB2TAB2TAB2TAB2<br/>


                    </div>
                </div>
            </div>


        </div>

    </div>
</div>
</body>

</html>