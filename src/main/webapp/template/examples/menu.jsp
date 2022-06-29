<%@ page contentType="text/html;charset=UTF-8" language="java" %>
<%@taglib uri="http://www.sparrowzoo.com/ui" prefix="j" %>

<a href="#menu" id="menuLink" class="menu-link">
    <span></span>
</a>
<div id="divVerticalMenu">
    <div class="pure-menu">
        <a class="pure-menu-heading"
           href="javascript:$.browser.addFavorite('http://www.sparrowzoo.com','Sparrow 为程序员服务')">收藏本站</a>

        <a class="pure-menu-heading" href="http://www.sparrowzoo.com">首页</a>
    </div>
<%--    <div class="pure-menu">--%>

<%--        <a class="pure-menu-heading" href="#">菜单</a>--%>

<%--        <ul class="pure-menu-list">--%>
<%--            <li class="pure-menu-item"><a target="_blank" href="javascript:alert('hi i.m vertical menu');"--%>
<%--                                          class="pure-menu-link">垂直</a></li>--%>
<%--            &lt;%&ndash;<li class="pure-menu-item"><a target="_blank" href="menu/top.html" class="pure-menu-link">水平</a></li>&ndash;%&gt;--%>
<%--        </ul>--%>
<%--    </div>--%>

    <div class="pure-menu">
        <a class="pure-menu-heading" href="#">动画</a>
        <ul class="pure-menu-list">
            <li class="pure-menu-item"><a href="${root_path}/examples/animation/animation" class="pure-menu-link">animation</a>
            </li>

            <li class="pure-menu-item"><a href="${root_path}/examples/animation/interlace" class="pure-menu-link">interlace</a>
            </li>
            <li class="pure-menu-item"><a href="${root_path}/examples/animation/marque"
                                          class="pure-menu-link">marque</a></li>
            <li class="pure-menu-item"><a href="${root_path}/examples/animation/show-hidden" class="pure-menu-link">show-hidden</a>
            </li>

            <li class="pure-menu-item">
                <a href="${root_path}/examples/animation/progress" class="pure-menu-link">progress</a>
            </li>

            <li class="pure-menu-item"><a href="${root_path}/examples/animation/play" class="pure-menu-link">play</a>
            </li>
            <li class="pure-menu-item"><a href="${root_path}/examples/animation/tabs" class="pure-menu-link">tabs</a>
            </li>

        </ul>
    </div>

    <div class="pure-menu">
        <a class="pure-menu-heading" href="#">消息</a>
        <ul class="pure-menu-list">
            <li class="pure-menu-item"><a href="${root_path}/examples/message/jalert" class="pure-menu-link">jalert</a>
            </li>
            <li class="pure-menu-item"><a href="${root_path}/examples/message/message"
                                          class="pure-menu-link">message</a></li>
        </ul>
    </div>

    <div class="pure-menu">
        <a class="pure-menu-heading" href="#">sparrow</a>
        <ul class="pure-menu-list">
            <li class="pure-menu-item"><a href="${root_path}/examples/selector/selector" class="pure-menu-link">选择器</a>
            </li>

            <li class="pure-menu-item"><a href="${root_path}/examples/sparrow/date_picker" class="pure-menu-link">date
                picker</a></li>
            <li class="pure-menu-item"><a href="${root_path}/examples/sparrow/editor" class="pure-menu-link">editor</a>
            </li>

            <li class="pure-menu-item">
                <a href="${root_path}/tools/jsonview" class="pure-menu-link">json 格式化</a>
            </li>
            <li class="pure-menu-item">
                <a href="${root_path}/examples/sparrow/jsonp-demo" class="pure-menu-link">jsonp</a>
            </li>
            <li class="pure-menu-item">
                <a href="${root_path}/examples/markdown" class="pure-menu-link">markdown demo</a>
            </li>

            <li class="pure-menu-item">
                <a href="${root_path}/examples/sparrow/sparrow" class="pure-menu-link">sparrow</a>
            </li>
            <li class="pure-menu-item">
                <a href="${root_path}/examples/sparrow/dispatcher" class="pure-menu-link">dispatcher</a>
            </li>



        </ul>


    </div>


    <div class="pure-menu">
        <a class="pure-menu-heading" href="#">工具</a>
        <ul class="pure-menu-list">
            <li class="pure-menu-item"><a href="${root_path}/tools/properties-yaml-converter" class="pure-menu-link">yaml转换器</a>
            </li>
            <li class="pure-menu-item"><a href="${root_path}/tools/jsonview" class="pure-menu-link">JSON格式化</a></li>
            <li class="pure-menu-item"><a href="${root_path}/tools/qr-code" class="pure-menu-link">二维码在线生成器</a></li>
            <li class="pure-menu-item"><a href="${root_path}/tools/commend-line-format" class="pure-menu-link">Linux
                命令行格式化</a></li>
        </ul>
    </div>
    <div class="pure-menu">
        <a class="pure-menu-heading" href="#">MVC</a>
        <ul class="pure-menu-list">
            <li class="pure-menu-item"><a target="_blank" href="${root_path}/hello-world" class="pure-menu-link">hello-world</a>
            </li>

            <li class="pure-menu-item"><a target="_blank" href="${root_path}/hello" class="pure-menu-link">hello-controller</a>
            </li>

            <li class="pure-menu-item"><a target="_blank" href="${root_path}/fly" class="pure-menu-link">重定向flash缓存</a>
            </li>
            <li class="pure-menu-item"><a target="_blank" href="${root_path}/transit-test" class="pure-menu-link">中转提示</a>
            </li>
            <li class="pure-menu-item"><a target="_blank" href="${root_path}/thread-10000-1" class="pure-menu-link">url传参</a>
            <li class="pure-menu-item"><a target="_blank" href="${root_path}/json-test.json" class="pure-menu-link">返回json</a>
            <li class="pure-menu-item"><a target="_blank" href="${root_path}/exception.json" class="pure-menu-link">异常json</a>

            <li class="pure-menu-item"><a target="_blank" href="${root_path}/exception" class="pure-menu-link">页面异常提示</a>
            <li class="pure-menu-item"><a target="_blank" href="${root_path}/authorizing" class="pure-menu-link">登录认证</a>
        </ul>
    </div>
</div>
