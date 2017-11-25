package com.qipeipu.crm.wx.controller;

import com.qipeipu.crm.dtos.global.ResultDTO;
import com.qipeipu.crm.dtos.global.ResultState;
import com.qipeipu.crm.dtos.global.VoModel;
import com.qipeipu.crm.dtos.user.MarketFeedBackEntity;
import com.qipeipu.crm.dtos.visit.PlatTypeEntity;
import com.qipeipu.crm.service.user.MarketFeedBackService;
import com.qipeipu.crm.session.UserSessionInfo;
import com.qipeipu.crm.session.bean.CrmSessionUser;
import com.qipeipu.crm.utils.bean.tools.GUtils;
import com.qipeipu.crm.wx.util.TimeUtil;
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
 * Created by laiyiyu on 2015/4/13.
 */
@Slf4j
@Controller
@RequestMapping(value = "wx/marketFeedBack")
public class WxMarketFeedBackController {

    @Autowired
    private MarketFeedBackService marketFeedBackService;


    @RequestMapping(value = "find/marketFeedBackList", method = RequestMethod.GET)
    public void getMarketFeedBackList(HttpServletRequest request, HttpServletResponse response, VoModel<?, ?> vo){
        CrmSessionUser user = UserSessionInfo.user_getUserOfRequest(request);
        marketFeedBackService.getMarketFeedBackList(user.getUserId(), vo);
        GUtils.responseJson(response, ResultDTO.successResult(vo));
    }

    @RequestMapping(value = "find", method = RequestMethod.GET)
    public void getMarketFeedBackByFeedBackID(HttpServletRequest request, HttpServletResponse response, Integer feedBackID){

        List<MarketFeedBackEntity> marketFeedBackEntityList = marketFeedBackService.getMarketFeedBackByFeedBackID(feedBackID);
        ResultDTO result;
        if (marketFeedBackEntityList == null) {
            marketFeedBackEntityList = Collections.EMPTY_LIST;
        }
        result = ResultDTO.successResult(marketFeedBackEntityList);
        GUtils.responseJson(response, result);

    }

    @RequestMapping(value = "create", method = RequestMethod.POST)
    public void createMarketFeedBack(HttpServletRequest request, HttpServletResponse response, MarketFeedBackEntity marketFeedBackEntity){
        ResultDTO result;
        String createTime = TimeUtil.getCurrentTime();
        Integer userID = UserSessionInfo.user_getUserOfRequest(request).getUserId();
        marketFeedBackEntity.setUserID(userID);
        marketFeedBackEntity.setCreateTime(createTime);
        int insertState = marketFeedBackService.createMarketFeedBack(marketFeedBackEntity);
        if(insertState==0){
            result = ResultDTO.failResult(ResultState.ERROR_CODE, "问题反馈添加失败");
            GUtils.responseJson(response, result);
            return;
        }else{
            result = ResultDTO.successResult(ResultState.SUCCESS_CODE, "问题反馈添加成功");
        }
        GUtils.responseJson(response, result);
    }

    @RequestMapping(value = "del", method = RequestMethod.POST)
    public void delMarketFeedBack(HttpServletRequest request, HttpServletResponse response, Integer feedBackID){
        ResultDTO result;


        int delState = marketFeedBackService.delMarketFeedBack(feedBackID);
        if(delState==0){
            result = ResultDTO.failResult(ResultState.ERROR_CODE
                    , "问题反馈删除失败");
            GUtils.responseJson(response, result);
            return;
        }else{
            result = ResultDTO.successResult(ResultState.SUCCESS_CODE, "问题反馈删除成功");
        }
        GUtils.responseJson(response, result);
    }

    @RequestMapping(value = "find/platType", method = RequestMethod.GET)
    public void getPlatType(HttpServletRequest request, HttpServletResponse response){
        List<PlatTypeEntity> platTypeEntityList = marketFeedBackService.getAllPlatType();
        ResultDTO result;
        if (platTypeEntityList == null) {
            platTypeEntityList = Collections.EMPTY_LIST;
        }
        result = ResultDTO.successResult(platTypeEntityList);
        GUtils.responseJson(response, result);
    }

}
