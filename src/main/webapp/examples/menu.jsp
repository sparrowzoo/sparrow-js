<!-- Menu toggle -->
<%@ page contentType="text/html;charset=UTF-8" language="java" %>
<%@taglib uri="http://www.sparrowzoo.com/ui" prefix="j" %>

<a href="#menu" id="menuLink" class="menu-link">
    <!-- Hamburger icon -->
    <span></span>
</a>
<div id="divVerticalMenu">
    <div class="pure-menu">
        <a class="pure-menu-heading" href="${root_path}">首页</a>
    </div>
    <div class="pure-menu">
        <a class="pure-menu-heading" href="#">菜单</a>

        <ul class="pure-menu-list">
            <li class="pure-menu-item"><a target="_blank" href="javascript:alert('hi i.m vertical menu');" class="pure-menu-link">垂直</a></li>
            <li class="pure-menu-item"><a target="_blank" href="menu/top.html" class="pure-menu-link">水平</a></li>
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
                <a href="animation/progress.html" class="pure-menu-link">progress</a>
            </li>

            <li class="pure-menu-item"><a href="${root_path}/examples//animation/play.html" class="pure-menu-link">play</a></li>
        </ul>
    </div>

    <div class="pure-menu">
        <a class="pure-menu-heading" href="#">消息</a>
        <ul class="pure-menu-list">
            <li class="pure-menu-item"><a href="${root_path}/examples//message/jalert.html" class="pure-menu-link">jalert</a></li>
            <li class="pure-menu-item"><a href="${root_path}/examples//message/message.html" class="pure-menu-link">message</a></li>

            <li class="pure-menu-item">
                <a href="${root_path}/examples/message/window.html" class="pure-menu-link">window</a>
            </li>
        </ul>
    </div>

    <div class="pure-menu">
        <a class="pure-menu-heading" href="#">sparrow</a>
        <ul class="pure-menu-list">
            <li class="pure-menu-item"><a href="${root_path}/examples/sparrow/date_picker.html" class="pure-menu-link">date picker</a></li>
            <li class="pure-menu-item"><a href="${root_path}/examples/sparrow/editor.html" class="pure-menu-link">editor</a></li>

            <li class="pure-menu-item">
                <a href="${root_path}/examples/sparrow/json.html" class="pure-menu-link">json</a>
            </li>
        </ul>
    </div>
</div>