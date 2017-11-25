package com.qipeipu.crm.wx.controller;

import com.qipeipu.crm.dtos.global.ResultDTO;
import com.qipeipu.crm.dtos.global.ResultState;
import com.qipeipu.crm.dtos.global.VoModel;
import com.qipeipu.crm.service.visitAll.WxAccidentCarRemainService;
import com.qipeipu.crm.session.UserSessionInfo;
import com.qipeipu.crm.utils.bean.tools.GUtils;
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
@RequestMapping(value = "wx/accidentCarsRemain")
public class WxAccidentCarRemainController {

    @Autowired
    private WxAccidentCarRemainService wxAccidentCarRemainService;

    @RequestMapping(value = "findRemainList", method = RequestMethod.GET)
    public void getAllAccidentCarsRemain(HttpServletRequest request,
                               HttpServletResponse response, VoModel<?, ?> vo, String key) {
        Integer userID = UserSessionInfo.user_getUserOfRequest(request).getUserId();
        wxAccidentCarRemainService.getCurrentRemain(userID, key, vo);
        GUtils.responseJson(response, ResultDTO.successResult(vo));
    }



    @RequestMapping(value = "findDetail", method = RequestMethod.GET)
    public void getAllAccidentCarsList(HttpServletRequest request,
                                         HttpServletResponse response, VoModel<?, ?> vo, String key) {
        Integer userID = UserSessionInfo.user_getUserOfRequest(request).getUserId();
        wxAccidentCarRemainService.getCurrentRemain(userID, key, vo);
        GUtils.responseJson(response, ResultDTO.successResult(vo));
    }

    @RequestMapping(value = "find/RemainList", method = RequestMethod.GET)
    public void getAccidentCarRemainList(HttpServletRequest request,
                                         HttpServletResponse response, VoModel<?, ?> vo, String key) {
        Integer userID = UserSessionInfo.user_getUserOfRequest(request).getUserId();
        wxAccidentCarRemainService.getRemainCarList(userID, key, vo);
        GUtils.responseJson(response, ResultDTO.successResult(vo));
    }

    @RequestMapping(value = "read", method = RequestMethod.GET)
    public void readAccidentCar(HttpServletRequest request, HttpServletResponse response, Integer accidentCarID){
        ResultDTO result;
        int updateState = wxAccidentCarRemainService.readAccidentCar(accidentCarID);
        if(updateState==0){
            result = ResultDTO.failResult(ResultState.ERROR_CODE, "事故车状态更改失败");
            GUtils.responseJson(response, result);
            return;
        }else{
            result = ResultDTO.successResult(ResultState.SUCCESS_CODE, "事故车状态更改成功");
        }
        GUtils.responseJson(response, result);
    }


    @RequestMapping(value = "remain", method = RequestMethod.GET)
    public void getVisitCount(HttpServletRequest request, HttpServletResponse response){
        Integer userID = UserSessionInfo.user_getUserOfRequest(request).getUserId();
        Integer count = wxAccidentCarRemainService.hasNewAccidentCar(userID);
        ResultDTO result = ResultDTO.successResult(count) ;
        GUtils.responseJson(response, result);
    }

}
