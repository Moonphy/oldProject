package com.qipeipu.crm.controller;

import java.util.List;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import lombok.extern.slf4j.Slf4j;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;

import com.qipeipu.crm.dtos.basedata.CityDTO;
import com.qipeipu.crm.dtos.global.ResultDTO;
import com.qipeipu.crm.dtos.global.ResultState;
import com.qipeipu.crm.service.basedata.CityService;
import com.qipeipu.crm.utils.bean.tools.GUtils;

/**
 * 基础数据相关1 Created by johnkim on 15-2-5.
 */
@Slf4j
@Controller
@RequestMapping(value = "base")
public class BaseDataController {

	private static final org.slf4j.Logger logger = org.slf4j.LoggerFactory
			.getLogger(BaseDataController.class);

	@Autowired
	private CityService cityService;

	/***
	 * 返回所有城市
	 * 
	 * @memo ajax
	 */
	@RequestMapping(value = "city", method = RequestMethod.GET)
	public void getAllCity(HttpServletRequest request,
			HttpServletResponse response) {
		List<CityDTO> list = cityService.findAllCity();
		ResultDTO result = ResultDTO.failResult(ResultState.ERROR_CODE,
				"未查询到此汽修厂信息,请检查汽修厂ID是否输入正确。");
		if (list != null) {
			result = ResultDTO.successResult(list);
		}
		GUtils.responseJson(response, result);
	}

}
