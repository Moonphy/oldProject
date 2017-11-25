package com.qipeipu.crm.controller;

import com.qipeipu.crm.dtos.customer.OrgForVipVo;
import com.qipeipu.crm.dtos.customer.OrgVipEntity;
import com.qipeipu.crm.dtos.global.ResultDTO;
import com.qipeipu.crm.dtos.global.ResultState;
import com.qipeipu.crm.dtos.global.VoModel;
import com.qipeipu.crm.service.customer.VipService;
import com.qipeipu.crm.utils.bean.tools.GUtils;
import com.qipeipu.crm.utils.statistics.BaseJudgeUtil;
import com.qipeipu.crm.wx.util.ExceptionUtil;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;

import javax.servlet.http.HttpServletResponse;

/**
 * Created by laiyiyu on 2015/6/3.
 */
@Slf4j
@Controller
@RequestMapping(value = "vip")
public class VipController {

    @Autowired
    private VipService vipService;

    @RequestMapping(value = "find/list", method = RequestMethod.GET)
    public void findOrgList(HttpServletResponse response, VoModel vo, String key, Boolean isVip){
        try {
            vipService.getOrgForVipList(key, vo, isVip);
            GUtils.responseJson(response, ResultDTO.successResult(vo));
        }catch (Exception e){
            log.error(ExceptionUtil.getStackMsg(e));
            GUtils.responseJson(response, ResultDTO.failResult(ResultState.ERROR_CODE, "error"));
        }
    }

    @RequestMapping(value = "find/specif", method = RequestMethod.GET)
    public void findOrgByID(HttpServletResponse response, String orgID){
        try {
            OrgForVipVo orgForVipVo = vipService.getOrgForVipVoByOrgID(orgID);
            GUtils.responseJson(response, ResultDTO.successResult(orgForVipVo));
        }catch (Exception e){
            log.error(ExceptionUtil.getStackMsg(e));
            GUtils.responseJson(response, ResultDTO.failResult(ResultState.ERROR_CODE, "error"));
        }
    }

    @RequestMapping(value = "del/specif", method = RequestMethod.GET)
    public void delBySpecifOrg(HttpServletResponse response, String orgID){
        try {
            vipService.delVipByOrgID(orgID);
            GUtils.responseJson(response, ResultDTO.successResult(ResultState.SUCCESS_CODE));
        }catch (Exception e){
            GUtils.responseJson(response, ResultDTO.failResult(ResultState.ERROR_CODE, "error"));
            log.error(ExceptionUtil.getStackMsg(e));
        }
    }

    @RequestMapping(value = "edit/specif", method = RequestMethod.POST)
    public void updateBySpecifOrg(HttpServletResponse response, OrgVipEntity orgVipEntity){
        try {
            if(BaseJudgeUtil.isEmpty(orgVipEntity.getEndTime())){
                GUtils.responseJson(response, ResultDTO.failResult(ResultState.ERROR_CODE, "结束时间不能为空"));
                return;
            }
            if(BaseJudgeUtil.isEmpty(orgVipEntity.getStartTime())){
                GUtils.responseJson(response, ResultDTO.failResult(ResultState.ERROR_CODE, "开始时间不能为空"));
                return;
            }
            vipService.updateVipByOrg(orgVipEntity);
            GUtils.responseJson(response, ResultDTO.successResult(ResultState.SUCCESS_CODE));
        }catch (Exception e){
            GUtils.responseJson(response, ResultDTO.failResult(ResultState.ERROR_CODE, "error"));
            log.error(ExceptionUtil.getStackMsg(e));
        }
    }

    @RequestMapping(value = "set", method = RequestMethod.POST)
    public void createVip(HttpServletResponse response, OrgVipEntity orgVipEntity){
        try {
            if(BaseJudgeUtil.isEmpty(orgVipEntity.getEndTime())){
                GUtils.responseJson(response, ResultDTO.failResult(ResultState.ERROR_CODE, "结束时间不能为空"));
                return;
            }
            if(BaseJudgeUtil.isEmpty(orgVipEntity.getStartTime())){
                GUtils.responseJson(response, ResultDTO.failResult(ResultState.ERROR_CODE, "开始时间不能为空"));
                return;
            }
            vipService.setVip(orgVipEntity);
            GUtils.responseJson(response, ResultDTO.successResult(ResultState.SUCCESS_CODE));
        }catch (Exception e){
            GUtils.responseJson(response, ResultDTO.failResult(ResultState.ERROR_CODE, "error"));
            log.error(ExceptionUtil.getStackMsg(e));
        }
    }

}
