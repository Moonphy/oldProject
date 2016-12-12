package com.qipeipu.crm.controller;

import com.qipeipu.crm.dao.bean.EggRoleRecord;
import com.qipeipu.crm.dao.bean.SuperEggPlayerRecord;
import com.qipeipu.crm.dtos.customer.OrgForHitEggEntity;
import com.qipeipu.crm.dtos.global.ResultDTO;
import com.qipeipu.crm.dtos.global.ResultState;
import com.qipeipu.crm.dtos.global.VoModel;
import com.qipeipu.crm.dtos.user.UserDTO;
import com.qipeipu.crm.dtos.user.UserHitEggDTO;
import com.qipeipu.crm.service.customer.HitEggService;
import com.qipeipu.crm.session.UserSessionInfo;
import com.qipeipu.crm.utils.bean.tools.GUtils;
import com.qipeipu.crm.utils.bean.tools.TimeUtil;
import com.qipeipu.crm.wx.util.ExceptionUtil;
import lombok.extern.slf4j.Slf4j;
import org.apache.commons.beanutils.BeanUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.util.ArrayList;
import java.util.List;

/**
 * Created by laiyiyu on 2015/6/3.
 */
@Slf4j
@Controller
@RequestMapping(value = "hitEgg")
public class HitEggController {

    @Autowired
    private HitEggService hitEggService;

    @RequestMapping(value = "find/list", method = RequestMethod.GET)
    public void findOrgList(HttpServletResponse response, VoModel vo, String key){
        try {
            if (null == key) key = "" ;
            hitEggService.getHitEggLevelList(key, vo);
            GUtils.responseJson(response, ResultDTO.successResult(vo));
        }catch (Exception e){
            log.error(ExceptionUtil.getStackMsg(e));
            GUtils.responseJson(response, ResultDTO.failResult(ResultState.ERROR_CODE, "error"));
        }
    }

    @RequestMapping(value = "edit/level", method = RequestMethod.POST)
    public void editOrgLevelByID(HttpServletResponse response,
                            OrgForHitEggEntity orgForHitEggEntity){
        try {
            String currentTime = TimeUtil.getCurrentTime();
            orgForHitEggEntity.setUpdateTime(currentTime);
            hitEggService.updateOrgLevel(orgForHitEggEntity);
            GUtils.responseJson(response, ResultDTO.successResult(ResultState.SUCCESS_CODE));
        }catch (Exception e){
            log.error(ExceptionUtil.getStackMsg(e));
            GUtils.responseJson(response, ResultDTO.failResult(ResultState.ERROR_CODE, "error"));
        }
    }

    //查找汽修厂的相关帐号的砸蛋规则信息
    @RequestMapping(value = "find/user/list", method = RequestMethod.GET)
    public void findUserList(HttpServletResponse response, VoModel vo, Long orgId){
        try {
            hitEggService.getUserHitEggLevelList(orgId, vo);
            GUtils.responseJson(response, ResultDTO.successResult(vo));
        }catch (Exception e){
            log.error(ExceptionUtil.getStackMsg(e));
//            GUtils.responseJson(response, ResultDTO.failResult(ResultState.ERROR_CODE, "查找汽修厂的相关帐号的砸蛋规则信息时出错" + ExceptionUtil.getStackMsg(e)));
            GUtils.responseJson(response, ResultDTO.failResult(ResultState.ERROR_CODE, "查找汽修厂的相关帐号的砸蛋规则信息时出错"));
        }
    }

    //更新汽修厂的相关帐号的砸蛋规则信息
    @RequestMapping(value = "edit/user", method = RequestMethod.POST)
    public void editUserLevelByUserId(HttpServletRequest request,
                                      HttpServletResponse response,
                                      UserHitEggDTO userHitEggDTO){
        try {
            if (null == userHitEggDTO.getUserId()) {
                log.error("相关帐号的砸蛋规则信息时:没有填写相关帐号id");
                GUtils.responseJson(response, ResultDTO.failResult(ResultState.ERROR_CODE, "相关帐号的砸蛋规则信息时:没有填写相关帐号id"));
            }

            //获取操作人员信息
            UserDTO user = new UserDTO() ;
            BeanUtils.copyProperties(user, UserSessionInfo.user_getUserOfRequest(request));

            SuperEggPlayerRecord emptySuperEggPlayerRecord = new SuperEggPlayerRecord() ;
            //操作前记录
            SuperEggPlayerRecord oldRe = hitEggService.findSuperEggPlayerRecordByUserId(userHitEggDTO.getUserId()).getModel() ;
            if (null == oldRe) oldRe = emptySuperEggPlayerRecord ;
            //更新
            hitEggService.updateUserLevel(userHitEggDTO);
            //操作后记录
            SuperEggPlayerRecord newRe = hitEggService.findSuperEggPlayerRecordByUserId(userHitEggDTO.getUserId()).getModel() ;
            if (null == newRe) newRe = emptySuperEggPlayerRecord ;

            //系统操作日志记录录入
            hitEggService.addEditOperationInfo2SysLog(user , oldRe , newRe) ;

            GUtils.responseJson(response, ResultDTO.successResult(ResultState.SUCCESS_CODE));
        }catch (Exception e){
            log.error(ExceptionUtil.getStackMsg(e));
            GUtils.responseJson(response, ResultDTO.failResult(ResultState.ERROR_CODE, "更新汽修厂的相关帐号的砸蛋规则信息时出错"));
        }
    }

    //获取所有砸蛋等级信息
    @RequestMapping(value = "find/all/eggRole", method = RequestMethod.GET)
    public void findAllEggRole(HttpServletResponse response){
        try {
            List<EggRoleRecord> res = new ArrayList<>() ;
            hitEggService.findEggRoleList(res);
            GUtils.responseJson(response, ResultDTO.successResult(res));
        }catch (Exception e){
            log.error(ExceptionUtil.getStackMsg(e));
            GUtils.responseJson(response, ResultDTO.failResult(ResultState.ERROR_CODE, "获取所有砸蛋等级信息时错误"));
        }
    }
}
