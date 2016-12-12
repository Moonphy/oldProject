<%@ page import="com.qipeipu.crm.service.impl.user.UserServiceImpl" %>
<%@ page import="org.springframework.web.context.WebApplicationContext" %>
<%@ page import="org.springframework.web.context.support.WebApplicationContextUtils" %>
<%--
  用于启动脚本检查应用是否正常启动
  Created by IntelliJ IDEA.
  User: lichenq
  Date: 14/12/8
  Time: 下午3:59
--%>
<%@ page contentType="text/html;charset=UTF-8" language="java" %>
<%
    WebApplicationContext context = WebApplicationContextUtils.getWebApplicationContext(application);
    UserServiceImpl userServiceImpl = (UserServiceImpl) context.getBean("userServiceImpl");
    if (userServiceImpl != null) {
       response.getWriter().write("OK");
    } else {
        response.setStatus(500);
        response.getWriter().write("FAIL");
    }
%>
