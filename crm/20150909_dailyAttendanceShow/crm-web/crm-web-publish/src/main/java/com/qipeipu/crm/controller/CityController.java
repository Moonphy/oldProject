package com.qipeipu.crm.controller;

import java.util.List;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import lombok.extern.slf4j.Slf4j;

import org.apache.commons.collections.CollectionUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.ModelMap;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;

import com.qipeipu.crm.dtos.basedata.CityDTO;
import com.qipeipu.crm.dtos.global.ResultDTO;
import com.qipeipu.crm.dtos.global.ResultState;
import com.qipeipu.crm.service.basedata.CityService;
import com.qipeipu.crm.utils.bean.tools.GUtils;

@Slf4j
@Controller
@RequestMapping(value = "base/city")
public class CityController {
	@Autowired
	private CityService service;

	@RequestMapping(value = "find/{proId}", method = RequestMethod.GET)
	public void findCityByProId(ModelMap map, HttpServletRequest request,
			HttpServletResponse response, @PathVariable("proId") Integer proId) {
		try {
			List<CityDTO> result = service.findCityByProId(proId);
			if (!CollectionUtils.isEmpty(result)) {
				GUtils.responseJson(response, ResultDTO.successResult(result));
			} else {
				GUtils.responseJson(response, ResultDTO.successResult("empty"));
			}
		} catch (Exception e) {
			log.error("CityNewController.findCityByProId", e);
			GUtils.responseJson(response,
					ResultDTO.failResult(ResultState.ERROR_CODE, "error"));
		}

	}
}
