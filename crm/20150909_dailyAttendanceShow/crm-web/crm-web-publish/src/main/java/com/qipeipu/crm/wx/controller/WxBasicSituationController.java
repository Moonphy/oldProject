package com.qipeipu.crm.wx.controller;

import com.qipeipu.crm.dtos.global.ResultDTO;
import com.qipeipu.crm.dtos.global.ResultState;
import com.qipeipu.crm.dtos.visit.BusinessMessageEntity;
import com.qipeipu.crm.dtos.visit.CustomerBasedDTO;
import com.qipeipu.crm.service.wxCustomer.WxBasicSituationService;
import com.qipeipu.crm.utils.bean.tools.GUtils;
import com.qipeipu.crm.wx.util.TimeUtil;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

/**
 * Created by laiyiyu on 2015/3/27.
 */
@Slf4j
@Controller
@RequestMapping(value = "wx/basicSituation")
public class WxBasicSituationController {

    @Autowired
    WxBasicSituationService wxBasicSituationService;

    @RequestMapping(value = "modify/message", method = RequestMethod.POST)
    public void updateBasicSituation(HttpServletRequest request, HttpServletResponse response, CustomerBasedDTO customerBasedDTO, BusinessMessageEntity businessMessageEntity) {
        ResultDTO result;
        String contactMan = customerBasedDTO.getCactMan();
        String phoneNo = customerBasedDTO.getCactTel();
        String address = customerBasedDTO.getAddress();
        String updateTime = TimeUtil.getCurrentTime();

        if(contactMan==null){
            result = ResultDTO.failResult(ResultState.ERROR_CODE, "联系人名称不能为空");
            GUtils.responseJson(response, result);
            return;
        }

        if(phoneNo==null) {
            result = ResultDTO.failResult(ResultState.ERROR_CODE, "联系人号码不能为空");
            GUtils.responseJson(response, result);
            return;
        }

        if(address==null) {
            result = ResultDTO.failResult(ResultState.ERROR_CODE, "地址不能为空");
            GUtils.responseJson(response, result);
            return;
        }
        businessMessageEntity.setCustID(customerBasedDTO.getId());
        customerBasedDTO.setUpdateTime(updateTime);

        businessMessageEntity.setUpdateTime(updateTime);
        int updateState1 = wxBasicSituationService.updateBasicSituation(customerBasedDTO);
        int updateState2 = wxBasicSituationService.updateBusinessMessage(businessMessageEntity);

        if(updateState2==0){
            wxBasicSituationService.createBusiness(businessMessageEntity);
        }

        if(updateState1==0 ){
            result = ResultDTO.failResult(ResultState.ERROR_CODE, "业务信息更改失败");
            GUtils.responseJson(response, result);
            return;
        }else{
            result = ResultDTO.successResult(ResultState.SUCCESS_CODE, "业务信息更改成功");
        }

        GUtils.responseJson(response, result);
    }


}
