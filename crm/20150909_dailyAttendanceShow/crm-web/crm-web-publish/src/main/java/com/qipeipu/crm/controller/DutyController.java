package com.qipeipu.crm.controller;

import com.qipeipu.crm.dtos.global.ResultDTO;
import com.qipeipu.crm.dtos.user.DutyEntity;
import com.qipeipu.crm.service.user.DutyService;
import com.qipeipu.crm.utils.bean.tools.GUtils;
import lombok.extern.slf4j.Slf4j;
import org.apache.commons.collections.CollectionUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.util.List;

/**
 * Created by laiyiyu on 2015/4/10.
 */

@Controller
@Slf4j
@RequestMapping(value = "base/duty")
public class DutyController {

    @Autowired
    private DutyService dutyService;

    @RequestMapping(value = "find", method = RequestMethod.GET)
    public void getDutyList(HttpServletRequest request,
                            HttpServletResponse response){
        List<DutyEntity> result = dutyService.getDutyList();
        if (!CollectionUtils.isEmpty(result)) {
            GUtils.responseJson(response, ResultDTO.successResult(result));
        } else {
            GUtils.responseJson(response, ResultDTO.successResult("empty"));
        }
    }
}
