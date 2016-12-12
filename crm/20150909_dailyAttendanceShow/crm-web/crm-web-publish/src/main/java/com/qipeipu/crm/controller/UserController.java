package com.qipeipu.crm.controller;

import com.qipeipu.crm.dtos.global.ResultDTO;
import com.qipeipu.crm.dtos.global.ResultState;
import com.qipeipu.crm.dtos.user.UserDTO;
import com.qipeipu.crm.dtos.user.UserMaintainEntity;
import com.qipeipu.crm.service.user.UserService;
import com.qipeipu.crm.session.UserSessionInfo;
import com.qipeipu.crm.session.bean.CrmSessionUser;
import com.qipeipu.crm.utils.bean.tools.GUtils;
import com.utils.crypt.AESUtils;
import lombok.extern.slf4j.Slf4j;
import org.apache.commons.lang.StringUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.ModelMap;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.util.List;

/**
 * Created by johnkim on 14-12-25.
 */
@Slf4j
@Controller
public class UserController {

	@Autowired
	private UserService userService;


	@RequestMapping(value = "find/byKey", method = RequestMethod.GET)
	public void getUserPhoneByID(HttpServletRequest request,
								 HttpServletResponse response, String key) {
		List<UserMaintainEntity> userMaintainEntityList = userService.findUserByKey(key);
		ResultDTO result;
		result = ResultDTO.successResult(userMaintainEntityList);
		GUtils.responseJson(response, result);
	}

	@RequestMapping(value = "login", method = RequestMethod.POST)
	public String login(HttpServletRequest request,
			HttpServletResponse response, ModelMap map, UserDTO user,
			String next) {
		String dispatch = "login";
		try {
			String name = user.getLoginName();
			String pwd = user.getLoginPwd();
			if (StringUtils.equals(null, name) || StringUtils.equals("", name)) {
				map.put("result", ResultDTO.failResult(
						ResultState.ERROR_CODE, "请输入用户账户名！", user));
			} else if (StringUtils.equals(null, pwd)
					|| StringUtils.equals("", pwd)) {
				map.put("result", ResultDTO.failResult(
						ResultState.ERROR_CODE, "请输入登录密码！", user));
			} else {
				user.setLoginPwd(AESUtils.getInst().encrypt(pwd));
				UserDTO userInfo = userService.login(user);
				if (userInfo != null) {
					//注册session
					UserSessionInfo.login(request, userInfo);
					userInfo.setLoginPwd("");
					request.getSession().setAttribute("user", userInfo);
					dispatch = "index";
					if (!GUtils.isEmptyOrNull(next)) {
						dispatch = "";
						response.sendRedirect(next);
					}
				} else {
					map.put("result", ResultDTO.failResult(
							ResultState.ERROR_CODE, "用户名或密码错误！", user));
				}
			}
			user.setLoginPwd("");
		} catch (Exception e) {
			log.error("{用户登录失败：{}}", e);
		}
		return dispatch;
	}

	@RequestMapping(value = "loginAsync", method = RequestMethod.POST)
	public void loginAsync(HttpServletRequest request,
						HttpServletResponse response, UserDTO user) {
		try {
			String name = user.getLoginName();
			String pwd = user.getLoginPwd();
			String msg = "";
			if (StringUtils.equals(null, name) || StringUtils.equals("", name)) {
				msg = "请输入用户账户名！";
			} else if (StringUtils.equals(null, pwd)
					|| StringUtils.equals("", pwd)) {
				msg = "请输入登录密码！";
			} else {
				user.setLoginPwd(AESUtils.getInst().encrypt(pwd));
				UserDTO userInfo = userService.login(user);
				if (userInfo != null) {
					//注册session
					UserSessionInfo.login(request, userInfo);
					userInfo.setLoginPwd("");
					request.getSession().setAttribute("user", userInfo);
					GUtils.responseJson(response,ResultDTO.successResult(userInfo,"登录成功"));
					return;
				} else {
					msg = "用户名或密码错误！";
				}
			}
			GUtils.responseJson(response, ResultDTO.failResult(ResultState.ERROR_CODE,msg));
		} catch (Exception e) {
			log.error("{用户登录失败：{}}", e);
			GUtils.responseJson(response, ResultDTO.failResult(ResultState.ERROR_CODE,"服务器内部错误"));
		}
	}

	@RequestMapping(value = "logout", method = RequestMethod.GET)
	public String logout(HttpServletRequest request, ModelMap map) {
		String dispatch = "login";
		try {
			//清除用户session信息
			UserSessionInfo.request_logout(request);

			request.getSession().removeAttribute("user");
			request.setAttribute("msg", "你已成功退出");
		} catch (Exception e) {
			log.error("{用户退出失败：}{}", e.getMessage());
		}
		return dispatch;
	}

	@RequestMapping(value = "resetpwd", method = RequestMethod.POST)
	public String resetPwd(HttpServletRequest request, ModelMap map,
			UserDTO user) {
		String dispatch = "resetpwd";
		try {
			String pwd = user.getLoginPwd();
			String newpwd = user.getNewloginPwd();
			String repwd = user.getRepassword();
			if (StringUtils.equals(null, pwd) || StringUtils.equals("", pwd)) {
				map.put("result", ResultDTO.failResult(
						ResultState.ERROR_CODE, "请输入原始密码！", user));
			} else if (StringUtils.equals(null, newpwd)
					|| StringUtils.equals("", newpwd)) {
				map.put("result", ResultDTO.failResult(
						ResultState.ERROR_CODE, "请输入新密码！", user));
			} else if (StringUtils.equals(null, repwd)
					|| StringUtils.equals("", repwd)) {
				map.put("result", ResultDTO.failResult(
						ResultState.ERROR_CODE, "请重复新密码！", user));
			} else {
				user.setLoginPwd(AESUtils.getInst().encrypt(pwd));
				user.setLoginName(UserSessionInfo.getUserNameOfSession(request));
				UserDTO userInfo = userService.login(user);
				if (userInfo != null) {
					if (newpwd.equals(repwd)) {
						if (!pwd.equals(newpwd)) {
							user.setNewloginPwd(AESUtils.getInst().encrypt(user
									.getNewloginPwd()));
							boolean rs = userService.resetPwd(user);
							if (rs) {
								user.setLoginPwd("");
								user.setRepassword("");
								user.setNewloginPwd("");
								map.put("result", ResultDTO.successResult(
										user, "密码修改成功!"));
							} else {
								map.put("result", ResultDTO.failResult(
										ResultState.ERROR_CODE, "密码修改失败！",
										user));
							}
						} else {
							map.put("result", ResultDTO.failResult(
									ResultState.ERROR_CODE, "新密码与原始密码相同！",
									user));
							user.setLoginPwd(pwd);
						}
					} else {
						map.put("result", ResultDTO.failResult(
								ResultState.ERROR_CODE, "新密码两次输入不一致!", user));
						user.setLoginPwd(pwd);
					}
				} else {
					map.put("result", ResultDTO.failResult(
							ResultState.ERROR_CODE, "原始密码输错！", user));
					user.setLoginPwd("");
				}
			}
		} catch (Exception e) {
			log.error("{密码修改失败：}{}", e.getMessage());
		}
		return dispatch;
	}

	/***
	 * 查询符合条件的客服信息
	 *
	 * @param request
	 * @param response
	 * @memo ajax
	 */
	@RequestMapping(value = "user/list", method = RequestMethod.GET)
	public void getUserList(HttpServletRequest request,
			HttpServletResponse response) {
		List<UserDTO> list = userService.findUser(null);
		ResultDTO result = ResultDTO.failResult(ResultState.ERROR_CODE,
				"未查询到客服信息");
		if (list != null) {
			if (list.size() > 0)
				result = ResultDTO.successResult(list);
			else
				result.setMsg("没有客服信息。");
		}
		GUtils.responseJson(response, result);
	}

	/***
	 * 查询符合条件的客服信息
	 *
	 * @param request
	 * @param response
	 * @memo ajax
	 */
	@RequestMapping(value = "user/dtl", method = RequestMethod.GET)
	public void getUserDtl(HttpServletRequest request,
			HttpServletResponse response) {
		CrmSessionUser user = UserSessionInfo.user_getUserOfRequest(request);

		ResultDTO result = ResultDTO.failResult(ResultState.ERROR_CODE,
				"未查询到客服信息");
		if (user != null) {
			UserDTO userDto = new UserDTO();
			userDto.setLoginName(user.getLoginName());
			userDto.setSex(user.getSex());
			user.setIsAdmin(user.getIsAdmin());
			user.setWeCharNo(user.getWeCharNo());

			result = ResultDTO.successResult(userDto);
		} else {
			result.setMsg("没有客服信息。");
		}
		GUtils.responseJson(response, result);
	}
}
