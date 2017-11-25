package com.qipeipu.crm.session;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import com.qipeipu.crm.constant.RequestMethodConst;
import com.qipeipu.crm.dtos.global.ResultDTO;
import com.qipeipu.crm.dtos.global.ResultState;
import com.qipeipu.crm.utils.bean.tools.GUtils;
import lombok.extern.slf4j.Slf4j;

import org.springframework.web.servlet.HandlerInterceptor;
import org.springframework.web.servlet.ModelAndView;

import com.qipeipu.crm.session.auth.AuthManager;
import com.qipeipu.crm.session.bean.CrmSessionUser;
import com.qipeipu.crm.utils.bean.data.MultipleDataSource;

/****
 * 未登录用户拦截器 | 登录用户请求自动添加基础数据 | 访问控制拦截器
 *
 * @author dreamstu
 * @author liujunyong
 */
@Slf4j
public class AddParamsInterceptor implements HandlerInterceptor {

	@Override
	public boolean preHandle(HttpServletRequest request,
							 HttpServletResponse response,
							 Object handler) throws Exception {
		//请求资源的用户信息
		CrmSessionUser user = UserSessionInfo.user_getUserOfRequest(request);

		//请求资源
		String currUrl = request.getRequestURI();
		String currMethod = request.getMethod() ;
		//webApp根目录路径
		String appName = request.getContextPath();

		if (request.getSession() == null) {
			log.info("uri----------" + currUrl + ";session: Null");
		} else {
			log.info("uri----------" + currUrl + ";sessionId:"
					+ request.getSession().getId());
		}

		//未登录用户拦截(未搞懂是什么业务的，先不碰)
		if (user == null
				&& !"/login".equals(currUrl)
				&& !"/login-modal".equals(currUrl)
				&& !"/loginAsync".equals(currUrl)
				&& !currUrl.contains("wx/base")) {
			request.setAttribute("next", (appName + currUrl).equals("/logout")?"":appName + currUrl);
			request.setAttribute("msg", "你需要登录才能操作！");
			request.getRequestDispatcher("/login").forward(request, response);

			log.info("用户尚未登录，已转发至登录页面");
			return false;
		}
		if (user == null) return true ;

		//访问控制拦截
		if (! user.getIsAdmin())	//是否为超级管理员
			if (! AuthManager.getInstance().check(
					user , currUrl , RequestMethodConst.getRequestMethodType(currMethod).getIndex() , 1)) {
				log.info("auth----------false");

				//ajax请求返回
				String requestType = request.getHeader("X-Requested-With");
				if (null != requestType && requestType.equals("XMLHttpRequest")) {
					GUtils.responseJson(response, ResultDTO.failResult(ResultState.ERROR_CODE, "你无权访问"));
					log.info("用户无权使用该ajax访问");
					return false ;
				}

				//方法1
				//response.sendError(401 , "Unauthorized");
				//方法2
				request.setAttribute("msg", "你需要权限才能访问！");
				request.getRequestDispatcher("/index").forward(request, response);

				log.info("用户无权访问，已转发至首页");
				return false;
			}
		log.info("auth----------true");

		return true;
	}

	@Override
	public void postHandle(HttpServletRequest request,
			HttpServletResponse response, Object handler,
			ModelAndView modelAndView) throws Exception {
		String appName = request.getContextPath();
		String currUrl = request.getRequestURI();

		// modelAndView.addObject("title", title);
		if (modelAndView != null) {//可能为ajax请求
			modelAndView.addObject("appName", appName);
			modelAndView.addObject("currUrl", currUrl);
			modelAndView.addObject("currUser", (CrmSessionUser)UserSessionInfo.user_getUserOfRequest(request));
		}

	}

	@Override
	public void afterCompletion(HttpServletRequest request,
			HttpServletResponse response, Object handler, Exception ex)
					throws Exception {
		String currUrl = request.getRequestURI();
		if (request.getSession() == null) {
			log.info("end----" + currUrl + ";session: Null");
		} else {
			log.info("end----" + currUrl + ";sessionId:"
					+ request.getSession().getId());
		}
		MultipleDataSource.setDataSourceKey("dataSource");
	}

}
