package com.qipeipu.crm.wx.controller;

import com.qipeipu.crm.dtos.visit.PlatTypeEntity;
import com.qipeipu.crm.dtos.visit.ReturnGoodsQuestionEntity;
import com.qipeipu.crm.dtos.global.ResultDTO;
import com.qipeipu.crm.dtos.global.ResultState;
import com.qipeipu.crm.service.visitAll.ReturnGoodsQuestionService;
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
 * Created by laiyiyu on 2015/3/26.
 */

@Slf4j
@Controller
@RequestMapping(value = "wx/returnGoodsQuestion")
public class WxReturnGoodsQuestionController {
    @Autowired
    private ReturnGoodsQuestionService returnGoodsQuestionService;

    @RequestMapping(value = "find", method = RequestMethod.GET)
    public void getReturnGoodsQuestionByFeedBackID(HttpServletRequest request, HttpServletResponse response, Integer returnGoodsID){

        List<ReturnGoodsQuestionEntity> returnGoodsQuestionEntityList = returnGoodsQuestionService.getReturnGoodsQuestionByReturnGoodsID(returnGoodsID);
        ResultDTO result;
        if (returnGoodsQuestionEntityList == null) {
            returnGoodsQuestionEntityList = Collections.EMPTY_LIST;
        }
        result = ResultDTO.successResult(returnGoodsQuestionEntityList);
        GUtils.responseJson(response, result);

    }

    @RequestMapping(value = "create", method = RequestMethod.POST)
    public void createPlatFormQuestion(HttpServletRequest request, HttpServletResponse response, ReturnGoodsQuestionEntity returnGoodsQuestionEntity){
        ResultDTO result;
        String createTime = TimeUtil.getCurrentTime();
        returnGoodsQuestionEntity.setCreateTime(createTime);
        int insertState = returnGoodsQuestionService.createsReturnGoodsQuestion(returnGoodsQuestionEntity);
        if(insertState==0){
            result = ResultDTO.failResult(ResultState.ERROR_CODE, "退货问题添加失败");
            GUtils.responseJson(response, result);
            return;
        }else{
            result = ResultDTO.successResult(ResultState.SUCCESS_CODE, "退货问题添加成功");
        }
        GUtils.responseJson(response, result);
    }

    @RequestMapping(value = "del", method = RequestMethod.GET)
    public void delPlatFormQuestion(HttpServletRequest request, HttpServletResponse response, Integer returnGoodsID){
        ResultDTO result;


        int delState = returnGoodsQuestionService.delReturnGoodsQuestion(returnGoodsID);
        if(delState==0){
            result = ResultDTO.failResult(ResultState.ERROR_CODE
                    , "退货问题删除失败");
            GUtils.responseJson(response, result);
            return;
        }else{
            result = ResultDTO.successResult(ResultState.SUCCESS_CODE, "退货问题删除成功");
        }
        GUtils.responseJson(response, result);
    }

    @RequestMapping(value = "getQuestionType", method = RequestMethod.GET)
    public void getPlatType(HttpServletRequest request, HttpServletResponse response){
        List<PlatTypeEntity> platTypeEntityList = returnGoodsQuestionService.getAllPlatType();
        ResultDTO result;
        if (platTypeEntityList == null) {
            platTypeEntityList = Collections.EMPTY_LIST;
        }
        result = ResultDTO.successResult(platTypeEntityList);
        GUtils.responseJson(response, result);
    }

}
