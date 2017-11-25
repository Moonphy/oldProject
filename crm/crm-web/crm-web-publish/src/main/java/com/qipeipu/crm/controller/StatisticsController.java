package com.qipeipu.crm.controller;

import javax.servlet.http.HttpServletRequest;

import org.apache.log4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.ModelMap;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;

import com.qipeipu.crm.dtos.customer.CustomerDTO;
import com.qipeipu.crm.dtos.customer.params.CustomerParamsDTO;
import com.qipeipu.crm.dtos.global.ResultDTO;
import com.qipeipu.crm.dtos.global.ResultState;
import com.qipeipu.crm.dtos.global.VoModel;
import com.qipeipu.crm.service.main.OrderInCSService;
import com.qipeipu.crm.session.UserSessionInfo;
import com.qipeipu.crm.session.bean.CrmSessionUser;

/**
 * 客户相关 Created by johnkim on 15-2-5.
 */
@Controller
@RequestMapping(value = "statistics")
public class StatisticsController {
	private static final Logger logger = Logger
			.getLogger(StatisticsController.class);
	@Autowired
	private OrderInCSService orderInCSService;

	@RequestMapping(value = "tel/tradeInfo", method = RequestMethod.GET)
	public String findTelTradeInfo(HttpServletRequest request, ModelMap map,
			CustomerDTO customer, VoModel vo, CustomerParamsDTO params) {
		String dispatch = "statistics/1";
		try {
			if (vo != null) {
				CrmSessionUser user = UserSessionInfo
						.user_getUserOfRequest(request);
				//只查询客服自己的客户
				//userId=0时说明查询全部
				if (customer.getUserId() == null) {
					customer.setUserId(user.getUserId());
				}
				if (params == null) {
					params = CustomerParamsDTO.builder();
				}
				params.setIsAdmin(user.getIsAdmin());
				vo.setParams(customer, params);
				vo = orderInCSService.findTelTradeInfo(vo);
				map.put("result", ResultDTO.successResult(vo));
			} else {
				map.put("result",
						ResultDTO.failResult(ResultState.ERROR_CODE, "无法获取到参数"));
			}
		} catch (Exception e) {
			logger.error("{业绩统计-电话统计查询失败}" + e.getMessage());
		}
		return dispatch;
	}

	@RequestMapping(value = "summary/tradeInfo", method = RequestMethod.GET)
	public String findSummaryTradeInfo(HttpServletRequest request,
			ModelMap map, CustomerDTO customer, VoModel vo,
			CustomerParamsDTO params) {
		String dispatch = "statistics/all";
		try {
			if (vo != null) {
				CrmSessionUser user = UserSessionInfo
						.user_getUserOfRequest(request);
				//只查询客服自己的客户
				customer.setUserId(user.getUserId());
				if (params == null) {
					params = CustomerParamsDTO.builder();
				}
				params.setIsAdmin(user.getIsAdmin());
				vo.setParams(customer, params);
				vo = orderInCSService.findSummaryTradeInfo(vo);
				map.put("result", ResultDTO.successResult(vo));
			} else {
				map.put("result",
						ResultDTO.failResult(ResultState.ERROR_CODE, "无法获取到参数"));
			}
		} catch (Exception e) {
			logger.error("{业绩统计-汇总统计信息查询失败}", e);
		}
		return dispatch;
	}

}
