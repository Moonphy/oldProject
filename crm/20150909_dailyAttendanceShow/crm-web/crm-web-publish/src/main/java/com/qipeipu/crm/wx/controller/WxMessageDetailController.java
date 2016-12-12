package com.qipeipu.crm.wx.controller;

import com.alibaba.fastjson.JSON;
import com.alibaba.fastjson.JSONArray;
import com.alibaba.fastjson.JSONObject;
import com.qipeipu.crm.dtos.global.ResultDTO;
import com.qipeipu.crm.dtos.global.ResultState;
import com.qipeipu.crm.dtos.visit.AccidentCarEntity;
import com.qipeipu.crm.dtos.visit.WxMessageDetailEntity;
import com.qipeipu.crm.service.visitAll.WxMessageDetailService;
import com.qipeipu.crm.session.UserSessionInfo;
import com.qipeipu.crm.utils.bean.tools.GUtils;
import com.qipeipu.crm.wx.util.TimeUtil;

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
 * Created by laiyiyu on 2015/3/26.
 */

@Slf4j
@Controller
@RequestMapping(value = "wx/message")
public class WxMessageDetailController {

    @Autowired
    private WxMessageDetailService wxMessageDetailService;
    @RequestMapping(value = "find", method = RequestMethod.GET)
    public void getDetailByVisitID(HttpServletRequest request, HttpServletResponse response, Integer visitID){

        List<WxMessageDetailEntity> wxMessageDetailEntityList = wxMessageDetailService.getDetailByVisitID(visitID);
        ResultDTO result = null;
        if (wxMessageDetailEntityList == null) {
            wxMessageDetailEntityList = Collections.EMPTY_LIST;
        }
        result = ResultDTO.successResult(wxMessageDetailEntityList);
        GUtils.responseJson(response, result);

    }


    @RequestMapping(value = "countVisit", method = RequestMethod.GET)
    public void getVisitCount(HttpServletRequest request, HttpServletResponse response, Integer taskID){

        Integer count = wxMessageDetailService.getVisitCount(taskID);
        ResultDTO result = null;
        if (count == null || count==0) {
            result = ResultDTO.failResult(ResultState.ERROR_CODE,
                    "该任务今天没有拜访信息");
        } else {
            result = ResultDTO.successResult(ResultState.SUCCESS_CODE, "可以添加事故车");
        }
        GUtils.responseJson(response, result);

    }


    @RequestMapping(value = "del", method = RequestMethod.GET)
    public void delPlatFormQuestion(HttpServletRequest request, HttpServletResponse response, Integer visitID){
        ResultDTO result;


        int delState = wxMessageDetailService.delDetailMessage(visitID);
        if(delState==0){
            result = ResultDTO.failResult(ResultState.ERROR_CODE
                    , "详细信息删除失败");
            GUtils.responseJson(response, result);
            return;
        }else{
            result = ResultDTO.successResult(ResultState.SUCCESS_CODE, "详细信息删除成功");
        }
        GUtils.responseJson(response, result);
    }


    @RequestMapping(value = "createAccidentCar", method = RequestMethod.POST)
    public void batchInsertAccidentCar(HttpServletRequest request, HttpServletResponse response, String accidentCarJSON, Integer taskID){
        ResultDTO result;
        List<AccidentCarEntity> accidentCarEntityList = new ArrayList<AccidentCarEntity>();
        JSONArray accidentCarsArr = JSON.parseArray(accidentCarJSON);
        for(int i=0;i<accidentCarsArr.size();i++){
            JSONObject jo = (JSONObject) accidentCarsArr.get(i);
            String carType = (String) jo.get("carType");
            Integer num = Integer.parseInt((String) jo.get("num")) ;
            String preBuyTime = (String) jo.get("preBuyTime");
            String currenTime = TimeUtil.getCurrentTime();
            AccidentCarEntity accidentCarEntity = AccidentCarEntity.builder().carType(carType).num(num).preBuyTime(preBuyTime).taskID(taskID).createTime(currenTime).build();
            accidentCarEntityList.add(accidentCarEntity);
        }
        int insertState = wxMessageDetailService.batchInsertAccidentCar(accidentCarEntityList);
        if(insertState==0){
            result = ResultDTO.failResult(ResultState.ERROR_CODE, "事故车添加失败");
            GUtils.responseJson(response, result);
            return;
        }else{
            result = ResultDTO.successResult(ResultState.SUCCESS_CODE, "事故车添加成功");
        }
        GUtils.responseJson(response, result);
    }


    @RequestMapping(value = "createMsgDetail", method = RequestMethod.POST)
    public void createMsgDetail(HttpServletRequest request, HttpServletResponse response, WxMessageDetailEntity wxMessageDetailEntity){
        Integer userID = UserSessionInfo.user_getUserOfRequest(request).getUserId();
        ResultDTO result;
        String currenTime = TimeUtil.getCurrentTime();
        String enterTime = wxMessageDetailEntity.getEnterTime();
        String leaveTime = wxMessageDetailEntity.getLeaveTime();


        if(enterTime==null || enterTime.equals("")){
            result = ResultDTO.failResult(ResultState.ERROR_CODE, "拜访时间不能为空");
            GUtils.responseJson(response, result);
            return;
        }

        if(leaveTime==null || leaveTime.equals("")) {
            result = ResultDTO.failResult(ResultState.ERROR_CODE, "离店时间不能为空");
            GUtils.responseJson(response, result);
            return;
        }

        wxMessageDetailEntity.setCreateTime(currenTime);
        wxMessageDetailEntity.setUserID(userID);


        int insertState = wxMessageDetailService.insertMessageDetail(wxMessageDetailEntity, userID);
        if(insertState==0){
            result = ResultDTO.failResult(ResultState.ERROR_CODE, "信息详情添加失败");
            GUtils.responseJson(response, result);
            return;
        }

        result = ResultDTO.successResult(ResultState.SUCCESS_CODE, "信息详情添加添加成功");
        GUtils.responseJson(response, result);
    }


}
