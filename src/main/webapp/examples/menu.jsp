<%@ page contentType="text/html;charset=UTF-8" language="java" %>
<%@taglib uri="http://www.sparrowzoo.com/ui" prefix="j" %>

<a href="#menu" id="menuLink" class="menu-link">
    <span></span>
</a>
<div id="divVerticalMenu">
    <div class="pure-menu">
        <a class="pure-menu-heading" href="javascript:$.browser.addFavorite('http://www.sparrowzoo.net','Sparrow 程序员在线工具')">收藏本站</a>

        <a class="pure-menu-heading" href="http://www.sparrowzoo.net">首页</a>
    </div>
    <div class="pure-menu">

        <a class="pure-menu-heading" href="#">菜单</a>

        <ul class="pure-menu-list">
            <li class="pure-menu-item"><a target="_blank" href="javascript:alert('hi i.m vertical menu');" class="pure-menu-link">垂直</a></li>
            <%--<li class="pure-menu-item"><a target="_blank" href="menu/top.html" class="pure-menu-link">水平</a></li>--%>
        </ul>
    </div>

    <div class="pure-menu">
        <a class="pure-menu-heading" href="#">动画</a>
        <ul class="pure-menu-list">
            <li class="pure-menu-item"><a href="${root_path}/examples/animation/animation.jsp" class="pure-menu-link">animation</a></li>

            <li class="pure-menu-item"><a href="${root_path}/examples/animation/interlace.jsp" class="pure-menu-link">interlace</a></li>
            <li class="pure-menu-item"><a href="${root_path}/examples/animation/marque.jsp" class="pure-menu-link">marque</a></li>
            <li class="pure-menu-item"><a href="${root_path}/examples/animation/show-hidden.jsp" class="pure-menu-link">show-hidden</a></li>

            <li class="pure-menu-item">
                <a href="${root_path}/examples/animation//progress.jsp" class="pure-menu-link">progress</a>
            </li>

            <li class="pure-menu-item"><a href="${root_path}/examples/animation/play.jsp" class="pure-menu-link">play</a></li>
            <li class="pure-menu-item"><a href="${root_path}/examples/animation/tabs.jsp" class="pure-menu-link">tabs</a></li>

        </ul>
    </div>

    <div class="pure-menu">
        <a class="pure-menu-heading" href="#">消息</a>
        <ul class="pure-menu-list">
            <li class="pure-menu-item"><a href="${root_path}/examples/message/jalert.jsp" class="pure-menu-link">jalert</a></li>
            <li class="pure-menu-item"><a href="${root_path}/examples/message/message.jsp" class="pure-menu-link">message</a></li>

            <li class="pure-menu-item">
                <a href="${root_path}/examples/message/window.html" class="pure-menu-link">window</a>
            </li>
        </ul>
    </div>

    <div class="pure-menu">
        <a class="pure-menu-heading" href="#">sparrow</a>
        <ul class="pure-menu-list">
            <li class="pure-menu-item"><a href="${root_path}/examples/selector/selector.jsp" class="pure-menu-link">选择器</a></li>

            <li class="pure-menu-item"><a href="${root_path}/examples/sparrow/date_picker.jsp" class="pure-menu-link">date picker</a></li>
            <li class="pure-menu-item"><a href="${root_path}/examples/sparrow/editor.jsp" class="pure-menu-link">editor</a></li>

            <li class="pure-menu-item">
                <a href="${root_path}/tools/jsonview.jsp" class="pure-menu-link">json 格式化</a>
            </li>
            <li class="pure-menu-item">
                <a href="${root_path}/examples/sparrow/jsonp-demo.jsp" class="pure-menu-link">jsonp</a>
            </li>
            <li class="pure-menu-item">
                <a href="${root_path}/examples/markdown.jsp" class="pure-menu-link">markdown demo</a>
            </li>

            <li class="pure-menu-item">
                <a href="${root_path}/examples/sparrow/sparrow.jsp" class="pure-menu-link">sparrow</a>
            </li>
            <li class="pure-menu-item">
                <a href="${root_path}/examples/sparrow/dispatcher.jsp" class="pure-menu-link">dispatcher</a>
            </li>
        </ul>


    </div>


    <div class="pure-menu">
        <a class="pure-menu-heading" href="#">工具</a>
        <ul class="pure-menu-list">
            <li class="pure-menu-item"><a href="${root_path}/tools/properties-yaml-converter.jsp" class="pure-menu-link">yaml转换器</a></li>
            <li class="pure-menu-item"><a href="${root_path}/tools/jsonview.jsp" class="pure-menu-link">JSON格式化</a></li>
            <li class="pure-menu-item"><a href="${root_path}/tools/qr-code.jsp" class="pure-menu-link">二维码在线生成器</a></li>
            <li class="pure-menu-item"><a href="${root_path}/tools/commend-line-format.jsp" class="pure-menu-link">Linux 命令行格式化</a></li>
        </ul>
    </div>
</div>
