<%@ page import="java.util.Enumeration" %>
<%@ page language="java" pageEncoding="UTF-8" %>

<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html>
<head>
    <script type="text/javascript" src="jquery.js"></script>
    <script type="text/javascript" src="http://127.0.0.1:8000/data/order-status.js"/>
</head>
<body>
<%
    String str = "";
    if (request.getParameter("ajax") != null && request.getParameter("ajax") != null) {
        Enumeration enumt = request.getParameterNames();
        while (enumt.hasMoreElements()) {
            str = enumt.nextElement().toString();
            out.println(str + ":" + request.getParameter(str) + "<br>");
        }
    }
    out.println("hello world");
    out.flush();
%>

<script type="text/javascript" language="JavaScript">
    $.post("ajax-post.jsp", "p=123", function (json) {
        alert(json);
    });
</script>
AJAX DEMO

</body>
</html>