package com.qipeipu.crm.wx.controller;

import com.qipeipu.crm.dtos.global.ResultDTO;
import com.qipeipu.crm.dtos.global.ResultState;
import com.qipeipu.crm.dtos.global.VoModel;
import com.qipeipu.crm.dtos.user.MemorandumEntity;
import com.qipeipu.crm.service.user.WxMemorandumService;
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
import java.util.ArrayList;
import java.util.Collections;
import java.util.List;

/**
 * Created by laiyiyu on 2015/4/9.
 */
@Slf4j
@Controller
@RequestMapping(value = "wx/memorandum")
public class WxMemorandumController {

    @Autowired
    private WxMemorandumService wxMemorandumService;

    @RequestMapping(value = "find/memorandumList", method = RequestMethod.GET)
    public void getMemorandumListByUserID(HttpServletRequest request,
                                          HttpServletResponse response, VoModel<?, ?> vo, String key) {
        CrmSessionUser user = UserSessionInfo.user_getUserOfRequest(request);
        wxMemorandumService.getMemorandumListByUserID(user.getUserId(), key, vo);
        GUtils.responseJson(response, ResultDTO.successResult(vo));
    }

    @RequestMapping(value = "del", method = RequestMethod.POST)
    public void delMemorandum(HttpServletRequest request, HttpServletResponse response, Integer noteID) {
        ResultDTO result;
        int delState = wxMemorandumService.delMemorandum(noteID);
        if(delState==0){
            result = ResultDTO.failResult(ResultState.ERROR_CODE
                    , "备忘录删除失败");
            GUtils.responseJson(response, result);
            return;
        }else{
            result = ResultDTO.successResult(ResultState.SUCCESS_CODE, "备忘录删除成功");
        }
        GUtils.responseJson(response, result);
    }

    @RequestMapping(value = "find/detail", method = RequestMethod.POST)
    public void getMemorandumDetail(HttpServletRequest request, HttpServletResponse response, Integer noteID) {
        List<MemorandumEntity> memorandumEntityList = new ArrayList<>();
        try {
            memorandumEntityList = wxMemorandumService.getMemorandumDetail(noteID);
        }catch(Exception e){
            log.info(e.getMessage());
        }
        ResultDTO result;
        if (memorandumEntityList.size()==0
                ) {
            memorandumEntityList = Collections.EMPTY_LIST;
        }
        result = ResultDTO.successResult(memorandumEntityList);
        GUtils.responseJson(response, result);
    }


    @RequestMapping(value = "create", method = RequestMethod.POST)
    public void createMemorandum(HttpServletRequest request, HttpServletResponse response, MemorandumEntity memorandumEntity) {
        ResultDTO result ;
        int insertState = 0;
        Integer userID = UserSessionInfo.user_getUserOfRequest(request).getUserId();
        memorandumEntity.setUserID(userID);
        String currentTime = TimeUtil.getCurrentTime();
        memorandumEntity.setCreateTime(currentTime);
        try {
            insertState = wxMemorandumService.createMemorandum(memorandumEntity);
        }catch(Exception e){
            log.info(e.getMessage());
        }

        if(insertState==0){
            result = ResultDTO.failResult(ResultState.ERROR_CODE, "备忘录添加失败");
            GUtils.responseJson(response, result);
            return;
        }else{
            result = ResultDTO.successResult(ResultState.SUCCESS_CODE, "备忘录添加成功");
        }
        GUtils.responseJson(response, result);
    }
}
