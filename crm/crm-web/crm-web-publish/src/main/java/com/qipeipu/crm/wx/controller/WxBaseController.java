package com.qipeipu.crm.wx.controller;

import java.io.PrintWriter;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import lombok.extern.slf4j.Slf4j;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.servlet.ModelAndView;

import com.qipeipu.crm.dtos.global.ResultDTO;
import com.qipeipu.crm.dtos.global.ResultState;
import com.qipeipu.crm.dtos.user.UserDTO;
import com.qipeipu.crm.service.user.UserService;
import com.qipeipu.crm.session.UserSessionInfo;
import com.qipeipu.crm.utils.bean.tools.GUtils;
import com.qipeipu.crm.wx.bean.WxConfig;
import com.qipeipu.crm.wx.util.WxBaseAPI;
import com.qipeipu.crm.wx.util.WxUtil;
import com.utils.crypt.AESUtils;
import com.utils.web.RequestUtils;

@Slf4j
@Controller
@RequestMapping(value = "wx/base")
public class WxBaseController {
	@Autowired
	private UserService userService;

	@RequestMapping(value = "isok", method = RequestMethod.GET)
	public void serverCheck(HttpServletRequest request,
			HttpServletResponse response) {
		PrintWriter out = null;
		try {
			String signature = request.getParameter("signature"); // 微信加密签名
			String echostr = request.getParameter("echostr");// 随机字符串
			String timestamp = request.getParameter("timestamp");// 时间戳
			String nonce = request.getParameter("nonce"); // 随机数

			out = response.getWriter();
			// 通过检验signature对请求进行校验，若校验成功则原样返回echostr，表示接入成功，否则接入失败
			if (WxUtil.checkSignature(signature, timestamp, nonce)) {
				out.print(echostr);
			}
		} catch (Exception e) {
			log.error("WxTokenController.doGet", e);
		} finally {
			if (out != null) {
				out.close();
				out = null;
			}
		}
	}

	@RequestMapping(value = "check")
	public ModelAndView check(HttpServletRequest request,
			HttpServletResponse response) {
		StringBuilder sb = new StringBuilder();
		sb.append("redirect:");
		try {
			sb.append(WxConfig.getInstance().getCheck_redirectUrl());

			String code = RequestUtils.getString(request, "code");
			log.info("------------code:" + code);
			//判断code
			if (code == null || code.length() == 0) {
				sb.append("?error=1");
				return new ModelAndView(sb.toString());
			}
			//获取openId
			String openId = WxBaseAPI.getOpenID(code);
			sb.append("?error=0&openId=");
			sb.append(openId);

			if (openId != null) {
				UserDTO user = userService.isExistOpenId(openId);
				//已绑定直接跳转首页
				if (user != null) {
					user.setLoginPwd(null);
					//注册session
					UserSessionInfo.login(request, user);

					sb.setLength(0);
					sb.append("redirect:");
					sb.append(WxConfig.getInstance().getIndex_redirectUrl());
					log.info(sb.toString());
					return new ModelAndView(sb.toString());
				}
			}
		} catch (Exception e) {
			log.error("WxTokenController.check", e);
			log.error(sb.toString().replace("error=0", "error=1"));
			return new ModelAndView(sb.toString().replace("error=0", "error=1"));
		}
		log.info(sb.toString());
		return new ModelAndView(sb.toString());
	}

	/**
	 * 登录
	 *
	 * 1.获取用户登录信息；2.openId是否存在，不存在绑定，存在比对(微信开关off该步骤无效)
	 *
	 * @param request
	 * @param response
	 */
	@RequestMapping(value = "login")
	public void login(HttpServletRequest request, HttpServletResponse response) {
		try {
			String openId = RequestUtils.getString(request, "openId");
			String loginName = RequestUtils.getString(request, "loginName");
			String loginPwd = RequestUtils.getString(request, "loginPwd");
			if (loginName == null
					|| loginPwd == null
					|| (WxConfig.getInstance().getWx_switch() && openId == null)) {
				GUtils.responseJson(response,
						ResultDTO.failResult(ResultState.ERROR_CODE, "参数有误"));
				return;
			}

			UserDTO user = new UserDTO();
			user.setLoginName(loginName);
			user.setLoginPwd(AESUtils.getInst().encrypt(loginPwd));
			user = userService.login(user);

			if (user != null) {
				user.setLoginPwd("");
				//微信开关
				if (WxConfig.getInstance().getWx_switch()) {
					if (! GUtils.isEmptyOrNull(user.getOpenId())) {
						//新旧openId不匹配验证(其实应该重新绑定)
						if (!user.getOpenId().equals(openId)) {
							GUtils.responseJson(response, ResultDTO.failResult(
									ResultState.ERROR_CODE, "已经绑定了其他帐号"));
							return;
						}
					} else {
						//openId不存在绑定
						userService.bindWx(user.getUserId(), openId);
					}
				}

				//注册session
				UserSessionInfo.login(request, user);
				GUtils.responseJson(response, ResultDTO.successResult(user));
				return;
			}
			GUtils.responseJson(response,
					ResultDTO.failResult(ResultState.ERROR_CODE, "帐号/密码错误"));
		} catch (Exception e) {
			log.error("WxTokenController.login", e);
			GUtils.responseJson(response,
					ResultDTO.failResult(ResultState.ERROR_CODE, "error"));
		}
	}

	/**
	 * 登录
	 *
	 * 1.获取用户登录信息；2.openId是否存在，不存在绑定，存在比对(微信开关off该步骤无效)
	 *
	 * @param request
	 * @param response
	 */
	@RequestMapping(value = "/app/login")
	public void loginApp(HttpServletRequest request, HttpServletResponse response) {
		try {
			String loginName = RequestUtils.getString(request, "loginName");
			String loginPwd = RequestUtils.getString(request, "loginPwd");
			if (loginName == null || loginPwd == null) {
				GUtils.responseJson(response,
						ResultDTO.failResult(ResultState.ERROR_CODE, "参数有误"));
				return;
			}

			UserDTO user = new UserDTO();
			user.setLoginName(loginName);
			user.setLoginPwd(AESUtils.getInst().encrypt(loginPwd));
			user = userService.login(user);

			if (user != null) {
				user.setLoginPwd(null);
				//注册session
				UserSessionInfo.login(request, user);
				GUtils.responseJson(response, ResultDTO.successResult(user));
				return;
			}
			GUtils.responseJson(response,
					ResultDTO.failResult(ResultState.ERROR_CODE, "帐号/密码错误"));
		} catch (Exception e) {
			log.error("WxBaseController.app.login", e);
			GUtils.responseJson(response,
					ResultDTO.failResult(ResultState.ERROR_CODE, "error"));
		}
	}
}
