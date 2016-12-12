package com.qipeipu.crm.wx.controller;

import com.qipeipu.crm.dtos.global.ResultDTO;
import com.qipeipu.crm.dtos.global.ResultState;
import com.qipeipu.crm.dtos.visit.CustomerBasedEntity;
import com.qipeipu.crm.service.wxCustomer.WxCustomerService;
import com.qipeipu.crm.session.UserSessionInfo;
import com.qipeipu.crm.utils.bean.tools.GUtils;
import com.qipeipu.crm.wx.util.TimeUtil;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.util.ArrayList;
import java.util.List;

/**
 * Created by laiyiyu on 2015/3/24.
 */
@Slf4j
@Controller
@RequestMapping(value = "wx/customer")
public class WxCustomerController {

	@Autowired
	private WxCustomerService wxCustomerService;

	@RequestMapping(value = "create/mfcty", method = RequestMethod.POST)
	public void createUserPhone(HttpServletRequest request,
			HttpServletResponse response,
			CustomerBasedEntity customerBasedEntity) {
		ResultDTO result;
		String mfctyName = customerBasedEntity.getMfctyName();
		String address = customerBasedEntity.getAddress();
		String contactMan = customerBasedEntity.getCactMan();
		String tel = customerBasedEntity.getCactTel();
		String currentTime = TimeUtil.getCurrentTime();
		Integer userID = UserSessionInfo.user_getUserOfRequest(request)
				.getUserId();

		if (mfctyName == null) {
			result = ResultDTO.failResult(ResultState.ERROR_CODE, "厂名称不能为空");
			GUtils.responseJson(response, result);
			return;
		}

		if (address == null) {
			result = ResultDTO.failResult(ResultState.ERROR_CODE, "地址不能为空");
			GUtils.responseJson(response, result);
			return;
		}

		if (contactMan == null) {
			result = ResultDTO.failResult(ResultState.ERROR_CODE, "联系人名称不能为空");
			GUtils.responseJson(response, result);
			return;
		}

		if (tel == null) {
			result = ResultDTO.failResult(ResultState.ERROR_CODE, "联系人号码不能为空");
			GUtils.responseJson(response, result);
			return;
		}

		/*if(checkPhoneIsUnique(phoneNo)){
			result.failResult(GParamsState.ERROR_CODE, "号码已存在，请重新输入");
			GUtils.responseJson(response, result);
			return;
		}*/
		customerBasedEntity.setCreateTime(currentTime);
		customerBasedEntity.setUserID(userID);
		Integer custID = wxCustomerService.createMfcty(customerBasedEntity).getId();

		if (custID == null) {
			result = ResultDTO.failResult(ResultState.ERROR_CODE, "新用户厂商添加失败");
			GUtils.responseJson(response, result);
			return;
		} else {
			customerBasedEntity.setId(custID);
			List<CustomerBasedEntity> customerBasedEntityList = new ArrayList<CustomerBasedEntity>();
			customerBasedEntityList.add(customerBasedEntity);
			result = ResultDTO
					.successResult(customerBasedEntityList);
		}
		GUtils.responseJson(response, result);
	}

}
