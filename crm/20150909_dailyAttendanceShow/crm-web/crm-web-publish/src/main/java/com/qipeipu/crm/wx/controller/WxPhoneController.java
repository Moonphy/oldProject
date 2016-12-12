package com.qipeipu.crm.wx.controller;

import com.qipeipu.crm.dtos.visit.PlatTypeEntity;
import com.qipeipu.crm.dtos.global.ResultDTO;
import com.qipeipu.crm.dtos.global.ResultState;
import com.qipeipu.crm.dtos.global.VoModel;
import com.qipeipu.crm.dtos.phone.PublicPhoneEntity;
import com.qipeipu.crm.dtos.phone.UserPhoneDTO;
import com.qipeipu.crm.dtos.phone.UserPhoneEntity;
import com.qipeipu.crm.service.phone.PhoneService;
import com.qipeipu.crm.session.UserSessionInfo;
import com.qipeipu.crm.session.bean.CrmSessionUser;
import com.qipeipu.crm.utils.bean.tools.GUtils;
import com.qipeipu.crm.wx.util.TimeUtil;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.util.Collections;
import java.util.List;

/**
 * Created by laiyiyu on 2015/3/23.
 */
@Slf4j
@Controller
@RequestMapping(value = "wx/phone")
public class WxPhoneController {


	@Autowired
	private PhoneService phoneService;

	@RequestMapping(value = "find/own/all", method = RequestMethod.GET)
	public void getAllUserPhone(HttpServletRequest request,
			HttpServletResponse response, VoModel<?, ?> vo, String key) {
		CrmSessionUser user = UserSessionInfo.user_getUserOfRequest(request);
		phoneService.getUserPhonesByParams(vo, user.getUserId(), key);
		GUtils.responseJson(response, ResultDTO.successResult(vo));
	}

	@RequestMapping(value = "find/pub/all", method = RequestMethod.GET)
	public void getAllPubPhone(HttpServletRequest request,
			HttpServletResponse response, VoModel<?, ?> vo, String key) {
		CrmSessionUser user = UserSessionInfo.user_getUserOfRequest(request);
		phoneService.getAllPublicPhoneByParams(vo, key);
		GUtils.responseJson(response, ResultDTO.successResult(vo));
	}

	@RequestMapping(value = "find/own", method = RequestMethod.POST)
	public void getUserPhoneByID(HttpServletRequest request,
			HttpServletResponse response, Integer contactID) {
		List<UserPhoneEntity> userPhoneEntityList = phoneService
				.getUserPhoneByContactID(contactID);
		ResultDTO result = null;
		if (userPhoneEntityList == null) {
			userPhoneEntityList = Collections.EMPTY_LIST;
		}
		result = ResultDTO.successResult(userPhoneEntityList);

		GUtils.responseJson(response, result);
	}

	@RequestMapping(value = "find/pub", method = RequestMethod.POST)
	public void getPubPhoneByID(HttpServletRequest request,
			HttpServletResponse response, Integer contactID) {
		List<PublicPhoneEntity> publicPhoneEntityList = phoneService
				.getPublicPhoneByContactID(contactID);
		ResultDTO result = null;
		if (publicPhoneEntityList == null) {
			publicPhoneEntityList = Collections.EMPTY_LIST;
		}
		result = ResultDTO.successResult(publicPhoneEntityList);

		GUtils.responseJson(response, result);
	}




	@RequestMapping(value = "create/userPhone", method = RequestMethod.POST)
	public void createUserPhone(HttpServletRequest request, HttpServletResponse response, UserPhoneDTO userPhoneDTO){
		ResultDTO result = null;
		String contactMan = userPhoneDTO.getContactMan();
		String phoneNo = userPhoneDTO.getPhoneNo();
		String currentTime = TimeUtil.getCurrentTime();
		Integer userID = UserSessionInfo.user_getUserOfRequest(request).getUserId();

		if(contactMan==null){
			result = ResultDTO.failResult(ResultState.ERROR_CODE, "联系人名称不能为空");
			GUtils.responseJson(response, result);
			return;
		}

		if(phoneNo==null) {
			result = ResultDTO.failResult(ResultState.ERROR_CODE, "联系人号码不能为空");
			GUtils.responseJson(response, result);
			return;
		}

		/*if(checkPhoneIsUnique(phoneNo)){
			result.failResult(GParamsState.ERROR_CODE, "号码已存在，请重新输入");
			GUtils.responseJson(response, result);
			return;
		}*/
		userPhoneDTO.setCreateTime(currentTime);
		userPhoneDTO.setUserID(userID);
		int insertState = phoneService.createUserPhone(userPhoneDTO);
		if(insertState==0){
			result = ResultDTO.failResult(ResultState.ERROR_CODE, "新联系人添加失败");
			GUtils.responseJson(response, result);
			return;
		}else{
			result = ResultDTO.successResult(ResultState.SUCCESS_CODE, "新联系人添加成功");
		}
		GUtils.responseJson(response, result);
	}



	@RequestMapping(value = "update/userPhone", method = RequestMethod.POST)
	public void updateUserPhone(HttpServletRequest request, HttpServletResponse response, UserPhoneDTO userPhoneDTO){
		ResultDTO result = null;
		String contactMan = userPhoneDTO.getContactMan();
		String phoneNo = userPhoneDTO.getPhoneNo();
		String currentTime = TimeUtil.getCurrentTime();

		if(contactMan==null){
			result = ResultDTO.failResult(ResultState.ERROR_CODE, "联系人名称不能为空");
			GUtils.responseJson(response, result);
			return;
		}

		if(phoneNo==null) {
			result = ResultDTO.failResult(ResultState.ERROR_CODE, "联系人号码不能为空");
			GUtils.responseJson(response, result);
			return;
		}

		/*if(checkPhoneIsUnique(phoneNo)){
			result.failResult(GParamsState.ERROR_CODE, "号码已存在，请重新输入");
			GUtils.responseJson(response, result);
			return;
		}*/
		userPhoneDTO.setUpdateTime(currentTime);
		int updateState = phoneService.updateUserPhone(userPhoneDTO);
		if(updateState==0){
			result = ResultDTO.failResult(ResultState.ERROR_CODE, "联系人更改失败");
			GUtils.responseJson(response, result);
			return;
		}else{
			result = ResultDTO.successResult(ResultState.SUCCESS_CODE, "联系人更改成功");
		}
		GUtils.responseJson(response, result);
	}

	@RequestMapping(value = "del/userPhone", method = RequestMethod.POST)
	public void delUserPhone(HttpServletRequest request, HttpServletResponse response, UserPhoneDTO userPhoneDTO){
		ResultDTO result = null;


		int delState = phoneService.delUserPhone(userPhoneDTO);
		if(delState==0){
			result = ResultDTO.failResult(ResultState.ERROR_CODE
					, "联系人删除失败");
			GUtils.responseJson(response, result);
			return;
		}else{
			result = ResultDTO.successResult(ResultState.SUCCESS_CODE, "联系人删除成功");
		}
		GUtils.responseJson(response, result);
	}



	@RequestMapping(value = "getContectType", method = RequestMethod.GET)
	public void getPlatType(HttpServletRequest request, HttpServletResponse response){
		List<PlatTypeEntity> platTypeEntityList = phoneService.getAllPlatType();
		ResultDTO result;
		if (platTypeEntityList == null) {
			platTypeEntityList = Collections.EMPTY_LIST;
		}
		result = ResultDTO.successResult(platTypeEntityList);

		GUtils.responseJson(response, result);
	}


}
