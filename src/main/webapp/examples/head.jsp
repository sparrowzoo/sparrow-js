<%@ page contentType="text/html;charset=UTF-8" language="java" %>
<%@taglib uri="http://www.sparrowzoo.com/ui" prefix="j" %>
<j:style href="$resource/assets/styles/pure-css/pure.css"/>
<!--[if lte IE 8]>
<j:style href="$resource/assets/styles/layouts-old-ie.css"/>
<![endif]-->
<!--[if gt IE 8]><!-->
<j:style href="$resource/assets/styles/layouts.css"/>
<!--<![endif]-->
<j:script src="$resource/assets/scripts-dev/require.js"/>
<script type="text/javascript">
    requirejs.config({
        baseUrl: "/assets/scripts-dev",
        paths: {
           // Sparrow: 'sparrow'
        }
    });

    require(['sparrow','domReady!'], function ($,dom) {
        new $.menu("verticalMenu", $.VERTICAL,"menuLink").init();
    });
</script>
<script>
    var _hmt = _hmt || [];
    (function() {
        var hm = document.createElement("script");
        hm.src = "https://hm.baidu.com/hm.js?7d0cb4019538f62bb1700d28db7d1e65";
        var s = document.getElementsByTagName("script")[0];
        s.parentNode.insertBefore(hm, s);
    })();
</script>
