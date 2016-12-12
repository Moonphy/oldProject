package com.qipeipu.crm.controller;

import com.alibaba.fastjson.JSON;
import com.alibaba.fastjson.JSONArray;
import com.alibaba.fastjson.JSONObject;
import com.baturu.sms.client.SendSmsServiceClient;
import com.google.common.collect.Maps;
import com.qipeipu.crm.dtos.customer.QpuOrgDetailVo;
import com.qipeipu.crm.dtos.customer.QpuOrgEntity;
import com.qipeipu.crm.dtos.global.ResultDTO;
import com.qipeipu.crm.dtos.global.ResultState;
import com.qipeipu.crm.dtos.global.VoModel;
import com.qipeipu.crm.dtos.user.QpuUserEntity;
import com.qipeipu.crm.service.customer.OrgService;
import com.qipeipu.crm.utils.bean.tools.GUtils;
import com.qipeipu.crm.utils.bean.tools.TimeUtil;
import com.qipeipu.crm.wx.util.ExceptionUtil;
import com.utils.crypt.AESUtils;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;

import javax.servlet.http.HttpServletResponse;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Random;

/**
 * Created by laiyiyu on 2015/5/25.
 */
@Slf4j
@Controller
@RequestMapping(value = "org")
public class OrgController {

    @Autowired
    private OrgService orgService;

    @Autowired
    @Qualifier("smsBusinessClient")
    private SendSmsServiceClient  sendSmsServiceClient;

    @RequestMapping(value = "find/list", method = RequestMethod.GET)
    public void findOrgList(HttpServletResponse response, VoModel vo, String key){
        try {
            orgService.getOrgDetailForPage(key, vo);
            GUtils.responseJson(response, ResultDTO.successResult(vo));
        }catch (Exception e){
            log.error(ExceptionUtil.getStackMsg(e));
            GUtils.responseJson(response, ResultDTO.failResult(ResultState.ERROR_CODE, "error"));
        }
    }

    @RequestMapping(value = "find/userlist", method = RequestMethod.GET)
    public void findUserList(HttpServletResponse response, VoModel vo, String orgID){
        try {
            orgService.getSpecifyMfctyForAccount(orgID, vo);
            GUtils.responseJson(response, ResultDTO.successResult(vo));
        }catch (Exception e){
            log.error(ExceptionUtil.getStackMsg(e));
            GUtils.responseJson(response, ResultDTO.failResult(ResultState.ERROR_CODE, "error"));
        }
    }

    @RequestMapping(value = "find/specif", method = RequestMethod.GET)
    public void findOrgByID(HttpServletResponse response, String orgID){
        try {
            QpuOrgDetailVo qpuOrgDetailVo = orgService.getOrgDetailByID(orgID);
            GUtils.responseJson(response, ResultDTO.successResult(qpuOrgDetailVo));
        }catch (Exception e){
            log.error(ExceptionUtil.getStackMsg(e));
            GUtils.responseJson(response, ResultDTO.failResult(ResultState.ERROR_CODE, "error"));
        }
    }

    @RequestMapping(value = "edit/mfcty", method = RequestMethod.POST)
         public void editOrgByID(HttpServletResponse response,
                                 QpuOrgEntity qpuOrgEntity, boolean isFilter,  String[] urlPic){
        try {
            String currentTime = TimeUtil.getCurrentTime();
            qpuOrgEntity.setUpdateTime(currentTime);
            QpuOrgDetailVo qpuOrgDetailVo = QpuOrgDetailVo.builder().qpuOrgEntity(qpuOrgEntity).isFilter(isFilter).orgFacadePics(urlPic).build();
            orgService.updateOrgDetail(qpuOrgDetailVo);
            GUtils.responseJson(response, ResultDTO.successResult(ResultState.SUCCESS_CODE));
        }catch (Exception e){
            log.error(ExceptionUtil.getStackMsg(e));
            GUtils.responseJson(response, ResultDTO.failResult(ResultState.ERROR_CODE, "error"));
        }
    }


    @RequestMapping(value = "edit/resetPwd", method = RequestMethod.POST)
    public void resetPwd(HttpServletResponse response, String userID, String tel){
        try {

            String chars = "abcdefghijklmnopqrstuvwxyz";
            StringBuilder sb = new StringBuilder();
            sb.append(chars.charAt((int)(Math.random() * 26)));
            Random random = new Random();
            for(int i=0;i<5;i++){
                sb.append(random.nextInt(10));
            }
            orgService.resetPwd(userID, AESUtils.getInst().encrypt(sb.toString()));
            //QpuUserEntity qpuUserEntity = orgService.getUserByUserID(userID);
            HashMap<String, String> parameters = Maps.<String, String>newHashMap();
            parameters.put("password", sb.toString());
            sendSmsServiceClient.sendSms(tel, "crmResetPwd", parameters);
            GUtils.responseJson(response, ResultDTO.successResult(ResultState.SUCCESS_CODE));
        }catch (Exception e){
            log.error(ExceptionUtil.getStackMsg(e));
            GUtils.responseJson(response, ResultDTO.failResult(ResultState.ERROR_CODE, "error"));
        }
    }


    @RequestMapping(value = "del/user", method = RequestMethod.POST)
    public void delByUserID(HttpServletResponse response, String userID){
        try {
            orgService.delQpuUserByID(userID);
            GUtils.responseJson(response, ResultDTO.successResult(ResultState.SUCCESS_CODE));
        }catch (Exception e){
            GUtils.responseJson(response, ResultDTO.failResult(ResultState.ERROR_CODE, "error"));
            log.error(ExceptionUtil.getStackMsg(e));
        }
    }


    @RequestMapping(value = "create/user", method = RequestMethod.POST)
    public void createUser(HttpServletResponse response, QpuUserEntity qpuUserEntity){
        try {
            qpuUserEntity.setPassword(AESUtils.getInst().encrypt(qpuUserEntity.getPassword()));
            orgService.insertQpuUser(qpuUserEntity);
            GUtils.responseJson(response, ResultDTO.successResult(ResultState.SUCCESS_CODE));
        }catch (Exception e){
            log.error(ExceptionUtil.getStackMsg(e));
            GUtils.responseJson(response, ResultDTO.failResult(ResultState.ERROR_CODE, "error"));
        }
    }



    @RequestMapping(value = "edit/batchUser", method = RequestMethod.POST)
    public void editBatchUser(HttpServletResponse response, String users){
        try {
            List<QpuUserEntity> qpuUserEntities = new ArrayList<>();
            JSONArray accidentCarsArr = JSON.parseArray(users);
            for(int i=0;i<accidentCarsArr.size();i++){
                JSONObject jo = (JSONObject) accidentCarsArr.get(i);
                String userID = (String) jo.get("userID");
                String loginEmail = (String) jo.get("loginEmail") ;
                String loginMobile = (String) jo.get("loginMobile") ;
                String userName = (String) jo.get("userName");
                QpuUserEntity qpuUserEntity = QpuUserEntity.builder().userName(userName).loginMobile(loginMobile).loginEmail(loginEmail).userID(userID).build();

                qpuUserEntities.add(qpuUserEntity);
            }
            orgService.batchUpdateQpuUser(qpuUserEntities);
            GUtils.responseJson(response, ResultDTO.successResult(ResultState.SUCCESS_CODE));
        }catch (Exception e){
            log.error(ExceptionUtil.getStackMsg(e));
            GUtils.responseJson(response, ResultDTO.failResult(ResultState.ERROR_CODE, "error"));
        }
    }


    @RequestMapping(value = "find/accountIsExist", method = RequestMethod.GET)
    public void findaccountIsExist(HttpServletResponse response, String loginKey, String userID){
        try {
            GUtils.responseJson(response, ResultDTO.successResult(orgService.countExistAccount(loginKey, userID)));
        }catch (Exception e){
            log.error(ExceptionUtil.getStackMsg(e));
            GUtils.responseJson(response, ResultDTO.failResult(ResultState.ERROR_CODE, "error"));
        }
    }

}
