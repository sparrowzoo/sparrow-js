<%@ page contentType="text/html;charset=UTF-8" language="java" %>
<%@taglib uri="http://www.sparrowzoo.com/ui" prefix="j" %>
<%@taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c" %>
<!doctype html>
<html lang="en">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
     <title>Sparrow tab切换 &ndash; Sparrow JS Framework</title>
    <jsp:include page="/template/examples/head.jsp"/>
    <j:style href="$resource/styles/sparrow.css"/>
    <script type="text/javascript" language="JavaScript">


        require(['sparrow', 'domReady!'], function ($, dom) {
            $("#tabs").tabs();
            $("#tabeditor").tabs();
        });
    </script>
</head>

<body>

<div id="layout">
    <jsp:include page="/template/examples/menu.jsp"/>
    <div id="main">
        <div class="header">
            <h1> tab 页切换动画</h1>
            <h2>class="tab"为自动执行脚本 否则手动执行</h2>
        </div>


        <div class="content">
             <pre>
$("#tabs").tabs();
</pre>

            <%--<div class="tab-title">--%>
            <%--<ul>--%>
            <%--<li class="select"><a  href="javascript:void(0);"--%>
            <%--rev="http://www.baidu.com"><span>TAB1</span> </a>--%>
            <%--</li>--%>
            <%--<li class="no-select">--%>
            <%--<a rev="http://www.sohu.com"--%>
            <%--href="javascript:void(0);"><span>TAB2</span> </a>--%>
            <%--</li>--%>
            <%--<li class="close">--%>
            <%--<a target="_blank" href="javascript:void(0);"--%>
            <%--onclick="parent.win.closeClick();"><span>关闭</span> </a>--%>
            <%--</li>--%>
            <%--</ul>--%>
            <%--</div>--%>

            <div id="tabs" class="tab">

                <div class="pure-menu pure-menu-horizontal">
                    <ul class="pure-menu-list" style="width: 100%;">
                        <li class="pure-menu-item"><a rev="http://ww2w.baidu.com" href="#" class="pure-menu-link"><span>Selected</span></a>
                        </li>
                        <li class="pure-menu-item"><a rev="http://www2.sina.com" href="#" class="pure-menu-link"><span>Normal</span></a>
                        </li>
                        <li class="pure-menu-item more"><a target="_blank">MORE</a></li>
                    </ul>
                </div>

                <div class="tab-content">
                    <div class="block">
                        <ul class="items">
                            <li class="item"><a class="link">www.baidu.com</a><span class="text">111</span></li>

                            <li class="item"><a class="link">www.baidu.com</a><span class="text">111</span></li>
                            <li class="item"><a class="link">www.baidu.com</a><span class="text">111</span></li>
                            <li class="item"><a class="link">www.baidu.com</a><span class="text">111</span></li>
                            <li class="item"><a class="link">www.baidu.com</a><span class="text">111</span></li>
                        </ul>
                    </div>
                    <div class="none">

                        <ul class="items">
                            <li class="item"><a class="link">www.baidu.com</a><span class="text">111</span></li>

                            <li class="item"><a class="link">www.baidu.com</a><span class="text">111</span></li>
                            <li class="item"><a class="link">www.baidu.com</a><span class="text">111</span></li>
                            <li class="item"><a class="link">www.baidu.com</a><span class="text">111</span></li>
                            <li class="item"><a class="link">www.baidu.com</a><span class="text">111</span></li>
                            <li class="item"><a class="link">www.baidu.com</a><span class="text">111</span></li>

                            <li class="item"><a class="link">www.baidu.com</a><span class="text">111</span></li>
                            <li class="item"><a class="link">www.baidu.com</a><span class="text">111</span></li>
                            <li class="item"><a class="link">www.baidu.com</a><span class="text">111</span></li>
                            <li class="item"><a class="link">www.baidu.com</a><span class="text">111</span></li>


                        </ul>


                    </div>
                </div>
            </div>

            <div id="tabeditor" class="tab">
                <div class="pure-menu pure-menu-horizontal" id="sparrow_29053584709821">
                    <ul class="pure-menu-list" style="width: 100%;" id="sparrow_12565494756422257">
                        <li class="pure-menu-item pure-menu-selected" id="sparrow_7634657658249133" tab_index="0"><a
                                target="_self" href="javascript:void(0);" class="pure-menu-link"
                                id="sparrow_017794983137893183"><span>本地图片</span></a></li>
                        <li class="pure-menu-item" id="sparrow_3746897690425648" tab_index="1">
                            <a target="_self"
                                                                                                  href="javascript:void(0);"
                                                                                                  class="pure-menu-link"
                                                                                                  id="sparrow_9473977880208615"><span>网络图片</span></a>
                        </li>
                    </ul>
                </div>
                <div class="tab-content" id="sparrow_8933450649348391">
                    <div id="threadeditor_localUploadImgTab" class="block">
                        <div style="width:100%;height:auto;overflow:hidden;padding:2px;"
                             id="editor_uploadImgContainer"></div>
                        <iframe name="editor_fileUpload" id="editor_fileUpload_image" class="file-frame" frameborder="0"
                                src="http://script.sparrowzoo.com/FileUpload?pathKey=thread&amp;editor=editor"></iframe>
                        <br></div>
                    <div class="none">图片URL:<input style="width:300px;" id="editor_txtImage" type="text"><br><span
                            id="editor_spanImageErrorMessage"></span><br><input value="插入图片" type="button"
                                                                                onclick="editor.insertImage();"></div>
                </div>
            </div>

        </div>

    </div>
</div>
</body>

</html>