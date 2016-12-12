package com.qipeipu.crm.controller;

import com.qipeipu.crm.dtos.global.ResultDTO;
import com.qipeipu.crm.dtos.global.ResultState;
import com.qipeipu.crm.dtos.global.VoModel;
import com.qipeipu.crm.dtos.user.AccountEntity;
import com.qipeipu.crm.service.SendMail.SendMailService;
import com.qipeipu.crm.service.user.AccountService;
import com.qipeipu.crm.utils.bean.tools.GUtils;
import com.qipeipu.crm.wx.util.TimeUtil;
import com.utils.crypt.AESUtils;
import lombok.extern.slf4j.Slf4j;
import org.apache.log4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.ModelMap;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.servlet.mvc.SimpleFormController;

import javax.servlet.http.HttpServletResponse;
import java.util.List;

/**
 * Created by laiyiyu on 2015/4/9.
 */
@Slf4j
@Controller
@RequestMapping(value = "base/account")
public class AccountController extends SimpleFormController {

    private static final Logger logger = Logger
            .getLogger(CustomerController.class);

    @Autowired
    private AccountService accountService;

    @Autowired
    private SendMailService sendMailService;

    @RequestMapping(value = "send", method = RequestMethod.GET)
    public void send(){
        sendMailService.work();
    }

    @RequestMapping(value = "create", method = RequestMethod.POST)
    public String createAccount(ModelMap map, AccountEntity accountEntity,String reloginPwd){
        String currentTime = TimeUtil.getCurrentTime();
        accountEntity.setCreateTime(currentTime);
        int state = -1;
        String dispatch = "mobile/account/create";
        String msg = null;
        try {
            if (accountEntity == null) {
                msg = "无法获取到参数";
            } else if(GUtils.isEmptyOrNull(accountEntity.getUserName())){
                msg = "请输入姓名";
            } else if (GUtils.isEmptyOrNull(String.valueOf(accountEntity.getMp()))
                    && GUtils
                    .isEmptyOrNull(String.valueOf(accountEntity.getEmail()))) {
                msg = "请输入手机账户名或邮箱账户名";
            } else if(accountEntity.getAreaId()==null || accountEntity.getAreaId()==-1){
                msg = "请选择地区";
            } else if (GUtils.isEmptyOrNull(accountEntity.getLoginName())) {
                msg = "请输入账号";
            } else if (GUtils.isEmptyOrNull(accountEntity.getLoginPwd())) {
                msg = "请输入密码";
            } else if (GUtils.isEmptyOrNull(reloginPwd)) {
                msg = "请重复输入密码";
            }  else if (!accountEntity.getLoginPwd().equals(reloginPwd)) {
                msg = "两次密码不一致";
            }else {
                accountEntity.setLoginPwd(AESUtils.getInst().encrypt(accountEntity.getLoginPwd()));
                int insertState = accountService.createAccount(accountEntity);
                if (insertState == 0) {
                    msg = "帐号添加失败";
                    map.put("result", ResultDTO.failResult(ResultState.ERROR_CODE,
                            msg, accountEntity));
                } else {
                    state = 0;
                    map.put("result", ResultDTO.successResult("帐号信息录入成功"));
                }
            }
            if (state == -1) {
                map.put("result", ResultDTO.failResult(ResultState.ERROR_CODE, msg, accountEntity));
            }

        } catch (Exception e) {
            logger.error("{帐号息录入失败}" + e.getMessage());
        }
        return dispatch;

    }

    @RequestMapping(value = "del", method = RequestMethod.POST)
    public void delAccount(HttpServletResponse response, Integer id){
        try {
            if (id == null) {
                GUtils.responseJson(response, ResultDTO.failResult(ResultState.ERROR_CODE, "无法获取到参数", id));
            } else {
                int insertState = accountService.delAccount(id);
                if (insertState <= 0) {
                    GUtils.responseJson(response,ResultDTO.failResult(ResultState.ERROR_CODE,
                            "帐号删除失败", id));
                } else {
                    GUtils.responseJson(response,ResultDTO.successResult("帐号信息删除成功"));
                }
            }
        } catch (Exception e) {
            logger.error("{帐号删除入失败}" + e.getMessage());
        }
    }

    @RequestMapping(value = "reset", method = RequestMethod.GET)
    public void resetAccount(HttpServletResponse response, Integer id){
        try {
            if (id == null) {
                GUtils.responseJson(response, ResultDTO.failResult(ResultState.ERROR_CODE, "无法获取到参数", id));
            } else {
                int insertState = accountService.resetPwd(id, AESUtils.getInst().encrypt("c123456"));
                if (insertState <= 0) {
                    GUtils.responseJson(response,ResultDTO.failResult(ResultState.ERROR_CODE,
                            "密码重置失败", id));
                } else {
                    GUtils.responseJson(response,ResultDTO.successResult("密码重置成功"));
                }
            }
        } catch (Exception e) {
            logger.error("{密码重置失败}" + e.getMessage());
        }
    }

    @RequestMapping(value = "edit", method = RequestMethod.POST)
    public String updateAccount(ModelMap map, AccountEntity accountEntity){
        String currentTime = TimeUtil.getCurrentTime();
        accountEntity.setUpdateTime(currentTime);
        int state = -1;
        String dispatch = "mobile/account/create";
        String msg = null;
        try {
            if (accountEntity == null) {
                msg = "无法获取到参数";
            } else if(GUtils.isEmptyOrNull(accountEntity.getUserName())){
                msg = "请输入姓名";
            } else if (GUtils.isEmptyOrNull(String.valueOf(accountEntity.getMp()))
                    && GUtils
                    .isEmptyOrNull(String.valueOf(accountEntity.getEmail()))) {
                msg = "请输入手机账户名或邮箱账户名";
            } else if(accountEntity.getAreaId()==null || accountEntity.getAreaId()==-1){
                msg = "请选择地区";
            } else if (accountEntity.getLoginName() == null) {
                msg = "请输入账号";
            } else {
                int updateState = accountService.updateAccount(accountEntity);
                if (updateState == 0) {
                    msg = "帐号信息更改失败";
                    map.put("result", ResultDTO.failResult(ResultState.ERROR_CODE,
                            msg, accountEntity));
                } else {
                    state = 0;
                    map.put("result", ResultDTO.successResult("帐号信息更改成功"));
                }
            }
            if (state == -1) {
                map.put("result", ResultDTO.failResult(ResultState.ERROR_CODE, msg, accountEntity));
            }
        } catch (Exception e) {
            logger.error("{帐号信息更改失败}" + e.getMessage());
        }
        map.put("flag", "edit");
        return dispatch;
    }

    @RequestMapping(value = "find/all", method = RequestMethod.GET)
    public String getAccountList(ModelMap map, VoModel<?, ?> vo, String key){
        String dispatch = "mobile/account/list";
        try {
            if (vo != null) {
                accountService.getAccountList(vo, key);
                map.put("result", ResultDTO.successResult(vo));
            } else {
                map.put("result", ResultDTO.failResult(ResultState.ERROR_CODE, "无法获取到参数"));
            }
        } catch (Exception e) {
            logger.error("{帐号列表信息查询失败}", e);
        }
        map.put("key", key);
        return dispatch;
    }

    @RequestMapping(value = "find", method = RequestMethod.GET)
    public String getAccountByID(ModelMap map, Integer id){
        String dispatch = "mobile/account/create";
        try {
            if (id != null) {

                List<AccountEntity> accountEntityList = accountService.getAccountByID(id);
                if(accountEntityList==null){
                    map.put("result", ResultDTO.successResult(null));
                }else if(accountEntityList.size()>0){
                    AccountEntity account = accountEntityList.get(0);
                    logger.debug(account.getUserName()+"-"+account.getLoginName()+"-"+"-nima");
                    account.setLoginPwd("");
                    map.put("result", ResultDTO.successResult(account));
                }
            } else {
                map.put("result", ResultDTO.failResult(ResultState.ERROR_CODE,
                        "无法获取到id参数"));
            }
        } catch (Exception e) {
            logger.error("{客户查询信息信息查询失败}" + e.getMessage());
        }
        map.put("flag", "edit");
        return dispatch;

    }
}
