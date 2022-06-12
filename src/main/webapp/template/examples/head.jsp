<%@ page contentType="text/html;charset=UTF-8" language="java" %>
<%@taglib uri="http://www.sparrowzoo.com/ui" prefix="j" %>
<meta name="description"
      content="从零开始的轻量级js框架,麻雀虽小，但五脏俱全">
<j:style href="$resource/styles/pure-css/pure.css"/>
<!--[if lte IE 8]>
<j:style href="$resource/styles/layouts-old-ie.css"/>
<![endif]-->
<!--[if gt IE 8]><!-->
<j:style href="$resource/styles/layouts.css"/>
<!--<![endif]-->
<j:script src="$resource/scripts-dev/require.js"/>
<script type="text/javascript">
    requirejs.config({
        baseUrl: "${resource}/scripts-dev",
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
