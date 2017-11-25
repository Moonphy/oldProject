package com.qipeipu.crm.wx.controller;

import com.qipeipu.crm.dtos.global.ResultDTO;
import com.qipeipu.crm.dtos.global.VoModel;
import com.qipeipu.crm.dtos.visit.InquirySheetEntity;
import com.qipeipu.crm.dtos.visit.OrderFormEntity;
import com.qipeipu.crm.dtos.visit.QueryConditionEntity;
import com.qipeipu.crm.service.visitAll.WxBillOfDocumentService;
import com.qipeipu.crm.session.UserSessionInfo;
import com.qipeipu.crm.utils.bean.tools.GUtils;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.util.ArrayList;
import java.util.Collections;
import java.util.List;

/**
 * Created by laiyiyu on 2015/4/2.
 */
@Slf4j
@Controller
@RequestMapping(value = "wx/billOfDocument")
public class WxBillOfDocumentController {

    @Autowired
    private WxBillOfDocumentService wxBillOfDocumentService;

    @RequestMapping(value = "find/orderMainList", method = RequestMethod.GET)
    public void getOrderMainList(HttpServletRequest request,
                               HttpServletResponse response, VoModel<?, ?> vo, Integer custID, QueryConditionEntity queryConditionEntity, String queryTime) {
        Integer userID= UserSessionInfo.user_getUserOfRequest(request).getUserId();
        wxBillOfDocumentService.getOrderFormListByDemanderID(custID, queryConditionEntity, vo, userID, queryTime);
        GUtils.responseJson(response, ResultDTO.successResult(vo));
    }


    @RequestMapping(value = "find/orderMainDetail", method = RequestMethod.GET)
    public void getOrderMainDetail(HttpServletRequest request,
                               HttpServletResponse response, String orderMainID) {
        ResultDTO result;
        OrderFormEntity orderFormEntity = wxBillOfDocumentService.getOrderFormAndDetailByOrderMainID(orderMainID);
        List<OrderFormEntity> orderFormEntityList = new ArrayList<OrderFormEntity>();
        if (orderFormEntity == null) {
            orderFormEntityList = Collections.EMPTY_LIST;
        }else{
            orderFormEntityList.add(orderFormEntity);
        }
        result = ResultDTO.successResult(orderFormEntityList);
        GUtils.responseJson(response, result);
    }



    @RequestMapping(value = "find/inquirySheetList", method = RequestMethod.GET)
    public void getInquiryList(HttpServletRequest request,
                                 HttpServletResponse response, VoModel<?, ?> vo, Integer custID, QueryConditionEntity queryConditionEntity, String queryTime) {
        Integer userID= UserSessionInfo.user_getUserOfRequest(request).getUserId();
        wxBillOfDocumentService.getInquirysheetListByMfctyID(custID, queryConditionEntity, vo, userID, queryTime);
        GUtils.responseJson(response, ResultDTO.successResult(vo));
    }


    @RequestMapping(value = "find/inquirySheetDetail", method = RequestMethod.GET)
    public void getInquirySheetDetail(HttpServletRequest request,
                                   HttpServletResponse response, Integer inquiryID) {
        ResultDTO result;
        InquirySheetEntity inquirySheetEntity = wxBillOfDocumentService.getInquirysheetAndDetailByInquiryID(inquiryID);
        List<InquirySheetEntity> inquirySheetEntityList = new ArrayList<InquirySheetEntity>();
        if (inquirySheetEntity == null) {
            inquirySheetEntityList = Collections.EMPTY_LIST;
        }else{
            inquirySheetEntityList.add(inquirySheetEntity);
        }
        result = ResultDTO.successResult(inquirySheetEntityList);
        GUtils.responseJson(response, result);
    }




}
