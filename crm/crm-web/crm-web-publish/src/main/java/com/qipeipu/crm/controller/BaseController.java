package com.qipeipu.crm.controller;

import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Controller;
import org.springframework.ui.ModelMap;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;

import javax.servlet.http.HttpServletRequest;

@Slf4j
@Controller
public class BaseController {

	private static final org.slf4j.Logger logger = org.slf4j.LoggerFactory.getLogger(BaseController.class);

	@RequestMapping(value = "{target}", method = RequestMethod.GET)
	public String toPage(ModelMap map, HttpServletRequest request,
			@PathVariable("target") String target) {
		logger.info("toPage {} start!",target);
		return target;
	}

	@RequestMapping(value = "{target1}/{target2}", method = RequestMethod.GET)
	public String toPage(ModelMap map, HttpServletRequest request,
						 @PathVariable("target1") String target1,
						 @PathVariable("target2") String target2) {
		logger.info("toPage {}/{} start!",target1,target2);
		return target1+"/"+target2;
	}

	@RequestMapping(value = "{target1}/{target2}/{target3}.do", method = RequestMethod.GET)
	public String toPage(ModelMap map, HttpServletRequest request,
						 @PathVariable("target1") String target1,
						 @PathVariable("target2") String target2,
						 @PathVariable("target3") String target3) {
		logger.info("toPage {}/{}/{} start!",target1,target2,target3);
		return target1+"/"+target2+"/"+target3;
	}
}
