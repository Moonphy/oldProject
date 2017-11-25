package com.qipeipu.crm.wx.controller;

import com.qipeipu.crm.dtos.global.ResultDTO;
import com.qipeipu.crm.dtos.global.ResultState;
import com.qipeipu.crm.dtos.visit.PlatTypeEntity;
import com.qipeipu.crm.dtos.visit.PlatformQuestionEntity;
import com.qipeipu.crm.service.visitAll.WxPlatFormQuestionService;
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
 * Created by laiyiyu on 2015/3/25.
 */
@Slf4j
@Controller
@RequestMapping(value = "wx/platFormQuestion")
public class WxPlatFormQuestionController {

    @Autowired
    private WxPlatFormQuestionService wxPlatFormQuestionService;

    @RequestMapping(value = "find", method = RequestMethod.GET)
    public void getPlatformQuestionByFeedBackID(HttpServletRequest request, HttpServletResponse response, Integer feedBackID){

        List<PlatformQuestionEntity> platformQuestionEntityList = wxPlatFormQuestionService.getPlatformQuestionByFeedBackID(feedBackID);
        ResultDTO result = null;
        if (platformQuestionEntityList == null) {
            platformQuestionEntityList = Collections.EMPTY_LIST;
        }
        result = ResultDTO.successResult(platformQuestionEntityList);

        GUtils.responseJson(response, result);

    }

    @RequestMapping(value = "create", method = RequestMethod.POST)
    public void createPlatFormQuestion(HttpServletRequest request, HttpServletResponse response, PlatformQuestionEntity platformQuestionEntity){
        ResultDTO result;
        String createTime = TimeUtil.getCurrentTime();
        platformQuestionEntity.setCreateTime(createTime);
        int insertState = wxPlatFormQuestionService.createPlatFormQuestion(platformQuestionEntity);
        if(insertState==0){
            result = ResultDTO.failResult(ResultState.ERROR_CODE, "平台问题添加失败");
            GUtils.responseJson(response, result);
            return;
        }else{
            result = ResultDTO.successResult(ResultState.SUCCESS_CODE, "平台问题添加成功");
        }
        GUtils.responseJson(response, result);
    }

    @RequestMapping(value = "del", method = RequestMethod.GET)
    public void delPlatFormQuestion(HttpServletRequest request, HttpServletResponse response, Integer feedBackID){
        ResultDTO result;


        int delState = wxPlatFormQuestionService.delPlatFormQuestion(feedBackID);
        if(delState==0){
            result = ResultDTO.failResult(ResultState.ERROR_CODE
                    , "平台问题删除失败");
            GUtils.responseJson(response, result);
            return;
        }else{
            result = ResultDTO.successResult(ResultState.SUCCESS_CODE, "平台问题删除成功");
        }
        GUtils.responseJson(response, result);
    }



    @RequestMapping(value = "getPlatType", method = RequestMethod.GET)
    public void getPlatType(HttpServletRequest request, HttpServletResponse response){
        List<PlatTypeEntity> platTypeEntityList = wxPlatFormQuestionService.getAllPlatType();
        ResultDTO result;
        if (platTypeEntityList == null) {
            platTypeEntityList = Collections.EMPTY_LIST;
        }
        result = ResultDTO.successResult(platTypeEntityList);
        GUtils.responseJson(response, result);
    }

}
