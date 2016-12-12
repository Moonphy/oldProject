package com.qipeipu.crm.session;

import java.lang.reflect.InvocationTargetException;

import javax.servlet.http.HttpServletRequest;

import org.apache.commons.beanutils.BeanUtils;

import com.qipeipu.crm.dtos.user.UserDTO;
import com.qipeipu.crm.session.bean.CrmSessionUser;
import com.qmsk.session.UserSessionMemcache;

public class UserSessionInfo extends UserSessionMemcache {

	/**
	 * 登录
	 *
	 * @throws InvocationTargetException
	 * @throws IllegalAccessException
	 */
	public static boolean login(HttpServletRequest request, UserDTO user)
			throws IllegalAccessException, InvocationTargetException {
		CrmSessionUser sessionUser = new CrmSessionUser();
		user.setLoginPwd("");//清空密码
		BeanUtils.copyProperties(sessionUser, user);
		return UserSessionInfo.request_login(request, sessionUser);
	}

	/**
	 * 登录
	 *
	 * @throws InvocationTargetException
	 * @throws IllegalAccessException
	 */
	public static boolean login(HttpServletRequest request, CrmSessionUser user)
			throws IllegalAccessException, InvocationTargetException {
		CrmSessionUser sessionUser = new CrmSessionUser();
		return UserSessionInfo.request_login(request, sessionUser);
	}

	/**
	 * 获取cache中存储user对象
	 *
	 * @param request
	 * @return SessionUser
	 */
	public static CrmSessionUser user_getUserOfRequest(
			HttpServletRequest request) {
		return (CrmSessionUser) UserSessionMemcache.getUserOfRequest(request);
	}

	/**
	 * 获取cache中存储user对象
	 *
	 * @param sessionId
	 * @return SessionUser
	 */
	public static CrmSessionUser user_getUserOfSessionId(String sessionId) {
		return (CrmSessionUser) user_getValueOfSessionId(sessionId);
	}

	/**
	 * 获取userid
	 *
	 * @param sessionId
	 * @param idefault
	 * @return
	 */
	public static Integer user_getUserIdOfSessionId(String sessionId,
			Integer idefault) {
		CrmSessionUser u = user_getUserOfSessionId(sessionId);
		if (u != null) {
			return u.getUserId();
		} else {
			return idefault;
		}
	}

	/**
	 * 获取userid
	 *
	 * @param sessionId
	 * @param idefault
	 * @return
	 */
	public static Integer getUserIdOfRequest(HttpServletRequest request,
			Integer iDefault) {
		String sessionId = getSessionId(request);
		return user_getUserIdOfSessionId(sessionId, iDefault);
	}

	/**
	 * 获取用户名称
	 *
	 * @param request
	 * @return
	 */
	public static String getUserNameOfSession(HttpServletRequest request) {
		return user_getUserNameOfRequest(request);
	}

	/**
	 * 获取用户id
	 *
	 * @param request
	 * @return
	 */
	public static Integer getUserIdOfRequest(HttpServletRequest request) {
		return getUserIdOfRequest(request, 0);
	}

}