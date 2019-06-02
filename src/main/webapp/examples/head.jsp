<%@ page contentType="text/html;charset=UTF-8" language="java" %>
<%@taglib uri="http://www.sparrowzoo.com/ui" prefix="j" %>
<j:style href="$resource/assets/styles/pure-css/pure.css"/>
<!--[if lte IE 8]>
<j:style href="$resource/assets/styles/layouts-old-ie.css"/>
<![endif]-->
<!--[if gt IE 8]><!-->
<j:style href="$resource/assets/styles/layouts.css"/>
<!--<![endif]-->
<j:script src="$resource/assets/scripts-all/sparrow.js"/>
<script type="text/javascript">
    document.ready(function () {
        new Menu("verticalMenu", $.VERTICAL).init();
    });
</script>