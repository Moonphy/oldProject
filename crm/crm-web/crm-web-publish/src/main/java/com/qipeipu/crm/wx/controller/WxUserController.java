package com.qipeipu.crm.wx.controller;

import com.qipeipu.crm.dtos.global.ResultDTO;
import com.qipeipu.crm.dtos.global.ResultState;
import com.qipeipu.crm.dtos.user.DepartDTO;
import com.qipeipu.crm.dtos.user.UserAreaDTO;
import com.qipeipu.crm.dtos.user.UserWxDTO;
import com.qipeipu.crm.service.user.UserAreaService;
import com.qipeipu.crm.service.user.UserService;
import com.qipeipu.crm.session.UserSessionInfo;
import com.qipeipu.crm.session.bean.CrmSessionUser;
import com.qipeipu.crm.utils.bean.tools.GUtils;
import com.utils.crypt.AESUtils;
import com.utils.web.RequestUtils;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.util.List;

@Slf4j
@Controller
@RequestMapping(value = "wx/user")
public class WxUserController {
	@Autowired
	private UserService userService;
	@Autowired
	private UserAreaService userAreaService;

	@RequestMapping(value = "find/info", method = RequestMethod.GET)
	public void serverCheck(HttpServletRequest request,
			HttpServletResponse response) {
		try {
			CrmSessionUser user = UserSessionInfo
					.user_getUserOfRequest(request);

			UserWxDTO userWx = userService.findUserWx(user.getUserId());
			userWx.setUserId(user.getUserId());
			userWx.setUserName(user.getUserName());
			userWx.setIsAdmin(user.getIsAdmin());
			userWx.setSex(user.getSex());
			userWx.setMp(user.getMp());
			userWx.setEmail(user.getEmail());

			GUtils.responseJson(response, ResultDTO.successResult(userWx));
		} catch (Exception e) {
			log.error("WxUserController.serverCheck", e);
			GUtils.responseJson(response,
					ResultDTO.failResult(ResultState.ERROR_CODE, ""));
		}
	}

	@RequestMapping(value = "edit/pwd")
	public void editPwd(HttpServletRequest request, HttpServletResponse response) {
		try {
			CrmSessionUser user = UserSessionInfo
					.user_getUserOfRequest(request);

			String oldPwd = RequestUtils.getString(request, "oldPwd");
			String newPwd = RequestUtils.getString(request, "newPwd");

			if (oldPwd == null || newPwd == null) {
				GUtils.responseJson(response, ResultDTO.failResult(
						ResultState.ERROR_CODE, "新旧密码不可为空"));
				return;
			}

			Integer isOk = userService.editPwd(user.getUserId(), AESUtils
					.getInst().encrypt(oldPwd),
					AESUtils.getInst().encrypt(newPwd));
			if (isOk == 1) {
				GUtils.responseJson(response, ResultDTO.successResult(""));

				UserSessionInfo.request_logout(request);
				request.getSession().removeAttribute("user");
				return;
			}
			GUtils.responseJson(response,
					ResultDTO.failResult(ResultState.ERROR_CODE, "修改密码失败"));
		} catch (Exception e) {
			log.error("WxUserController.editPwd", e);
			GUtils.responseJson(response,
					ResultDTO.failResult(ResultState.ERROR_CODE, ""));
		}
	}

	@RequestMapping(value = "edit/info")
	public void editInfo(HttpServletRequest request,
			HttpServletResponse response, UserWxDTO userInfo) {
		try {
			CrmSessionUser user = UserSessionInfo
					.user_getUserOfRequest(request);
			Integer isOk = userService.editInfo(user.getUserId(), userInfo);
			if (isOk == 1) {
				GUtils.responseJson(response, ResultDTO.successResult(""));
				return;
			}
			GUtils.responseJson(response,
					ResultDTO.failResult(ResultState.ERROR_CODE, "修改信息失败"));
		} catch (Exception e) {
			log.error("WxUserController.editInfo", e);
			GUtils.responseJson(response,
					ResultDTO.failResult(ResultState.ERROR_CODE, "修改信息失败"));
		}
	}

	@RequestMapping(value = "add/area")
	public void addArea(HttpServletRequest request,
			HttpServletResponse response, Integer areaId) {
		CrmSessionUser user = UserSessionInfo.user_getUserOfRequest(request);
		Integer result = userAreaService.addOrUpdate(areaId, user.getUserId());
		if (result != null && result > 0) {
			GUtils.responseJson(response, ResultDTO.successResult(""));
		} else {
			GUtils.responseJson(response,
					ResultDTO.failResult(ResultState.ERROR_CODE, ""));
		}
	}

	@RequestMapping(value = "find/fullArea")
	public void findFullArea(HttpServletRequest request,
			HttpServletResponse response) {
		CrmSessionUser user = UserSessionInfo.user_getUserOfRequest(request);
		UserAreaDTO result = userAreaService.findUserFullAddr(user.getUserId());
		if (result != null) {
			GUtils.responseJson(response, ResultDTO.successResult(result));
		} else {
			GUtils.responseJson(response,
					ResultDTO.failResult(ResultState.ERROR_CODE, ""));
		}
	}




	@RequestMapping(value = "find/depart")
	public void findDepart(HttpServletRequest request,
							 HttpServletResponse response) {
		//CrmSessionUser user = UserSessionInfo.user_getUserOfRequest(request);
		List<DepartDTO> departDTOs = userService.getDepartList();
		if (departDTOs != null) {
			GUtils.responseJson(response, ResultDTO.successResult(departDTOs));
		} else {
			GUtils.responseJson(response,
					ResultDTO.failResult(ResultState.ERROR_CODE, ""));
		}
	}

}
