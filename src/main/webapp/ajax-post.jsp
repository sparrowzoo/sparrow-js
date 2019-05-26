<%@ page contentType="text/html;charset=UTF-8" language="java" %>
<%
    response.setHeader("Content-type","text/json");
    out.clear();
    out.println("{\"result\":\"hello world\"}");
    out.flush();
%>