package com.qipeipu.crm.wx.controller;

import com.qipeipu.crm.dtos.global.ResultDTO;
import com.qipeipu.crm.dtos.visit.*;
import com.qipeipu.crm.service.visitAll.VisitService;
import com.qipeipu.crm.utils.bean.tools.GUtils;
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
 * Created by laiyiyu on 2015/3/24.
 */
@Slf4j
@Controller
@RequestMapping(value = "wx/visit")
public class WxVisitController {

    @Autowired
    private VisitService visitService;

    @RequestMapping(value = "basedMesg", method = RequestMethod.GET)
    public void getBasedCustomerMessageByID(HttpServletRequest request, HttpServletResponse response, Integer ID) {

        List<CustomerBasedDTO> customerBasedDTOList = visitService.getCustomerBasedByID(ID);
        ResultDTO result = null;
        if (customerBasedDTOList == null) {
            customerBasedDTOList = Collections.EMPTY_LIST;
        }
        result = ResultDTO.successResult(customerBasedDTOList);

        GUtils.responseJson(response, result);

    }

    @RequestMapping(value = "busniess", method = RequestMethod.GET)
    public void getbusniessMessageByID(HttpServletRequest request, HttpServletResponse response, Integer ID) {

        List<BusinessMessageEntity> businessMessageEntityList = visitService.getBusinessMessageByID(ID);
        ResultDTO result = null;
        if (businessMessageEntityList == null) {
            businessMessageEntityList = Collections.EMPTY_LIST;
        }
        result = ResultDTO.successResult(businessMessageEntityList);
        GUtils.responseJson(response, result);

    }



    @RequestMapping(value = "platFormList", method = RequestMethod.GET)
    public void vistPlatFormQuestion(HttpServletRequest request, HttpServletResponse response, Integer taskID){
        List<PlatformQuestionEntity> platformQuestionEntityList = visitService.getAllPlatformQuestionByTaskID(taskID);
        ResultDTO result;
        if (platformQuestionEntityList == null) {
            platformQuestionEntityList = Collections.EMPTY_LIST;
        }
        result = ResultDTO.successResult(platformQuestionEntityList);

        GUtils.responseJson(response, result);
    }


    @RequestMapping(value = "returnGoodsList", method = RequestMethod.GET)
    public void vistReturnGoodsQuestion(HttpServletRequest request, HttpServletResponse response, Integer taskID){
        List<ReturnGoodsQuestionEntity> returnGoodsQuestionEntityList = visitService.getAllReturnGoodsQuestionByTaskID(taskID);
        ResultDTO result;
        if (returnGoodsQuestionEntityList == null) {
            returnGoodsQuestionEntityList = Collections.EMPTY_LIST;
        }
        result = ResultDTO.successResult(returnGoodsQuestionEntityList);

        GUtils.responseJson(response, result);
    }

    @RequestMapping(value = "messageDetailList", method = RequestMethod.GET)
    public void vistMessageDetail(HttpServletRequest request, HttpServletResponse response, Integer taskID){
        List<WxMessageDetailDTO> wxMessageDetailDTOList = visitService.getAllWxMessageDetailList(taskID);
        ResultDTO result;
        if (wxMessageDetailDTOList == null) {
            wxMessageDetailDTOList = Collections.EMPTY_LIST;
        }
        result = ResultDTO.successResult(wxMessageDetailDTOList);

        GUtils.responseJson(response, result);
    }


}
