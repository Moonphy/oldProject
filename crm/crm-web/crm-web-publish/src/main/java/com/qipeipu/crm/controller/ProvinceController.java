package com.qipeipu.crm.controller;

import java.util.List;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import lombok.extern.slf4j.Slf4j;

import org.apache.commons.collections.CollectionUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.ModelMap;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;

import com.qipeipu.crm.dtos.basedata.ProvinceDTO;
import com.qipeipu.crm.dtos.global.ResultDTO;
import com.qipeipu.crm.dtos.global.ResultState;
import com.qipeipu.crm.service.basedata.ProvinceService;
import com.qipeipu.crm.utils.bean.tools.GUtils;

@Slf4j
@Controller
@RequestMapping(value = "base/province")
public class ProvinceController {
	@Autowired
	private ProvinceService service;

	@RequestMapping(value = "find/all", method = RequestMethod.GET)
	public void findCityByProId(ModelMap map, HttpServletRequest request,
			HttpServletResponse response) {
		try {
			List<ProvinceDTO> result = service.findAllPro();
			if (!CollectionUtils.isEmpty(result)) {
				GUtils.responseJson(response, ResultDTO.successResult(result));
			} else {
				GUtils.responseJson(response, ResultDTO.successResult("empty"));
			}
		} catch (Exception e) {
			log.error("ProvinceController.findCityByProId", e);
			GUtils.responseJson(response,
					ResultDTO.failResult(ResultState.ERROR_CODE, "error"));
		}

	}
}
