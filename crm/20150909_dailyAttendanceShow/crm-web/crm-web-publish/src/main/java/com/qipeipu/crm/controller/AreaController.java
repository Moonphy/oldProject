package com.qipeipu.crm.controller;

import java.util.List;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import lombok.extern.slf4j.Slf4j;

import org.apache.commons.collections.CollectionUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;

import com.qipeipu.crm.dtos.basedata.AreaDTO;
import com.qipeipu.crm.dtos.global.ResultDTO;
import com.qipeipu.crm.dtos.global.ResultState;
import com.qipeipu.crm.service.basedata.AreaService;
import com.qipeipu.crm.utils.bean.tools.GUtils;

@Controller
@Slf4j
@RequestMapping(value = "base/area")
public class AreaController {
	@Autowired
	private AreaService service;

	@RequestMapping(value = "find/{cityId}", method = RequestMethod.GET)
	public void findAreaByCityId(HttpServletRequest request,
			HttpServletResponse response, @PathVariable("cityId") Integer cityId) {
		try {
			List<AreaDTO> result = service.findAreaByCityId(cityId);
			if (!CollectionUtils.isEmpty(result)) {
				GUtils.responseJson(response, ResultDTO.successResult(result));
			} else {
				GUtils.responseJson(response, ResultDTO.successResult("empty"));
			}
		} catch (Exception e) {
			log.error("AreaController.findAreaByCityId", e);
			GUtils.responseJson(response,
					ResultDTO.failResult(ResultState.ERROR_CODE, "error"));
		}
	}
}
